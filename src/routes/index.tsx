import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, User, Shield } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JobBoard — Find the job that fits your future" },
      { name: "description", content: "Connecting talent with opportunity — fast, simple, and free. Browse listings, apply, and manage hiring in one place." },
      { property: "og:title", content: "JobBoard — Find the job that fits your future" },
      { property: "og:description", content: "Connecting talent with opportunity — fast, simple, and free." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated mesh */}
      <div className="absolute inset-0 bg-gradient-mesh animate-mesh" />
      <div className="absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,rgba(91,78,255,0.08)_1px,transparent_0)] [background-size:32px_32px]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
        <header className="flex items-center justify-between">
          <Logo />
          <Link to="/login" className="hidden text-sm font-semibold text-muted-foreground hover:text-primary sm:inline">
            Log In →
          </Link>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center py-12 text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-4 py-1.5 text-xs font-semibold text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            New jobs added every hour
          </span>
          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Find the job that fits<br />
            <span className="bg-gradient-to-r from-primary via-primary-dark to-accent bg-clip-text text-transparent">
              your future.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Connecting talent with opportunity — fast, simple, and free.
          </p>

          <div className="mt-12 grid w-full max-w-3xl gap-5 sm:grid-cols-2">
            <RoleCard
              to="/login"
              icon={<User className="h-7 w-7" />}
              title="Job Seeker"
              desc="Browse listings, apply, and track your career journey."
              cta="Get Started"
              variant="primary"
            />
            <RoleCard
              to="/login"
              icon={<Shield className="h-7 w-7" />}
              title="Admin / Employer"
              desc="Post jobs, review applications, and manage listings."
              cta="Manage Jobs"
              variant="outline"
            />
          </div>

          <p className="mt-10 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Log In
            </Link>
          </p>
        </main>

        <footer className="mt-auto pt-8 text-center text-xs text-muted-foreground">
          © 2026 JobBoard. Built for HCI 102.
        </footer>
      </div>
    </div>
  );
}

function RoleCard({
  to, icon, title, desc, cta, variant,
}: {
  to: string; icon: React.ReactNode; title: string; desc: string; cta: string;
  variant: "primary" | "outline";
}) {
  return (
    <Link
      to={to}
      className="group relative flex flex-col items-start gap-4 overflow-hidden rounded-3xl border border-border bg-surface p-7 text-left shadow-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated animate-float"
      style={{ animationDelay: variant === "outline" ? "1s" : "0s" }}
    >
      <div className={
        variant === "primary"
          ? "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-white shadow-soft"
          : "flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-primary/30 bg-primary-soft text-primary"
      }>
        {icon}
      </div>
      <div>
        <h3 className="font-display text-2xl font-bold text-foreground">{title}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
      </div>
      <span className={
        variant === "primary"
          ? "mt-2 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-all group-hover:gap-3 group-hover:bg-primary-dark"
          : "mt-2 inline-flex items-center gap-1.5 rounded-xl border-2 border-primary/30 bg-surface px-4 py-2.5 text-sm font-semibold text-primary transition-all group-hover:gap-3 group-hover:border-primary group-hover:bg-primary-soft"
      }>
        {cta} <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
