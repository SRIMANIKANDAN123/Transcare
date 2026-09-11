import { createFileRoute } from "@tanstack/react-router";

import { Disclaimer } from "@/components/site/DemoBadge";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — TransCare" },
      {
        name: "description",
        content:
          "How TransCare handles your data: no health records and no tracking of individuals.",
      },
      { property: "og:title", content: "Privacy — TransCare" },
      {
        property: "og:description",
        content: "No health records and no personal tracking.",
      },
    ],
  }),
  component: PrivacyPage,
});

const points = [
  {
    title: "No accounts, no profiles",
    text: "Your account stores only your name, email and the preferences you choose. Nothing health-related is linked to you.",
  },
  {
    title: "No health data collected",
    text: "TransCare never asks for symptoms, diagnoses, prescriptions or identity documents. Please do not enter health information anywhere in TransCare.",
  },
  {
    title: "Searches stay in your browser",
    text: "Search terms and filters are handled in the page and reflected in the URL. Nothing is sent to a server in this version.",
  },
  {
    title: "Privacy by default in the design",
    text: "When a backend is added, the intention is minimal data collection: no health records, and clear consent for anything saved.",
  },
];

function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="Privacy at TransCare"
        description="Discovering healthcare should never require exposing yourself. TransCare works without personal health data."
      />
      <div className="shell max-w-3xl py-12 lg:py-16">
        <div className="space-y-6">
          {points.map((point) => (
            <section key={point.title} className="card-surface p-6 lg:p-7">
              <h2 className="text-lg font-semibold">{point.title}</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">{point.text}</p>
            </section>
          ))}
        </div>
        <Disclaimer className="mt-10">
          This page is a plain-language summary, not a legal privacy policy.
        </Disclaimer>
      </div>
    </>
  );
}
