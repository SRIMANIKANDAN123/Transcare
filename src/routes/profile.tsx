import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LogOut, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — TransCare" },
      {
        name: "description",
        content:
          "See and update your TransCare location, healthcare preferences and certificate status.",
      },
      { property: "og:title", content: "Your profile — TransCare" },
      { property: "og:description", content: "Manage your TransCare preferences." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const rows: { label: string; value: string }[] = [
    { label: "Name", value: user.fullName },
    { label: "Email", value: user.email },
    ...(user.mobile ? [{ label: "Mobile", value: user.mobile }] : []),
    {
      label: "Location",
      value: [profile?.district, profile?.state].filter(Boolean).join(", ") || "Not added yet",
    },
    { label: "Age group", value: profile?.ageGroup ?? "Not added yet" },
    { label: "Certificate status", value: profile?.certificateStatus ?? "Prefer not to say" },
    {
      label: "Healthcare preferences",
      value: profile?.interests?.length ? profile.interests.join(", ") : "Not added yet",
    },
    { label: "Affordability preference", value: profile?.affordability ?? "Any" },
    { label: "Preferred care", value: profile?.carePreference ?? "Either" },
  ];

  return (
    <div className="shell max-w-3xl py-12 lg:py-16">
      <div className="flex items-center gap-4">
        <span className="grid size-12 place-items-center rounded-2xl bg-teal-soft text-primary">
          <UserRound className="size-6" aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-3xl font-semibold">Your profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Used only to order what you see first. Nothing here is shared publicly.
          </p>
        </div>
      </div>

      <dl className="card-surface mt-8 divide-y divide-border">
        {rows.map((row) => (
          <div key={row.label} className="grid gap-1 p-5 sm:grid-cols-[12rem_minmax(0,1fr)]">
            <dt className="text-sm font-medium text-muted-foreground">{row.label}</dt>
            <dd className="text-sm font-medium text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-7 flex flex-wrap gap-3">
        <Button asChild className="rounded-full px-7">
          <Link to="/register">Edit preferences</Link>
        </Button>
        <Button
          variant="outline"
          className="rounded-full px-7"
          onClick={async () => {
            await signOut();
            navigate({ to: "/login", replace: true });
          }}
        >
          <LogOut className="size-4" aria-hidden="true" />
          Log out
        </Button>
      </div>
    </div>
  );
}
