import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Share2, MapPin, Briefcase, DollarSign, Check, Sparkles, CalendarClock } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatSalary, timeAgo } from "@/data/mockData";
import { PrimaryButton, GhostButton } from "@/components/ui/primary-button";
import { cn } from "@/lib/utils";
import { BrandBookmarkIcon } from "@/components/shared/BrandIcons";
import { toast } from "sonner";

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
  const { getJobById, bookmarks, toggleBookmark, markJobViewed } = useApp();
  const navigate = useNavigate();
  const job = getJobById(id);
  const [tab, setTab] = useState<Tab>("Overview");
  const applyPath = `/apply?jobId=${id}`;

  if (!job) throw notFound();
  const saved = bookmarks.has(job.id);

  useEffect(() => {
    markJobViewed(id);
  }, [id, markJobViewed]);

  function openApply() {
    navigate({ to: "/apply", search: { jobId: job.id } });
    setTimeout(() => {
      if (!window.location.pathname.endsWith(`/jobs/${job.id}/apply`) && !window.location.pathname.includes("/apply")) {
        window.location.assign(applyPath);
      }
    }, 120);
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="mx-auto max-w-lg">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between bg-gradient-primary px-5 py-3 text-white">
          <Link to="/jobs" className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                const url = `${window.location.origin}/jobs/${job.id}`;
                try {
                  await navigator.clipboard.writeText(url);
                  toast.success("Job link copied to clipboard!");
                } catch {
                  window.prompt("Copy job link:", url);
                }
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 bg-white/10 text-white/90"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => toggleBookmark(job.id)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl border transition-colors",
                saved ? "border-white bg-white/25 text-white" : "border-white/30 bg-white/10 text-white/90"
              )}
            >
              <BrandBookmarkIcon className={cn("h-4 w-4", saved && "fill-current")} />
            </button>
          </div>
        </header>

        {/* Header */}
        <div className="rounded-b-3xl bg-gradient-primary px-5 pb-6 pt-2 text-white">
          <p className="text-center text-xs text-white/70">Jobs Details</p>
          <div className="mt-4 flex items-start gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-soft"
              style={{ backgroundColor: job.companyColor }}
            >
              {job.company.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-xl font-bold leading-tight text-white">
                  {job.title}
                </h1>
                {job.isNew && (
                  <span className="rounded-md bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase text-accent">
                    New
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-white/70">{job.company}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <Stat icon={<MapPin className="h-4 w-4" />} label="Location" value={job.location.split("·")[0].trim()} />
            <Stat icon={<Briefcase className="h-4 w-4" />} label="Type" value={job.type} />
            <Stat icon={<DollarSign className="h-4 w-4" />} label="Salary" value={formatSalary(job.salaryMin, job.salaryMax)} />
          </div>
          <p className="mt-3 text-xs text-white/60">Posted {timeAgo(job.postedAt)}</p>
          <button
            type="button"
            onClick={openApply}
            className="mt-4 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-primary-dark"
          >
            Open Apply Form
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-4 px-5">
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
            <div className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Quick insights</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <Insight icon={<Sparkles className="h-4 w-4" />} label="Match" value="88%" />
                <Insight icon={<CalendarClock className="h-4 w-4" />} label="Hiring stage" value="Interviewing" />
                <Insight icon={<Briefcase className="h-4 w-4" />} label="Applicants" value="24" />
              </div>
            </div>
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
                <div className="rounded-2xl border border-primary/20 bg-primary-soft p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">Application tips</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-foreground">
                    <li>Tailor your resume to this role's top requirements.</li>
                    <li>Show recent results and measurable impact in your portfolio.</li>
                    <li>Mention why this company's mission fits your career goals.</li>
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
      <div className="fixed bottom-16 left-1/2 z-40 w-full max-w-lg -translate-x-1/2 border-t border-border bg-surface/95 px-5 py-4 backdrop-blur">
        <div className="flex gap-3">
          <GhostButton onClick={() => toggleBookmark(job.id)} className="flex-1">
            {saved ? "Saved" : "Save Job"}
          </GhostButton>
          <PrimaryButton fullWidth onClick={openApply} className="flex-1">
            Apply Now
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function Insight({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/60 p-2.5">
      <div className="flex items-center gap-1.5 text-primary">{icon}<span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span></div>
      <p className="mt-1 text-xs font-semibold text-foreground">{value}</p>
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
