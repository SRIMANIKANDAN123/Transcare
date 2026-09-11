import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, LockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { requestPasswordReset } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — TransCare" },
      {
        name: "description",
        content: "Log in to TransCare to find inclusive healthcare, benefits and support near you.",
      },
      { property: "og:title", content: "Log in — TransCare" },
      { property: "og:description", content: "Access your TransCare account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn, isAuthenticated, ready } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [forgot, setForgot] = useState(false);

  useEffect(() => {
    if (ready && isAuthenticated) navigate({ to: "/", replace: true });
  }, [ready, isAuthenticated, navigate]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      await signIn({ email, password });
      toast.success("Welcome back to TransCare");
      navigate({ to: "/", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not log you in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await requestPasswordReset(email);
      toast.success("Password reset instructions sent", {
        description: `If ${email} has an account, you will receive a reset link.`,
      });
      setForgot(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset instructions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shell flex min-h-[80vh] items-center justify-center py-14">
      <div className="card-surface w-full max-w-md p-7 sm:p-9">
        <span className="grid size-11 place-items-center rounded-2xl bg-teal-soft text-primary">
          <LockKeyhole className="size-5" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold sm:text-3xl">
          {forgot ? "Reset your password" : "Log in to TransCare"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {forgot
            ? "Enter your email and we will send reset instructions."
            : "Continue finding inclusive healthcare, benefits and support."}
        </p>

        <form onSubmit={forgot ? sendReset : submit} className="mt-7 space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          {!forgot ? (
            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
              />
            </div>
          ) : null}

          {error ? (
            <p role="alert" className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="h-12 w-full rounded-full text-base" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
            {forgot ? "Send reset link" : "Log in"}
          </Button>
        </form>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
          <button
            type="button"
            onClick={() => {
              setForgot((v) => !v);
              setError(null);
            }}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {forgot ? "Back to login" : "Forgot password?"}
          </button>
          <p className="text-muted-foreground">
            New here?{" "}
            <Link to="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
