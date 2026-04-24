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
import { BLOOD_GROUPS, type BloodGroup, initialRequests, nearbyDonors, type BloodRequest } from "@/lib/mockData";
import { BloodGroupBadge } from "@/components/BloodGroupBadge";
import { toast } from "sonner";
import { MapPin, Plus, Activity } from "lucide-react";
import { DashboardHeader, StatusBadge, UrgencyBadge } from "./DonorDashboard";

const ReceiverDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<BloodRequest[]>(initialRequests.slice(0, 3));
  const [form, setForm] = useState({
    patient: user?.name ?? "",
    group: "O+" as BloodGroup,
    units: 1,
    hospital: "",
    city: user?.city ?? "Mumbai",
    urgency: "High" as BloodRequest["urgency"],
  });

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newReq: BloodRequest = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      ...form,
      status: "Pending",
      createdAt: new Date().toLocaleString(),
    };
    setRequests([newReq, ...requests]);
    toast.success("Blood request created. Donors are being notified.");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="container py-10">
        <DashboardHeader title="Receiver dashboard" subtitle="Create urgent requests and connect with donors near you." />

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-border/60 bg-card p-6 shadow-soft lg:col-span-1">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Plus className="h-4 w-4 text-primary" /> New request
            </h2>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="space-y-2">
                <Label>Patient name</Label>
                <Input required value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Blood group</Label>
                  <Select value={form.group} onValueChange={(v) => setForm({ ...form, group: v as BloodGroup })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{BLOOD_GROUPS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Units</Label>
                  <Input type="number" min={1} max={10} value={form.units} onChange={(e) => setForm({ ...form, units: +e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Hospital</Label>
                <Input required value={form.hospital} onChange={(e) => setForm({ ...form, hospital: e.target.value })} placeholder="City General Hospital" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Urgency</Label>
                  <Select value={form.urgency} onValueChange={(v) => setForm({ ...form, urgency: v as BloodRequest["urgency"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Normal">Normal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" variant="hero" className="w-full">Submit request</Button>
            </form>
          </Card>

          <div className="space-y-6 lg:col-span-2">
            <Card className="border-border/60 bg-card p-6 shadow-soft">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <Activity className="h-4 w-4 text-primary" /> Your requests
                </h2>
                <Badge variant="secondary">{requests.length} total</Badge>
              </div>
              <div className="space-y-3">
                {requests.map((r) => (
                  <div key={r.id} className="flex flex-col gap-3 rounded-xl border border-border/60 bg-gradient-card p-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <BloodGroupBadge group={r.group} />
                      <div>
                        <p className="font-medium">{r.patient} <span className="text-xs text-muted-foreground">· {r.id}</span></p>
                        <p className="text-sm text-muted-foreground">{r.hospital || "—"}, {r.city} · {r.units} unit(s) · {r.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <UrgencyBadge urgency={r.urgency} />
                      <StatusBadge status={r.status} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-border/60 bg-card p-6 shadow-soft">
              <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold">
                <MapPin className="h-4 w-4 text-primary" /> Nearby donors
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">Verified donors within 10 km of your location.</p>
              <div className="grid gap-3 md:grid-cols-2">
                {nearbyDonors.map((d) => (
                  <div key={d.id} className="flex items-center justify-between rounded-xl border border-border/60 bg-gradient-card p-4">
                    <div className="flex items-center gap-3">
                      <BloodGroupBadge group={d.group} size="sm" />
                      <div>
                        <p className="text-sm font-medium">{d.name}</p>
                        <p className="text-xs text-muted-foreground">{d.city} · {d.distanceKm} km</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${d.available ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                      {d.available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiverDashboard;
