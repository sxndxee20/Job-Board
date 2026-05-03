import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState, type ChangeEvent } from "react";
import { Camera, ChevronRight, Bell, Lock, LogOut, Shield, FileText, Briefcase, Brain, Award, TrendingUp } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useApp } from "@/context/AppContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [{ title: "Profile — JobBoard" }],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, logout, bookmarks, getUserApplications, jobs, applications, updateUser } = useApp();
  const navigate = useNavigate();
  const apps = getUserApplications(user?.id ?? "user_demo");
  const initials = (user?.name ?? "JS").split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nameDraft, setNameDraft] = useState(user?.name ?? "");
  const [locationDraft, setLocationDraft] = useState(user?.location ?? "");
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateUser({ avatarUrl: reader.result });
        toast.success("Profile photo updated!");
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function handleLogout() {
    setShowLogoutConfirm(false);
    logout();
    navigate({ to: "/" });
  }

  if (user?.role === "admin") {
    const activeJobs = jobs.filter((j) => j.status === "active").length;
    return (
      <AdminLayout>
        <header className="px-6 pt-8 animate-slide-down">
          <h1 className="font-display text-2xl font-black">Admin Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your hiring workspace and account settings.</p>
        </header>
        <div className="mt-5 px-6">
          <div className="rounded-3xl bg-gradient-hero p-6 text-white shadow-elevated">
            <p className="font-display text-xl font-bold">{user?.name ?? "Admin"}</p>
            <p className="text-xs text-white/70">{user?.email}</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <Stat label="Active Jobs" value={activeJobs} />
              <Stat label="Applicants" value={applications.length} />
              <Stat label="Interviews" value={applications.filter(a => a.status === "Interview").length} />
            </div>
          </div>
          <div className="mt-5 space-y-3">
            <SectionCard icon={<Shield className="h-4 w-4" />} title="Admin Permissions" subtitle="Full access to jobs, applicants and statuses" />
            <SectionCard icon={<Bell className="h-4 w-4" />} title="Hiring Notifications" subtitle="Recruiting alerts and candidate updates" />
            <SectionCard icon={<Lock className="h-4 w-4" />} title="Security" subtitle="Update password and account protection" />
          </div>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-danger/10 px-4 py-2 text-sm font-semibold text-danger hover:bg-danger/15"
          >
            <LogOut className="h-4 w-4" /> Log Out
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AppLayout>
      <header className="px-5 pt-7 pb-3 animate-slide-down">
        <h1 className="font-display text-2xl font-black">Profile</h1>
      </header>

      <div className="px-5">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-7 text-white shadow-elevated">
          <div className="absolute inset-0 bg-gradient-mesh opacity-30 animate-mesh" />
          <div className="relative flex items-center gap-4">
            <div className="relative">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user?.name ?? "User"} className="h-20 w-20 rounded-full object-cover ring-4 ring-white/20" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 font-display text-2xl font-bold backdrop-blur ring-4 ring-white/20">
                  {initials}
                </div>
              )}
              <button
                onClick={() => photoInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white shadow-lg"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="min-w-0">
              <p className="font-display text-xl font-bold">{user?.name ?? "Demo User"}</p>
              <p className="text-xs text-white/70">{user?.location ?? "—"}</p>
              <span className="mt-1.5 inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide backdrop-blur">
                {(user?.role as string) === "admin" ? "Admin" : "Job Seeker"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat label="Applied" value={apps.length} />
          <Stat label="Saved" value={bookmarks.size} />
          <Stat label="Views" value={42} />
        </div>

        <button 
          onClick={() => navigate({ to: "/analytics" })}
          className="mt-4 flex w-full items-center justify-between rounded-2xl bg-primary/10 px-5 py-4 text-primary transition-all hover:bg-primary/20"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="font-display text-sm font-bold">Candidate Analytics</h3>
              <p className="text-xs font-medium opacity-80">See who's viewing your profile</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="mt-5 space-y-3">
          <SectionCard
            icon={<FileText className="h-4 w-4" />}
            title="Personal Information"
            subtitle={user?.email ?? ""}
            onClick={() => {
              setNameDraft(user?.name ?? "");
              setLocationDraft(user?.location ?? "");
              setIsEditingProfile(true);
            }}
          />
          <SectionCard icon={<Briefcase className="h-4 w-4" />} title="Work Experience" subtitle={user?.experienceYears ? `${user.experienceYears} years of experience` : "Add your latest role"} />
          <SectionCard icon={<FileText className="h-4 w-4" />} title="Education" subtitle="Where did you study?" />
          <SectionCard icon={<Brain className="h-4 w-4" />} title="Skills" subtitle={user?.skills && user.skills.length > 0 ? user.skills.join(", ") : "React, TypeScript, Figma…"} />
          <SectionCard icon={<Award className="h-4 w-4" />} title="Skill Assessments" subtitle={user?.badges?.length ? `${user.badges.length} badges earned` : "Take tests to earn badges"} onClick={() => navigate({ to: "/assessments" })} />
          <SectionCard icon={<FileText className="h-4 w-4" />} title="Resume" subtitle="resume.pdf" />
        </div>
        <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />

        <div className="mt-6 rounded-2xl border border-border bg-surface p-2 shadow-card">
          <SettingsItem icon={<Bell className="h-4 w-4" />} label="Notifications" />
          <SettingsItem icon={<Shield className="h-4 w-4" />} label="Privacy Settings" />
          <SettingsItem icon={<Lock className="h-4 w-4" />} label="Change Password" />
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-danger transition-colors hover:bg-danger/5"
          >
            <LogOut className="h-4 w-4" /> Log Out
          </button>
        </div>
      </div>
      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your personal information. Changes are saved to local storage.</DialogDescription>
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
            <div className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2">
              <p className="text-xs text-muted-foreground">{user?.avatarUrl ? "Photo uploaded" : "No profile photo yet"}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => photoInputRef.current?.click()}
                  className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                >
                  Change Photo
                </button>
                {user?.avatarUrl && (
                  <button
                    onClick={() => { updateUser({ avatarUrl: "" }); toast.info("Profile photo removed"); }}
                    className="rounded-lg bg-danger/10 px-3 py-1 text-xs font-semibold text-danger"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setIsEditingProfile(false)} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted">Cancel</button>
            <button
              onClick={() => {
                updateUser({ name: nameDraft.trim() || user?.name, location: locationDraft.trim() || user?.location });
                setIsEditingProfile(false);
                toast.success("Profile updated successfully!");
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
              Are you sure you want to log out? You'll need to sign in again to access your account.
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
    </AppLayout>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-3 text-center shadow-card">
      <p className="font-display text-xl font-bold text-primary">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}

function SectionCard({ icon, title, subtitle, onClick }: { icon: React.ReactNode; title: string; subtitle: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface p-4 text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-elevated">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}

function SettingsItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
      <span className="text-muted-foreground">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}
