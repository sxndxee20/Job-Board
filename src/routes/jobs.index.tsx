import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bell, MapPin, Briefcase, ArrowUpDown, X, Search, SlidersHorizontal } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { JobCard } from "@/components/shared/JobCard";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { categories } from "@/data/mockData";
import { BrandFilterIcon, BrandSearchIcon } from "@/components/shared/BrandIcons";

export const Route = createFileRoute("/jobs/")({
  head: () => ({
    meta: [
      { title: "Find Jobs — JobBoard" },
      { name: "description", content: "Browse hundreds of curated job listings on JobBoard." },
    ],
  }),
  component: JobListingsPage,
});

const jobTypes = ["All", "Remote", "Hybrid", "Onsite"] as const;
type Sort = "Newest" | "Salary";

function JobListingsPage() {
  const { jobs } = useApp();
  const [q, setQ] = useState("");
  const [type, setType] = useState<typeof jobTypes[number]>("All");
  const [category, setCategory] = useState<string>("All");
  const [sort, setSort] = useState<Sort>("Newest");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() => {
    let r = jobs;
    if (q) {
      const ql = q.toLowerCase();
      r = r.filter(j => j.title.toLowerCase().includes(ql) || j.company.toLowerCase().includes(ql));
    }
    if (type !== "All") r = r.filter(j => j.type === type);
    if (category !== "All") r = r.filter(j => j.category === category);
    r = [...r].sort((a, b) => sort === "Newest"
      ? new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
      : b.salaryMax - a.salaryMax);
    return r;
  }, [jobs, q, type, category, sort]);

  return (
    <AppLayout>
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-7 pb-3 animate-slide-down">
        <div className="w-10" />
        <h1 className="font-display text-lg font-black text-foreground">Find Jobs</h1>
        <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface shadow-card transition-all hover:shadow-elevated hover:border-primary/30">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-accent ring-2 ring-surface animate-pulse" />
        </button>
      </header>

      {/* Search */}
      <div className="px-5 animate-slide-up" style={{ animationDelay: "60ms" }}>
        <div className="relative">
          <BrandSearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search jobs, companies..."
            className="h-13 w-full rounded-2xl border border-border bg-surface pl-12 pr-4 text-sm font-medium shadow-card placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 focus:shadow-glow transition-all duration-300"
          />
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Pill active onClick={() => setDrawerOpen(true)} icon={<SlidersHorizontal className="h-3.5 w-3.5" />}>
            Filter
          </Pill>
          {jobTypes.map(t => (
            <Pill key={t} active={type === t} onClick={() => setType(t)} icon={<Briefcase className="h-3.5 w-3.5" />}>
              {t}
            </Pill>
          ))}
          <Pill onClick={() => setSort(sort === "Newest" ? "Salary" : "Newest")} icon={<ArrowUpDown className="h-3.5 w-3.5" />}>
            {sort}
          </Pill>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            <span className="font-bold text-foreground">{filtered.length}</span> jobs found
          </p>
          {(type !== "All" || category !== "All") && (
            <button
              onClick={() => { setType("All"); setCategory("All"); }}
              className="text-[11px] font-bold text-primary hover:text-primary-dark transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Job list */}
      <div className="mt-4 grid gap-3 px-5 sm:grid-cols-2 stagger-children">
        {filtered.map((j, idx) => <JobCard key={j.id} job={j} dark={idx % 3 === 1} />)}
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-border bg-surface p-12 text-center sm:col-span-2 border-glow">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/5">
              <Search className="h-7 w-7 text-primary/40" />
            </div>
            <p className="font-display text-base font-bold text-foreground">No jobs found</p>
            <p className="mt-1.5 text-xs text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* Filter drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-md transition-all"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="absolute bottom-0 left-1/2 w-full max-w-lg -translate-x-1/2 rounded-t-3xl bg-surface p-6 shadow-elevated animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto h-1.5 w-12 rounded-full bg-border" />
            <div className="mt-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-black">Filters</h3>
              <button onClick={() => setDrawerOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-xl hover:bg-muted transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <p className="mb-2.5 text-xs font-bold text-foreground uppercase tracking-wider">Category</p>
                <div className="flex flex-wrap gap-2">
                  {["All", ...categories.map(c => c.name)].map(c => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={cn(
                        "rounded-xl px-4 py-2 text-xs font-bold transition-all duration-300",
                        category === c ? "bg-primary text-primary-foreground shadow-glow" : "bg-muted text-muted-foreground hover:bg-primary-soft hover:text-primary"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2.5 text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="h-3 w-3" /> Job Type
                </p>
                <div className="flex flex-wrap gap-2">
                  {jobTypes.map(t => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={cn(
                        "rounded-xl px-4 py-2 text-xs font-bold transition-all duration-300",
                        type === t ? "bg-primary text-primary-foreground shadow-glow" : "bg-muted text-muted-foreground hover:bg-primary-soft hover:text-primary"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => { setType("All"); setCategory("All"); setSort("Newest"); }}
                className="flex-1 rounded-xl border-2 border-border py-3.5 text-sm font-bold text-foreground transition-all hover:border-primary/30 hover:bg-primary/5"
              >
                Reset
              </button>
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex-1 rounded-xl bg-gradient-primary py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition-all hover:shadow-neon"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

function Pill({
  children, active, onClick, icon,
}: { children: React.ReactNode; active?: boolean; onClick?: () => void; icon?: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition-all duration-300",
        active
          ? "border-primary/30 bg-primary text-primary-foreground shadow-glow"
          : "border-border bg-surface text-muted-foreground hover:border-primary/30 hover:text-foreground hover:shadow-card"
      )}
    >
      {icon} {children}
    </button>
  );
}
