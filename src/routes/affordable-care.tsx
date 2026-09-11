import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, HandCoins, HeartHandshake, Landmark, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

import { Disclaimer } from "@/components/site/DemoBadge";
import { PageHero } from "@/components/site/PageHero";
import { ProviderCard } from "@/components/site/ProviderCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { providers } from "@/data/providers";
import { cities, filterProviders } from "@/lib/api";

export const Route = createFileRoute("/affordable-care")({
  head: () => ({
    meta: [
      { title: "Affordable care & financial assistance — TransCare" },
      {
        name: "description",
        content:
          "Government schemes, NGO and hospital assistance, insurance information and low-cost providers, organised in one place.",
      },
      { property: "og:title", content: "Affordable care & financial assistance — TransCare" },
      {
        property: "og:description",
        content: "Find government schemes, assistance funds and low-cost healthcare providers.",
      },
    ],
  }),
  component: AffordableCarePage,
});

const assistance = [
  {
    title: "Government assistance",
    icon: Landmark,
    text: "Central and state health schemes that cover hospitalisation or listed procedures.",
    to: "/schemes" as const,
    action: "Explore schemes",
  },
  {
    title: "NGO assistance",
    icon: HeartHandshake,
    text: "Community organisations that help with costs, documents and referrals.",
    to: "/support" as const,
    action: "See organisations",
  },
  {
    title: "Hospital assistance",
    icon: Building2,
    text: "Patient assistance desks and concession slabs run by hospitals and trusts.",
    to: "/schemes" as const,
    action: "How to ask",
  },
  {
    title: "Insurance information",
    icon: ShieldCheck,
    text: "What to check on a policy: coverage lists, waiting periods and network hospitals.",
    to: "/learn" as const,
    action: "Read guidance",
  },
];

function AffordableCarePage() {
  const [city, setCity] = useState("Chennai");
  const [band, setBand] = useState("Low cost");

  const results = useMemo(
    () =>
      filterProviders(providers, {
        city,
        affordable: band === "Low cost",
        sort: "affordability",
      }).filter((p) => (band === "Low cost" ? true : p.affordability === band)),
    [city, band],
  );

  return (
    <>
      <PageHero
        eyebrow="Afford"
        title="Affordable healthcare should be easier to find."
        description="Government benefits, assistance funds and low-cost providers, gathered in one view so you can compare before you travel."
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full px-7">
            <Link to="/schemes">Government schemes</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full bg-background/70 px-7">
            <Link to="/explore" search={{ affordable: true }}>
              Low-cost providers
            </Link>
          </Button>
        </div>
      </PageHero>

      <section className="shell py-14 lg:py-20">
        <SectionHeading
          eyebrow="Financial assistance"
          title="Where assistance usually comes from"
          description="Assistance is decided by the scheme, hospital or organisation. TransCare shows where to ask and which documents are usually needed."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {assistance.map((item) => (
            <article key={item.title} className="card-surface card-hover flex flex-col p-6">
              <span className="grid size-11 place-items-center rounded-2xl bg-teal-soft text-primary">
                <item.icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              <Button asChild variant="outline" className="mt-5 rounded-full">
                <Link to={item.to}>
                  {item.action}
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="shell py-14 lg:py-20">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <SectionHeading
              eyebrow="Affordable providers"
              title="Providers with lower listed costs"
              description="Filter the directory by city and affordability band."
            />
            <div className="flex flex-wrap gap-3">
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="w-40" aria-label="City">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={band} onValueChange={setBand}>
                <SelectTrigger className="w-44" aria-label="Affordability band">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low cost">Low cost</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>


          {results.length === 0 ? (
            <div className="card-surface mt-8 p-10 text-center">
              <h3 className="text-lg font-semibold">No providers in this band yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try another city or affordability band.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="shell py-14 lg:py-20">
        <div className="card-surface grid gap-8 p-8 lg:grid-cols-[1.2fr_1fr] lg:p-12">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">Before you pay, ask for this</h2>
            <ul className="mt-6 space-y-3 text-muted-foreground">
              {[
                "A written estimate covering consultation, tests and follow-up",
                "Which tests are needed now and which can wait",
                "Whether the hospital has a patient assistance or social work desk",
                "Whether your government scheme is accepted at that facility",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <HandCoins className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <Disclaimer className="self-center">
            Cost ranges are indicative. Assistance decisions always rest
            with the scheme, hospital or organisation — confirm details with them directly.
          </Disclaimer>
        </div>
      </section>
    </>
  );
}
