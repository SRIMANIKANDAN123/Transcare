import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import {
  AGE_GROUPS,
  CERTIFICATE_STATUSES,
  HEALTHCARE_INTERESTS,
  INDIAN_STATES,
  type AffordabilityPreference,
  type CarePreference,
  type CertificateStatus,
} from "@/lib/auth";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Complete your TransCare profile" },
      {
        name: "description",
        content:
          "Add your location and healthcare preferences so TransCare can personalise providers, benefits and support for you.",
      },
      { property: "og:title", content: "Complete your TransCare profile" },
      {
        property: "og:description",
        content: "Personalise healthcare, benefits and support recommendations.",
      },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { profile, saveProfile, user } = useAuth();
  const navigate = useNavigate();
  const [state, setState] = useState(profile?.state ?? "");
  const [district, setDistrict] = useState(profile?.district ?? "");
  const [ageGroup, setAgeGroup] = useState(profile?.ageGroup ?? "");
  const [certificate, setCertificate] = useState<CertificateStatus | "">(
    profile?.certificateStatus ?? "",
  );
  const [interests, setInterests] = useState<string[]>(profile?.interests ?? []);
  const [affordability, setAffordability] = useState<AffordabilityPreference>(
    profile?.affordability ?? "Any",
  );
  const [carePreference, setCarePreference] = useState<CarePreference>(
    profile?.carePreference ?? "Either",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleInterest = (value: string) =>
    setInterests((list) =>
      list.includes(value) ? list.filter((i) => i !== value) : [...list, value],
    );

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await saveProfile({
        interests,
        affordability,
        carePreference,
        ...(state ? { state } : {}),
        ...(district.trim() ? { district: district.trim() } : {}),
        ...(ageGroup ? { ageGroup } : {}),
        ...(certificate ? { certificateStatus: certificate } : {}),
      });
      toast.success("Profile saved");
      navigate({ to: "/", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shell max-w-3xl py-12 lg:py-16">
      <span className="grid size-11 place-items-center rounded-2xl bg-teal-soft text-primary">
        <Sparkles className="size-5" aria-hidden="true" />
      </span>
      <h1 className="mt-5 text-3xl font-semibold sm:text-4xl">Complete your TransCare profile</h1>
      <p className="mt-3 text-muted-foreground">
        Help us personalize healthcare, benefits and support for you.
      </p>
      {user ? (
        <p className="mt-2 text-sm text-muted-foreground">Signed in as {user.email}</p>
      ) : null}

      <form onSubmit={submit} className="mt-9 space-y-8">
        <section className="card-surface space-y-5 p-6 sm:p-7">
          <h2 className="text-lg font-semibold">Where you are</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>State (optional)</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_STATES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-district">District / city (optional)</Label>
              <Input
                id="reg-district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Chennai"
              />
            </div>
            <div className="space-y-2">
              <Label>Age group (optional)</Label>
              <Select value={ageGroup} onValueChange={setAgeGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an age group" />
                </SelectTrigger>
                <SelectContent>
                  {AGE_GROUPS.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Transgender certificate status (optional)</Label>
              <Select
                value={certificate}
                onValueChange={(v) => setCertificate(v as CertificateStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Prefer not to say" />
                </SelectTrigger>
                <SelectContent>
                  {CERTIFICATE_STATUSES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <section className="card-surface space-y-4 p-6 sm:p-7">
          <div>
            <h2 className="text-lg font-semibold">Healthcare you are looking for</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose any that apply — this only affects what we show first.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {HEALTHCARE_INTERESTS.map((interest) => (
              <label
                key={interest}
                className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border p-3.5 text-sm font-medium transition-colors hover:border-primary"
              >
                <Checkbox
                  checked={interests.includes(interest)}
                  onCheckedChange={() => toggleInterest(interest)}
                />
                {interest}
              </label>
            ))}
          </div>
        </section>

        <section className="card-surface grid gap-8 p-6 sm:grid-cols-2 sm:p-7">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Affordability preference</h2>
            <RadioGroup
              value={affordability}
              onValueChange={(v) => setAffordability(v as AffordabilityPreference)}
              className="space-y-2"
            >
              {["Free / Government-supported", "Affordable", "Any"].map((option) => (
                <label key={option} className="flex items-center gap-3 text-sm font-medium">
                  <RadioGroupItem value={option} />
                  {option}
                </label>
              ))}
            </RadioGroup>
          </div>
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Preferred care</h2>
            <RadioGroup
              value={carePreference}
              onValueChange={(v) => setCarePreference(v as CarePreference)}
              className="space-y-2"
            >
              {["Hospital / Clinic", "Teleconsultation", "Either"].map((option) => (
                <label key={option} className="flex items-center gap-3 text-sm font-medium">
                  <RadioGroupItem value={option} />
                  {option}
                </label>
              ))}
            </RadioGroup>
          </div>
        </section>

        {error ? (
          <p role="alert" className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" size="lg" className="rounded-full px-8" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
            Save and continue
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            className="rounded-full px-8"
            onClick={() => navigate({ to: "/", replace: true })}
          >
            Skip for now
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          We never ask for identity numbers, medical records, diagnoses or prescriptions.
        </p>
      </form>
    </div>
  );
}
