import { createFileRoute } from "@tanstack/react-router";

import { Disclaimer } from "@/components/site/DemoBadge";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of use — TransCare" },
      {
        name: "description",
        content:
          "How to use TransCare: information only, and never a substitute for professional healthcare advice.",
      },
      { property: "og:title", content: "Terms of use — TransCare" },
      {
        property: "og:description",
        content: "Information-only service — always confirm details with the provider.",
      },
    ],
  }),
  component: TermsPage,
});

const terms = [
  {
    title: "Information only",
    text: "TransCare helps you discover healthcare information. It does not diagnose conditions, prescribe medicines, recommend doses or recommend procedures for any individual.",
  },
  {
    title: "Information accuracy",
    text: "Providers, professionals, cost ranges and scheme summaries can change. Always confirm them directly with the provider or official source.",
  },
  {
    title: "Always confirm with the source",
    text: "Confirm current services, costs, timings and eligibility directly with the provider or the official government portal before acting on anything you read here.",
  },
  {
    title: "No emergency service",
    text: "This platform cannot respond to emergencies. In an emergency, call 108. For mental health support, the government Tele-MANAS helpline is 14416.",
  },
  {
    title: "Respectful use",
    text: "Listings and community resources are shared to help people access care. Do not use them to harass or misrepresent any person or organisation.",
  },
];

function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Terms"
        title="Terms of use"
        description="A short, plain-language summary of what TransCare is and how to use it safely."
      />
      <div className="shell max-w-3xl py-12 lg:py-16">
        <ol className="space-y-6">
          {terms.map((term, index) => (
            <li key={term.title} className="card-surface p-6 lg:p-7">
              <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                0{index + 1}
              </p>
              <h2 className="mt-2 text-lg font-semibold">{term.title}</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">{term.text}</p>
            </li>
          ))}
        </ol>
        <Disclaimer className="mt-10">
          © 2026 TransCare. This page is not a legal contract.
        </Disclaimer>
      </div>
    </>
  );
}
