import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useApp } from "@/context/AppContext";
import { BarChart3, TrendingUp, Users, Clock, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [{ title: "Analytics — JobBoard Admin" }],
  }),
  component: AdminAnalyticsPage,
});

function AdminAnalyticsPage() {
  const { applications, jobs } = useApp();

  return (
    <AdminLayout>
      <header className="px-6 pt-8 pb-4">
        <h1 className="font-display text-2xl font-bold">Recruitment Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your hiring velocity and candidate quality.</p>
      </header>

      <div className="px-6 space-y-6 animate-slide-up">
        {/* KPI Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard title="Total Applicants" value={applications.length} trend="+14% this month" icon={<Users />} />
          <KpiCard title="Active Jobs" value={jobs.length} trend="Stable" icon={<BarChart3 />} />
          <KpiCard title="Avg Time to Hire" value="18 Days" trend="-2 days vs last month" trendGood icon={<Clock />} />
          <KpiCard title="Offer Acceptance" value="84%" trend="+5% this quarter" trendGood icon={<TrendingUp />} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Source of Hire Chart */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
            <h3 className="font-display font-bold mb-4">Source of Hire</h3>
            <div className="space-y-4">
              <SourceBar label="Direct Search" percentage={45} color="bg-primary" />
              <SourceBar label="Referrals" percentage={30} color="bg-accent" />
              <SourceBar label="Social Media" percentage={15} color="bg-success" />
              <SourceBar label="Job Boards" percentage={10} color="bg-warning" />
            </div>
          </div>

          {/* Pipeline Drop-off */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
            <h3 className="font-display font-bold mb-4">Pipeline Conversion</h3>
            <div className="flex flex-col gap-2">
              <FunnelStep label="Applied" count={245} percentage={100} />
              <FunnelStep label="Screening" count={120} percentage={48} />
              <FunnelStep label="Interview" count={45} percentage={18} />
              <FunnelStep label="Offer" count={12} percentage={5} />
              <FunnelStep label="Hired" count={10} percentage={4} isLast />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function KpiCard({ title, value, trend, trendGood, icon }: any) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
        <div className="text-primary/50 [&>svg]:h-5 [&>svg]:w-5">{icon}</div>
      </div>
      <p className="font-display text-3xl font-black text-foreground">{value}</p>
      <div className={cn("mt-2 flex items-center gap-1 text-xs font-bold", trendGood ? "text-success" : "text-muted-foreground")}>
        {trendGood && <ArrowUpRight className="h-3 w-3" />} {trend}
      </div>
    </div>
  );
}

function SourceBar({ label, percentage, color }: { label: string, percentage: number, color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-bold mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground">{percentage}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full", color)} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function FunnelStep({ label, count, percentage, isLast }: any) {
  return (
    <div className="relative">
      <div className="flex justify-between text-sm py-2">
        <span className="font-semibold text-foreground w-24">{label}</span>
        <div className="flex-1 flex items-center px-4">
          <div className="h-6 bg-primary/20 rounded-r border-l-2 border-primary" style={{ width: `${percentage}%` }}>
            <span className="text-[10px] font-bold text-primary pl-2">{count}</span>
          </div>
        </div>
        <span className="text-xs text-muted-foreground w-12 text-right">{percentage}%</span>
      </div>
      {!isLast && <div className="absolute left-6 -bottom-1 h-2 border-l-2 border-border/50 border-dashed" />}
    </div>
  );
}
