import { useState } from "react";
import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Plus, X } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useApp } from "@/context/AppContext";
import { FormField } from "@/components/ui/form-field";
import { PrimaryButton, GhostButton } from "@/components/ui/primary-button";
import { Switch } from "@/components/ui/switch";
import { categories, type Job, type JobType, type JobSchedule } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/jobs/new")({
  head: () => ({
    meta: [{ title: "Post Job — JobBoard Admin" }],
  }),
  component: () => <PostJobPage mode="new" />,
});

const types: JobType[] = ["Remote", "Hybrid", "Onsite"];
const schedules: JobSchedule[] = ["Full-time", "Part-time", "Contract"];

export function PostJobPage({ mode }: { mode: "new" | "edit" }) {
  const navigate = useNavigate();
  const { addJob, updateJob, getJobById } = useApp();
  const params = useParams({ strict: false }) as { id?: string };
  const editing = mode === "edit" ? getJobById(params.id ?? "") : undefined;

  const [title, setTitle] = useState(editing?.title ?? "");
  const [company, setCompany] = useState(editing?.company ?? "");
  const [category, setCategory] = useState(editing?.category ?? categories[0].name);
  const [type, setType] = useState<JobType>(editing?.type ?? "Remote");
  const [schedule, setSchedule] = useState<JobSchedule>(editing?.schedule ?? "Full-time");
  const [location, setLocation] = useState(editing?.location ?? "");
  const [salaryMin, setSalaryMin] = useState(editing?.salaryMin ?? 60000);
  const [salaryMax, setSalaryMax] = useState(editing?.salaryMax ?? 90000);
  const [description, setDescription] = useState(editing?.description ?? "");
  const [responsibilities, setResponsibilities] = useState<string[]>(editing?.responsibilities ?? [""]);
  const [requirements, setRequirements] = useState<string[]>(editing?.requirements ?? [""]);
  const [customQuestions, setCustomQuestions] = useState<string[]>(editing?.customQuestions ?? [""]);
  const [active, setActive] = useState(editing?.status !== "draft");
  const [deadline, setDeadline] = useState("");

  function save(status: "active" | "draft") {
    if (!title.trim() || !company.trim()) {
      toast.error("Job title and company name are required");
      return;
    }
    const cat = categories.find(c => c.name === category) ?? categories[0];
    const job: Job = {
      id: editing?.id ?? `job_${Date.now()}`,
      title, company,
      companyColor: editing?.companyColor ?? cat.color,
      category, type, schedule, location,
      salaryMin: Number(salaryMin), salaryMax: Number(salaryMax),
      postedAt: editing?.postedAt ?? new Date().toISOString(),
      isNew: !editing,
      description,
      responsibilities: responsibilities.filter(Boolean),
      requirements: requirements.filter(Boolean),
      skills: editing?.skills ?? [],
      benefits: editing?.benefits ?? [],
      about: editing?.about ?? `${company} is hiring for ${title}.`,
      customQuestions: customQuestions.filter(Boolean),
      status,
    };
    if (editing) updateJob(editing.id, job);
    else addJob(job);
    toast.success(status === "active" ? (editing ? "Job updated successfully!" : "Job posted successfully! 🎉") : "Draft saved");
    navigate({ to: "/admin" });
  }

  return (
    <AdminLayout>
      <header className="flex items-center gap-3 px-6 pt-8">
        <Link to="/admin" className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-display text-2xl font-bold">{editing ? "Edit Job" : "Post New Job"}</h1>
      </header>

      <form onSubmit={(e) => { e.preventDefault(); save(active ? "active" : "draft"); }} className="mt-6 space-y-6 px-6 pb-44 lg:pb-32">
        <Card title="Job Info">
          <FormField label="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <FormField label="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} required />
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-12 w-full rounded-xl border-2 border-border bg-surface px-4 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
            >
              {categories.map(c => <option key={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Job Type</label>
            <div className="flex flex-wrap gap-2">
              {types.map(t => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setType(t)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    type === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary-soft"
                  )}
                >{t}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Schedule</label>
            <div className="flex flex-wrap gap-2">
              {schedules.map(s => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSchedule(s)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    schedule === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary-soft"
                  )}
                >{s}</button>
              ))}
            </div>
          </div>
          <FormField label="Location" placeholder="e.g. Remote · Worldwide" value={location} onChange={(e) => setLocation(e.target.value)} />
        </Card>

        <Card title="Compensation">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Salary Min ($)" type="number" value={salaryMin} onChange={(e) => setSalaryMin(Number(e.target.value))} />
            <FormField label="Salary Max ($)" type="number" value={salaryMax} onChange={(e) => setSalaryMax(Number(e.target.value))} />
          </div>
        </Card>

        <Card title="Description">
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Job Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full resize-none rounded-2xl border-2 border-border bg-surface p-4 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
            />
          </div>
          <BulletList label="Responsibilities" items={responsibilities} setItems={setResponsibilities} />
          <BulletList label="Requirements" items={requirements} setItems={setRequirements} />
        </Card>

        <Card title="Pre-Screening Questionnaires">
          <p className="text-sm text-muted-foreground mb-4">Add mandatory questions candidates must answer before submitting their application.</p>
          <BulletList label="Custom Questions" items={customQuestions} setItems={setCustomQuestions} />
        </Card>

        <Card title="Status">
          <label className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
            <span className="text-sm font-semibold">Publish status</span>
            <Switch checked={active} onCheckedChange={setActive} />
          </label>
          <FormField label="Application Deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </Card>

        <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-border bg-surface/95 px-6 py-3 backdrop-blur lg:bottom-0 lg:left-64">
          <div className="mx-auto flex max-w-6xl gap-3">
            <GhostButton type="button" onClick={() => save("draft")} className="flex-1">Save as Draft</GhostButton>
            <PrimaryButton type="submit" className="flex-1">{editing ? "Save Changes" : "Post Job"}</PrimaryButton>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <h3 className="mb-4 font-display text-base font-bold">{title}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function BulletList({ label, items, setItems }: { label: string; items: string[]; setItems: (i: string[]) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold">{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-muted-foreground">•</span>
            <input
              value={item}
              onChange={(e) => setItems(items.map((it, j) => j === i ? e.target.value : it))}
              className="h-10 flex-1 rounded-xl border-2 border-border bg-surface px-3 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
              placeholder={`Add a ${label.toLowerCase().slice(0, -1)}…`}
            />
            <button
              type="button"
              onClick={() => setItems(items.filter((_, j) => j !== i))}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-danger/10 hover:text-danger"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setItems([...items, ""])}
          className="inline-flex items-center gap-1.5 rounded-xl border-2 border-dashed border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:border-primary hover:text-primary"
        >
          <Plus className="h-3.5 w-3.5" /> Add row
        </button>
      </div>
    </div>
  );
}
