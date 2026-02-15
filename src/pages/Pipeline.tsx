import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const columns = [
  { key: "not_started", label: "Not Started", color: "bg-muted" },
  { key: "researching", label: "Researching", color: "bg-brand/10" },
  { key: "in_progress", label: "In Progress", color: "bg-brand/20" },
  { key: "submitted", label: "Submitted", color: "bg-primary/10" },
];

const grants = [
  { id: 1, title: "Community Development Block Grant", funder: "HUD", amount: "$500K", status: "in_progress", deadline: "Mar 15" },
  { id: 2, title: "Youth Education Initiative", funder: "Google.org", amount: "$250K", status: "researching", deadline: "Mar 22" },
  { id: 3, title: "Environmental Justice Small Grants", funder: "EPA", amount: "$100K", status: "not_started", deadline: "Apr 1" },
  { id: 4, title: "Arts in Education Grant", funder: "NEA", amount: "$75K", status: "in_progress", deadline: "Apr 10" },
  { id: 5, title: "Rural Health Outreach", funder: "HRSA", amount: "$300K", status: "submitted", deadline: "Feb 28" },
  { id: 6, title: "Digital Equity Grant", funder: "NTIA", amount: "$150K", status: "not_started", deadline: "May 1" },
];

const Pipeline = () => {
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

      {/* Kanban */}
      <div className="grid gap-4 lg:grid-cols-4">
        {columns.map((col) => {
          const colGrants = grants.filter((g) => g.status === col.key);
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
