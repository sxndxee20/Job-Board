import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bell, Search, SlidersHorizontal, MapPin, Briefcase, ArrowUpDown, X } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { JobCard } from "@/components/shared/JobCard";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { categories } from "@/data/mockData";

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
      <header className="flex items-center justify-between px-5 pt-6 pb-3">
        <div className="w-10" />
        <h1 className="font-display text-lg font-bold text-foreground">Find Jobs</h1>
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent ring-2 ring-surface" />
        </button>
      </header>

      <div className="px-5">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search jobs"
            className="h-12 w-full rounded-2xl border border-border bg-surface pl-11 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
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

        <p className="mt-3 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{filtered.length}</span> jobs found
        </p>
      </div>

      <div className="mt-3 grid gap-3 px-5 sm:grid-cols-2">
        {filtered.map(j => <JobCard key={j.id} job={j} />)}
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-border bg-surface p-10 text-center sm:col-span-2">
            <p className="text-sm font-semibold text-foreground">No jobs found</p>
            <p className="mt-1 text-xs text-muted-foreground">Try adjusting your filters.</p>
          </div>
        )}
      </div>

      {/* Filter drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="absolute bottom-0 left-1/2 w-full max-w-lg -translate-x-1/2 rounded-t-3xl bg-surface p-6 shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto h-1.5 w-12 rounded-full bg-border" />
            <div className="mt-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Filters</h3>
              <button onClick={() => setDrawerOpen(false)} className="rounded-lg p-1.5 hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <p className="mb-2 text-xs font-semibold text-foreground">Category</p>
                <div className="flex flex-wrap gap-2">
                  {["All", ...categories.map(c => c.name)].map(c => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={cn(
                        "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                        category === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary-soft"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold text-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Job Type
                </p>
                <div className="flex flex-wrap gap-2">
                  {jobTypes.map(t => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={cn(
                        "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                        type === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary-soft"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => { setType("All"); setCategory("All"); setSort("Newest"); }}
                className="flex-1 rounded-xl border-2 border-border py-3 text-sm font-semibold text-foreground"
              >
                Reset
              </button>
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-soft"
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
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground"
      )}
    >
      {icon} {children}
    </button>
  );
}
