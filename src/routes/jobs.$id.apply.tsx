import { useState } from "react";
import { createFileRoute, useNavigate, notFound } from "@tanstack/react-router";
import { ArrowLeft, Mail, MapPin, Phone, User, Upload, FileText, CheckCircle2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useApp } from "@/context/AppContext";
import { FormField } from "@/components/ui/form-field";
import { PrimaryButton } from "@/components/ui/primary-button";

export const Route = createFileRoute("/jobs/$id/apply")({
  head: () => ({
    meta: [{ title: "Apply — JobBoard" }],
  }),
  component: ApplicationFormPage,
});

function ApplicationFormPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { getJobById, user, submitApplication } = useApp();
  const job = getJobById(id);
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState(user?.location ?? "");
  const [resumeName, setResumeName] = useState<string>("");
  const [coverName, setCoverName] = useState<string>("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  if (!job) throw notFound();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      submitApplication({
        jobId: job!.id,
        userId: user?.id ?? "user_demo",
        applicantName: name,
        applicantEmail: email,
        resume: resumeName || "Resume.pdf",
        coverNote: note,
      });
      navigate({ to: "/application-success" });
    }, 700);
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="mx-auto max-w-lg">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/90 px-5 py-3 backdrop-blur">
          <Link to="/jobs/$id" params={{ id: job.id }} className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="flex-1 text-center font-display text-base font-bold">Application Form</h1>
          <div className="w-10" />
        </header>

        <div className="px-5 pt-5">
          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Applying to</p>
            <p className="font-display text-base font-bold">{job.title}</p>
            <p className="text-xs text-muted-foreground">{job.company}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-5 pt-6 space-y-7">
          <Section title="Personal Information">
            <FormField label="Full Name" icon={<User className="h-4 w-4" />} value={name} onChange={(e) => setName(e.target.value)} required />
            <FormField label="Email" type="email" icon={<Mail className="h-4 w-4" />} value={email} onChange={(e) => setEmail(e.target.value)} required />
            <FormField label="Phone Number" icon={<Phone className="h-4 w-4" />} value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <FormField label="Location" icon={<MapPin className="h-4 w-4" />} value={location} onChange={(e) => setLocation(e.target.value)} />
          </Section>

          <Section title="Resume & Documents">
            <FileBox
              label="Resume / CV"
              fileName={resumeName}
              onFile={(f) => setResumeName(f.name)}
              required
            />
            <FileBox
              label="Cover Letter (Optional)"
              fileName={coverName}
              onFile={(f) => setCoverName(f.name)}
            />
          </Section>

          <Section title="Additional Information">
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Why are you a good fit?</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 500))}
                rows={5}
                placeholder="Tell us a bit about yourself and why this role excites you…"
                className="w-full resize-none rounded-2xl border-2 border-border bg-surface p-4 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
              />
              <p className="mt-1 text-right text-[11px] text-muted-foreground">{note.length}/500</p>
            </div>
          </Section>

          <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-lg -translate-x-1/2 border-t border-border bg-surface/95 px-5 py-4 backdrop-blur">
            <PrimaryButton type="submit" fullWidth size="lg" loading={loading}>
              {loading ? "Submitting…" : "Submit Application"}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function FileBox({
  label, fileName, onFile, required,
}: {
  label: string; fileName: string; onFile: (f: File) => void; required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold">{label}</label>
      <label className="relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/40 p-6 text-center transition-colors hover:border-primary hover:bg-primary-soft/40">
        {fileName ? (
          <>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-foreground">{fileName}</span>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </div>
            <span className="text-[11px] text-muted-foreground">Click to replace</span>
          </>
        ) : (
          <>
            <Upload className="h-6 w-6 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Drag & drop or Browse files</span>
            <span className="text-[11px] text-muted-foreground">PDF or DOCX, max 5MB</span>
          </>
        )}
        <input
          type="file"
          required={required && !fileName}
          accept=".pdf,.doc,.docx"
          onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </label>
    </div>
  );
}
