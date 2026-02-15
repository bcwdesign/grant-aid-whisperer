import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Globe, Zap, Pencil, Trash2 } from "lucide-react";

const defaultSources = [
  { id: 1, name: "Grants.gov", url: "https://www.grants.gov", category: "Federal", active: true },
  { id: 2, name: "Google.org", url: "https://www.google.org/grants", category: "Corporate", active: true },
  { id: 3, name: "Microsoft Philanthropies", url: "https://www.microsoft.com/philanthropies", category: "Corporate", active: true },
  { id: 4, name: "Local Community Foundation", url: "https://communityfoundation.org", category: "Foundation", active: false },
  { id: 5, name: "State Grants Portal", url: "https://grants.state.gov", category: "State", active: false },
];

const categoryColors: Record<string, string> = {
  Federal: "bg-primary/10 text-primary",
  Corporate: "bg-brand/10 text-brand",
  Foundation: "bg-accent/10 text-accent-foreground",
  State: "bg-secondary text-secondary-foreground",
};

const Sources = () => {
  const [sources, setSources] = useState(defaultSources);

  const toggleSource = (id: number) => {
    setSources(sources.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Grant Sources</h1>
          <p className="text-muted-foreground">Manage the URLs that GrantPilot scans for grant opportunities.</p>
        </div>
        <Button variant="brand" className="gap-2">
          <Plus className="h-4 w-4" /> Add Source
        </Button>
      </div>

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
                  <Badge variant="secondary" className={categoryColors[s.category] || ""}>
                    {s.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{s.url}</p>
              </div>
              <Button variant="ghost" size="icon" title="Test source">
                <Zap className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
              <Switch checked={s.active} onCheckedChange={() => toggleSource(s.id)} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Sources;
