import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function BackButton({ to, className }: { to?: string; className?: string }) {
  const navigate = useNavigate();
  const router = useRouter();
  if (to) {
    return (
      <Link to={to} className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground transition-colors hover:bg-muted",
        className
      )}>
        <ArrowLeft className="h-5 w-5" />
      </Link>
    );
  }
  return (
    <button
      onClick={() => {
        if (window.history.length > 1) router.history.back();
        else navigate({ to: "/" });
      }}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground transition-colors hover:bg-muted",
        className
      )}
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
  );
}
