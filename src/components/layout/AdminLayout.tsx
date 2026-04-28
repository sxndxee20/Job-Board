import type { ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Briefcase, Users, User } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";

const navItems: { to: "/admin" | "/admin/jobs/new" | "/admin/applications" | "/profile"; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/jobs/new", label: "Post Job", icon: Briefcase },
  { to: "/admin/applications", label: "Applications", icon: Users },
  { to: "/profile", label: "Profile", icon: User },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-background lg:flex">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border bg-surface lg:flex lg:flex-col">
        <div className="border-b border-border p-6">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-4">
          <Link to="/" className="text-xs text-muted-foreground hover:text-primary">
            ← Switch to Job Seeker
          </Link>
        </div>
      </aside>

      <div className="flex-1">
        <div className="mx-auto max-w-6xl pb-24 lg:pb-8">
          {children}
        </div>
      </div>

      {/* Bottom nav (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface/95 backdrop-blur lg:hidden">
        <div className="grid h-16 grid-cols-4 px-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 text-[11px] font-medium",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
