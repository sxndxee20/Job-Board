import type { ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Briefcase, Users, MessageCircle, BarChart3, Presentation } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";

const navItems: { to: "/admin" | "/admin/jobs/new" | "/admin/applications" | "/messages" | "/admin/analytics" | "/admin/profile"; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/applications", label: "Pipeline", icon: Users },
  { to: "/messages", label: "Messages", icon: MessageCircle },
  { to: "/admin/jobs/new", label: "Post Job", icon: Briefcase },
  { to: "/admin/profile", label: "Admin Profile", icon: Presentation },
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
        <div className="mx-auto max-w-6xl pb-32 lg:pb-8">
          {children}
        </div>
      </div>

      {/* Bottom nav (mobile) */}
      <nav className="fixed bottom-3 left-0 right-0 z-40 px-3 lg:hidden">
        <div className="mx-auto max-w-lg rounded-full border border-white/20 bg-gradient-to-r from-primary via-violet-500 to-indigo-500 p-1.5 text-white shadow-elevated backdrop-blur">
          <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.28),transparent_55%)]" />
          <div className="relative grid h-14 grid-cols-6 overflow-x-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "relative mx-0.5 flex items-center justify-center rounded-full transition-all duration-300",
                  active ? "bg-white text-primary shadow-lg shadow-indigo-900/20" : "text-white/80 hover:text-white"
                )}
                aria-label={item.label}
                title={item.label}
              >
                <Icon className={cn("h-5 w-5 transition-transform duration-300", active && "scale-110")} />
                {active && <span className="absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-primary" />}
              </Link>
            );
          })}
          </div>
        </div>
      </nav>
    </div>
  );
}
