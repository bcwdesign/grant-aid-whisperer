import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

const runs = [
  { id: 1, type: "daily_cron", startedAt: "Feb 15, 2026 02:00", status: "success", sources: 5, grants: 12, duration: "34s" },
  { id: 2, type: "manual", startedAt: "Feb 14, 2026 14:23", status: "success", sources: 3, grants: 8, duration: "22s" },
  { id: 3, type: "daily_cron", startedAt: "Feb 14, 2026 02:00", status: "partial", sources: 5, grants: 9, duration: "45s" },
  { id: 4, type: "daily_cron", startedAt: "Feb 13, 2026 02:00", status: "success", sources: 5, grants: 15, duration: "38s" },
  { id: 5, type: "manual", startedAt: "Feb 12, 2026 10:15", status: "failed", sources: 2, grants: 0, duration: "12s" },
];

const statusConfig: Record<string, { icon: typeof CheckCircle2; className: string }> = {
  success: { icon: CheckCircle2, className: "bg-brand/10 text-brand" },
  partial: { icon: AlertTriangle, className: "bg-brand/20 text-brand" },
  failed: { icon: XCircle, className: "bg-destructive/10 text-destructive" },
};

const AgentRuns = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Run Logs</h1>
        <p className="text-muted-foreground">History of grant search runs and their results.</p>
      </div>

      <div className="space-y-3">
        {runs.map((r) => {
          const config = statusConfig[r.status];
          const StatusIcon = config.icon;
          return (
            <Card key={r.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{r.type === "daily_cron" ? "Daily Cron" : "Manual Run"}</p>
                    <Badge variant="secondary" className={config.className}>
                      <StatusIcon className="mr-1 h-3 w-3" />
                      {r.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{r.startedAt}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-foreground">{r.grants} grants found</p>
                  <p className="text-muted-foreground">{r.sources} sources · {r.duration}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AgentRuns;
