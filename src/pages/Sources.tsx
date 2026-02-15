import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Globe, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Source {
  id: string;
  name: string;
  url: string;
  category: string | null;
  is_active: boolean;
}

const categories = ["Federal", "Corporate", "Foundation", "State", "Other"];

const categoryColors: Record<string, string> = {
  Federal: "bg-primary/10 text-primary",
  Corporate: "bg-brand/10 text-brand",
  Foundation: "bg-accent/10 text-accent-foreground",
  State: "bg-secondary text-secondary-foreground",
  Other: "bg-muted text-muted-foreground",
};

const Sources = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newCategory, setNewCategory] = useState("Other");

  const loadSources = useCallback(async (oid: string) => {
    const { data, error } = await supabase
      .from("grant_sources")
      .select("*")
      .eq("organization_id", oid)
      .order("created_at", { ascending: true });
    if (!error && data) {
      setSources(data.map((s) => ({
        id: s.id,
        name: s.name,
        url: s.url,
        category: s.category,
        is_active: s.is_active,
      })));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user) return;
    const init = async () => {
      const { data: org } = await supabase
        .from("organizations")
        .select("id")
        .eq("owner_user_id", user.id)
        .maybeSingle();
      if (org) {
        setOrgId(org.id);
        await loadSources(org.id);
      } else {
        setLoading(false);
      }
    };
    init();
  }, [user, loadSources]);

  const handleAdd = async () => {
    if (!newName.trim() || !newUrl.trim() || !orgId) return;
    setAdding(true);
    const { error } = await supabase.from("grant_sources").insert({
      organization_id: orgId,
      name: newName.trim(),
      url: newUrl.trim(),
      category: newCategory,
    });
    setAdding(false);
    if (error) {
      toast({ title: "Failed to add source", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Source added" });
      setNewName("");
      setNewUrl("");
      setNewCategory("Other");
      setOpen(false);
      await loadSources(orgId);
    }
  };

  const toggleSource = async (id: string, currentActive: boolean) => {
    setSources((prev) => prev.map((s) => (s.id === id ? { ...s, is_active: !currentActive } : s)));
    const { error } = await supabase
      .from("grant_sources")
      .update({ is_active: !currentActive })
      .eq("id", id);
    if (error) {
      setSources((prev) => prev.map((s) => (s.id === id ? { ...s, is_active: currentActive } : s)));
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    }
  };

  const deleteSource = async (id: string) => {
    const prev = sources;
    setSources((s) => s.filter((x) => x.id !== id));
    const { error } = await supabase.from("grant_sources").delete().eq("id", id);
    if (error) {
      setSources(prev);
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Source removed" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Grant Sources</h1>
          <p className="text-muted-foreground">Manage the URLs that GrantPilot scans for grant opportunities.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="brand" className="gap-2">
              <Plus className="h-4 w-4" /> Add Source
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Grant Source</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="source-name">Name</Label>
                <Input id="source-name" placeholder="e.g. United Way Atlanta" value={newName} onChange={(e) => setNewName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source-url">URL</Label>
                <Input id="source-url" placeholder="https://example.org/grants" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="brand" onClick={handleAdd} disabled={!newName.trim() || !newUrl.trim() || adding} className="gap-2">
                {adding && <Loader2 className="h-4 w-4 animate-spin" />} Add Source
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {sources.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Globe className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="font-medium text-foreground">No sources yet</p>
            <p className="text-sm text-muted-foreground mt-1">Add grant source URLs to start discovering opportunities.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sources.map((s) => (
            <Card key={s.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{s.name}</p>
                    {s.category && (
                      <Badge variant="secondary" className={categoryColors[s.category] || ""}>
                        {s.category}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{s.url}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteSource(s.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Switch checked={s.is_active} onCheckedChange={() => toggleSource(s.id, s.is_active)} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sources;
