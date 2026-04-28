import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import type { AppStatus } from "@/data/mockData";

export const Route = createFileRoute("/applications")({
  head: () => ({
    meta: [{ title: "My Applications — JobBoard" }],
  }),
  component: MyApplicationsPage,
});

const tabs: ("All" | AppStatus)[] = ["All", "Applied", "In Review", "Interview", "Offered"];

function MyApplicationsPage() {
  const { user, getUserApplications, getJobById } = useApp();
  const [tab, setTab] = useState<typeof tabs[number]>("All");
  const all = getUserApplications(user?.id ?? "user_demo");

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: all.length };
    for (const a of all) c[a.status] = (c[a.status] ?? 0) + 1;
    return c;
  }, [all]);

  const list = tab === "All" ? all : all.filter(a => a.status === tab);

  return (
    <AppLayout>
      <header className="flex items-center justify-between px-5 pt-6 pb-3">
        <div className="w-10" />
        <h1 className="font-display text-lg font-bold">My Applications</h1>
        <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface">
          <Bell className="h-5 w-5" />
        </button>
      </header>

      <div className="flex gap-2 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map(t => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "shrink-0 border-b-2 px-1 pb-2 text-sm font-semibold transition-colors",
                active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {t} <span className={cn("ml-1 rounded-full px-1.5 py-0.5 text-[10px]", active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>{counts[t] ?? 0}</span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-3 px-5 sm:grid-cols-2">
        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center sm:col-span-2">
            <p className="font-display text-base font-bold">No applications yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Start applying to see them here.</p>
            <Link to="/jobs" className="mt-4 inline-block rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Browse Jobs
            </Link>
          </div>
        ) : list.map(app => {
          const job = getJobById(app.jobId);
          if (!job) return null;
          return (
            <Link
              key={app.id}
              to="/jobs/$id"
              params={{ id: job.id }}
              className="block rounded-2xl border border-border bg-surface p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elevated"
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white"
                  style={{ backgroundColor: job.companyColor }}
                >
                  {job.company.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-display text-sm font-bold">{job.title}</p>
                      <p className="text-xs text-muted-foreground">{job.company}</p>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Applied on {new Date(app.appliedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </AppLayout>
  );
}
