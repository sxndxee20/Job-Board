import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronRight, User, Shield } from "lucide-react";
import { BackButton } from "@/components/shared/BackButton";
import { useApp, type Role } from "@/context/AppContext";

export const Route = createFileRoute("/choose-role")({
  head: () => ({
    meta: [
      { title: "Choose Your Role — JobBoard" },
      { name: "description", content: "Select how you want to use JobBoard." },
    ],
  }),
  component: ChooseRolePage,
});

function ChooseRolePage() {
  const { setRole, login } = useApp();
  const navigate = useNavigate();

  function pick(role: Role) {
    setRole(role);
    // ensure a demo user exists if user came here directly
    login("demo@jobboard.app", "demo1234", role);
    navigate({ to: role === "admin" ? "/admin" : "/home" });
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md px-6 py-8">
        <BackButton to="/login" />
        <div className="mt-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Choose Your Role</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Select how you want to continue</p>
        </div>

        <div className="mt-8 space-y-4">
          <RoleCard
            onClick={() => pick("seeker")}
            icon={<User className="h-7 w-7 text-white" />}
            iconBg="bg-gradient-primary"
            title="Job Seeker"
            desc="Find jobs, apply and build your career"
          />
          <RoleCard
            onClick={() => pick("admin")}
            icon={<Shield className="h-7 w-7 text-white" />}
            iconBg="bg-[var(--color-primary-dark)]"
            title="Admin"
            desc="Manage jobs, applicants and more"
          />
        </div>
      </div>
    </div>
  );
}

function RoleCard({
  onClick, icon, iconBg, title, desc,
}: {
  onClick: () => void; icon: React.ReactNode; iconBg: string; title: string; desc: string;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-4 rounded-2xl border-2 border-border bg-surface p-5 text-left shadow-card transition-all hover:-translate-y-0.5 hover:scale-[1.02] hover:border-primary hover:shadow-elevated"
    >
      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${iconBg} shadow-soft`}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
    </button>
  );
}
