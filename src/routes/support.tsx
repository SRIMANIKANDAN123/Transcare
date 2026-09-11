import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, ExternalLink, Phone } from "lucide-react";
import { useState } from "react";

import { Disclaimer } from "@/components/site/DemoBadge";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { organisations } from "@/data/organisations";
import type { Organisation } from "@/data/types";

import communitySupport from "@/assets/community-support.jpg";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support & community resources — TransCare" },
      {
        name: "description",
        content:
          "Mental healthcare, NGOs, community organisations, financial assistance, legal information and crisis helplines in one directory.",
      },
      { property: "og:title", content: "Support & community resources — TransCare" },
      {
        property: "og:description",
        content: "Community, counselling, legal information and crisis support resources.",
      },
    ],
  }),
  component: SupportPage,
});

const sections: { type: Organisation["type"]; title: string; blurb: string }[] = [
  {
    type: "Mental Healthcare",
    title: "Mental healthcare",
    blurb: "Counselling networks and low-cost therapy options.",
  },
  { type: "NGO", title: "NGOs", blurb: "Non-profits running health camps and referral support." },
  {
    type: "Community Organisation",
    title: "Community organisations",
    blurb: "Peer support, clinic companions and document guidance.",
  },
  {
    type: "Financial Assistance",
    title: "Financial assistance",
    blurb: "Organisations that accept assistance requests for treatment costs.",
  },
  {
    type: "Legal Support",
    title: "Legal support information",
    blurb: "General rights information and referrals to legal aid. Not legal advice.",
  },
  {
    type: "Crisis Support",
    title: "Emergency & crisis resources",
    blurb: "Official helplines to call when help is needed immediately.",
  },
];

function SupportPage() {
  const [active, setActive] = useState<string>("All");
  const visible = sections.filter((s) => active === "All" || s.type === active);

  return (
    <>
      <PageHero
        eyebrow="Support"
        title="Support & Community Resources"
        description="Healthcare is easier with people alongside you. These resources cover counselling, community support, assistance and emergencies."
      >
        <div className="flex flex-wrap gap-2">
          {["All", ...sections.map((s) => s.type)].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setActive(option)}
              aria-pressed={active === option}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                active === option
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background/80 hover:border-primary hover:text-primary"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </PageHero>

      <div className="shell py-12 lg:py-16">
        <div className="card-surface mb-12 grid gap-6 overflow-hidden p-0 lg:grid-cols-[1.1fr_1fr]">
          <div className="p-8 lg:p-10">
            <h2 className="text-2xl font-semibold">You do not have to do this alone</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Many organisations will accompany you to a first appointment, help prepare documents or
              simply talk things through before you decide anything.
            </p>
            <p className="mt-6 flex items-center gap-2 font-semibold text-foreground">
              <AlertTriangle className="size-5 text-rose" aria-hidden="true" />
              In an emergency, call 108 immediately.
            </p>
          </div>
          <img
            src={communitySupport}
            alt="A support group of transgender and gender-diverse adults meeting with a counsellor"
            loading="lazy"
            width={1200}
            height={912}
            className="h-full min-h-56 w-full object-cover"
          />
        </div>

        <div className="space-y-14">
          {visible.map((section) => {
            const items = organisations.filter((o) => o.type === section.type);
            return (
              <section key={section.type}>
                <h2 className="text-2xl font-semibold">{section.title}</h2>
                <p className="mt-2 text-muted-foreground">{section.blurb}</p>
                {items.length === 0 ? (
                  <p className="mt-6 text-sm text-muted-foreground">No listings in this category yet.</p>
                ) : (
                  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((org) => (
                      <article key={org.id} className="card-surface card-hover flex flex-col p-6">
                        <span className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
                          {org.type}
                        </span>
                        <h3 className="mt-3 text-lg font-semibold">{org.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{org.city}</p>
                        <ul className="mt-4 flex-1 space-y-1.5 text-sm text-muted-foreground">
                          {org.services.map((service) => (
                            <li key={service}>• {service}</li>
                          ))}
                        </ul>
                        <p className="mt-4 flex items-center gap-2 text-sm font-medium">
                          <Phone className="size-4 text-primary" aria-hidden="true" />
                          {org.contact}
                        </p>
                        <p className="mt-3 text-xs text-muted-foreground">{org.note}</p>
                        <Button asChild variant="outline" className="mt-4 rounded-full">
                          <a href={org.website} target="_blank" rel="noreferrer noopener">
                            Website
                            <ExternalLink className="size-4" aria-hidden="true" />
                          </a>
                        </Button>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        <Disclaimer className="mt-12">
          Contact each organisation to confirm current services. Official helpline
          numbers are shown as published by the government — confirm details on the official website.
        </Disclaimer>
      </div>
    </>
  );
}
