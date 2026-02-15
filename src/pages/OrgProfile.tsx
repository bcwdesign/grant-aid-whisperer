import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const orgTypes = ["501(c)(3)", "School Foundation", "Faith-Based", "Community Organization", "Government", "Other"];
const budgetRanges = ["Under $100K", "$100K - $500K", "$500K - $1M", "$1M - $5M", "$5M+"];
const focusOptions = ["Education", "Health", "Environment", "Arts", "Housing", "Youth", "Community Development", "Technology", "Social Justice"];

const OrgProfile = () => {
  const [selectedFocus, setSelectedFocus] = useState<string[]>(["Education", "Youth"]);

  const toggleFocus = (area: string) => {
    setSelectedFocus((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Organization Profile</h1>
        <p className="text-muted-foreground">Set up your nonprofit profile to improve grant matching.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Tell us about your organization.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Organization Name</Label>
            <Input placeholder="Acme Nonprofit" defaultValue="Acme Nonprofit" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Organization Type</Label>
              <Select defaultValue="501(c)(3)">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {orgTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Annual Budget</Label>
              <Select defaultValue="$500K - $1M">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {budgetRanges.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Mission Statement</Label>
            <Textarea placeholder="Describe your organization's mission..." rows={3} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Country</Label>
              <Input defaultValue="United States" />
            </div>
            <div className="space-y-2">
              <Label>State</Label>
              <Input defaultValue="California" />
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input defaultValue="San Francisco" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Focus Areas</CardTitle>
          <CardDescription>Select areas that match your organization's work.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {focusOptions.map((area) => (
              <Badge
                key={area}
                variant={selectedFocus.includes(area) ? "default" : "outline"}
                className={`cursor-pointer ${selectedFocus.includes(area) ? "bg-brand text-brand-foreground hover:bg-brand/90" : ""}`}
                onClick={() => toggleFocus(area)}
              >
                {area}
                {selectedFocus.includes(area) && <X className="ml-1 h-3 w-3" />}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="brand">Save Profile</Button>
      </div>
    </div>
  );
};

export default OrgProfile;
