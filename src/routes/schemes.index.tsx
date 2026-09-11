import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarClock, Landmark, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Disclaimer } from "@/components/site/DemoBadge";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { schemes } from "@/data/schemes";

export const Route = createFileRoute("/schemes/")({
  head: () => ({
    meta: [
      { title: "Government healthcare benefits — TransCare" },
      {
        name: "description",
        content:
          "Summaries of health schemes: eligibility, benefits, documents, application steps and official sources.",
      },
      { property: "og:title", content: "Government healthcare benefits — TransCare" },
      {
        property: "og:description",
        content: "Scheme summaries with eligibility, benefits, documents and how to apply.",
      },
    ],
  }),
  component: SchemesPage,
});

function SchemesPage() {
  const [term, setTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");

  const results = useMemo(() => {
    const q = term.trim().toLowerCase();
    return schemes.filter((s) => {
      if (category !== "All" && s.category !== category) return false;
      if (level !== "All" && s.level !== level) return false;
      if (!q) return true;
      return [s.name, s.overview, s.authority].join(" ").toLowerCase().includes(q);
    });
  }, [term, category, level]);

  return (
    <>
      <PageHero
        eyebrow="Understand"
        title="Government Healthcare Benefits"
        description="Every summary follows the same four questions: who is eligible, what it covers, which documents are needed and where to apply."
      >
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
          <div className="relative">
            <Search
              className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search schemes"
              aria-label="Search schemes"
              className="h-13 rounded-2xl bg-background pl-12"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-13 rounded-2xl bg-background sm:w-52" aria-label="Category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["All", "Health insurance", "Identity & welfare", "Financial assistance"].map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger className="h-13 rounded-2xl bg-background sm:w-40" aria-label="Level">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["All", "Central", "State"].map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PageHero>

      <div className="shell py-12 lg:py-16">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{results.length}</span> summaries
        </p>

        {results.length === 0 ? (
          <div className="card-surface mt-8 p-10 text-center">
            <h2 className="text-lg font-semibold">No summaries match that search</h2>
            <Button className="mt-5 rounded-full" onClick={() => setTerm("")}>
              Clear search
            </Button>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {results.map((scheme) => (
              <article key={scheme.id} className="card-surface card-hover flex flex-col p-7">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-soft px-3 py-1 text-xs font-semibold tracking-[0.08em] text-primary uppercase">
                    <Landmark className="size-3.5" aria-hidden="true" />
                    {scheme.level === "Central" ? "Central government" : "State government"}
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-semibold">{scheme.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{scheme.authority}</p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {scheme.overview}
                </p>

                <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Mini title="Eligibility" value={scheme.eligibility[0] ?? ""} />
                  <Mini title="Benefits" value={scheme.benefits[0] ?? ""} />
                  <Mini title="Documents" value={scheme.documents[0] ?? ""} />
                  <Mini title="How to apply" value={scheme.applicationSteps[0] ?? ""} />
                </dl>

                <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarClock className="size-4" aria-hidden="true" />
                  {scheme.lastUpdated}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Button asChild className="rounded-full px-6">
                    <Link to="/schemes/$schemeId" params={{ schemeId: scheme.id }}>
                      Full summary
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full px-6">
                    <Link to="/explore" search={{ affordable: true }}>
                      Low-cost providers
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}

        <Disclaimer className="mt-10">
          These summaries are simplified. TransCare
          never invents official eligibility rules — always confirm current rules on the official
          portal or at a government help desk.
        </Disclaimer>
      </div>
    </>
  );
}

function Mini({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
        {title}
      </dt>
      <dd className="mt-1 text-sm text-foreground/85">{value}</dd>
    </div>
  );
}
