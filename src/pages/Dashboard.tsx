import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Layers, Clock, DollarSign, Zap, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { tinyfishApi } from "@/lib/api/tinyfish";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { usePipeline } from "@/contexts/PipelineContext";

const DEFAULT_URLS = [
  "https://www.grants.gov/",
  "https://www.microsoft.com/en-us/corporate-responsibility/philanthropies",
  "https://www.atlantafoundation.org/",
  "https://cfgreateratlanta.org/grant-opportunities/",
  "https://www.nsf.gov/funding/",
  "https://www.ed.gov/grants-and-programs/apply-grant/available-grants",
  "https://www.dol.gov/agencies/eta/grants/apply/find-opportunities",
  "https://digitalready.verizonwireless.com/funding",
  "https://unitedwayatlanta.org/apply-for-a-grant/",
];

const Dashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { pipelineGrants } = usePipeline();
  const [isRunning, setIsRunning] = useState(false);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [grantsCount, setGrantsCount] = useState(0);
  const [deadlinesCount, setDeadlinesCount] = useState(0);
  const [totalFunding, setTotalFunding] = useState(0);
  const [lastRun, setLastRun] = useState<{ status: string; grants_found: number; errors: string[] } | null>(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      // Get user's org
      const { data: org } = await supabase
        .from("organizations")
        .select("id")
        .eq("owner_user_id", user.id)
        .maybeSingle();
      if (org) {
        setOrgId(org.id);

        // Get grants count
        const { count } = await supabase
          .from("grants")
          .select("*", { count: "exact", head: true })
          .eq("organization_id", org.id);
        setGrantsCount(count || 0);

        // Get upcoming deadlines (next 14 days)
        const now = new Date().toISOString().split("T")[0];
        const in14 = new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];
        const { count: dlCount } = await supabase
          .from("grants")
          .select("*", { count: "exact", head: true })
          .eq("organization_id", org.id)
          .gte("deadline_date", now)
          .lte("deadline_date", in14);
        setDeadlinesCount(dlCount || 0);

        // Get total potential funding from grants
        const { data: fundingData } = await supabase
          .from("grants")
          .select("funding_amount_json")
          .eq("organization_id", org.id);
        if (fundingData) {
          let total = 0;
          for (const g of fundingData) {
            const f = g.funding_amount_json as any;
            if (!f) continue;
            if (f.amount) total += Number(f.amount) || 0;
            else if (f.max_amount) total += Number(f.max_amount) || 0;
            else if (f.min_amount) total += Number(f.min_amount) || 0;
          }
          setTotalFunding(total);
        }

        // Get last agent run
        const { data: run } = await supabase
          .from("agent_runs")
          .select("*")
          .eq("organization_id", org.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (run) {
          setLastRun({
            status: run.status,
            grants_found: run.grants_found || 0,
            errors: Array.isArray(run.errors_json) ? (run.errors_json as string[]) : [],
          });
        }
      }
    };
    load();
  }, [user]);

  const pipelineCount = pipelineGrants.length;

  const stats = [
    { label: "Grants Discovered", value: String(grantsCount), change: grantsCount > 0 ? "In database" : "Run search to discover", icon: Search },
    { label: "In Pipeline", value: String(pipelineCount), change: pipelineCount > 0 ? "Grants tracked" : "Save grants to track", icon: Layers },
    { label: "Upcoming Deadlines", value: String(deadlinesCount), change: "Next 14 days", icon: Clock },
    { label: "Potential Funding", value: totalFunding > 0 ? `$${totalFunding.toLocaleString()}` : "$0", change: "From discovered grants", icon: DollarSign },
  ];

  const handleRunSearch = async () => {
    if (!orgId) {
      toast({ title: "No organization found", description: "Please set up your org profile first.", variant: "destructive" });
      return;
    }
    setIsRunning(true);

    // Fetch active sources from the database, fall back to defaults
    const { data: activeSources } = await supabase
      .from("grant_sources")
      .select("url")
      .eq("organization_id", orgId)
      .eq("is_active", true);
    const urls = activeSources && activeSources.length > 0
      ? activeSources.map((s) => s.url)
      : DEFAULT_URLS;

    toast({ title: "Starting grant search...", description: `Scanning ${urls.length} sources. This may take a few minutes.` });

    try {
      const result = await tinyfishApi.runSearch(orgId, urls);

      if (result.success) {
        setGrantsCount((prev) => prev + (result.grants_found || 0));
        setLastRun({
          status: result.status,
          grants_found: result.grants_found,
          errors: result.errors || [],
        });
        toast({
          title: `Search complete: ${result.grants_found} grants found`,
          description: result.errors?.length > 0
            ? `${result.errors.length} source(s) had issues`
            : "All sources processed successfully",
        });
      } else {
        toast({ title: "Search failed", description: result.error, variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back. Here's your grant overview.</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-2 text-3xl font-bold text-foreground">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Run Search */}
      <Card>
        <CardContent className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-semibold text-foreground">Grant Search</h3>
            <p className="text-sm text-muted-foreground">
              {lastRun ? (
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-brand" />
                  Last run: {lastRun.status} · {lastRun.grants_found} grants found
                  {lastRun.errors?.length > 0 && ` · ${lastRun.errors.length} errors`}
                </span>
              ) : (
                <span>{DEFAULT_URLS.length} sources configured · Ready to search</span>
              )}
            </p>
          </div>
          <Button variant="brand" className="gap-2" onClick={handleRunSearch} disabled={isRunning}>
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Searching...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" /> Run Search Now
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Last run errors */}
      {lastRun?.errors && lastRun.errors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="h-4 w-4 text-destructive" /> Errors from last run
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {lastRun.errors.slice(0, 10).map((e, i) => (
                <p key={i} className="text-muted-foreground">{e}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
