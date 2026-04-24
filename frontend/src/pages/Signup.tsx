import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, type Role } from "@/context/AuthContext";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { BLOOD_GROUPS, type BloodGroup } from "@/lib/mockData";
import { RoleToggle } from "./Login";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("donor");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    location: "Mumbai",            // matches backend RegisterRequest.location
    bloodGroup: "O+" as BloodGroup,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup({
        name: form.name,
        email: form.email,
        password: form.password,
        role,
        location: form.location,
        bloodGroup: role !== "admin" ? form.bloodGroup : undefined,
      });
      toast.success("Account created — welcome to LifeDrop!");
      navigate(role === "admin" ? "/admin" : role === "donor" ? "/donor" : "/receiver");
    } catch {
      toast.error("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero px-4 py-12">
      <Card className="w-full max-w-md border-border/60 bg-card/95 p-8 shadow-elegant backdrop-blur md:p-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-6 text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Join the LifeDrop community</p>
        </div>

        <RoleToggle role={role} onChange={setRole} />

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Jane Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 6 characters"
            />
          </div>

          {/* Location — always visible */}
          <div className="space-y-2">
            <Label htmlFor="location">Location / City</Label>
            <Input
              id="location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Mumbai"
            />
          </div>

          {/* Blood group — only for donor / receiver */}
          {role !== "admin" && (
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
          )}

          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Signup;
