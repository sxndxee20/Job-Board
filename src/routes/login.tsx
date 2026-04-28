import { useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { FormField, PasswordInput } from "@/components/ui/form-field";
import { PrimaryButton } from "@/components/ui/primary-button";
import { RoleToggle } from "@/components/ui/role-toggle";
import { useApp, type Role } from "@/context/AppContext";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log In — JobBoard" },
      { name: "description", content: "Log in to your JobBoard account to continue your job search or manage listings." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [role, setRole] = useState<Role>("seeker");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!email.includes("@")) errs.email = "Enter a valid email";
    if (password.length < 6) errs.password = "Password must be at least 6 characters";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    setTimeout(() => {
      login(email, password, role);
      navigate({ to: role === "admin" ? "/admin" : "/home" });
    }, 600);
  }

  return (
    <AuthLayout>
      <h1 className="text-center font-display text-3xl font-bold text-foreground lg:text-left">Welcome Back!</h1>
      <p className="mt-1.5 text-center text-sm text-muted-foreground lg:text-left">Login to your account</p>

      <div className="mt-8">
        <RoleToggle value={role} onChange={setRole} />
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <FormField
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          icon={<Mail className="h-4 w-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
        />
        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="current-password"
        />

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:underline">
            Forgot Password?
          </Link>
        </div>

        <PrimaryButton type="submit" fullWidth size="lg" loading={loading}>
          {loading ? "Signing in..." : "Login"}
        </PrimaryButton>
      </form>

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/signup" className="font-semibold text-primary hover:underline">
          Sign Up
        </Link>
      </p>
    </AuthLayout>
  );
}
