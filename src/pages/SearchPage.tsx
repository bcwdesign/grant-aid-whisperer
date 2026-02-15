import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Bookmark, ExternalLink } from "lucide-react";

const mockGrants = [
  { id: 1, title: "Community Development Block Grant", funder: "HUD", amount: "$500,000", status: "open", deadline: "Mar 15, 2026", focus: ["Community Development", "Housing"], match: 95 },
  { id: 2, title: "Youth Education Initiative", funder: "Google.org", amount: "$250,000", status: "open", deadline: "Mar 22, 2026", focus: ["Education", "Youth"], match: 88 },
  { id: 3, title: "Environmental Justice Small Grants Program", funder: "EPA", amount: "$100,000", status: "open", deadline: "Apr 1, 2026", focus: ["Environment", "Justice"], match: 82 },
  { id: 4, title: "Arts in Education National Grant", funder: "NEA", amount: "$75,000", status: "upcoming", deadline: "Apr 10, 2026", focus: ["Arts", "Education"], match: 78 },
  { id: 5, title: "Rural Health Outreach Program", funder: "HRSA", amount: "$300,000", status: "open", deadline: "Feb 28, 2026", focus: ["Health", "Rural"], match: 72 },
];

const SearchPage = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Grant Search</h1>
        <p className="text-muted-foreground">Discover grant opportunities matching your organization.</p>
      </div>

      {/* Search bar */}
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

      {/* Results */}
      <div className="space-y-3">
        {mockGrants.map((g) => (
          <Card key={g.id} className="transition-shadow hover:shadow-md">
            <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{g.title}</h3>
                  <Badge variant="secondary" className={g.status === "open" ? "bg-brand/10 text-brand" : "bg-muted text-muted-foreground"}>
                    {g.status}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {g.funder} · {g.amount} · Due {g.deadline}
                </p>
                <div className="mt-2 flex gap-1.5">
                  {g.focus.map((f) => (
                    <Badge key={f} variant="outline" className="text-xs">
                      {f}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-2xl font-bold text-brand">{g.match}%</p>
                  <p className="text-xs text-muted-foreground">match</p>
                </div>
                <Button variant="ghost" size="icon">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
