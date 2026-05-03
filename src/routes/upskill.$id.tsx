import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, PlayCircle, CheckCircle, GraduationCap, Trophy } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/upskill/$id")({
  head: () => ({
    meta: [{ title: "Gamified Upskilling — JobBoard" }],
  }),
  component: UpskillCoursePage,
});

const mockCourses: Record<string, { title: string, modules: { name: string, duration: string }[] }> = {
  "react": { title: "Mastering React Hooks", modules: [{ name: "The useEffect Lifecycle", duration: "2 min" }, { name: "When to useMemo", duration: "3 min" }] },
  "ui-design": { title: "UI/UX Foundations", modules: [{ name: "Color Theory Basics", duration: "2 min" }, { name: "Prototyping in Figma", duration: "4 min" }] },
  "python": { title: "Python Essentials", modules: [{ name: "List Comprehensions", duration: "3 min" }] },
  "marketing": { title: "SEO Fundamentals", modules: [{ name: "Keyword Research 101", duration: "3 min" }] }
};

function UpskillCoursePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const course = mockCourses[id] || { title: "General Refresh", modules: [{ name: "Quick Review", duration: "5 min" }] };
  
  const [completedModules, setCompletedModules] = useState<Set<number>>(new Set());
  const [activeModule, setActiveModule] = useState(0);

  const handleCompleteModule = (index: number) => {
    setCompletedModules(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
    if (index < course.modules.length - 1) {
      setActiveModule(index + 1);
    } else {
      toast.success("Course completed! You can now retake the assessment.");
    }
  };

  const isAllComplete = completedModules.size === course.modules.length;

  return (
    <AppLayout>
      <header className="px-5 pt-7 pb-3 animate-slide-down">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate({ to: "/assessments" })} className="flex h-8 w-8 items-center justify-center rounded-full bg-surface border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Upskilling Path</span>
        </div>
        <h1 className="font-display text-2xl font-black text-foreground">{course.title}</h1>
      </header>

      <div className="px-5 mt-2 space-y-6 animate-slide-up">
        {/* Progress Card */}
        <div className="rounded-3xl bg-gradient-hero p-6 text-white shadow-elevated relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-mesh opacity-40 animate-mesh" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-accent" />
                <h3 className="font-display text-lg font-bold">Course Progress</h3>
              </div>
              <span className="text-sm font-bold">{Math.round((completedModules.size / course.modules.length) * 100)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
              <div 
                className="h-full bg-accent transition-all duration-1000 ease-out" 
                style={{ width: `${(completedModules.size / course.modules.length) * 100}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-4">
          <h3 className="font-display text-lg font-bold text-foreground">Modules</h3>
          {course.modules.map((mod, i) => {
            const isCompleted = completedModules.has(i);
            const isActive = activeModule === i;
            
            return (
              <div 
                key={i} 
                className={cn(
                  "relative overflow-hidden rounded-2xl border p-5 transition-all",
                  isCompleted ? "border-success/30 bg-success/5" : isActive ? "border-primary bg-primary/5 shadow-soft" : "border-border bg-surface opacity-70"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", isCompleted ? "bg-success text-white" : isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : <PlayCircle className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <h4 className={cn("font-display text-base font-bold", isCompleted ? "text-success" : isActive ? "text-primary" : "text-foreground")}>{mod.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">Interactive Lesson • {mod.duration}</p>
                    
                    {isActive && !isCompleted && (
                      <div className="mt-4 pt-4 border-t border-primary/10">
                        <p className="text-sm text-foreground mb-4">Watch the short video or complete the interactive reading to proceed.</p>
                        <div className="aspect-video w-full rounded-xl bg-black/5 flex items-center justify-center border border-border">
                          <PlayCircle className="h-12 w-12 text-primary/40" />
                        </div>
                        <button 
                          onClick={() => handleCompleteModule(i)} 
                          className="mt-4 w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-white shadow-glow hover:shadow-neon transition-all"
                        >
                          Mark as Completed
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {isAllComplete && (
          <div className="rounded-2xl border-2 border-primary bg-primary/5 p-6 text-center animate-in zoom-in duration-500">
            <Trophy className="mx-auto h-12 w-12 text-accent mb-3" />
            <h3 className="font-display text-xl font-bold text-foreground">You're Ready!</h3>
            <p className="mt-2 text-sm text-muted-foreground mb-5">
              Great job completing the upskilling path. You've unlocked the ability to retake the assessment.
            </p>
            <button 
              onClick={() => navigate({ to: `/assessments/$id`, params: { id } })} 
              className="w-full rounded-xl bg-gradient-primary py-3.5 text-sm font-bold text-white shadow-glow hover:shadow-neon transition-all"
            >
              Retake Assessment Now
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
