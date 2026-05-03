import type { ComponentType } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { BrandApplicationsIcon, BrandHomeIcon, BrandJobsIcon, BrandProfileIcon, BrandMessagesIcon } from "./BrandIcons";

const tabs: { to: "/home" | "/jobs" | "/applications" | "/messages" | "/profile"; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { to: "/home", label: "Home", icon: BrandHomeIcon },
  { to: "/jobs", label: "Jobs", icon: BrandJobsIcon },
  { to: "/applications", label: "Applications", icon: BrandApplicationsIcon },
  { to: "/messages", label: "Messages", icon: BrandMessagesIcon },
  { to: "/profile", label: "Profile", icon: BrandProfileIcon },
];

export function BottomNavBar() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-4 left-0 right-0 z-40 px-4">
      <div className="mx-auto max-w-lg overflow-hidden rounded-full bg-gradient-to-r from-primary via-violet-500 to-indigo-500 p-[2px] shadow-neon sm:max-w-md">
        <div className="relative rounded-full bg-gradient-to-r from-primary/95 via-violet-500/95 to-indigo-500/95 px-2 py-1.5 backdrop-blur-xl">
          {/* Glass shine */}
          <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.25),transparent_60%)]" />
          <div className="relative grid h-14 grid-cols-5">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = pathname === t.to || (t.to !== "/home" && pathname.startsWith(t.to));
              return (
                <Link
                  key={t.to}
                  to={t.to}
                  className={cn(
                    "relative mx-0.5 flex flex-col items-center justify-center gap-0.5 rounded-full transition-all duration-400",
                    active ? "bg-white text-primary shadow-lg shadow-indigo-900/25 scale-[1.02]" : "text-white/75 hover:text-white hover:bg-white/10"
                  )}
                  aria-label={t.label}
                  title={t.label}
                >
                  <Icon className={cn("h-5 w-5 transition-all duration-400", active ? "scale-110 stroke-[2.5]" : "scale-100")} />
                  {active && (
                    <span className="text-[8px] font-bold uppercase tracking-wider text-primary">{t.label}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
