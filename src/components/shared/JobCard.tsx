import { useNavigate } from "@tanstack/react-router";
import { MapPin, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { type Job, formatSalary, timeAgo } from "@/data/mockData";
import { BrandBookmarkIcon } from "./BrandIcons";
import { StyledAvatar } from "./StyledAvatar";

export function JobCard({ job, compact = false, dark = false }: { job: Job; compact?: boolean; dark?: boolean }) {
  const { bookmarks, toggleBookmark } = useApp();
  const navigate = useNavigate();
  const saved = bookmarks.has(job.id);
  const initial = job.company.charAt(0);
  const applyPath = `/apply?jobId=${job.id}`;

  function openApply(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    navigate({ to: "/apply", search: { jobId: job.id } });
    setTimeout(() => {
      if (!window.location.pathname.endsWith(`/jobs/${job.id}/apply`) && !window.location.pathname.includes("/apply")) {
        window.location.assign(applyPath);
      }
    }, 120);
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => navigate({ to: "/jobs/$id", params: { id: job.id } })}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate({ to: "/jobs/$id", params: { id: job.id } });
        }
      }}
      className={cn(
        "group relative block cursor-pointer overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated",
        dark
          ? "border-white/10 bg-gradient-hero text-white shadow-glow"
          : "border-border bg-surface shadow-card border-glow-hover"
      )}
    >
      {/* Subtle shimmer on hover */}
      {!dark && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.03] to-transparent translate-x-[-100%] transition-transform duration-700 group-hover:translate-x-[100%]" />
        </div>
      )}

      <div className="relative flex items-start gap-3.5">
        <StyledAvatar seed={job.company} label={initial} className={cn("h-12 w-12 shrink-0 rounded-2xl text-base ring-2 transition-shadow duration-300", dark ? "ring-white/20" : "ring-border group-hover:ring-primary/30 group-hover:shadow-glow")} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className={cn("truncate font-display text-[15px] font-bold leading-tight", dark ? "text-white" : "text-foreground")}>
                {job.title}
              </h3>
              <p className={cn("mt-0.5 text-xs font-medium", dark ? "text-white/65" : "text-muted-foreground")}>{job.company}</p>
            </div>
            <div className="flex items-center gap-1.5">
              {job.isNew && (
                <span className={cn(
                  "inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                  dark ? "bg-white/15 text-white backdrop-blur" : "bg-gradient-accent text-white shadow-soft"
                )}>
                  <Sparkles className="h-2.5 w-2.5" /> New
                </span>
              )}
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleBookmark(job.id); }}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-300",
                  saved
                    ? dark ? "bg-white/20 text-white shadow-sm" : "bg-primary/10 text-primary shadow-sm"
                    : dark ? "text-white/60 hover:bg-white/10 hover:text-white" : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                )}
              >
                <BrandBookmarkIcon className={cn("h-4 w-4 transition-transform duration-300", saved && "fill-current scale-110")} />
              </button>
            </div>
          </div>

          {!compact && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className={cn(
                "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium",
                dark ? "bg-white/10 text-white/75 backdrop-blur-sm" : "bg-muted text-muted-foreground"
              )}>
                <MapPin className="h-3 w-3" /> {job.location}
              </span>
              <span className={cn(
                "rounded-lg px-2.5 py-1 text-[11px] font-semibold",
                dark ? "bg-white/15 text-white backdrop-blur-sm" : "bg-primary-soft text-primary"
              )}>
                {job.type}
              </span>
              <span className={cn(
                "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium",
                dark ? "bg-white/10 text-white/75 backdrop-blur-sm" : "bg-muted text-muted-foreground"
              )}>
                <Clock className="h-3 w-3" /> {job.schedule}
              </span>
            </div>
          )}

          <div className="mt-3.5 flex items-center justify-between">
            <p className={cn("font-display text-sm font-black tracking-tight", dark ? "text-white" : "text-gradient")}>{formatSalary(job.salaryMin, job.salaryMax)}</p>
            <p className={cn("text-[11px] font-medium", dark ? "text-white/50" : "text-muted-foreground")}>{timeAgo(job.postedAt)}</p>
          </div>
          {!compact && (
            <div className="mt-3.5 flex items-center justify-between">
              <span className={cn("text-[11px] font-semibold transition-colors", dark ? "text-white/80 group-hover:text-white" : "text-primary group-hover:text-primary-dark")}>View details →</span>
              <button
                type="button"
                onClick={openApply}
                className={cn(
                  "rounded-xl px-4 py-2 text-[11px] font-bold transition-all duration-300",
                  dark
                    ? "bg-white text-primary-dark shadow-sm hover:shadow-md hover:scale-[1.02]"
                    : "bg-primary text-primary-foreground shadow-soft hover:bg-primary-dark hover:shadow-glow hover:scale-[1.02]"
                )}
              >
                Apply Now
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
