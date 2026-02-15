import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Layers, Clock, DollarSign, Zap, CheckCircle2, AlertCircle } from "lucide-react";

const stats = [
  { label: "Grants Discovered", value: "47", change: "+12 this week", icon: Search },
  { label: "In Pipeline", value: "8", change: "3 in progress", icon: Layers },
  { label: "Upcoming Deadlines", value: "5", change: "Next 14 days", icon: Clock },
  { label: "Potential Funding", value: "$2.4M", change: "Total pipeline value", icon: DollarSign },
];

const deadlines = [
  { title: "Community Development Block Grant", funder: "HUD", date: "Mar 15, 2026", status: "in_progress" },
  { title: "Youth Education Initiative", funder: "Google.org", date: "Mar 22, 2026", status: "researching" },
  { title: "Environmental Justice Small Grants", funder: "EPA", date: "Apr 1, 2026", status: "not_started" },
  { title: "Arts in Education Grant", funder: "NEA", date: "Apr 10, 2026", status: "in_progress" },
];

const statusColors: Record<string, string> = {
  not_started: "bg-muted text-muted-foreground",
  researching: "bg-brand/10 text-brand",
  in_progress: "bg-brand/20 text-brand",
  submitted: "bg-primary/10 text-primary",
};

const Dashboard = () => {
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
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-brand" /> Last run: 2 hours ago · 12 grants found
              </span>
            </p>
          </div>
          <Button variant="brand" className="gap-2">
            <Zap className="h-4 w-4" /> Run Search Now
          </Button>
        </CardContent>
      </Card>

      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-brand" /> Upcoming Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deadlines.map((d) => (
              <div
                key={d.title}
                className="flex flex-col items-start justify-between gap-2 rounded-lg border border-border p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="font-medium text-foreground">{d.title}</p>
                  <p className="text-sm text-muted-foreground">{d.funder}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className={statusColors[d.status]}>
                    {d.status.replace("_", " ")}
                  </Badge>
                  <span className="text-sm font-medium text-muted-foreground">{d.date}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
