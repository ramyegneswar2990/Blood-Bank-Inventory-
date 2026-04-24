import { cn } from "@/lib/utils";
import type { BloodGroup } from "@/lib/mockData";

export const BloodGroupBadge = ({
  group, size = "md", className
}: { group: BloodGroup; size?: "sm" | "md" | "lg"; className?: string }) => {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-20 w-20 text-xl",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-2xl bg-gradient-primary font-bold text-primary-foreground shadow-soft",
        sizes[size],
        className,
      )}
    >
      {group}
    </span>
  );
};
