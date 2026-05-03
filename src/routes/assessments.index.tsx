import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";
import { Award, Brain, Code, CheckCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assessments/")({
  head: () => ({
    meta: [{ title: "Skill Assessments — JobBoard" }],
  }),
  component: AssessmentsPage,
});

const availableAssessments = [
  { id: "react", title: "React Development", icon: <Code className="h-5 w-5" />, questions: 10, time: "10 mins" },
  { id: "ui-design", title: "UI/UX Design", icon: <Brain className="h-5 w-5" />, questions: 8, time: "8 mins" },
  { id: "python", title: "Python Programming", icon: <Code className="h-5 w-5" />, questions: 15, time: "15 mins" },
  { id: "marketing", title: "Growth Marketing", icon: <Brain className="h-5 w-5" />, questions: 10, time: "10 mins" },
];

function AssessmentsPage() {
  const { user } = useApp();
  const earnedBadges = user?.badges || [];

  return (
    <AppLayout>
      <header className="px-5 pt-7 pb-3 animate-slide-down">
        <h1 className="font-display text-2xl font-black text-foreground">Skill Assessments</h1>
        <p className="text-sm text-muted-foreground mt-1">Take short quizzes to earn badges and stand out to employers.</p>
      </header>

      <div className="px-5 mt-4 space-y-4 animate-slide-up">
        {earnedBadges.length > 0 && (
          <div className="rounded-2xl bg-gradient-hero p-5 text-white shadow-elevated relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-mesh opacity-30 animate-mesh" />
             <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="h-5 w-5 text-accent" />
                  <h2 className="font-display text-lg font-bold">Your Badges</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {earnedBadges.map(badge => (
                    <div key={badge} className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur shadow-sm">
                      <CheckCircle className="h-3.5 w-3.5 text-success" />
                      {badge}
                    </div>
                  ))}
                </div>
             </div>
          </div>
        )}

        <h3 className="font-display text-lg font-bold text-foreground mt-6 mb-2">Available Tests</h3>
        
        <div className="grid gap-3 sm:grid-cols-2">
          {availableAssessments.map((a) => {
            const isCompleted = earnedBadges.includes(a.title);

            return (
              <div
                key={a.id}
                className={cn(
                  "relative overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-card transition-all",
                  isCompleted ? "opacity-80" : "hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-elevated"
                )}
              >
                {isCompleted && (
                  <div className="absolute top-0 right-0 rounded-bl-xl bg-success/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-success">
                    Completed
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary shadow-inner">
                    {a.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-display text-base font-bold text-foreground">{a.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.questions} questions • {a.time}</p>
                    
                    {!isCompleted ? (
                      <Link to="/assessments/$id" params={{ id: a.id }} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white">
                        Start Assessment <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <div className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-success/10 px-4 py-2.5 text-sm font-bold text-success cursor-default">
                        <CheckCircle className="h-4 w-4" /> Badge Earned
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
