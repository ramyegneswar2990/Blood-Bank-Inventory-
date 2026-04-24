import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { BLOOD_GROUPS, type BloodGroup } from "@/lib/mockData";
import { BloodGroupBadge } from "@/components/BloodGroupBadge";
import { Search, MapPin, Loader2 } from "lucide-react";
import { InventoryAPI, type BloodInventoryItem } from "@/services/api";
import { toast } from "sonner";

const SearchPage = () => {
  const [group, setGroup] = useState<BloodGroup | "all">("all");
  const [results, setResults] = useState<BloodInventoryItem[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (group === "all") {
      toast("Please select a specific blood group to search.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await InventoryAPI.check(group);
      setResults(data);
      setSearched(true);
    } catch {
      toast.error("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="container py-10">
        <div className="mb-8 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight">Find blood near you</h1>
          <p className="mt-2 text-muted-foreground">
            No login required. Search live availability across hospitals.
          </p>
        </div>

        {/* ── Search bar ── */}
        <Card className="mb-8 border-border/60 bg-card p-6 shadow-soft">
          <div className="grid gap-4 md:grid-cols-[1fr,auto]">
            <div className="space-y-2">
              <Label>Blood group</Label>
              <Select
                value={group}
                onValueChange={(v) => setGroup(v as BloodGroup | "all")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All groups</SelectItem>
                  {BLOOD_GROUPS.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="hero"
                size="lg"
                className="w-full md:w-auto"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}{" "}
                Search
              </Button>
            </div>
          </div>
        </Card>

        {/* ── Results ── */}
        {searched && (
          <>
            <h2 className="mb-4 text-lg font-semibold">
              Availability — {group}{" "}
              <span className="text-sm text-muted-foreground font-normal">
                ({results.length} record{results.length !== 1 ? "s" : ""})
              </span>
            </h2>

            {results.length === 0 ? (
              <Card className="border-dashed border-border bg-card p-10 text-center text-muted-foreground">
                No inventory found for {group}. Try a different blood group.
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((item) => (
                  <Card
                    key={item.id}
                    className="border-border/60 bg-gradient-card p-5 shadow-soft transition-smooth hover:shadow-elegant"
                  >
                    <div className="flex items-start justify-between">
                      <BloodGroupBadge group={item.bloodGroup as BloodGroup} />
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          (item.units ?? 0) < 10
                            ? "bg-destructive/10 text-destructive"
                            : "bg-success/10 text-success"
                        }`}
                      >
                        {(item.units ?? 0) < 10 ? "Low stock" : "Available"}
                      </span>
                    </div>
                    <p className="mt-3 text-3xl font-bold">{item.units}</p>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">units</p>
                    <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">{item.hospitalName}</p>
                      <p className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {item.location}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
