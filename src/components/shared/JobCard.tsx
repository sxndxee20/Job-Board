import { Link } from "@tanstack/react-router";
import { Bookmark, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { type Job, formatSalary, timeAgo } from "@/data/mockData";

export function JobCard({ job, compact = false }: { job: Job; compact?: boolean }) {
  const { bookmarks, toggleBookmark } = useApp();
  const saved = bookmarks.has(job.id);
  const initial = job.company.charAt(0);

  return (
    <Link
      to="/jobs/$id"
      params={{ id: job.id }}
      className="group block rounded-2xl border border-border bg-surface p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elevated"
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-base font-bold text-white"
          style={{ backgroundColor: job.companyColor }}
        >
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate font-display text-[15px] font-bold leading-tight text-foreground">
                {job.title}
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{job.company}</p>
            </div>
            <div className="flex items-center gap-1.5">
              {job.isNew && (
                <span className="rounded-md bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent">
                  New
                </span>
              )}
              <button
                onClick={(e) => { e.preventDefault(); toggleBookmark(job.id); }}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                  saved ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
              </button>
            </div>
          </div>

          {!compact && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
                <MapPin className="h-3 w-3" /> {job.location}
              </span>
              <span className="rounded-md bg-primary-soft px-2 py-1 text-[11px] font-semibold text-primary">
                {job.type}
              </span>
              <span className="rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
                {job.schedule}
              </span>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm font-bold text-primary">{formatSalary(job.salaryMin, job.salaryMax)}</p>
            <p className="text-[11px] text-muted-foreground">{timeAgo(job.postedAt)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
