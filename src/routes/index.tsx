import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, User, Shield, Sparkles, Zap, TrendingUp } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

export const Route = createFileRoute("/")(    {
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
      {/* Animated mesh background */}
      <div className="absolute inset-0 bg-gradient-mesh animate-mesh" />
      <div className="absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,oklch(0.55_0.24_280_/_0.06)_1px,transparent_0)] [background-size:40px_40px]" />

      {/* Floating orbs */}
      <div className="absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-primary/5 blur-3xl animate-breathe" />
      <div className="absolute right-[15%] top-[60%] h-48 w-48 rounded-full bg-accent/8 blur-3xl animate-breathe" style={{ animationDelay: "3s" }} />
      <div className="absolute left-[50%] top-[10%] h-32 w-32 rounded-full bg-success/6 blur-2xl animate-breathe" style={{ animationDelay: "5s" }} />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
        {/* Header */}
        <header className="flex items-center justify-between animate-slide-down">
          <Logo />
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary sm:inline-flex">
              Log In
            </Link>
            <Link to="/signup" className="hidden items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:bg-primary-dark hover:shadow-glow sm:inline-flex">
              Get Started <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </header>

        {/* Hero */}
        <main className="flex flex-1 flex-col items-center justify-center py-12 text-center">
          {/* Badge */}
          <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-xs font-semibold text-primary backdrop-blur-sm animate-scale-in">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            New jobs added every hour
            <Sparkles className="h-3 w-3 text-accent" />
          </span>

          {/* Headline */}
          <h1 className="font-display text-5xl font-black leading-[1.02] tracking-tight text-foreground sm:text-6xl lg:text-7xl animate-slide-up">
            Find the job that fits<br />
            <span className="text-gradient-hero">
              your future.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg animate-slide-up" style={{ animationDelay: "100ms" }}>
            Connecting talent with opportunity — fast, simple, and free.
            <br className="hidden sm:inline" />
            Trusted by <span className="font-semibold text-foreground">10,000+</span> professionals worldwide.
          </p>

          {/* Stats strip */}
          <div className="mt-10 flex items-center gap-6 sm:gap-10 animate-slide-up" style={{ animationDelay: "200ms" }}>
            {[
              { value: "12k+", label: "Active Jobs", icon: Zap },
              { value: "85%", label: "Match Rate", icon: TrendingUp },
              { value: "4.9★", label: "App Rating", icon: Sparkles },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="font-display text-2xl font-black text-gradient sm:text-3xl">{s.value}</p>
                <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Role cards */}
          <div className="mt-14 grid w-full max-w-3xl gap-5 sm:grid-cols-2 stagger-children">
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

          <p className="mt-10 text-sm text-muted-foreground animate-slide-up" style={{ animationDelay: "400ms" }}>
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
      className="group relative flex flex-col items-start gap-5 overflow-hidden rounded-3xl border bg-surface p-8 text-left transition-all duration-500 hover:-translate-y-1.5 border-glow border-glow-hover animate-float"
      style={{ animationDelay: variant === "outline" ? "1.2s" : "0s" }}
    >
      {/* Shimmer */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-shimmer opacity-0 transition-opacity duration-500 group-hover:opacity-100 animate-shimmer" />
      </div>
      {/* Subtle glow on hover */}
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative">
        <div className={
          variant === "primary"
            ? "flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary text-white shadow-glow"
            : "flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-primary/20 bg-primary-soft text-primary"
        }>
          {icon}
        </div>
      </div>
      <div className="relative">
        <h3 className="font-display text-2xl font-black text-foreground">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
      </div>
      <span className={
        variant === "primary"
          ? "relative mt-auto inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-soft transition-all duration-300 group-hover:gap-3 group-hover:bg-primary-dark group-hover:shadow-glow"
          : "relative mt-auto inline-flex items-center gap-2 rounded-xl border-2 border-primary/20 bg-surface px-5 py-3 text-sm font-bold text-primary transition-all duration-300 group-hover:gap-3 group-hover:border-primary group-hover:bg-primary-soft"
      }>
        {cta} <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
