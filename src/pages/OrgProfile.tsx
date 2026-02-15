import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const orgTypes = ["501(c)(3)", "School Foundation", "Faith-Based", "Community Organization", "Government", "Other"];
const budgetRanges = ["Under $100K", "$100K - $500K", "$500K - $1M", "$1M - $5M", "$5M+"];
const focusOptions = ["Education", "Health", "Environment", "Arts", "Housing", "Youth", "Community Development", "Technology", "Social Justice"];

const OrgProfile = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("Acme Nonprofit");
  const [orgType, setOrgType] = useState("501(c)(3)");
  const [budget, setBudget] = useState("$500K - $1M");
  const [mission, setMission] = useState("");
  const [country, setCountry] = useState("United States");
  const [state, setState] = useState("California");
  const [city, setCity] = useState("San Francisco");
  const [selectedFocus, setSelectedFocus] = useState<string[]>(["Education", "Youth"]);

  const toggleFocus = (area: string) => {
    setSelectedFocus((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast({ title: "Organization name is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    // Simulate save — will persist to DB once auth is added
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast({ title: "Profile saved", description: "Your organization profile has been updated." });
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
            <Input placeholder="Acme Nonprofit" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Organization Type</Label>
              <Select value={orgType} onValueChange={setOrgType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {orgTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Annual Budget</Label>
              <Select value={budget} onValueChange={setBudget}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {budgetRanges.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Mission Statement</Label>
            <Textarea placeholder="Describe your organization's mission..." rows={3} value={mission} onChange={(e) => setMission(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Country</Label>
              <Input value={country} onChange={(e) => setCountry(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>State</Label>
              <Input value={state} onChange={(e) => setState(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} />
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
        <Button variant="brand" onClick={handleSave} disabled={saving} className="gap-2">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Profile
        </Button>
      </div>
    </div>
  );
};

export default OrgProfile;
