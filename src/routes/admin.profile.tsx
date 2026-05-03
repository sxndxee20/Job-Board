import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState, type ChangeEvent } from "react";
import { Bell, Camera, Lock, LogOut, Shield } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useApp } from "@/context/AppContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/profile")({
  head: () => ({
    meta: [{ title: "Admin Profile — JobBoard" }],
  }),
  component: AdminProfilePage,
});

function AdminProfilePage() {
  const { user, logout, jobs, applications, updateUser } = useApp();
  const navigate = useNavigate();
  const activeJobs = jobs.filter((j) => j.status === "active").length;
  const interviews = applications.filter((a) => a.status === "Interview").length;
  const [isEditing, setIsEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState(user?.name ?? "");
  const [locationDraft, setLocationDraft] = useState(user?.location ?? "");
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") updateUser({ avatarUrl: reader.result });
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function handleLogout() {
    setShowLogoutConfirm(false);
    logout();
    navigate({ to: "/" });
  }

  return (
    <AdminLayout>
      <header className="px-6 pt-8">
        <h1 className="font-display text-2xl font-bold">Admin Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your hiring workspace and account settings.</p>
      </header>
      <div className="mt-5 px-6">
        <div className="rounded-3xl bg-gradient-hero p-6 text-white shadow-elevated">
          <div className="flex items-center gap-3">
            <div className="relative">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user?.name ?? "Admin"} className="h-16 w-16 rounded-full object-cover ring-2 ring-white/30" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-lg font-bold ring-2 ring-white/30">
                  {(user?.name ?? "Admin").slice(0, 1).toUpperCase()}
                </div>
              )}
              <button onClick={() => photoInputRef.current?.click()} className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-primary">
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              <p className="font-display text-xl font-bold">{user?.name ?? "Admin"}</p>
              <p className="text-xs text-white/70">{user?.email ?? "admin@jobboard.local"}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Stat label="Active Jobs" value={activeJobs} />
            <Stat label="Applicants" value={applications.length} />
            <Stat label="Interviews" value={interviews} />
          </div>
        </div>
        <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
        <div className="mt-5 space-y-3">
          <SectionCard
            icon={<Shield className="h-4 w-4" />}
            title="Admin Permissions"
            subtitle="Full access to jobs, applicants and statuses"
            onClick={() => {
              setNameDraft(user?.name ?? "");
              setLocationDraft(user?.location ?? "");
              setIsEditing(true);
            }}
          />
          <SectionCard icon={<Bell className="h-4 w-4" />} title="Hiring Notifications" subtitle="Recruiting alerts and candidate updates" />
          <SectionCard icon={<Lock className="h-4 w-4" />} title="Security" subtitle="Update password and account protection" />
        </div>
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-danger/10 px-4 py-2 text-sm font-semibold text-danger hover:bg-danger/15"
        >
          <LogOut className="h-4 w-4" /> Log Out
        </button>
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Admin Profile</DialogTitle>
              <DialogDescription>Update your profile details.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground">Name</label>
                <input value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground">Location</label>
                <input value={locationDraft} onChange={(e) => setLocationDraft(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
            <DialogFooter>
              <button onClick={() => setIsEditing(false)} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted">Cancel</button>
              <button
                onClick={() => {
                  updateUser({ name: nameDraft.trim() || user?.name, location: locationDraft.trim() || user?.location });
                  setIsEditing(false);
                  toast.success("Admin profile updated!");
                }}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark"
              >
                Save changes
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Log Out?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to log out of the admin panel?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-danger text-white hover:bg-danger/90" onClick={handleLogout}>
                Log Out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-3 text-center">
      <p className="font-display text-xl font-bold text-white">{value}</p>
      <p className="text-[11px] text-white/75">{label}</p>
    </div>
  );
}

function SectionCard({ icon, title, subtitle, onClick }: { icon: React.ReactNode; title: string; subtitle: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface p-4 text-left shadow-card">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </button>
  );
}
