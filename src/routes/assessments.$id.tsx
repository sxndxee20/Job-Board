import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { ArrowLeft, Clock, CheckCircle, XCircle, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti"; // Using our custom animated confetti css if canvas-confetti is missing, but we'll stick to a simple custom one if needed. Let's just use CSS.

export const Route = createFileRoute("/assessments/$id")({
  head: () => ({
    meta: [{ title: "Assessment — JobBoard" }],
  }),
  component: AssessmentQuizPage,
});

const mockQuestions: Record<string, { title: string, questions: { q: string, options: string[], a: number }[] }> = {
  "react": {
    title: "React Development",
    questions: [
      { q: "Which hook is used for side effects in React?", options: ["useState", "useEffect", "useMemo", "useContext"], a: 1 },
      { q: "What does JSX stand for?", options: ["JavaScript XML", "Java Syntax Extension", "JSON X", "JavaScript X"], a: 0 },
      { q: "How do you pass data to a child component?", options: ["State", "Props", "Context", "Redux"], a: 1 }
    ]
  },
  "ui-design": {
    title: "UI/UX Design",
    questions: [
      { q: "What does UX stand for?", options: ["User Exchange", "Universal Experience", "User Experience", "Unified Experience"], a: 2 },
      { q: "Which is a common prototyping tool?", options: ["Figma", "VS Code", "Terminal", "Docker"], a: 0 }
    ]
  },
  "python": {
    title: "Python Programming",
    questions: [
      { q: "How do you define a function in Python?", options: ["function()", "def name():", "func name():", "define name():"], a: 1 }
    ]
  },
  "marketing": {
    title: "Growth Marketing",
    questions: [
      { q: "What does SEO stand for?", options: ["Search Engine Optimization", "Social Engagement Operations", "Sales Engagement Optimization", "Search Error Output"], a: 0 }
    ]
  }
};

function AssessmentQuizPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useApp();
  
  const assessment = mockQuestions[id];
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!assessment) return;
    if (isFinished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished, assessment]);

  if (!assessment) {
    return <div className="p-8 text-center">Assessment not found.</div>;
  }

  const handleSelect = (idx: number) => {
    setAnswers({ ...answers, [currentQ]: idx });
  };

  const handleNext = () => {
    if (currentQ < assessment.questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsFinished(true);
    let score = 0;
    assessment.questions.forEach((q, i) => {
      if (answers[i] === q.a) score++;
    });
    const passed = score >= Math.ceil(assessment.questions.length * 0.7); // 70% to pass
    
    if (passed) {
      // Fire confetti effect
      toast.success("Assessment passed! You earned a new badge.");
      const currentBadges = user?.badges || [];
      if (!currentBadges.includes(assessment.title)) {
         updateUser({ badges: [...currentBadges, assessment.title] });
      }
    } else {
      toast.error("Assessment failed. Try again later.");
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (isFinished) {
    let score = 0;
    assessment.questions.forEach((q, i) => {
      if (answers[i] === q.a) score++;
    });
    const passed = score >= Math.ceil(assessment.questions.length * 0.7);

    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        {passed && (
           <div className="absolute inset-0 pointer-events-none overflow-hidden">
               {Array.from({ length: 30 }).map((_, i) => (
                   <div key={i} className={`absolute w-3 h-3 rounded-full ${['bg-success','bg-primary','bg-accent'][i%3]} animate-confetti`} style={{left: `${Math.random()*100}%`, top: `-5%`, animationDelay: `${Math.random()*3}s`, animationDuration: `${2+Math.random()*2}s`}}></div>
               ))}
           </div>
        )}
        <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-8 text-center shadow-elevated animate-scale-in relative z-10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br shadow-glow" style={{ backgroundImage: passed ? 'linear-gradient(to bottom right, #22c55e, #16a34a)' : 'linear-gradient(to bottom right, #ef4444, #dc2626)' }}>
            {passed ? <CheckCircle className="h-10 w-10 text-white" /> : <XCircle className="h-10 w-10 text-white" />}
          </div>
          <h1 className="font-display text-2xl font-black">{passed ? "Badge Earned!" : "Keep Trying!"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You scored <span className="font-bold text-foreground">{score}</span> out of {assessment.questions.length}.
          </p>

          {!passed && (
            <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-left">
              <div className="flex items-center gap-2 text-primary mb-2">
                <GraduationCap className="h-5 w-5" />
                <h4 className="font-display font-bold">Recommended Upskilling</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                You missed a few concepts in {assessment.title}. Take our 5-minute interactive mini-course to refresh your knowledge and unlock a retake!
              </p>
              <button onClick={() => navigate({ to: `/upskill/$id`, params: { id } })} className="mt-4 w-full rounded-xl bg-primary/10 py-2.5 text-sm font-bold text-primary hover:bg-primary hover:text-white transition-colors">
                Start Mini-Course
              </button>
            </div>
          )}

          <div className="mt-8 space-y-3">
             <button onClick={() => navigate({ to: "/assessments" })} className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-glow hover:shadow-neon transition-all">
               Back to Assessments
             </button>
          </div>
        </div>
      </div>
    );
  }

  const q = assessment.questions[currentQ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border bg-surface px-5 py-4">
        <button onClick={() => navigate({ to: "/assessments" })} className="p-2 -ml-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="font-display font-bold text-sm">{assessment.title}</h2>
        <div className={cn("flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold", timeLeft < 60 ? "bg-danger/10 text-danger animate-pulse" : "bg-muted text-muted-foreground")}>
          <Clock className="h-3.5 w-3.5" />
          {formatTime(timeLeft)}
        </div>
      </header>

      <div className="flex-1 px-5 py-8 animate-slide-up">
        <div className="mx-auto max-w-lg">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Question {currentQ + 1} of {assessment.questions.length}</p>
            <h3 className="font-display text-xl font-bold text-foreground leading-snug">{q.q}</h3>
          </div>

          <div className="space-y-3">
            {q.options.map((opt, i) => {
              const isSelected = answers[currentQ] === i;
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all",
                    isSelected 
                      ? "border-primary bg-primary/5 shadow-sm" 
                      : "border-border bg-surface hover:border-primary/30"
                  )}
                >
                  <div className={cn("flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-bold", isSelected ? "border-primary bg-primary text-white" : "border-border text-muted-foreground")}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span className={cn("text-sm font-semibold", isSelected ? "text-foreground" : "text-muted-foreground")}>{opt}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-10 flex justify-end">
            <button
              onClick={handleNext}
              disabled={answers[currentQ] === undefined}
              className="rounded-xl bg-gradient-primary px-8 py-3 text-sm font-bold text-white shadow-glow hover:shadow-neon transition-all disabled:opacity-50 disabled:shadow-none"
            >
              {currentQ < assessment.questions.length - 1 ? "Next Question" : "Submit Assessment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
