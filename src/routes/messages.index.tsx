import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useApp } from "@/context/AppContext";
import { MessageCircle, ChevronRight, Search } from "lucide-react";
import { timeAgo } from "@/data/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/messages/")({
  head: () => ({
    meta: [{ title: "Messages — JobBoard" }],
  }),
  component: MessagesPage,
});

function MessagesPage() {
  const { user, applications, jobs, getMessagesByApplicationId } = useApp();

  // For seeker, show their applications that are in 'Interview', 'Offered', etc.
  // For admin, show all applications.
  const activeChats = applications.filter((app) => {
    if (user?.role === "seeker" && app.userId !== user.id) return false;
    // only show chats for applications that have messages or are in Interview stage
    const hasMessages = getMessagesByApplicationId(app.id).length > 0;
    const isInterviewing = app.status === "Interview" || app.status === "Offered";
    return hasMessages || isInterviewing;
  });

  const Layout = user?.role === "admin" ? AdminLayout : AppLayout;

  return (
    <Layout>
      <header className="px-5 pt-7 pb-3 animate-slide-down">
        <h1 className="font-display text-2xl font-black text-foreground">Messages</h1>
        <p className="text-sm text-muted-foreground mt-1">Chat directly with {user?.role === "admin" ? "candidates" : "recruiters"}.</p>
      </header>

      <div className="px-5 mt-2 animate-slide-up">
        {activeChats.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-border bg-surface p-12 text-center shadow-card border-glow">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/5">
              <MessageCircle className="h-7 w-7 text-primary/40" />
            </div>
            <p className="font-display text-base font-bold text-foreground">No active chats</p>
            <p className="mt-1.5 text-xs text-muted-foreground">Conversations will appear here when an application reaches the Interview stage.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeChats.map((app) => {
              const job = jobs.find((j) => j.id === app.jobId);
              const msgs = getMessagesByApplicationId(app.id);
              const lastMsg = msgs[msgs.length - 1];

              return (
                <Link
                  key={app.id}
                  to="/messages/$id"
                  params={{ id: app.id }}
                  className="block rounded-2xl border border-border bg-surface p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-elevated"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-hero text-white font-bold shadow-soft">
                      {user?.role === "admin" ? app.applicantName[0] : job?.company[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-display text-base font-bold truncate">
                          {user?.role === "admin" ? app.applicantName : job?.company}
                        </p>
                        {lastMsg && <span className="text-[10px] text-muted-foreground shrink-0">{timeAgo(lastMsg.sentAt)}</span>}
                      </div>
                      <p className="text-xs font-semibold text-primary truncate mb-1">{job?.title}</p>
                      <p className={cn("text-sm truncate", lastMsg ? "text-foreground" : "text-muted-foreground italic")}>
                        {lastMsg ? lastMsg.text : "Start a conversation..."}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
