import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Mail, Lock } from "lucide-react";
import { BackButton } from "@/components/shared/BackButton";
import { FormField } from "@/components/ui/form-field";
import { PrimaryButton } from "@/components/ui/primary-button";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot Password — JobBoard" },
      { name: "description", content: "Reset your JobBoard password in a few clicks." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-8">
        <BackButton to="/login" />
        <div className="flex flex-1 items-center">
          <div className="w-full rounded-3xl border border-border bg-surface p-8 shadow-card">
            <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-3xl bg-primary-soft">
              <div className="relative">
                <Mail className="h-14 w-14 text-primary" strokeWidth={1.5} />
                <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white">
                  <Lock className="h-3.5 w-3.5" strokeWidth={3} />
                </div>
              </div>
            </div>
            <h1 className="text-center font-display text-2xl font-bold text-foreground">
              Forgot Password?
            </h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              No worries! Enter your email and we'll send you a link to reset your password.
            </p>

            {!sent ? (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); toast.success("Reset link sent! Check your inbox."); }} className="mt-6 space-y-4">
                <FormField
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  icon={<Mail className="h-4 w-4" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <PrimaryButton type="submit" fullWidth size="lg">
                  Send Reset Link
                </PrimaryButton>
              </form>
            ) : (
              <div className="mt-6 rounded-2xl border border-success/30 bg-success/5 p-4 text-center">
                <p className="text-sm font-semibold text-foreground">Check your inbox ✉️</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  We sent a reset link to <span className="font-semibold">{email}</span>
                </p>
              </div>
            )}

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
