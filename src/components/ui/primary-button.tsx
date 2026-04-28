import { type ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
}

export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ className, loading, fullWidth, size = "md", children, disabled, ...props }, ref) => {
    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-5 text-sm",
      lg: "h-12 px-6 text-base",
    };
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-semibold",
          "bg-primary text-primary-foreground shadow-soft",
          "transition-all duration-200 hover:bg-primary-dark hover:shadow-elevated active:scale-[0.98]",
          "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-soft",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30",
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
PrimaryButton.displayName = "PrimaryButton";

export const GhostButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ className, loading, fullWidth, size = "md", children, disabled, ...props }, ref) => {
    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-5 text-sm",
      lg: "h-12 px-6 text-base",
    };
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-semibold",
          "border-2 border-primary/20 bg-surface text-primary",
          "transition-all duration-200 hover:border-primary hover:bg-primary-soft active:scale-[0.98]",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20",
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
GhostButton.displayName = "GhostButton";
