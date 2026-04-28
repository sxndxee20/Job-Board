import { cn } from "@/lib/utils";
import type { AppStatus } from "@/data/mockData";

const statusStyles: Record<string, string> = {
  Applied: "bg-blue-50 text-blue-700 ring-blue-200",
  "In Review": "bg-amber-50 text-amber-700 ring-amber-200",
  Interview: "bg-orange-50 text-orange-700 ring-orange-200",
  Offered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Rejected: "bg-rose-50 text-rose-700 ring-rose-200",
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  closed: "bg-rose-50 text-rose-700 ring-rose-200",
  draft: "bg-slate-100 text-slate-600 ring-slate-200",
};

export function StatusBadge({ status, className }: { status: AppStatus | string; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset capitalize",
      statusStyles[status] ?? "bg-muted text-muted-foreground ring-border",
      className
    )}>
      <span className={cn(
        "mr-1.5 h-1.5 w-1.5 rounded-full",
        status === "Applied" && "bg-blue-500",
        status === "In Review" && "bg-amber-500",
        status === "Interview" && "bg-orange-500",
        status === "Offered" && "bg-emerald-500",
        status === "Rejected" && "bg-rose-500",
        status === "active" && "bg-emerald-500",
        status === "closed" && "bg-rose-500",
        status === "draft" && "bg-slate-500",
      )} />
      {status}
    </span>
  );
}
