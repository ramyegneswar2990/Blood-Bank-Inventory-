import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import type { Role } from "@/context/AuthContext";
import { Heart, HeartHandshake } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // login() calls /api/auth/login and stores the JWT + user.
      // The role is returned by the backend, so no need to pass it from the UI.
      await login(email, password);
      toast.success("Welcome back!");
      // Redirect based on role stored after login
      const raw = localStorage.getItem("bb_user");
      const role = raw ? (JSON.parse(raw).role as Role) : "donor";
      navigate(role === "admin" ? "/admin" : role === "donor" ? "/donor" : "/receiver");
    } catch {
      toast.error("Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero px-4 py-12">
      <Card className="w-full max-w-md border-border/60 bg-card/95 p-8 shadow-elegant backdrop-blur md:p-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-6 text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Log in to continue saving lives</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to LifeDrop?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  );
};

/** Exported so Signup.tsx can reuse it. */
export const RoleToggle = ({ role, onChange }: { role: Role; onChange: (r: Role) => void }) => (
  <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted p-1.5">
    {(
      [
        { value: "donor", label: "Donor", icon: Heart },
        { value: "receiver", label: "Receiver", icon: HeartHandshake },
        { value: "admin", label: "Admin", icon: HeartHandshake },
      ] as const
    ).map((r) => (
      <button
        key={r.value}
        type="button"
        onClick={() => onChange(r.value)}
        className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-smooth ${
          role === r.value
            ? "bg-card text-foreground shadow-soft"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <r.icon className="h-3.5 w-3.5" /> {r.label}
      </button>
    ))}
  </div>
);

export default Login;
