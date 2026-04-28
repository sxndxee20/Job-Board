import { Link, useLocation } from "@tanstack/react-router";
import { Home, Briefcase, FileText, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs: { to: "/home" | "/jobs" | "/applications" | "/profile"; label: string; icon: typeof Home }[] = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/applications", label: "Applications", icon: FileText },
  { to: "/profile", label: "Profile", icon: User },
];

export function BottomNavBar() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface/95 backdrop-blur-md">
      <div className="mx-auto grid h-16 max-w-lg grid-cols-4 px-2 sm:max-w-md">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = pathname === t.to || (t.to !== "/home" && pathname.startsWith(t.to));
          return (
            <Link
              key={t.to}
              to={t.to}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {active && (
                <span className="absolute top-1.5 h-1 w-1 rounded-full bg-primary" />
              )}
              <Icon className={cn("h-5 w-5", active && "stroke-[2.4]")} />
              <span>{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
