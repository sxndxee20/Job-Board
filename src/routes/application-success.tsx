import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/application-success")({
  head: () => ({
    meta: [{ title: "Application Submitted — JobBoard" }],
  }),
  component: ApplicationSuccessPage,
});

function ApplicationSuccessPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
      {/* Floating orbs */}
      <div className="absolute left-[15%] top-[25%] h-48 w-48 rounded-full bg-primary/5 blur-3xl animate-breathe" />
      <div className="absolute right-[10%] bottom-[30%] h-40 w-40 rounded-full bg-success/8 blur-3xl animate-breathe" style={{ animationDelay: "2s" }} />
      <div className="absolute left-[50%] bottom-[15%] h-32 w-32 rounded-full bg-accent/6 blur-2xl animate-breathe" style={{ animationDelay: "4s" }} />

      {/* Confetti */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 24 }).map((_, i) => {
          const colors = ["bg-primary", "bg-accent", "bg-success", "bg-warning", "bg-violet-400", "bg-sky-400"];
          const tx = (Math.random() - 0.5) * 700;
          const ty = (Math.random() - 0.5) * 700;
          const size = Math.random() > 0.5 ? "h-2 w-2" : "h-1.5 w-3";
          return (
            <span
              key={i}
              className={`absolute left-1/2 top-1/2 rounded-sm ${colors[i % colors.length]} ${size}`}
              style={{
                ["--tx" as string]: `${tx}px`,
                ["--ty" as string]: `${ty}px`,
                animation: `confetti-burst 1.6s ease-out ${i * 0.03}s forwards`,
              }}
            />
          );
        })}
      </div>

      <div className="relative w-full max-w-md text-center animate-scale-in">
        {/* Clipboard illustration */}
        <div className="relative mx-auto mb-8 h-36 w-36">
          <div className="absolute inset-x-4 top-4 bottom-0 rounded-2xl bg-primary-soft ring-1 ring-primary/15 shadow-soft" />
          <div className="absolute left-1/2 top-0 h-6 w-14 -translate-x-1/2 rounded-lg bg-gradient-primary shadow-glow" />
          <div className="absolute inset-x-8 top-12 space-y-2.5">
            <div className="h-2.5 w-full rounded-full bg-primary/15" />
            <div className="h-2.5 w-3/4 rounded-full bg-primary/10" />
            <div className="h-2.5 w-2/3 rounded-full bg-primary/10" />
          </div>
          {/* Green check badge */}
          <div className="absolute -bottom-2 -right-2 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-success text-white shadow-elevated ring-4 ring-background animate-pulse-glow">
            <svg viewBox="0 0 52 52" className="h-8 w-8">
              <path d="M14 27 L23 36 L40 18" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="50" strokeDashoffset="50" style={{ animation: "draw-check 0.6s 0.3s ease forwards" }} />
            </svg>
          </div>
        </div>

        <h1 className="font-display text-4xl font-black text-foreground tracking-tight">
          Application <span className="text-gradient">Submitted!</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Thank you for applying. We have received your application and will review it shortly.
        </p>

        <div className="mt-8 rounded-2xl border bg-surface p-6 text-left shadow-card border-glow animate-slide-up" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <p className="font-display text-sm font-black text-foreground">What's Next?</p>
          </div>
          <ul className="mt-4 space-y-3">
            {[
              "We will review your application",
              "If selected, our team will contact you",
              "Check your email for updates",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-success text-white shadow-sm">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 space-y-3 animate-slide-up" style={{ animationDelay: "400ms" }}>
          <Link to="/applications" className="block">
            <button className="group h-13 w-full rounded-xl bg-gradient-primary text-sm font-bold text-primary-foreground shadow-glow transition-all duration-300 hover:shadow-neon hover:scale-[1.01] flex items-center justify-center gap-2">
              View My Applications <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </Link>
          <Link to="/home" className="block">
            <button className="h-13 w-full rounded-xl border-2 border-primary/15 bg-surface text-sm font-bold text-primary transition-all duration-300 hover:bg-primary-soft hover:border-primary/30">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
