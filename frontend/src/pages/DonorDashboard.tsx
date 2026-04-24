import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { BloodGroupBadge } from "@/components/BloodGroupBadge";
import { toast } from "sonner";
import { MapPin, Calendar, Droplet, Award } from "lucide-react";
import type { BloodGroup } from "@/lib/mockData";

// ─── Shared types (match backend BloodRequest entity) ──────────────────────
interface IncomingRequest {
  id: string;
  bloodGroup: string;
  urgencyLevel: string;   // HIGH | MEDIUM | LOW
  location: string;
  requiredUnits: number;
  status: "Pending" | "Accepted" | "Fulfilled" | "Rejected";
  createdAt: string;
}

const DonorDashboard = () => {
  const { user, updateUser } = useAuth();
  // In production, fetch open requests from backend. For now, start empty and
  // the matching engine will push requests to donors via your backend service.
  const [requests, setRequests] = useState<IncomingRequest[]>([]);

  const handleAccept = (id: string) => {
    setRequests((r) => r.map((x) => (x.id === id ? { ...x, status: "Accepted" as const } : x)));
    toast.success("Request accepted. The hospital has been notified.");
  };

  const handleReject = (id: string) => {
    setRequests((r) => r.map((x) => (x.id === id ? { ...x, status: "Rejected" as const } : x)));
    toast("Request declined.");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="container py-10">
        <DashboardHeader
          title={`Hi, ${user?.name?.split(" ")[0]} 👋`}
          subtitle="Manage your donor profile and respond to life-saving requests."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile card */}
          <Card className="border-border/60 bg-card p-6 shadow-soft lg:col-span-1">
            <div className="flex items-center gap-4">
              <BloodGroupBadge group={(user?.bloodGroup ?? "O+") as BloodGroup} size="lg" />
              <div>
                <p className="text-lg font-semibold">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="mt-6 space-y-3 text-sm">
              <Row icon={MapPin} label="Location" value={user?.location ?? "—"} />
              <Row icon={Calendar} label="Last donation" value="—" />
              <Row icon={Droplet} label="Total donations" value="—" />
              <Row icon={Award} label="Lives impacted" value="—" />
            </div>

            {/* Availability toggle */}
            <div className="mt-6 rounded-xl border border-border/60 bg-gradient-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Availability</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.available
                      ? "You'll receive emergency requests"
                      : "You won't be contacted"}
                  </p>
                </div>
                <Switch
                  checked={!!user?.available}
                  onCheckedChange={(v) => {
                    updateUser({ available: v });
                    toast.success(v ? "You're available to donate" : "Marked as unavailable");
                  }}
                />
              </div>
            </div>
          </Card>

          {/* Incoming requests */}
          <Card className="border-border/60 bg-card p-6 shadow-soft lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Incoming requests</h2>
              <Badge variant="secondary">
                {requests.filter((r) => r.status === "Pending").length} pending
              </Badge>
            </div>

            {requests.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No incoming requests right now. You'll be notified when there's a match.
              </p>
            ) : (
              <div className="space-y-3">
                {requests.map((r) => (
                  <div
                    key={r.id}
                    className="flex flex-col gap-4 rounded-xl border border-border/60 bg-gradient-card p-4 transition-smooth hover:shadow-soft md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <BloodGroupBadge group={r.bloodGroup as BloodGroup} />
                      <div>
                        <p className="font-medium">
                          {r.bloodGroup}{" "}
                          <span className="text-xs text-muted-foreground">· #{r.id}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {r.location} · {r.requiredUnits} unit(s)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <UrgencyBadge urgency={r.urgencyLevel as "Critical" | "High" | "Normal"} />
                      <StatusBadge status={r.status} />
                      {r.status === "Pending" && (
                        <>
                          <Button size="sm" variant="success" onClick={() => handleAccept(r.id)}>
                            Accept
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleReject(r.id)}>
                            Decline
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

// ─── Shared sub-components (exported for use in other pages) ───────────────

export const DashboardHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
    <p className="mt-1 text-muted-foreground">{subtitle}</p>
  </div>
);

const Row = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) => (
  <div className="flex items-center justify-between border-b border-border/60 pb-2 last:border-0 last:pb-0">
    <span className="flex items-center gap-2 text-muted-foreground">
      <Icon className="h-4 w-4" /> {label}
    </span>
    <span className="font-medium">{value}</span>
  </div>
);

export const UrgencyBadge = ({
  urgency,
}: {
  urgency: "Critical" | "High" | "Normal" | "HIGH" | "MEDIUM" | "LOW";
}) => {
  const normalized =
    urgency === "HIGH" ? "Critical" : urgency === "MEDIUM" ? "High" : urgency === "LOW" ? "Normal" : urgency;
  const map = {
    Critical: "bg-destructive/10 text-destructive border-destructive/20",
    High: "bg-warning/10 text-warning border-warning/20",
    Normal: "bg-muted text-muted-foreground border-border",
  } as const;
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${map[normalized as keyof typeof map] ?? map.Normal}`}
    >
      {normalized}
    </span>
  );
};

export const StatusBadge = ({
  status,
}: {
  status: "Pending" | "Accepted" | "Fulfilled" | "Rejected" | "PENDING" | "ACCEPTED" | "FULFILLED" | "REJECTED";
}) => {
  const normalized =
    status === "PENDING"
      ? "Pending"
      : status === "ACCEPTED"
      ? "Accepted"
      : status === "FULFILLED"
      ? "Fulfilled"
      : status === "REJECTED"
      ? "Rejected"
      : status;
  const map = {
    Pending: "bg-muted text-muted-foreground border-border",
    Accepted: "bg-primary/10 text-primary border-primary/20",
    Fulfilled: "bg-success/10 text-success border-success/20",
    Rejected: "bg-destructive/10 text-destructive border-destructive/20",
  } as const;
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${map[normalized as keyof typeof map] ?? map.Pending}`}
    >
      {normalized}
    </span>
  );
};

export default DonorDashboard;
