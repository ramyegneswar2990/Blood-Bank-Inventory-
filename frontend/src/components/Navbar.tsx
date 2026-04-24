import { Link, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { LogOut, LayoutDashboard } from "lucide-react";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dashboardPath =
    user?.role === "admin" ? "/admin"
    : user?.role === "donor" ? "/donor"
    : "/receiver";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="text-sm text-muted-foreground transition-smooth hover:text-foreground">Home</Link>
          <Link to="/search" className="text-sm text-muted-foreground transition-smooth hover:text-foreground">Find Blood</Link>
          <Link to="/donor" className="text-sm text-muted-foreground transition-smooth hover:text-foreground">Become Donor</Link>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate(dashboardPath)}>
                <LayoutDashboard className="mr-1.5 h-4 w-4" /> Dashboard
              </Button>
              <Button variant="outline" size="sm" onClick={() => { logout(); navigate("/"); }}>
                <LogOut className="mr-1.5 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>Login</Button>
              <Button variant="hero" size="sm" onClick={() => navigate("/signup")}>Sign Up</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
