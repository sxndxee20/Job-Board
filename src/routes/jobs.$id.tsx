import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Bookmark, Share2, MapPin, Briefcase, DollarSign, Check } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatSalary, timeAgo } from "@/data/mockData";
import { PrimaryButton, GhostButton } from "@/components/ui/primary-button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/jobs/$id")({
  head: () => ({
    meta: [
      { title: "Job Details — JobBoard" },
      { name: "description", content: "View full job details and apply on JobBoard." },
    ],
  }),
  component: JobDetailsPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center px-6 text-center">
      <div>
        <h1 className="font-display text-3xl font-bold">Job not found</h1>
        <Link to="/jobs" className="mt-4 inline-block font-semibold text-primary">Back to listings</Link>
      </div>
    </div>
  ),
});

type Tab = "Overview" | "Requirements" | "Company";

function JobDetailsPage() {
  const { id } = Route.useParams();
  const { getJobById, bookmarks, toggleBookmark } = useApp();
  const job = getJobById(id);
  const [tab, setTab] = useState<Tab>("Overview");

  if (!job) throw notFound();
  const saved = bookmarks.has(job.id);

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="mx-auto max-w-lg">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/90 px-5 py-3 backdrop-blur">
          <Link to="/jobs" className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-muted-foreground">
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => toggleBookmark(job.id)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl border transition-colors",
                saved ? "border-primary bg-primary-soft text-primary" : "border-border bg-surface text-muted-foreground"
              )}
            >
              <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
            </button>
          </div>
        </header>

        {/* Header */}
        <div className="px-5 pt-6">
          <div className="flex items-start gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-soft"
              style={{ backgroundColor: job.companyColor }}
            >
              {job.company.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-xl font-bold leading-tight text-foreground">
                  {job.title}
                </h1>
                {job.isNew && (
                  <span className="rounded-md bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase text-accent">
                    New
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{job.company}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <Stat icon={<MapPin className="h-4 w-4" />} label="Location" value={job.location.split("·")[0].trim()} />
            <Stat icon={<Briefcase className="h-4 w-4" />} label="Type" value={job.type} />
            <Stat icon={<DollarSign className="h-4 w-4" />} label="Salary" value={formatSalary(job.salaryMin, job.salaryMax)} />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Posted {timeAgo(job.postedAt)}</p>
        </div>

        {/* Tabs */}
        <div className="mt-6 px-5">
          <div className="flex gap-1 border-b border-border">
            {(["Overview", "Requirements", "Company"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "relative flex-1 py-3 text-sm font-semibold transition-colors",
                  tab === t ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t}
                {tab === t && (
                  <span className="absolute -bottom-px left-0 right-0 mx-auto h-0.5 w-12 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-5 space-y-5">
            {tab === "Overview" && (
              <>
                <div>
                  <h2 className="font-display text-base font-bold text-foreground">Job Description</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{job.description}</p>
                </div>
                <div>
                  <h2 className="font-display text-base font-bold text-foreground">Responsibilities</h2>
                  <ul className="mt-2 space-y-2">
                    {job.responsibilities.map((r, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
            {tab === "Requirements" && (
              <>
                <div>
                  <h2 className="font-display text-base font-bold text-foreground">Skills</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {job.skills.map(s => (
                      <span key={s} className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="font-display text-base font-bold text-foreground">Requirements</h2>
                  <ul className="mt-2 space-y-2">
                    {job.requirements.map((r, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="font-display text-base font-bold text-foreground">Benefits</h2>
                  <ul className="mt-2 space-y-2">
                    {job.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
            {tab === "Company" && (
              <div className="rounded-2xl border border-border bg-surface p-5">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-base font-bold text-white"
                    style={{ backgroundColor: job.companyColor }}
                  >
                    {job.company.charAt(0)}
                  </div>
                  <div>
                    <p className="font-display text-base font-bold">{job.company}</p>
                    <p className="text-xs text-muted-foreground">{job.category} · 50–200 employees</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{job.about}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-lg -translate-x-1/2 border-t border-border bg-surface/95 px-5 py-4 backdrop-blur">
        <div className="flex gap-3">
          <GhostButton onClick={() => toggleBookmark(job.id)} className="flex-1">
            {saved ? "Saved" : "Save Job"}
          </GhostButton>
          <Link to="/jobs/$id/apply" params={{ id: job.id }} className="flex-1">
            <PrimaryButton fullWidth>Apply Now</PrimaryButton>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-[10px] uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-1 truncate text-sm font-bold text-foreground">{value}</p>
    </div>
  );
}
