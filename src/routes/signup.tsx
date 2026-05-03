import { useState, useMemo } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Mail, User } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { FormField, PasswordInput } from "@/components/ui/form-field";
import { PrimaryButton } from "@/components/ui/primary-button";
import { RoleToggle } from "@/components/ui/role-toggle";
import { useApp, type Role } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up — JobBoard" },
      { name: "description", content: "Create your free JobBoard account in seconds." },
    ],
  }),
  component: SignUpPage,
});

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s++;
  return s; // 0..3
}

function SignUpPage() {
  const navigate = useNavigate();
  const { signup } = useApp();
  const [role, setRole] = useState<Role>("seeker");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const score = useMemo(() => strength(pw), [pw]);
  const strengthLabel = ["Weak", "Weak", "Medium", "Strong"][score];
  const strengthColor = ["bg-danger", "bg-danger", "bg-warning", "bg-success"][score];
  const strengthWidth = ["w-1/4", "w-1/3", "w-2/3", "w-full"][score];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (name.trim().length < 2) errs.name = "Enter your full name";
    if (!email.includes("@")) errs.email = "Enter a valid email";
    if (pw.length < 6) errs.pw = "Password must be at least 6 characters";
    if (pw !== pw2) errs.pw2 = "Passwords do not match";
    if (!agree) errs.agree = "You must accept the terms";
    setErrors(errs);
    if (Object.keys(errs).length) {
      toast.error("Please fix the errors before continuing");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      signup({ name, email, password: pw, role });
      toast.success("Account created! Welcome aboard 🎉");
      navigate({ to: role === "admin" ? "/admin" : "/onboarding" });
    }, 600);
  }

  return (
    <AuthLayout tagline="Build a career you love.">
      <h1 className="text-center font-display text-3xl font-bold text-foreground lg:text-left">Sign Up</h1>
      <p className="mt-1.5 text-center text-sm text-muted-foreground lg:text-left">Create your account</p>

      <div className="mt-8">
        <RoleToggle value={role} onChange={setRole} />
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <FormField
          label="Full Name"
          icon={<User className="h-4 w-4" />}
          placeholder="Jane Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
        <FormField
          label="Email Address"
          type="email"
          icon={<Mail className="h-4 w-4" />}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <div>
          <PasswordInput
            label="Password"
            placeholder="Create a password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            error={errors.pw}
          />
          {pw && (
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div className={cn("h-full transition-all", strengthColor, strengthWidth)} />
              </div>
              <span className="text-[11px] font-semibold text-muted-foreground">{strengthLabel}</span>
            </div>
          )}
        </div>
        <PasswordInput
          label="Confirm Password"
          placeholder="Re-enter password"
          value={pw2}
          onChange={(e) => setPw2(e.target.value)}
          error={errors.pw2}
        />

        <label className="flex items-start gap-2.5">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-border text-primary accent-[var(--color-primary)]"
          />
          <span className="text-xs text-muted-foreground">
            I agree to the{" "}
            <a className="font-semibold text-primary hover:underline">Terms & Conditions</a> and{" "}
            <a className="font-semibold text-primary hover:underline">Privacy Policy</a>
          </span>
        </label>
        {errors.agree && <p className="-mt-2 text-xs font-medium text-danger">{errors.agree}</p>}

        <PrimaryButton type="submit" fullWidth size="lg" loading={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </PrimaryButton>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}
