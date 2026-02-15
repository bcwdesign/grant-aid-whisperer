import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Calendar, DollarSign, MapPin, Bookmark } from "lucide-react";

const GrantDetail = () => {
  const { id } = useParams();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/app/search" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to search
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Community Development Block Grant</h1>
          <p className="mt-1 text-lg text-muted-foreground">U.S. Department of Housing and Urban Development</p>
        </div>
        <div className="flex gap-2">
          <Button variant="brand-outline" className="gap-2">
            <Bookmark className="h-4 w-4" /> Save to Pipeline
          </Button>
          <Button variant="brand" className="gap-2">
            <ExternalLink className="h-4 w-4" /> Apply
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <DollarSign className="h-5 w-5 text-brand" />
            <div>
              <p className="text-sm text-muted-foreground">Funding Amount</p>
              <p className="font-semibold text-foreground">$500,000</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Calendar className="h-5 w-5 text-brand" />
            <div>
              <p className="text-sm text-muted-foreground">Deadline</p>
              <p className="font-semibold text-foreground">March 15, 2026</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <MapPin className="h-5 w-5 text-brand" />
            <div>
              <p className="text-sm text-muted-foreground">Eligibility</p>
              <p className="font-semibold text-foreground">Nationwide</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            The Community Development Block Grant (CDBG) program provides annual grants on a formula basis to states, cities,
            and counties to develop viable urban communities by providing decent housing and a suitable living environment,
            and by expanding economic opportunities, principally for low- and moderate-income persons.
          </p>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline">Community Development</Badge>
            <Badge variant="outline">Housing</Badge>
            <Badge variant="outline">Economic Development</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrantDetail;
