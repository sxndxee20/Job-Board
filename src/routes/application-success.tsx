import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

export const Route = createFileRoute("/application-success")({
  head: () => ({
    meta: [{ title: "Application Submitted — JobBoard" }],
  }),
  component: ApplicationSuccessPage,
});

function ApplicationSuccessPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
      {/* Confetti */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 18 }).map((_, i) => {
          const colors = ["bg-primary", "bg-accent", "bg-success", "bg-warning"];
          const tx = (Math.random() - 0.5) * 600;
          const ty = (Math.random() - 0.5) * 600;
          return (
            <span
              key={i}
              className={`absolute left-1/2 top-1/2 h-2 w-2 rounded-sm ${colors[i % colors.length]}`}
              style={{
                ["--tx" as string]: `${tx}px`,
                ["--ty" as string]: `${ty}px`,
                animation: `confetti-burst 1.4s ease-out ${i * 0.04}s forwards`,
              }}
            />
          );
        })}
      </div>

      <div className="relative w-full max-w-md text-center">
        <div className="relative mx-auto mb-6 h-32 w-32">
          {/* Clipboard */}
          <div className="absolute inset-x-4 top-3 bottom-0 rounded-2xl bg-primary-soft ring-1 ring-primary/20" />
          <div className="absolute left-1/2 top-0 h-5 w-12 -translate-x-1/2 rounded-md bg-primary-dark/80" />
          <div className="absolute inset-x-7 top-9 space-y-2">
            <div className="h-2 w-full rounded-full bg-primary/20" />
            <div className="h-2 w-3/4 rounded-full bg-primary/15" />
            <div className="h-2 w-2/3 rounded-full bg-primary/15" />
          </div>
          {/* Green check badge */}
          <div className="absolute -bottom-1 -right-1 flex h-12 w-12 items-center justify-center rounded-full bg-success text-white shadow-elevated ring-4 ring-background">
            <svg viewBox="0 0 52 52" className="h-7 w-7">
              <path d="M14 27 L23 36 L40 18" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="50" strokeDashoffset="50" style={{ animation: "draw-check 0.5s 0.2s ease forwards" }} />
            </svg>
          </div>
        </div>

        <h1 className="font-display text-3xl font-bold text-foreground">Application Submitted!</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you for applying. We have received your application and will review it shortly.
        </p>

        <div className="mt-6 rounded-2xl border border-border bg-surface p-5 text-left shadow-card">
          <p className="font-display text-sm font-bold text-foreground">What's Next?</p>
          <ul className="mt-3 space-y-2.5">
            {[
              "We will review your application",
              "If selected, our team will contact you",
              "Check your email for updates",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 space-y-3">
          <Link to="/applications" className="block">
            <button className="h-12 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:bg-primary-dark">
              View My Applications
            </button>
          </Link>
          <Link to="/home" className="block">
            <button className="h-12 w-full rounded-xl border-2 border-primary/20 bg-surface text-sm font-semibold text-primary transition-colors hover:bg-primary-soft">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
