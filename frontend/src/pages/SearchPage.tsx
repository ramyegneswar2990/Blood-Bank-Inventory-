import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo, useState } from "react";
import { BLOOD_GROUPS, type BloodGroup, initialInventory, nearbyDonors } from "@/lib/mockData";
import { BloodGroupBadge } from "@/components/BloodGroupBadge";
import { Search, MapPin } from "lucide-react";

const SearchPage = () => {
  const [city, setCity] = useState("");
  const [group, setGroup] = useState<BloodGroup | "all">("all");

  const filteredInv = useMemo(
    () => group === "all" ? initialInventory : initialInventory.filter((i) => i.group === group),
    [group],
  );

  const filteredDonors = useMemo(() => nearbyDonors.filter((d) =>
    (group === "all" || d.group === group) &&
    (city === "" || d.city.toLowerCase().includes(city.toLowerCase()))
  ), [group, city]);

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="container py-10">
        <div className="mb-8 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight">Find blood near you</h1>
          <p className="mt-2 text-muted-foreground">No login required. Search live availability and verified donors across cities.</p>
        </div>

        <Card className="mb-8 border-border/60 bg-card p-6 shadow-soft">
          <div className="grid gap-4 md:grid-cols-[1fr,1fr,auto]">
            <div className="space-y-2">
              <Label>Blood group</Label>
              <Select value={group} onValueChange={(v) => setGroup(v as BloodGroup | "all")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All groups</SelectItem>
                  {BLOOD_GROUPS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input placeholder="e.g. Mumbai" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="flex items-end">
              <Button variant="hero" size="lg" className="w-full md:w-auto">
                <Search className="h-4 w-4" /> Search
              </Button>
            </div>
          </div>
        </Card>

        <h2 className="mb-4 text-lg font-semibold">Inventory</h2>
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {filteredInv.map((i) => (
            <Card key={i.group} className="flex flex-col items-center gap-2 border-border/60 bg-gradient-card p-5 text-center shadow-soft">
              <BloodGroupBadge group={i.group} />
              <p className="text-2xl font-bold">{i.units}</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">units</p>
            </Card>
          ))}
        </div>

        <h2 className="mb-4 text-lg font-semibold">Verified donors</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filteredDonors.length === 0 && (
            <Card className="col-span-full border-dashed border-border bg-card p-10 text-center text-muted-foreground">
              No donors match your filters. Try expanding the search.
            </Card>
          )}
          {filteredDonors.map((d) => (
            <Card key={d.id} className="flex items-center justify-between border-border/60 bg-card p-5 shadow-soft transition-smooth hover:shadow-elegant">
              <div className="flex items-center gap-4">
                <BloodGroupBadge group={d.group} />
                <div>
                  <p className="font-medium">{d.name}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {d.city} · {d.distanceKm} km
                  </p>
                </div>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${d.available ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                {d.available ? "Available" : "Unavailable"}
              </span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
