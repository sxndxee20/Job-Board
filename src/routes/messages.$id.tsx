import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useApp } from "@/context/AppContext";
import { ChevronLeft, Send, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/messages/$id")({
  head: () => ({
    meta: [{ title: "Chat — JobBoard" }],
  }),
  component: ChatPage,
});

function ChatPage() {
  const { id } = Route.useParams();
  const { user, applications, jobs, getMessagesByApplicationId, sendMessage } = useApp();
  const navigate = useNavigate();
  const [draft, setDraft] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const application = applications.find(a => a.id === id);
  const job = jobs.find(j => j.id === application?.jobId);
  const messages = getMessagesByApplicationId(id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!application || !job) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Chat not found.</p>
      </div>
    );
  }

  const Layout = user?.role === "admin" ? AdminLayout : AppLayout;
  const isUserAdmin = user?.role === "admin";
  const chatPartnerName = isUserAdmin ? application.applicantName : job.company;

  const handleSend = () => {
    if (!draft.trim()) return;
    sendMessage(application.id, draft.trim());
    setDraft("");
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-80px)] flex-col bg-background animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Chat Header */}
        <header className="flex shrink-0 items-center gap-3 border-b border-border bg-surface/80 px-4 py-3 backdrop-blur-md">
          <Link to="/messages" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-hero text-white shadow-soft">
            {chatPartnerName[0]}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-base font-bold truncate">{chatPartnerName}</h2>
            <p className="text-xs text-primary font-semibold truncate">{job.title}</p>
          </div>
        </header>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <UserIcon className="h-8 w-8 text-primary/50" />
              </div>
              <p className="text-sm font-semibold">Start the conversation</p>
              <p className="text-xs">Say hello to {chatPartnerName}!</p>
            </div>
          )}
          {messages.map((msg, i) => {
            const isMe = msg.senderId === user?.id;
            const showTail = i === messages.length - 1 || messages[i + 1].senderId !== msg.senderId;
            
            return (
              <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                    isMe
                      ? "bg-gradient-primary text-white"
                      : "bg-surface border border-border text-foreground",
                    isMe && showTail ? "rounded-br-sm" : "",
                    !isMe && showTail ? "rounded-bl-sm" : ""
                  )}
                >
                  <p>{msg.text}</p>
                  <span className={cn(
                    "mt-1 block text-[9px] font-semibold uppercase tracking-wider opacity-70",
                    isMe ? "text-right" : "text-left"
                  )}>
                    {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="shrink-0 border-t border-border bg-surface p-4">
          <div className="flex items-end gap-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type a message..."
              className="max-h-32 min-h-12 flex-1 resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!draft.trim()}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-primary text-white shadow-glow transition-all hover:shadow-neon disabled:opacity-50 disabled:shadow-none"
            >
              <Send className="h-5 w-5 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
