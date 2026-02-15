import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Bookmark, BookmarkCheck, ExternalLink, Loader2 } from "lucide-react";
import { usePipeline } from "@/contexts/PipelineContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Grant {
  id: string;
  grant_title: string;
  funder_name: string | null;
  funding_amount_json: any;
  status: string | null;
  deadline_date: string | null;
  focus_areas: string[] | null;
  summary: string | null;
  application_url: string | null;
  source_url: string | null;
}

const formatAmount = (json: any): string => {
  if (!json) return "N/A";
  if (json.amount) return `$${Number(json.amount).toLocaleString()}`;
  if (json.max_amount && json.min_amount) return `$${Number(json.min_amount).toLocaleString()} – $${Number(json.max_amount).toLocaleString()}`;
  if (json.max_amount) return `Up to $${Number(json.max_amount).toLocaleString()}`;
  if (json.min_amount) return `From $${Number(json.min_amount).toLocaleString()}`;
  return "N/A";
};

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToPipeline, removeFromPipeline, isInPipeline } = usePipeline();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      const { data: org } = await supabase
        .from("organizations")
        .select("id")
        .eq("owner_user_id", user.id)
        .maybeSingle();
      if (!org) { setLoading(false); return; }

      const { data } = await supabase
        .from("grants")
        .select("id, grant_title, funder_name, funding_amount_json, status, deadline_date, focus_areas, summary, application_url, source_url")
        .eq("organization_id", org.id)
        .order("created_at", { ascending: false });

      setGrants(data || []);
      setLoading(false);
    };
    load();
  }, [user]);

  const filtered = query.trim()
    ? grants.filter((g) => {
        const q = query.toLowerCase();
        return (
          g.grant_title.toLowerCase().includes(q) ||
          (g.funder_name || "").toLowerCase().includes(q) ||
          (g.focus_areas || []).some((f) => f.toLowerCase().includes(q))
        );
      })
    : grants;

  const handleToggleSave = (g: Grant) => {
    if (isInPipeline(g.id)) {
      removeFromPipeline(g.id);
      toast({ title: "Removed from pipeline", description: g.grant_title });
    } else {
      addToPipeline({
        id: g.id,
        title: g.grant_title,
        funder: g.funder_name || "Unknown",
        amount: formatAmount(g.funding_amount_json),
        deadline: g.deadline_date || "N/A",
        status: "not_started",
        focus: g.focus_areas || [],
      });
      toast({ title: "Saved to pipeline", description: g.grant_title });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Grant Search</h1>
        <p className="text-muted-foreground">Discover grant opportunities matching your organization.</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search grants by keyword, funder, or focus area..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" /> Filters
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          {grants.length === 0
            ? "No grants discovered yet. Run a search from the Dashboard to get started."
            : "No grants match your search."}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((g) => {
            const saved = isInPipeline(g.id);
            return (
              <Card key={g.id} className="transition-shadow hover:shadow-md">
                <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{g.grant_title}</h3>
                      {g.status && (
                        <Badge variant="secondary" className={g.status === "open" ? "bg-brand/10 text-brand" : "bg-muted text-muted-foreground"}>
                          {g.status}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {g.funder_name || "Unknown funder"} · {formatAmount(g.funding_amount_json)}
                      {g.deadline_date && ` · Due ${g.deadline_date}`}
                    </p>
                    {g.focus_areas && g.focus_areas.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {g.focus_areas.slice(0, 5).map((f) => (
                          <Badge key={f} variant="outline" className="text-xs">{f}</Badge>
                        ))}
                        {g.focus_areas.length > 5 && (
                          <Badge variant="outline" className="text-xs">+{g.focus_areas.length - 5}</Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={saved ? "default" : "ghost"}
                      size="icon"
                      onClick={() => handleToggleSave(g)}
                      title={saved ? "Remove from pipeline" : "Save to pipeline"}
                    >
                      {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                    </Button>
                    {(g.application_url || g.source_url) && (
                      <Button variant="ghost" size="icon" asChild>
                        <a href={g.application_url || g.source_url || "#"} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
