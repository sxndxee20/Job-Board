import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Inbox, ChevronDown } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useApp } from "@/context/AppContext";
import { StatusBadge } from "@/components/ui/status-badge";
import type { AppStatus } from "@/data/mockData";

export const Route = createFileRoute("/admin/applications")({
  head: () => ({
    meta: [{ title: "Applications — JobBoard Admin" }],
  }),
  component: ApplicantsPage,
});

const statuses: ("All" | AppStatus)[] = ["All", "Applied", "In Review", "Interview", "Offered", "Rejected"];

function ApplicantsPage() {
  const { applications, jobs, updateApplicationStatus } = useApp();
  const [q, setQ] = useState("");
  const [jobFilter, setJobFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<typeof statuses[number]>("All");

  const list = useMemo(() => {
    return applications.filter(a => {
      if (q && !a.applicantName.toLowerCase().includes(q.toLowerCase()) && !a.applicantEmail.toLowerCase().includes(q.toLowerCase())) return false;
      if (jobFilter !== "All" && a.jobId !== jobFilter) return false;
      if (statusFilter !== "All" && a.status !== statusFilter) return false;
      return true;
    });
  }, [applications, q, jobFilter, statusFilter]);

  return (
    <AdminLayout>
      <header className="px-6 pt-8">
        <h1 className="font-display text-2xl font-bold">Applications</h1>
        <p className="text-sm text-muted-foreground">Review applicants across all your job postings.</p>
      </header>

      <div className="mt-6 px-6">
        <div className="grid gap-3 lg:grid-cols-[1fr_200px_200px]">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search applicants…"
              className="h-12 w-full rounded-2xl border border-border bg-surface pl-11 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
            />
          </div>
          <SelectField value={jobFilter} onChange={setJobFilter}>
            <option value="All">All Jobs</option>
            {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
          </SelectField>
          <SelectField value={statusFilter} onChange={(v) => setStatusFilter(v as typeof statuses[number])}>
            {statuses.map(s => <option key={s}>{s}</option>)}
          </SelectField>
        </div>
      </div>

      <div className="mt-5 space-y-3 px-6">
        {list.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-surface p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <Inbox className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="font-display text-base font-bold">No applications yet</p>
            <p className="mt-1 text-sm text-muted-foreground">When candidates apply, they'll appear here.</p>
          </div>
        ) : list.map(app => {
          const job = jobs.find(j => j.id === app.jobId);
          const initials = app.applicantName.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
          return (
            <div key={app.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-card lg:flex-row lg:items-center">
              <div className="flex flex-1 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-sm font-bold text-white">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-foreground">{app.applicantName}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    Applied for: <span className="font-semibold text-foreground">{job?.title ?? "—"}</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {new Date(app.appliedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-xl border-2 border-border px-4 py-2 text-xs font-semibold hover:border-primary hover:text-primary">
                  View
                </button>
                <div className="relative">
                  <select
                    value={app.status}
                    onChange={(e) => updateApplicationStatus(app.id, e.target.value as AppStatus)}
                    className="appearance-none rounded-xl bg-primary px-4 py-2 pr-8 text-xs font-semibold text-primary-foreground shadow-soft focus:outline-none focus:ring-4 focus:ring-primary/30"
                  >
                    {(["Applied", "In Review", "Interview", "Offered", "Rejected"] as AppStatus[]).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-primary-foreground" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}

function SelectField({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full appearance-none rounded-2xl border border-border bg-surface px-4 pr-10 text-sm font-semibold focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
