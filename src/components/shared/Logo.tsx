import { Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, variant = "default" }: { className?: string; variant?: "default" | "light" }) {
  const isLight = variant === "light";
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "flex h-9 w-9 items-center justify-center rounded-xl",
        isLight ? "bg-white/15 backdrop-blur" : "bg-gradient-primary shadow-soft"
      )}>
        <Briefcase className={cn("h-5 w-5", isLight ? "text-white" : "text-white")} strokeWidth={2.5} />
      </div>
      <span className={cn(
        "font-display text-xl font-bold tracking-tight",
        isLight ? "text-white" : "text-foreground"
      )}>
        JobBoard
      </span>
    </div>
  );
}
