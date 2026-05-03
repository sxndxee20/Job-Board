import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheck, CheckCircle2, PartyPopper, MessageCircle, FileSignature } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import type { AppStatus } from "@/data/mockData";
import { BrandBellIcon } from "@/components/shared/BrandIcons";
import { StyledAvatar } from "@/components/shared/StyledAvatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/applications")({
  head: () => ({
    meta: [{ title: "My Applications — JobBoard" }],
  }),
  component: MyApplicationsPage,
});

const tabs: ("All" | AppStatus)[] = ["All", "Applied", "In Review", "Interview", "Offered", "Withdrawn"];

function MyApplicationsPage() {
  const { user, getUserApplications, getJobById, withdrawApplication, setApplicationInterview, setOfferDecision, updateApplication, deleteApplication } = useApp();
  const [tab, setTab] = useState<typeof tabs[number]>("All");
  const [acceptedOfferIds, setAcceptedOfferIds] = useState<Set<string>>(new Set());
  const [scheduledInterviewIds, setScheduledInterviewIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftNote, setDraftNote] = useState("");
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const all = getUserApplications(user?.id ?? "user_demo");

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: all.length };
    for (const a of all) c[a.status] = (c[a.status] ?? 0) + 1;
    return c;
  }, [all]);

  const list = tab === "All" ? all : all.filter(a => a.status === tab);

  return (
    <AppLayout>
      <header className="flex items-center justify-between px-5 pt-6 pb-3">
        <div className="w-10" />
        <h1 className="font-display text-lg font-bold">My Applications</h1>
        <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface">
          <BrandBellIcon className="h-5 w-5" />
        </button>
      </header>

      <div className="flex gap-2 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map(t => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "shrink-0 border-b-2 px-1 pb-2 text-sm font-semibold transition-colors",
                active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {t} <span className={cn("ml-1 rounded-full px-1.5 py-0.5 text-[10px]", active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>{counts[t] ?? 0}</span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-3 px-5 sm:grid-cols-2">
        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center sm:col-span-2">
            <p className="font-display text-base font-bold">No applications yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Start applying to see them here.</p>
            <Link to="/jobs" className="mt-4 inline-block rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Browse Jobs
            </Link>
          </div>
        ) : list.map(app => {
          const job = getJobById(app.jobId);
          if (!job) return null;
          const accepted = acceptedOfferIds.has(app.id);
          const scheduled = scheduledInterviewIds.has(app.id);
          return (
            <div
              key={app.id}
              className="rounded-2xl border border-border bg-surface p-4 shadow-card transition-all hover:border-primary/40 hover:shadow-elevated"
            >
              <div className="flex items-start gap-3">
                <StyledAvatar seed={job.company} label={job.company} className="h-12 w-12 shrink-0 rounded-xl text-base" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-display text-sm font-bold">{job.title}</p>
                      <p className="text-xs text-muted-foreground">{job.company}</p>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Applied on {new Date(app.appliedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>
              {(app.status === "Interview" || app.status === "Offered") && (
                <div className="mt-3 rounded-xl border border-primary/20 bg-primary-soft p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">What's next</p>
                  {app.status === "Interview" && (
                    <>
                      <p className="mt-1 text-sm text-foreground">Prepare your portfolio and pick an interview slot.</p>
                      <button
                        onClick={() => {
                          const dt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
                          setApplicationInterview(app.id, dt);
                          setScheduledInterviewIds(prev => new Set(prev).add(app.id));
                        }}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                      >
                        <CalendarCheck className="h-3.5 w-3.5" />
                        {scheduled ? "Interview Scheduled" : "Schedule Interview"}
                      </button>
                    </>
                  )}
                  {app.status === "Offered" && (
                    <>
                      <p className="mt-1 text-sm text-foreground">Congrats! Review your offer package and confirm your decision.</p>
                      {app.offerGenerated ? (
                        <button
                          onClick={() => {
                            setAcceptedOfferIds(prev => new Set(prev).add(app.id));
                            setOfferDecision(app.id, "accepted");
                          }}
                          className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-success px-3 py-1.5 text-xs font-semibold text-white shadow-glow hover:bg-success/90 transition-all"
                        >
                          <FileSignature className="h-3.5 w-3.5" /> Review & E-Sign Offer Letter
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setAcceptedOfferIds(prev => new Set(prev).add(app.id));
                            setOfferDecision(app.id, "accepted");
                          }}
                          className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-success px-3 py-1.5 text-xs font-semibold text-white hover:bg-success/90 transition-all"
                        >
                          <PartyPopper className="h-3.5 w-3.5" /> Accept Offer
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
              {accepted && (
                <div className="mt-3 flex flex-col gap-2 rounded-xl border border-success/20 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Offer accepted. The recruiter will contact you for onboarding.
                  </div>
                  <Link
                    to="/messages/$id"
                    params={{ id: app.id }}
                    className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-white shadow-glow hover:bg-emerald-700 transition-colors"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> Chat directly with {job.company}
                  </Link>
                </div>
              )}
              <Link to="/jobs/$id" params={{ id: job.id }} className="mt-3 inline-block text-xs font-semibold text-primary">
                View job details
              </Link>
              <button
                onClick={() => {
                  setEditingId(app.id);
                  setDraftNote(app.coverNote ?? "");
                }}
                className="mt-3 ml-3 inline-block text-xs font-semibold text-primary hover:underline"
              >
                Edit
              </button>
              {(app.status === "Applied" || app.status === "In Review") && (
                <button
                  onClick={() => setWithdrawingId(app.id)}
                  className="mt-3 ml-3 inline-block text-xs font-semibold text-warning hover:underline"
                >
                  Withdraw
                </button>
              )}
              <button
                onClick={() => setDeletingId(app.id)}
                className="mt-3 ml-3 inline-block text-xs font-semibold text-danger hover:underline"
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
      <Dialog open={!!editingId} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Application Note</DialogTitle>
            <DialogDescription>
              Update your cover note or application details. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <textarea
              rows={6}
              value={draftNote}
              onChange={(e) => setDraftNote(e.target.value)}
              className="w-full rounded-xl border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Write your cover note..."
            />
          </div>
          <DialogFooter>
            <button onClick={() => setEditingId(null)} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted">Cancel</button>
            <button
              onClick={() => {
                if (editingId) updateApplication(editingId, { coverNote: draftNote.trim() });
                setEditingId(null);
              }}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark"
            >
              Save changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!withdrawingId} onOpenChange={(open) => !open && setWithdrawingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Withdraw Application?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to withdraw this application? You cannot undo this action, but you can apply again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-warning text-white hover:bg-warning/90"
              onClick={() => {
                if (withdrawingId) withdrawApplication(withdrawingId);
                setWithdrawingId(null);
              }}
            >
              Withdraw
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this application from your history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-danger text-white hover:bg-danger/90"
              onClick={() => {
                if (deletingId) deleteApplication(deletingId);
                setDeletingId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
