import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Briefcase, Users, TrendingUp, CheckCircle2, Plus, Pencil, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useApp } from "@/context/AppContext";
import { StatusBadge } from "@/components/ui/status-badge";
import { timeAgo } from "@/data/mockData";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Admin Dashboard — JobBoard" }],
  }),
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const { jobs, applications, deleteJob, user } = useApp();
  const today = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  const adminName = user?.name ?? "Admin";

  const activeJobs = jobs.filter(j => j.status === "active").length;
  const todayApps = applications.filter(a => {
    const d = new Date(a.appliedAt);
    return Date.now() - d.getTime() < 24 * 60 * 60 * 1000;
  }).length;
  const offered = applications.filter(a => a.status === "Offered").length;

  return (
    <AdminLayout>
      <header className="flex items-center justify-between px-6 pt-8">
        <div>
          <h1 className="font-display text-2xl font-bold">Good Morning, {adminName} 👋</h1>
          <p className="text-sm text-muted-foreground">{today}</p>
        </div>
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
        </button>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-3 px-6 lg:grid-cols-4">
        <StatCard label="Total Jobs" value={jobs.length} icon={<Briefcase className="h-4 w-4" />} color="bg-primary text-primary-foreground" trend="+12%" />
        <StatCard label="Active Listings" value={activeJobs} icon={<TrendingUp className="h-4 w-4" />} color="bg-success text-white" trend="+5%" />
        <StatCard label="Apps Today" value={todayApps} icon={<Users className="h-4 w-4" />} color="bg-accent text-white" trend="+18%" />
        <StatCard label="Hired This Month" value={offered} icon={<CheckCircle2 className="h-4 w-4" />} color="bg-warning text-white" trend="+2" />
      </div>

      <div className="mt-8 px-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Recent Job Postings</h2>
          <Link to="/admin/jobs/new" className="hidden lg:inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft">
            <Plus className="h-4 w-4" /> Post New Job
          </Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
          {/* Desktop table */}
          <table className="hidden w-full text-sm lg:table">
            <thead className="bg-muted/50">
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-semibold">Job Title</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Posted</th>
                <th className="px-5 py-3 font-semibold">Applicants</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.slice(0, 8).map(job => {
                const apps = applications.filter(a => a.jobId === job.id).length;
                return (
                  <tr key={job.id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white" style={{ backgroundColor: job.companyColor }}>
                          {job.company.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{job.title}</p>
                          <p className="text-xs text-muted-foreground">{job.company}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{job.category}</td>
                    <td className="px-5 py-3 text-muted-foreground">{timeAgo(job.postedAt)}</td>
                    <td className="px-5 py-3">
                      <span className="rounded-md bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary">{apps}</span>
                    </td>
                    <td className="px-5 py-3"><StatusBadge status={job.status} /></td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <Link to="/admin/jobs/$id/edit" params={{ id: job.id }} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-primary">
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button onClick={() => deleteJob(job.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-danger/10 hover:text-danger">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Mobile list */}
          <div className="divide-y divide-border lg:hidden">
            {jobs.slice(0, 8).map(job => {
              const apps = applications.filter(a => a.jobId === job.id).length;
              return (
                <div key={job.id} className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ backgroundColor: job.companyColor }}>
                    {job.company.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{job.title}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{apps} applicants</span>
                      <span>·</span>
                      <span>{timeAgo(job.postedAt)}</span>
                    </div>
                  </div>
                  <StatusBadge status={job.status} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile FAB */}
      <Link
        to="/admin/jobs/new"
        className="fixed bottom-20 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-elevated transition-transform hover:scale-105 lg:hidden"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </AdminLayout>
  );
}

function StatCard({ label, value, icon, color, trend }: { label: string; value: number; icon: React.ReactNode; color: string; trend: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-card">
      <div className="flex items-start justify-between">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>{icon}</div>
        <span className="text-[11px] font-semibold text-success">{trend} ↑</span>
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
