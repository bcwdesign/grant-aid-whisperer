import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";

const upcomingDeadlines = [
  { title: "Rural Health Outreach Program", funder: "HRSA", date: "Feb 28, 2026", daysLeft: 13 },
  { title: "Community Development Block Grant", funder: "HUD", date: "Mar 15, 2026", daysLeft: 28 },
  { title: "Youth Education Initiative", funder: "Google.org", date: "Mar 22, 2026", daysLeft: 35 },
  { title: "Environmental Justice Small Grants", funder: "EPA", date: "Apr 1, 2026", daysLeft: 45 },
  { title: "Arts in Education Grant", funder: "NEA", date: "Apr 10, 2026", daysLeft: 54 },
  { title: "Digital Equity Grant", funder: "NTIA", date: "May 1, 2026", daysLeft: 75 },
];

const CalendarPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
        <p className="text-muted-foreground">Track upcoming grant deadlines at a glance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {upcomingDeadlines.map((d) => (
          <Card key={d.title} className="transition-shadow hover:shadow-md">
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <Badge
                  variant="secondary"
                  className={
                    d.daysLeft <= 14
                      ? "bg-destructive/10 text-destructive"
                      : d.daysLeft <= 30
                        ? "bg-brand/10 text-brand"
                        : "bg-muted text-muted-foreground"
                  }
                >
                  {d.daysLeft} days left
                </Badge>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">{d.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d.funder}</p>
              <p className="mt-2 text-sm font-medium text-foreground">{d.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CalendarPage;
