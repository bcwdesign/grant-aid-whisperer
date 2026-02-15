import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Layers, Clock, DollarSign, Zap, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { tinyfishApi } from "@/lib/api/tinyfish";
import { useToast } from "@/hooks/use-toast";

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

// Demo org ID — in production this comes from auth context
const DEMO_ORG_ID = "00000000-0000-0000-0000-000000000000";

const getStats = (result: any) => [
  { label: "Grants Discovered", value: result?.grants_found != null ? String(result.grants_found) : "—", change: result ? `From last search` : "Run search to discover", icon: Search },
  { label: "In Pipeline", value: "0", change: "Save grants to track", icon: Layers },
  { label: "Upcoming Deadlines", value: result?.grants ? String(result.grants.filter((g: any) => g.deadline_date).length) : "0", change: "With deadlines", icon: Clock },
  { label: "Potential Funding", value: "$0", change: "Total pipeline value", icon: DollarSign },
];

const statusColors: Record<string, string> = {
  not_started: "bg-muted text-muted-foreground",
  researching: "bg-brand/10 text-brand",
  in_progress: "bg-brand/20 text-brand",
  submitted: "bg-primary/10 text-primary",
};

const Dashboard = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState<{
    status: string;
    grants_found: number;
    errors: string[];
  } | null>(null);

  const handleRunSearch = async () => {
    setIsRunning(true);
    toast({ title: "Starting grant search...", description: `Scanning ${DEFAULT_URLS.length} sources. This may take a few minutes.` });

    try {
      const result = await tinyfishApi.runSearch(DEMO_ORG_ID, DEFAULT_URLS);
      setLastResult(result);

      if (result.success) {
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
        {getStats(lastResult).map((s) => (
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
              {lastResult ? (
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-brand" />
                  Last run: {lastResult.status} · {lastResult.grants_found} grants found
                  {lastResult.errors?.length > 0 && ` · ${lastResult.errors.length} errors`}
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
      {lastResult?.errors && lastResult.errors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="h-4 w-4 text-destructive" /> Errors from last run
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {lastResult.errors.slice(0, 10).map((e, i) => (
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
