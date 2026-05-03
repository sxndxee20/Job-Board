import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Inbox, ChevronDown, FileText, Mail, User, Award, CheckCircle, GripVertical, CheckSquare, Square, CalendarCheck, ShieldCheck, FileSignature, MessageSquare, Sparkles } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useApp } from "@/context/AppContext";
import { StatusBadge } from "@/components/ui/status-badge";
import type { AppStatus } from "@/data/mockData";
import { StyledAvatar } from "@/components/shared/StyledAvatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/applications")({
  head: () => ({
    meta: [{ title: "Applications Pipeline — JobBoard Admin" }],
  }),
  component: ApplicantsPage,
});

const statuses: ("All" | AppStatus)[] = ["All", "Applied", "In Review", "Interview", "Offered", "Rejected", "Withdrawn"];
const kanbanColumns: AppStatus[] = ["Applied", "In Review", "Interview", "Offered", "Rejected"];

function ApplicantsPage() {
  const { applications, jobs, updateApplicationStatus, updateApplication, setApplicationAdminNote, deleteApplication } = useApp();
  const [q, setQ] = useState("");
  const [jobFilter, setJobFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<typeof statuses[number]>("All");
  const [viewMode, setViewMode] = useState<"list" | "board">("list");
  
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Bulk Actions
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const list = useMemo(() => {
    return applications.filter(a => {
      if (q && !a.applicantName.toLowerCase().includes(q.toLowerCase()) && !a.applicantEmail.toLowerCase().includes(q.toLowerCase())) return false;
      if (jobFilter !== "All" && a.jobId !== jobFilter) return false;
      if (viewMode === "list" && statusFilter !== "All" && a.status !== statusFilter) return false;
      return true;
    });
  }, [applications, q, jobFilter, statusFilter, viewMode]);

  const viewing = list.find((a) => a.id === viewingId) ?? null;
  const viewingJob = jobs.find((j) => j.id === viewing?.jobId);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkReject = () => {
    if (selectedIds.size === 0) return;
    selectedIds.forEach(id => updateApplicationStatus(id, "Rejected"));
    toast.success(`Successfully rejected ${selectedIds.size} candidates and sent automated emails.`);
    setSelectedIds(new Set());
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("appId", id);
  };

  const handleDrop = (e: React.DragEvent, status: AppStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("appId");
    if (id) {
      updateApplicationStatus(id, status);
      toast.success(`Moved candidate to ${status}`);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <AdminLayout>
      <header className="px-6 pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">Applicant Pipeline</h1>
            <p className="text-sm text-muted-foreground mt-1">Review, rank, and manage candidates.</p>
          </div>
          <div className="flex items-center gap-2 bg-surface p-1 rounded-xl border border-border w-fit">
            <button onClick={() => setViewMode("list")} className={cn("px-4 py-1.5 rounded-lg text-sm font-semibold transition-all", viewMode === "list" ? "bg-primary text-white shadow-soft" : "text-muted-foreground hover:text-foreground")}>List View</button>
            <button onClick={() => setViewMode("board")} className={cn("px-4 py-1.5 rounded-lg text-sm font-semibold transition-all", viewMode === "board" ? "bg-primary text-white shadow-soft" : "text-muted-foreground hover:text-foreground")}>Board View</button>
          </div>
        </div>
      </header>

      <div className="mt-6 px-6">
        <div className="grid gap-3 lg:grid-cols-[1fr_200px_200px]">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search applicants…"
              className="h-12 w-full rounded-2xl border border-border bg-surface pl-11 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
            />
          </div>
          <SelectField value={jobFilter} onChange={setJobFilter}>
            <option value="All">All Jobs</option>
            {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
          </SelectField>
          {viewMode === "list" && (
            <SelectField value={statusFilter} onChange={(v) => setStatusFilter(v as typeof statuses[number])}>
              {statuses.map(s => <option key={s}>{s}</option>)}
            </SelectField>
          )}
        </div>
      </div>

      {viewMode === "list" && (
        <div className="mt-5 px-6">
          {selectedIds.size > 0 && (
            <div className="mb-4 flex items-center justify-between rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 animate-in fade-in slide-in-from-top-2">
              <span className="text-sm font-bold text-primary">{selectedIds.size} candidates selected</span>
              <button onClick={handleBulkReject} className="rounded-lg bg-danger px-4 py-1.5 text-xs font-bold text-white shadow-glow hover:bg-danger/90 transition-colors">
                Bulk Reject & Email
              </button>
            </div>
          )}

          <div className="space-y-3">
            {list.length === 0 ? (
              <EmptyState />
            ) : list.map(app => {
              const job = jobs.find(j => j.id === app.jobId);
              const isSelected = selectedIds.has(app.id);
              // Fallback match score if local storage has old data without it
              const matchScore = app.matchScore ?? (app.id === "app_103" ? 98 : app.id === "app_101" ? 92 : 78);
              return (
                <div key={app.id} className={cn("flex flex-col gap-3 rounded-2xl border bg-surface p-4 shadow-card lg:flex-row lg:items-center transition-all hover:shadow-elevated", isSelected ? "border-primary ring-1 ring-primary" : "border-border")}>
                  <div className="flex flex-1 items-center gap-3">
                    <button onClick={() => toggleSelect(app.id)} className="text-muted-foreground hover:text-primary transition-colors">
                      {isSelected ? <CheckSquare className="h-5 w-5 text-primary" /> : <Square className="h-5 w-5" />}
                    </button>
                    <StyledAvatar seed={app.applicantEmail} label={app.applicantName} className="h-11 w-11 shrink-0 text-sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-bold text-foreground">{app.applicantName}</p>
                        <div className={cn("flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold", matchScore >= 90 ? "bg-success/15 text-success" : matchScore >= 70 ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground")}>
                          <Sparkles className="h-3 w-3" /> {matchScore}% Match
                        </div>
                      </div>
                      <p className="truncate text-xs text-muted-foreground mt-0.5">
                        Applied for: <span className="font-semibold text-foreground">{job?.title ?? "—"}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[11px] text-muted-foreground">
                          {new Date(app.appliedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                        {app.badges && app.badges.length > 0 && (
                          <span className="flex items-center gap-1 rounded-md bg-accent/10 px-1.5 py-0.5 text-[10px] font-bold text-accent">
                            <Award className="h-3 w-3" /> {app.badges.length} Verified Skills
                          </span>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setViewingId(app.id)} className="rounded-xl border-2 border-border px-4 py-2 text-xs font-semibold hover:border-primary hover:text-primary transition-colors">View</button>
                    <button onClick={() => setDeletingId(app.id)} className="rounded-xl border-2 border-danger/30 px-3 py-2 text-xs font-semibold text-danger hover:bg-danger/5 transition-colors">Delete</button>
                    <div className="relative">
                      <select value={app.status} onChange={(e) => updateApplicationStatus(app.id, e.target.value as AppStatus)} className="appearance-none rounded-xl bg-primary px-4 py-2 pr-8 text-xs font-semibold text-primary-foreground shadow-soft focus:outline-none focus:ring-4 focus:ring-primary/30">
                        {statuses.filter(s => s !== "All").map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-primary-foreground" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === "board" && (
        <div className="mt-5 px-6 pb-12 flex gap-4 overflow-x-auto min-h-[60vh] items-start [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {kanbanColumns.map(col => {
            const colApps = list.filter(a => a.status === col);
            return (
              <div 
                key={col} 
                onDrop={(e) => handleDrop(e, col)} 
                onDragOver={handleDragOver}
                className="w-80 shrink-0 rounded-2xl bg-surface/50 p-3 border border-border flex flex-col min-h-[500px]"
              >
                <div className="flex items-center justify-between px-2 pb-3 mb-2 border-b border-border/50">
                  <h3 className="font-display font-bold text-sm text-foreground">{col}</h3>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">{colApps.length}</span>
                </div>
                <div className="flex-1 space-y-3">
                  {colApps.map(app => {
                    const job = jobs.find(j => j.id === app.jobId);
                    const matchScore = app.matchScore ?? (app.id === "app_103" ? 98 : app.id === "app_101" ? 92 : 78);
                    return (
                      <div 
                        key={app.id} 
                        draggable 
                        onDragStart={(e) => handleDragStart(e, app.id)}
                        onClick={() => setViewingId(app.id)}
                        className="rounded-xl border border-border bg-background p-3 shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/40 hover:shadow-card transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <StyledAvatar seed={app.applicantEmail} label={app.applicantName} className="h-6 w-6 text-[10px]" />
                            <p className="font-bold text-sm truncate">{app.applicantName}</p>
                          </div>
                          <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", matchScore >= 90 ? "bg-success/15 text-success" : matchScore >= 70 ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground")}>
                            {matchScore}%
                          </span>
                        </div>
                        <p className="text-xs text-primary font-semibold truncate mb-2">{job?.title}</p>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <GripVertical className="h-3 w-3 opacity-30" />
                          <span className="text-[10px] font-medium">{new Date(app.appliedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Dialog open={!!viewingId} onOpenChange={(open) => !open && setViewingId(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <DialogTitle className="text-xl flex items-center gap-2">
                  {viewing?.applicantName}
                  {viewing && (
                    <span className="text-xs font-bold bg-success/15 text-success px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> {viewing.matchScore ?? (viewing.id === "app_103" ? 98 : viewing.id === "app_101" ? 92 : 78)}% Match
                    </span>
                  )}
                </DialogTitle>
                <DialogDescription>Applying for {viewingJob?.title}</DialogDescription>
              </div>
              {viewing && <StatusBadge status={viewing.status} />}
            </div>
          </DialogHeader>
          
          {viewing && (
            <div className="grid lg:grid-cols-2 gap-6 py-4">
              {/* Left Column: Details */}
              <div className="space-y-4">
                <div className="space-y-2 rounded-2xl bg-muted/60 p-4 text-sm">
                  <p className="flex items-center gap-2"><User className="h-4 w-4 text-primary" /> {viewing.applicantName}</p>
                  <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> {viewing.applicantEmail}</p>
                  <p className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> <a href="#" className="font-semibold hover:underline">{viewing.resume}</a></p>
                </div>

                {viewing.badges && viewing.badges.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Verified Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {viewing.badges.map(badge => (
                        <div key={badge} className="flex items-center gap-1.5 rounded-xl border border-accent/20 bg-accent/5 px-3 py-1.5 text-xs font-semibold text-accent">
                          <CheckCircle className="h-3.5 w-3.5" /> {badge}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Cover Note</h4>
                  <p className="text-sm bg-surface p-3 border border-border rounded-xl text-foreground">
                    {viewing.coverNote || "No cover note submitted."}
                  </p>
                </div>
              </div>

              {/* Right Column: Premium Actions */}
              <div className="space-y-4">
                {/* Status Update & Sync */}
                <div className="rounded-2xl border border-border bg-surface p-4">
                  <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-primary">Recruitment Actions</h4>
                  
                  {viewing.status === "In Review" && (
                     <button onClick={() => updateApplicationStatus(viewing.id, "Interview")} className="w-full mb-2 flex items-center justify-center gap-2 rounded-xl bg-primary/10 text-primary px-4 py-2 text-sm font-bold hover:bg-primary hover:text-white transition-all">
                       <CalendarCheck className="h-4 w-4" /> Schedule Interview (Calendar Sync)
                     </button>
                  )}

                  {viewing.status === "Interview" && (
                    <button 
                      onClick={() => {
                        updateApplicationStatus(viewing.id, "Offered");
                        updateApplication(viewing.id, { offerGenerated: true });
                      }} 
                      className="w-full mb-2 flex items-center justify-center gap-2 rounded-xl bg-success text-white px-4 py-2 text-sm font-bold shadow-glow hover:bg-success/90 transition-all"
                    >
                      <FileSignature className="h-4 w-4" /> Generate Offer Letter & E-Sign
                    </button>
                  )}

                  <button 
                    onClick={() => {
                      updateApplication(viewing.id, { bgCheckStatus: "cleared" });
                      toast.success("Background check passed via Checkr.");
                    }} 
                    className="w-full mb-2 flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-bold hover:bg-muted transition-all"
                  >
                    <ShieldCheck className={cn("h-4 w-4", viewing.bgCheckStatus === "cleared" ? "text-success" : "text-muted-foreground")} /> 
                    {viewing.bgCheckStatus === "cleared" ? "Background Check: Cleared" : "Run Background Check (1-Click)"}
                  </button>

                  <select
                    value={viewing.status}
                    onChange={(e) => updateApplicationStatus(viewing.id, e.target.value as AppStatus)}
                    className="mt-2 w-full appearance-none rounded-xl bg-surface border border-border px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {statuses.filter(s => s !== "All").map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Team Notes */}
                <div className="rounded-2xl border border-border bg-surface p-4 flex flex-col h-full max-h-[200px]">
                  <h4 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <MessageSquare className="h-3 w-3" /> Team Notes
                  </h4>
                  <div className="flex-1 overflow-y-auto mb-2 space-y-2">
                    {viewing.teamNotes?.map((n, i) => (
                      <div key={i} className="bg-muted/50 p-2 rounded-lg text-xs">
                        <span className="font-bold text-primary mr-1">{n.author}:</span>
                        <span className="text-foreground">{n.text}</span>
                      </div>
                    ))}
                    {(!viewing.teamNotes || viewing.teamNotes.length === 0) && (
                      <p className="text-xs text-muted-foreground italic">No team notes yet.</p>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="@CTO add a note..."
                    className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:border-primary"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.currentTarget.value) {
                        const newNote = { author: "Admin", text: e.currentTarget.value, date: new Date().toISOString() };
                        updateApplication(viewing.id, { teamNotes: [...(viewing.teamNotes || []), newNote] });
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove this application.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-danger text-white" onClick={() => { if (deletingId) deleteApplication(deletingId); setDeletingId(null); }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-surface p-12 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <Inbox className="h-7 w-7 text-muted-foreground" />
      </div>
      <p className="font-display text-base font-bold">No applications match</p>
    </div>
  );
}

function SelectField({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-12 w-full appearance-none rounded-2xl border border-border bg-surface px-4 pr-10 text-sm font-semibold focus:border-primary">
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
