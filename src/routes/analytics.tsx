import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";
import { Eye, Search, TrendingUp, BarChart3, Award, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [{ title: "Candidate Analytics — JobBoard" }],
  }),
  component: AnalyticsDashboardPage,
});

function AnalyticsDashboardPage() {
  const { user } = useApp();
  const navigate = useNavigate();

  // Mock analytics data
  const stats = {
    profileViews: 142,
    profileViewsGrowth: "+12%",
    searchAppearances: 38,
    searchAppearancesGrowth: "+5%",
    topPercentile: "5%",
  };

  // Mock chart data (heights in percentage for CSS bars)
  const viewHistory = [40, 20, 60, 80, 50, 90, 100];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <AppLayout>
      <header className="px-5 pt-7 pb-3 animate-slide-down">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate({ to: "/profile" })} className="flex h-8 w-8 items-center justify-center rounded-full bg-surface border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Creator Studio</span>
        </div>
        <h1 className="font-display text-2xl font-black text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">See how your profile is performing among top employers.</p>
      </header>

      <div className="px-5 mt-4 space-y-4 animate-slide-up">
        {/* Main Stat Card */}
        <div className="rounded-3xl bg-gradient-hero p-6 text-white shadow-elevated relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-mesh opacity-30 animate-mesh" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
               <div className="flex items-center gap-2 mb-1">
                 <Eye className="h-5 w-5 text-white/70" />
                 <h2 className="text-sm font-bold uppercase tracking-wider text-white/80">Profile Views</h2>
               </div>
               <p className="font-display text-5xl font-black">{stats.profileViews}</p>
               <div className="mt-2 flex items-center gap-1.5 rounded-full bg-success/20 px-2.5 py-1 text-xs font-bold text-white w-fit backdrop-blur">
                 <TrendingUp className="h-3 w-3" /> {stats.profileViewsGrowth} this week
               </div>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 ring-4 ring-white/5 backdrop-blur shadow-glow">
              <BarChart3 className="h-8 w-8 text-accent" />
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-surface p-4 shadow-card hover:shadow-elevated transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-lg bg-primary/10 p-1.5">
                <Search className="h-4 w-4 text-primary" />
              </div>
              <p className="text-xs font-bold text-muted-foreground">Search Hits</p>
            </div>
            <p className="font-display text-2xl font-bold text-foreground">{stats.searchAppearances}</p>
            <p className="text-[10px] font-semibold text-success mt-1">{stats.searchAppearancesGrowth} vs last week</p>
          </div>
          
          <div className="rounded-2xl border border-border bg-surface p-4 shadow-card hover:shadow-elevated transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-lg bg-accent/10 p-1.5">
                <Award className="h-4 w-4 text-accent" />
              </div>
              <p className="text-xs font-bold text-muted-foreground">Skill Rank</p>
            </div>
            <p className="font-display text-2xl font-bold text-foreground">Top {stats.topPercentile}</p>
            <p className="text-[10px] font-semibold text-muted-foreground mt-1">For Frontend Roles</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
          <h3 className="font-display text-base font-bold text-foreground mb-6">Views Over Time</h3>
          
          <div className="flex h-32 items-end justify-between gap-2">
            {viewHistory.map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-full">
                <div className="relative w-full rounded-t-sm bg-primary/10 hover:bg-primary/20 transition-colors group cursor-pointer" style={{ height: '100%' }}>
                  <div 
                    className="absolute bottom-0 left-0 right-0 rounded-t-sm bg-gradient-to-t from-primary to-indigo-400 shadow-glow transition-all group-hover:brightness-110" 
                    style={{ height: `${h}%` }}
                  />
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded shadow-lg pointer-events-none">
                    {Math.round(h * 1.5)}
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Insights */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
           <h3 className="font-display text-sm font-bold text-primary mb-2">AI Insights</h3>
           <p className="text-xs text-muted-foreground leading-relaxed">
             Your profile is performing well! You appeared in 38 recruiter searches this week. Adding a badge for <span className="font-bold text-foreground">"React Development"</span> could increase your visibility by an estimated 24%.
           </p>
           <button onClick={() => navigate({ to: "/assessments" })} className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-glow hover:shadow-neon transition-all">
             Take Assessment
           </button>
        </div>

      </div>
    </AppLayout>
  );
}
