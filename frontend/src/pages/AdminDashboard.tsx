import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { type BloodGroup } from "@/lib/mockData";
import { BloodGroupBadge } from "@/components/BloodGroupBadge";
import { toast } from "sonner";
import { Droplet, Users, ClipboardList, TrendingUp, Minus, Plus, Loader2, Trash2 } from "lucide-react";
import { DashboardHeader } from "./DonorDashboard";
import { InventoryAPI, type BloodInventoryItem } from "@/services/api";

const AdminDashboard = () => {
  const [inventory, setInventory] = useState<BloodInventoryItem[]>([]);
  const [loadingInv, setLoadingInv] = useState(true);
  const totalUnits = inventory.reduce((s, i) => s + (i.units ?? 0), 0);

  // New inventory form state
  const [newItem, setNewItem] = useState({
    bloodGroup: "O+" as BloodGroup,
    units: 1,
    hospitalName: "",
    location: "",
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoadingInv(true);
    try {
      const { data } = await InventoryAPI.getAll();
      setInventory(data);
    } catch {
      toast.error("Failed to load inventory.");
    } finally {
      setLoadingInv(false);
    }
  };

  const handleAddInventory = async () => {
    if (!newItem.hospitalName || !newItem.location) {
      toast.error("Please fill hospital name and location.");
      return;
    }
    try {
      const { data } = await InventoryAPI.add(newItem);
      setInventory((prev) => {
        const idx = prev.findIndex((i) => i.id === data.id);
        return idx >= 0 ? prev.map((i) => (i.id === data.id ? data : i)) : [...prev, data];
      });
      toast.success(`Inventory updated for ${data.bloodGroup}.`);
    } catch {
      toast.error("Failed to update inventory.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await InventoryAPI.remove(id);
      setInventory((prev) => prev.filter((i) => i.id !== id));
      toast("Inventory record deleted.");
    } catch {
      toast.error("Failed to delete record.");
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="container py-10">
        <DashboardHeader
          title="Admin dashboard"
          subtitle="Monitor inventory, users, and requests across the network."
        />

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Droplet} label="Total units" value={totalUnits} accent />
          <StatCard icon={Users} label="Donors" value={inventory.length} />
          <StatCard icon={ClipboardList} label="Inventory records" value={inventory.length} />
          <StatCard icon={TrendingUp} label="Blood groups tracked" value={new Set(inventory.map((i) => i.bloodGroup)).size} />
        </div>

        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="add">Add / Update</TabsTrigger>
          </TabsList>

          {/* ── Inventory list ── */}
          <TabsContent value="inventory">
            <Card className="border-border/60 bg-card p-6 shadow-soft">
              {loadingInv ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : inventory.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  No inventory records. Use the "Add / Update" tab to add some.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Group</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Hospital</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <BloodGroupBadge group={item.bloodGroup as BloodGroup} size="sm" />
                        </TableCell>
                        <TableCell>
                          <span className={`font-bold ${item.units < 10 ? "text-destructive" : ""}`}>
                            {item.units}
                          </span>
                          {item.units < 10 && (
                            <Badge variant="destructive" className="ml-2 text-xs">Low</Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{item.hospitalName}</TableCell>
                        <TableCell className="text-muted-foreground">{item.location}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => item.id !== undefined && handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>
          </TabsContent>

          {/* ── Add / Update inventory ── */}
          <TabsContent value="add">
            <Card className="border-border/60 bg-card p-6 shadow-soft">
              <h2 className="mb-4 text-lg font-semibold">Add or Update Inventory</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Blood Group</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newItem.bloodGroup}
                    onChange={(e) => setNewItem({ ...newItem, bloodGroup: e.target.value as BloodGroup })}
                  >
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Units</label>
                  <Input
                    type="number"
                    min={1}
                    value={newItem.units}
                    onChange={(e) => setNewItem({ ...newItem, units: +e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hospital Name</label>
                  <Input
                    placeholder="City General"
                    value={newItem.hospitalName}
                    onChange={(e) => setNewItem({ ...newItem, hospitalName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    placeholder="Mumbai"
                    value={newItem.location}
                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                  />
                </div>
              </div>
              <Button
                variant="hero"
                className="mt-5 flex items-center gap-2"
                onClick={handleAddInventory}
              >
                <Plus className="h-4 w-4" /> Save Inventory
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  accent?: boolean;
}) => (
  <Card
    className={`border-border/60 p-6 shadow-soft ${accent ? "bg-gradient-primary text-primary-foreground" : "bg-card"}`}
  >
    <div className="flex items-center justify-between">
      <p className={`text-sm ${accent ? "text-primary-foreground/85" : "text-muted-foreground"}`}>
        {label}
      </p>
      <Icon className="h-5 w-5 opacity-80" />
    </div>
    <p className="mt-3 text-3xl font-bold">{value.toLocaleString()}</p>
  </Card>
);

export default AdminDashboard;
