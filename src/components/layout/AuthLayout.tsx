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
        <div className="absolute inset-0 bg-gradient-mesh opacity-60 animate-mesh" />
        <div className="absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] [background-size:24px_24px] opacity-40" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Logo variant="light" />
          <div className="space-y-6">
            <div className="animate-float space-y-3">
              <div className="w-fit rounded-2xl bg-white/10 p-4 backdrop-blur-md ring-1 ring-white/20">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-accent" />
                  <div>
                    <div className="h-3 w-32 rounded bg-white/40" />
                    <div className="mt-1.5 h-2 w-20 rounded bg-white/25" />
                  </div>
                </div>
              </div>
              <div className="ml-8 w-fit rounded-2xl bg-white/15 p-4 backdrop-blur-md ring-1 ring-white/20">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-400" />
                  <div>
                    <div className="h-3 w-40 rounded bg-white/40" />
                    <div className="mt-1.5 h-2 w-24 rounded bg-white/25" />
                  </div>
                </div>
              </div>
            </div>
            <h2 className="font-display text-4xl font-bold leading-tight text-white">
              {tagline}
            </h2>
            <p className="max-w-sm text-white/70">
              Join thousands of professionals finding meaningful work every day on JobBoard.
            </p>
          </div>
          <p className="text-xs text-white/50">© 2026 JobBoard. Designed for HCI 102.</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-6 sm:py-10 lg:px-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
