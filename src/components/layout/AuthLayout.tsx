import type { ReactNode } from "react";
import { Logo } from "@/components/shared/Logo";

export function AuthLayout({
  children,
  tagline = "Your next opportunity is one click away.",
}: {
  children: ReactNode;
  tagline?: string;
}) {
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-2">
      {/* Decorative panel */}
      <div className="relative hidden overflow-hidden bg-gradient-hero lg:block">
        <div className="absolute inset-0 bg-gradient-mesh opacity-50 animate-mesh" />
        <div className="absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.12)_1px,transparent_0)] [background-size:28px_28px] opacity-40" />

        {/* Floating decorative orbs */}
        <div className="absolute left-[20%] top-[30%] h-40 w-40 rounded-full bg-white/5 blur-2xl animate-breathe" />
        <div className="absolute right-[20%] bottom-[25%] h-32 w-32 rounded-full bg-accent/10 blur-2xl animate-breathe" style={{ animationDelay: "3s" }} />

        <div className="relative flex h-full flex-col justify-between p-12">
          <Logo variant="light" />
          <div className="space-y-8">
            <div className="animate-float space-y-4">
              <div className="w-fit rounded-2xl bg-white/8 p-5 backdrop-blur-lg ring-1 ring-white/15 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-gradient-accent shadow-soft" />
                  <div>
                    <div className="h-3 w-36 rounded-full bg-white/35" />
                    <div className="mt-2 h-2 w-24 rounded-full bg-white/20" />
                  </div>
                </div>
              </div>
              <div className="ml-10 w-fit rounded-2xl bg-white/12 p-5 backdrop-blur-lg ring-1 ring-white/15 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-gradient-success shadow-soft" />
                  <div>
                    <div className="h-3 w-44 rounded-full bg-white/35" />
                    <div className="mt-2 h-2 w-28 rounded-full bg-white/20" />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="font-display text-4xl font-black leading-tight text-white tracking-tight">
                {tagline}
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">
                Join thousands of professionals finding meaningful work every day on JobBoard.
              </p>
            </div>
          </div>
          <p className="text-xs text-white/40">© 2026 JobBoard. Designed for HCI 102.</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="relative flex min-h-screen items-center justify-center px-5 py-8 sm:px-6 sm:py-10 lg:px-12 overflow-hidden">
        {/* Subtle bg pattern */}
        <div className="absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,oklch(0.55_0.24_280_/_0.03)_1px,transparent_0)] [background-size:32px_32px]" />
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/3 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-accent/3 blur-3xl" />

        <div className="relative w-full max-w-md animate-scale-in">
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
