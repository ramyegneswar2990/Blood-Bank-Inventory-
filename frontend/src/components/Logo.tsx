import { Droplet } from "lucide-react";
import { Link } from "react-router-dom";

export const Logo = ({ className = "" }: { className?: string }) => (
  <Link to="/" className={`flex items-center gap-2 font-semibold ${className}`}>
    <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-soft">
      <Droplet className="h-5 w-5 text-primary-foreground" fill="currentColor" />
    </span>
    <span className="text-lg tracking-tight">
      Life<span className="text-primary">Drop</span>
    </span>
  </Link>
);
