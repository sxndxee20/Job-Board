import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { FormField } from "@/components/ui/form-field";
import { PrimaryButton } from "@/components/ui/primary-button";
import { useApp } from "@/context/AppContext";
import { Brain, MapPin, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { Map } from "@/components/ui/map";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding — JobBoard" },
      { name: "description", content: "Personalize your job seeking experience." },
    ],
  }),
  component: OnboardingPage,
});

const availableSkills = [
  "React", "TypeScript", "UI Design", "UX Research", "Figma", 
  "Node.js", "Python", "Marketing Strategy", "SEO", "Salesforce",
  "Product Management", "Data Analysis", "Project Management", "Agile",
  "Tailwind CSS", "Go", "Kubernetes", "AWS", "SQL", "Content Writing"
];

function OnboardingPage() {
  const navigate = useNavigate();
  const { updateUser } = useApp();
  const [step, setStep] = useState(1);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState<number | "">("");
  const [location, setLocation] = useState("");

  const handleToggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleNext = () => {
    if (step === 1) {
      if (selectedSkills.length < 5) return;
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      updateUser({
        skills: selectedSkills,
        experienceYears: Number(experience) || 0,
        location,
      });
      navigate({ to: "/home" });
    }
  };

  const firstSkill = selectedSkills[0] || "your top skill";

  return (
    <AuthLayout tagline="Let's personalize your profile.">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="font-display text-2xl font-bold text-foreground">Step {step} of 3</h1>
            <p className="text-sm text-muted-foreground">
              {step === 1 && "Pick at least 5 top skills"}
              {step === 2 && `How many years of experience in ${firstSkill}?`}
              {step === 3 && "Where are you located?"}
            </p>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 w-6 rounded-full transition-colors ${
                  s <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="min-h-[300px]">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex flex-wrap gap-2">
                {availableSkills.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      onClick={() => handleToggleSkill(skill)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-xs font-semibold transition-all",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground shadow-md scale-105"
                          : "border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      )}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
              <p className={cn(
                "text-[11px] font-medium transition-colors",
                selectedSkills.length >= 5 ? "text-success" : "text-muted-foreground"
              )}>
                {selectedSkills.length} of 5 minimum selected
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
               <FormField
                  label="Years of Experience"
                  type="number"
                  icon={<Briefcase className="h-4 w-4" />}
                  placeholder="e.g. 5"
                  min={0}
                  value={experience}
                  onChange={(e) => setExperience(e.target.value === "" ? "" : parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground italic">
                  We'll use this to match you with roles that fit your seniority in {firstSkill}.
                </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
               <FormField
                  label="Location"
                  icon={<MapPin className="h-4 w-4" />}
                  placeholder="e.g. San Francisco, CA or Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <div className="mt-4 h-48 w-full overflow-hidden rounded-2xl border border-border bg-muted/30 shadow-inner">
                  <Map 
                    options={{
                      center: [120.9842, 14.5995],
                      zoom: 11,
                      interactive: false
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Your location helps us find jobs in your time zone or nearby.
                </p>
            </div>
          )}
        </div>

        <PrimaryButton 
          onClick={handleNext} 
          fullWidth 
          size="lg"
          disabled={step === 1 && selectedSkills.length < 5}
        >
          {step === 3 ? "Finish Setup" : "Next Step"}
        </PrimaryButton>
      </div>
    </AuthLayout>
  );
}
