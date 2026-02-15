import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePipeline } from "@/contexts/PipelineContext";

const columns = [
  { key: "not_started", label: "Not Started", color: "bg-muted" },
  { key: "researching", label: "Researching", color: "bg-brand/10" },
  { key: "in_progress", label: "In Progress", color: "bg-brand/20" },
  { key: "submitted", label: "Submitted", color: "bg-primary/10" },
];

const Pipeline = () => {
  const { pipelineGrants } = usePipeline();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pipeline</h1>
          <p className="text-muted-foreground">Track your grant applications from discovery to award.</p>
        </div>
        <Button variant="brand" className="gap-2">
          <Plus className="h-4 w-4" /> Add Grant
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {columns.map((col) => {
          const colGrants = pipelineGrants.filter((g) => g.status === col.key);
          return (
            <div key={col.key} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${col.color}`} />
                <span className="text-sm font-semibold text-foreground">{col.label}</span>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {colGrants.length}
                </Badge>
              </div>
              <div className="space-y-3">
                {colGrants.map((g) => (
                  <Card key={g.id} className="cursor-pointer transition-shadow hover:shadow-md">
                    <CardContent className="p-4">
                      <p className="font-medium text-foreground">{g.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{g.funder}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm font-semibold text-brand">{g.amount}</span>
                        <span className="text-xs text-muted-foreground">{g.deadline}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Pipeline;
