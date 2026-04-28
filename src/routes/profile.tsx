import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Camera, ChevronRight, Bell, Lock, LogOut, Shield, FileText } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [{ title: "Profile — JobBoard" }],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, logout, bookmarks, getUserApplications } = useApp();
  const navigate = useNavigate();
  const apps = getUserApplications(user?.id ?? "user_demo");
  const initials = (user?.name ?? "JS").split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();

  function handleLogout() {
    logout();
    navigate({ to: "/" });
  }

  return (
    <AppLayout>
      <header className="px-5 pt-6 pb-3">
        <h1 className="font-display text-2xl font-bold">Profile</h1>
      </header>

      <div className="px-5">
        <div className="rounded-3xl bg-gradient-hero p-6 text-white shadow-elevated">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 font-display text-2xl font-bold backdrop-blur ring-4 ring-white/20">
                {initials}
              </div>
              <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white shadow-lg">
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="min-w-0">
              <p className="font-display text-xl font-bold">{user?.name ?? "Demo User"}</p>
              <p className="text-xs text-white/70">{user?.location ?? "—"}</p>
              <span className="mt-1.5 inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide backdrop-blur">
                {user?.role === "admin" ? "Admin" : "Job Seeker"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat label="Applied" value={apps.length} />
          <Stat label="Saved" value={bookmarks.size} />
          <Stat label="Views" value={42} />
        </div>

        <div className="mt-5 space-y-3">
          <SectionCard icon={<FileText className="h-4 w-4" />} title="Personal Information" subtitle={user?.email ?? ""} />
          <SectionCard icon={<FileText className="h-4 w-4" />} title="Work Experience" subtitle="Add your latest role" />
          <SectionCard icon={<FileText className="h-4 w-4" />} title="Education" subtitle="Where did you study?" />
          <SectionCard icon={<FileText className="h-4 w-4" />} title="Skills" subtitle="React, TypeScript, Figma…" />
          <SectionCard icon={<FileText className="h-4 w-4" />} title="Resume" subtitle="resume.pdf" />
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-surface p-2 shadow-card">
          <SettingsItem icon={<Bell className="h-4 w-4" />} label="Notifications" />
          <SettingsItem icon={<Shield className="h-4 w-4" />} label="Privacy Settings" />
          <SettingsItem icon={<Lock className="h-4 w-4" />} label="Change Password" />
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-danger transition-colors hover:bg-danger/5"
          >
            <LogOut className="h-4 w-4" /> Log Out
          </button>
        </div>
      </div>
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

function SectionCard({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <button className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface p-4 text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-elevated">
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
