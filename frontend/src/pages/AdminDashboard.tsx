import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { initialInventory, initialRequests, nearbyDonors } from "@/lib/mockData";
import { BloodGroupBadge } from "@/components/BloodGroupBadge";
import { toast } from "sonner";
import { Droplet, Users, ClipboardList, TrendingUp, Minus, Plus } from "lucide-react";
import { DashboardHeader, StatusBadge, UrgencyBadge } from "./DonorDashboard";

const AdminDashboard = () => {
  const [inventory, setInventory] = useState(initialInventory);
  const totalUnits = inventory.reduce((s, i) => s + i.units, 0);

  const adjust = (group: string, delta: number) => {
    setInventory((inv) => inv.map((i) => i.group === group ? { ...i, units: Math.max(0, i.units + delta) } : i));
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="container py-10">
        <DashboardHeader title="Admin dashboard" subtitle="Monitor inventory, users, and requests across the network." />

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Droplet} label="Total units" value={totalUnits} accent />
          <StatCard icon={Users} label="Donors" value={1284} />
          <StatCard icon={ClipboardList} label="Open requests" value={initialRequests.filter(r => r.status === "Pending").length} />
          <StatCard icon={TrendingUp} label="Donations / week" value={147} />
        </div>

        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory">
            <Card className="border-border/60 bg-card p-6 shadow-soft">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {inventory.map((item) => (
                  <div key={item.group} className="rounded-xl border border-border/60 bg-gradient-card p-4">
                    <div className="flex items-center justify-between">
                      <BloodGroupBadge group={item.group} />
                      {item.units < 10 && <Badge variant="destructive">Low</Badge>}
                    </div>
                    <p className="mt-4 text-3xl font-bold">{item.units}</p>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">units</p>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => { adjust(item.group, -1); toast(`Removed 1 unit of ${item.group}`); }}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="hero" className="flex-1" onClick={() => { adjust(item.group, 1); toast.success(`Added 1 unit of ${item.group}`); }}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="requests">
            <Card className="border-border/60 bg-card p-6 shadow-soft">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialRequests.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-xs">{r.id}</TableCell>
                      <TableCell className="font-medium">{r.patient}</TableCell>
                      <TableCell><BloodGroupBadge group={r.group} size="sm" /></TableCell>
                      <TableCell className="text-muted-foreground">{r.hospital}, {r.city}</TableCell>
                      <TableCell><UrgencyBadge urgency={r.urgency} /></TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="border-border/60 bg-card p-6 shadow-soft">
              <div className="mb-4 flex items-center justify-between gap-3">
                <Input placeholder="Search users…" className="max-w-sm" />
                <Badge variant="secondary">{nearbyDonors.length} shown</Badge>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Last donation</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nearbyDonors.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.name}</TableCell>
                      <TableCell><BloodGroupBadge group={d.group} size="sm" /></TableCell>
                      <TableCell className="text-muted-foreground">{d.city}</TableCell>
                      <TableCell className="text-muted-foreground">{d.lastDonation}</TableCell>
                      <TableCell>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${d.available ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                          {d.available ? "Available" : "Unavailable"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: number; accent?: boolean }) => (
  <Card className={`border-border/60 p-6 shadow-soft ${accent ? "bg-gradient-primary text-primary-foreground" : "bg-card"}`}>
    <div className="flex items-center justify-between">
      <p className={`text-sm ${accent ? "text-primary-foreground/85" : "text-muted-foreground"}`}>{label}</p>
      <Icon className="h-5 w-5 opacity-80" />
    </div>
    <p className="mt-3 text-3xl font-bold">{value.toLocaleString()}</p>
  </Card>
);

export default AdminDashboard;
