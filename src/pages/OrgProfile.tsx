import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const orgTypes = ["501(c)(3)", "School Foundation", "Faith-Based", "Community Organization", "Government", "Other"];
const budgetRanges = ["Under $100K", "$100K - $500K", "$500K - $1M", "$1M - $5M", "$5M+"];
const focusOptions = ["Education", "Health", "Environment", "Arts", "Housing", "Youth", "Community Development", "Technology", "Social Justice"];

const OrgProfile = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [orgType, setOrgType] = useState("");
  const [budget, setBudget] = useState("");
  const [mission, setMission] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [selectedFocus, setSelectedFocus] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .eq("owner_user_id", user.id)
        .maybeSingle();
      if (data) {
        setOrgId(data.id);
        setName(data.name || "");
        setOrgType(data.org_type || "");
        setBudget(data.annual_budget_range || "");
        setMission(data.mission || "");
        setCountry(data.location_country || "");
        setState(data.location_state || "");
        setCity(data.location_city || "");
        setSelectedFocus(data.focus_areas || []);
      }
      setLoading(false);
    };
    load();
  }, [user]);

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
    if (!orgId) return;
    setSaving(true);
    const { error } = await supabase
      .from("organizations")
      .update({
        name: name.trim(),
        org_type: orgType || null,
        annual_budget_range: budget || null,
        mission: mission || null,
        location_country: country || null,
        location_state: state || null,
        location_city: city || null,
        focus_areas: selectedFocus,
      })
      .eq("id", orgId);
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile saved", description: "Your organization profile has been updated." });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

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
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {orgTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Annual Budget</Label>
              <Select value={budget} onValueChange={setBudget}>
                <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
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
