import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Menu, Search, SlidersHorizontal, ArrowRight, Palette, Code, Megaphone, TrendingUp } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { JobCard } from "@/components/shared/JobCard";
import { useApp } from "@/context/AppContext";
import { categories } from "@/data/mockData";

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
  const { user, jobs } = useApp();
  const firstName = (user?.name ?? "Friend").split(" ")[0];
  const recommended = jobs.slice(0, 5);

  return (
    <AppLayout>
      {/* Top bar */}
      <header className="flex items-center justify-between px-5 pt-6 pb-3">
        <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground">
          <Menu className="h-5 w-5" />
        </button>
        <div className="text-center">
          <p className="text-[11px] text-muted-foreground">Good Morning,</p>
          <p className="font-display text-base font-bold text-foreground">{firstName} 👋</p>
        </div>
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent ring-2 ring-surface" />
        </button>
      </header>

      {/* Search */}
      <div className="px-5 pt-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search for jobs, roles or companies..."
              className="h-12 w-full rounded-2xl border border-border bg-surface pl-11 pr-4 text-sm placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
            />
          </div>
          <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Hero banner */}
      <div className="px-5 pt-5">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-6 text-white shadow-elevated">
          <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
          <div className="relative flex items-center justify-between gap-4">
            <div className="max-w-[60%]">
              <h2 className="font-display text-xl font-bold leading-tight">
                Find the job that fits your life
              </h2>
              <p className="mt-1 text-xs text-white/80">Curated picks updated daily.</p>
              <Link
                to="/jobs"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-white/40 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                Explore Now <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="relative h-24 w-24 shrink-0">
              <div className="absolute inset-0 rounded-full bg-white/15 backdrop-blur" />
              <div className="absolute inset-2 rounded-2xl bg-white/20" />
              <div className="absolute right-0 top-0 h-10 w-10 rounded-xl bg-accent shadow-lg" />
              <div className="absolute bottom-0 left-0 h-8 w-12 rounded-lg bg-emerald-300 shadow-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mt-6 px-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-foreground">Popular Categories</h3>
          <Link to="/jobs" className="text-xs font-semibold text-primary">View all</Link>
        </div>
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((c) => {
            const Icon = categoryIcons[c.name] ?? Palette;
            return (
              <Link
                key={c.name}
                to="/jobs"
                className="group flex w-32 shrink-0 flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-elevated"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                  style={{ backgroundColor: c.color }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">{c.count} jobs</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recommended */}
      <div className="mt-6 px-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-foreground">Recommended Jobs</h3>
          <Link to="/jobs" className="text-xs font-semibold text-primary">See all →</Link>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {recommended.map(j => <JobCard key={j.id} job={j} />)}
        </div>
      </div>
    </AppLayout>
  );
}
