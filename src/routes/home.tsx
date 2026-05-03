import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Palette, Code, Megaphone, TrendingUp, Sparkles, Flame } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { JobCard } from "@/components/shared/JobCard";
import { useApp } from "@/context/AppContext";
import { categories, type Job } from "@/data/mockData";
import { BrandBellIcon, BrandFilterIcon, BrandSearchIcon } from "@/components/shared/BrandIcons";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Home — JobBoard" },
      { name: "description", content: "Discover jobs picked just for you on JobBoard." },
    ],
  }),
  component: HomePage,
});

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Design: Palette,
  Development: Code,
  Marketing: Megaphone,
  Sales: TrendingUp,
  Product: Palette,
  Finance: TrendingUp,
};

function HomePage() {
  const { user, jobs, recentlyViewedJobIds } = useApp();
  const firstName = (user?.name ?? "Friend").split(" ")[0];
  const [query, setQuery] = useState("");
  const [activeQuickFilter, setActiveQuickFilter] = useState("All");
  const recommended = jobs.slice(0, 2);
  const quickFilters = ["Full-time", "Part-time", "Work from Home"];
  const featured = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs
      .filter((j) => {
        if (activeQuickFilter === "Full-time" && j.schedule !== "Full-time") return false;
        if (activeQuickFilter === "Part-time" && j.schedule !== "Part-time") return false;
        if (activeQuickFilter === "Work from Home" && j.type !== "Remote") return false;
        if (!q) return true;
        return j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q);
      })
      .slice(0, 5);
  }, [jobs, query, activeQuickFilter]);
  const recent = useMemo(() => {
    const map = new Map(jobs.map((j) => [j.id, j]));
    const seen = recentlyViewedJobIds.map((id) => map.get(id)).filter((j): j is Job => !!j);
    return (seen.length ? seen : jobs).slice(0, 4);
  }, [jobs, recentlyViewedJobIds]);

  return (
    <AppLayout>
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-7 pb-3 animate-slide-down">
        <div>
          <p className="text-[11px] font-medium text-muted-foreground">✨ Find your next role</p>
          <p className="font-display text-xl font-black text-foreground">Hi, {firstName}</p>
        </div>
        <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface text-foreground shadow-card transition-all hover:shadow-elevated hover:border-primary/30">
          <BrandBellIcon className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-accent ring-2 ring-surface animate-pulse" />
        </button>
      </header>

      {/* Search */}
      <div className="px-5 pt-2 animate-slide-up" style={{ animationDelay: "60ms" }}>
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1">
            <BrandSearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for jobs, roles or companies..."
              className="h-13 w-full rounded-2xl border border-border bg-surface pl-12 pr-4 text-sm font-medium shadow-card placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 focus:shadow-glow transition-all duration-300"
            />
          </div>
          <button className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow transition-all duration-300 hover:shadow-neon hover:scale-[1.02]">
            <BrandFilterIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {["All", ...quickFilters].map((chip) => (
            <button
              key={chip}
              onClick={() => setActiveQuickFilter(chip)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-all duration-300",
                activeQuickFilter === chip
                  ? "border-primary/30 bg-primary text-primary-foreground shadow-glow"
                  : "border-border bg-surface text-muted-foreground hover:border-primary/30 hover:text-foreground hover:shadow-card"
              )}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mt-5 px-5 animate-slide-up" style={{ animationDelay: "120ms" }}>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-black text-foreground">Popular Categories</h3>
          <Link to="/jobs" className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-dark transition-colors">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden stagger-children">
          {categories.map((c) => {
            const Icon = categoryIcons[c.name] ?? Palette;
            return (
              <Link
                key={c.name}
                to="/jobs"
                className="group flex w-[140px] shrink-0 flex-col gap-3 rounded-2xl border bg-surface p-4 transition-all duration-300 hover:-translate-y-1 border-glow border-glow-hover"
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-soft transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: c.color }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{c.name}</p>
                  <p className="text-[11px] font-medium text-muted-foreground">{c.count} jobs</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Hero banner */}
      <div className="px-5 pt-5 animate-slide-up" style={{ animationDelay: "180ms" }}>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-7 text-white shadow-elevated">
          <div className="absolute inset-0 bg-gradient-mesh opacity-40 animate-mesh" />
          {/* Decorative floating elements */}
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5 blur-2xl animate-breathe" />
          <div className="absolute -left-4 -bottom-4 h-24 w-24 rounded-full bg-accent/10 blur-xl animate-breathe" style={{ animationDelay: "2s" }} />
          <div className="relative flex items-center justify-between gap-4">
            <div className="max-w-[65%]">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                <Flame className="h-3 w-3 text-accent" /> Trending
              </div>
              <h2 className="font-display text-xl font-black leading-tight">
                Find the job that fits your life
              </h2>
              <p className="mt-1.5 text-xs text-white/70 leading-relaxed">Curated picks updated daily just for you.</p>
              <Link
                to="/jobs"
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-2.5 text-xs font-bold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:shadow-lg"
              >
                Explore Now <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="relative h-28 w-28 shrink-0">
              <div className="absolute inset-0 rounded-full bg-white/8 backdrop-blur-sm" />
              <div className="absolute inset-2 rounded-2xl bg-white/12" />
              <div className="absolute right-0 top-0 h-11 w-11 rounded-xl bg-gradient-accent shadow-lg animate-float" style={{ animationDelay: "0s" }} />
              <div className="absolute bottom-0 left-0 h-9 w-12 rounded-lg bg-gradient-success shadow-lg animate-float" style={{ animationDelay: "1.5s" }} />
              <div className="absolute bottom-2 right-2 h-4 w-4 rounded-full bg-white/30 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Featured jobs */}
      <div className="mt-7 px-5 animate-slide-up" style={{ animationDelay: "240ms" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-base font-black text-foreground">Search Result</h3>
            <span className="rounded-lg bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">{featured.length}</span>
          </div>
          <p className="text-xs font-medium text-muted-foreground">32 Jobs Found</p>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {["UI Designer", "UX Designer", "Product"].map((chip, i) => (
            <button
              key={chip}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-all duration-300",
                i === 0 ? "bg-primary text-primary-foreground shadow-glow" : "border border-border bg-surface text-muted-foreground hover:border-primary/30"
              )}
            >
              {chip}
            </button>
          ))}
        </div>
        <div className="mt-3.5 space-y-3 stagger-children">
          {featured.map((j, idx) => <JobCard key={j.id} job={j} dark={idx % 2 === 1} />)}
        </div>
      </div>

      {/* Recommended */}
      <div className="mt-7 px-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <h3 className="font-display text-base font-black text-foreground">Recommended Jobs</h3>
          </div>
          <Link to="/jobs" className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-dark transition-colors">See all <ArrowRight className="h-3 w-3" /></Link>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {recommended.map(j => <JobCard key={j.id} job={j} compact />)}
        </div>
      </div>

      {/* Recent */}
      <div className="mt-7 px-5 pb-2">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-black text-foreground">Recent Jobs</h3>
          <Link to="/jobs" className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-dark transition-colors">View all <ArrowRight className="h-3 w-3" /></Link>
        </div>
        <div className="mt-3 space-y-2.5 stagger-children">
          {recent.map((job) => (
            <Link
              key={job.id}
              to="/jobs/$id"
              params={{ id: job.id }}
              className="flex items-center gap-3.5 rounded-2xl border bg-surface p-3.5 transition-all duration-300 hover:-translate-y-0.5 border-glow border-glow-hover"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl text-xs font-bold text-white shadow-soft" style={{ backgroundColor: job.companyColor }}>
                {job.company.slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{job.title}</p>
                <p className="truncate text-[11px] font-medium text-muted-foreground">{job.company}</p>
              </div>
              <span className="rounded-lg bg-primary/8 px-2.5 py-1 text-[10px] font-bold text-primary">{job.schedule}</span>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
