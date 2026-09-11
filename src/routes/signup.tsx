import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Loader2, UserPlus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your TransCare account" },
      {
        name: "description",
        content:
          "Create a TransCare account to find inclusive healthcare providers, affordable care and government benefits.",
      },
      { property: "og:title", content: "Create your TransCare account" },
      {
        property: "og:description",
        content: "Sign up for inclusive healthcare discovery and support.",
      },
    ],
  }),
  component: SignupPage,
});

interface Errors {
  fullName?: string;
  email?: string;
  password?: string;
  confirm?: string;
  mobile?: string;
  form?: string;
}

function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const validate = () => {
    const next: Errors = {};
    if (!values.fullName.trim()) next.fullName = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      next.email = "Enter a valid email address.";
    if (values.password.length < 8) next.password = "Use at least 8 characters.";
    else if (!/[A-Za-z]/.test(values.password) || !/\d/.test(values.password))
      next.password = "Include at least one letter and one number.";
    if (values.confirm !== values.password) next.confirm = "Passwords do not match.";
    if (values.mobile.trim() && !/^[0-9+\s-]{8,15}$/.test(values.mobile.trim()))
      next.mobile = "Enter a valid mobile number or leave it blank.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await signUp({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        ...(values.mobile.trim() ? { mobile: values.mobile } : {}),
      });
      setDone(true);
      setTimeout(() => navigate({ to: "/register", replace: true }), 900);
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Could not create your account." });
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="shell flex min-h-[70vh] items-center justify-center py-14">
        <div className="card-surface max-w-md p-9 text-center">
          <CheckCircle2 className="mx-auto size-10 text-success" aria-hidden="true" />
          <h1 className="mt-4 text-2xl font-semibold">Account created</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Taking you to your profile setup so TransCare can personalise your results.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="shell flex min-h-[85vh] items-center justify-center py-14">
      <div className="card-surface w-full max-w-lg p-7 sm:p-9">
        <span className="grid size-11 place-items-center rounded-2xl bg-teal-soft text-primary">
          <UserPlus className="size-5" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold sm:text-3xl">Create your TransCare account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We only ask for what is needed to sign you in. No health information required.
        </p>

        <form onSubmit={submit} className="mt-7 space-y-4" noValidate>
          <Field id="su-name" label="Full name" error={errors.fullName}>
            <Input id="su-name" value={values.fullName} onChange={set("fullName")} autoComplete="name" />
          </Field>
          <Field id="su-email" label="Email" error={errors.email}>
            <Input
              id="su-email"
              type="email"
              value={values.email}
              onChange={set("email")}
              autoComplete="email"
              placeholder="you@example.com"
            />
          </Field>
          <Field id="su-mobile" label="Mobile number (optional)" error={errors.mobile}>
            <Input
              id="su-mobile"
              type="tel"
              value={values.mobile}
              onChange={set("mobile")}
              autoComplete="tel"
              placeholder="+91 90000 00000"
            />
          </Field>
          <Field id="su-password" label="Password" error={errors.password}>
            <Input
              id="su-password"
              type="password"
              value={values.password}
              onChange={set("password")}
              autoComplete="new-password"
            />
            <p className="text-xs text-muted-foreground">
              At least 8 characters, with a letter and a number.
            </p>
          </Field>
          <Field id="su-confirm" label="Confirm password" error={errors.confirm}>
            <Input
              id="su-confirm"
              type="password"
              value={values.confirm}
              onChange={set("confirm")}
              autoComplete="new-password"
            />
          </Field>

          {errors.form ? (
            <p role="alert" className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
              {errors.form}
            </p>
          ) : null}

          <Button type="submit" className="h-12 w-full rounded-full text-base" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
            Create account
          </Button>
        </form>

        <p className="mt-5 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
