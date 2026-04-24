import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { BLOOD_GROUPS, type BloodGroup } from "@/lib/mockData";
import { BloodGroupBadge } from "@/components/BloodGroupBadge";
import { toast } from "sonner";
import { MapPin, Plus, Activity, Loader2 } from "lucide-react";
import { DashboardHeader, StatusBadge, UrgencyBadge } from "./DonorDashboard";
import { RequestsAPI, type BloodRequestResponse } from "@/services/api";

// Map frontend urgency labels → backend enum values
const toUrgencyLevel = (u: string) => {
  const map: Record<string, string> = {
    Critical: "HIGH",
    High: "HIGH",
    Normal: "LOW",
    Medium: "MEDIUM",
  };
  return map[u] ?? "MEDIUM";
};

// Map backend urgency → display label
const fromUrgencyLevel = (u: string) => {
  const map: Record<string, string> = {
    HIGH: "Critical",
    MEDIUM: "High",
    LOW: "Normal",
  };
  return map[u] ?? u;
};

// Map backend status → display label
const fromStatus = (s: string) => {
  const map: Record<string, string> = {
    PENDING: "Pending",
    ACCEPTED: "Accepted",
    FULFILLED: "Fulfilled",
    REJECTED: "Rejected",
  };
  return map[s] ?? s;
};

const ReceiverDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<BloodRequestResponse[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    bloodGroup: "O+" as BloodGroup,
    units: 1,
    location: user?.location ?? "Mumbai",
    urgency: "High" as string,
  });

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await RequestsAPI.create({
        bloodGroup: form.bloodGroup,
        urgencyLevel: toUrgencyLevel(form.urgency),
        location: form.location,
        requiredUnits: form.units,
      });
      setRequests((prev) => [data, ...prev]);
      toast.success("Blood request submitted. Donors are being notified.");
    } catch {
      toast.error("Failed to create request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="container py-10">
        <DashboardHeader
          title="Receiver dashboard"
          subtitle="Create urgent requests and connect with donors near you."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* ── Request form ── */}
          <Card className="border-border/60 bg-card p-6 shadow-soft lg:col-span-1">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Plus className="h-4 w-4 text-primary" /> New request
            </h2>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Blood group</Label>
                  <Select
                    value={form.bloodGroup}
                    onValueChange={(v) => setForm({ ...form, bloodGroup: v as BloodGroup })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOOD_GROUPS.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Units</Label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={form.units}
                    onChange={(e) => setForm({ ...form, units: +e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="City / Hospital area"
                />
              </div>

              <div className="space-y-2">
                <Label>Urgency</Label>
                <Select
                  value={form.urgency}
                  onValueChange={(v) => setForm({ ...form, urgency: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Normal">Normal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" variant="hero" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
                  </>
                ) : (
                  "Submit request"
                )}
              </Button>
            </form>
          </Card>

          {/* ── My requests ── */}
          <div className="space-y-6 lg:col-span-2">
            <Card className="border-border/60 bg-card p-6 shadow-soft">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <Activity className="h-4 w-4 text-primary" /> Your requests
                </h2>
                <Badge variant="secondary">{requests.length} total</Badge>
              </div>

              {requests.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No requests yet — submit your first request on the left.
                </p>
              ) : (
                <div className="space-y-3">
                  {requests.map((r) => (
                    <div
                      key={r.id}
                      className="flex flex-col gap-3 rounded-xl border border-border/60 bg-gradient-card p-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <BloodGroupBadge group={r.bloodGroup as BloodGroup} />
                        <div>
                          <p className="font-medium">
                            {r.bloodGroup}{" "}
                            <span className="text-xs text-muted-foreground">· #{r.id}</span>
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {r.location} · {r.requiredUnits} unit(s)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <UrgencyBadge urgency={fromUrgencyLevel(r.urgencyLevel) as "Critical" | "High" | "Normal"} />
                        <StatusBadge status={fromStatus(r.status) as "Pending" | "Accepted" | "Fulfilled" | "Rejected"} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiverDashboard;
