import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, HandCoins, MapPin, Search } from "lucide-react";

import { Disclaimer } from "@/components/site/DemoBadge";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Button } from "@/components/ui/button";

import clinicWelcome from "@/assets/clinic-welcome.jpg";
import communitySupport from "@/assets/community-support.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About TransCare — inclusive healthcare discovery" },
      {
        name: "description",
        content:
          "Why healthcare information is scattered, and how TransCare brings discovery, affordability, benefits and support together.",
      },
      { property: "og:title", content: "About TransCare — inclusive healthcare discovery" },
      {
        property: "og:description",
        content: "The problem, the solution and the mission behind TransCare.",
      },
    ],
  }),
  component: AboutPage,
});

const flow = [
  { title: "Discover", text: "Find services and providers from one search.", icon: Search },
  { title: "Compare", text: "Weigh cost, distance and services side by side.", icon: BadgeCheck },
  { title: "Support", text: "See benefits and assistance that may apply.", icon: HandCoins },
  { title: "Connect", text: "Reach the provider with the details in hand.", icon: MapPin },
];

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About TransCare"
        title="Healthcare information, brought together."
        description="TransCare brings healthcare discovery, affordability, benefits and support together in one place."
      />

      <section className="shell py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="The problem" title="Information is scattered" />
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Healthcare information is often scattered across hospitals, government portals,
              organisations and different websites. Someone looking for inclusive care may check a
              dozen sources and still not know what a visit will cost, whether a scheme applies, or
              whether the clinic will treat them with respect.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              That effort falls hardest on people who already face barriers to healthcare — including
              transgender people in India.
            </p>
          </div>
          <img
            src={clinicWelcome}
            alt="A transgender man checking in at a welcoming community clinic reception desk"
            loading="lazy"
            width={1200}
            height={912}
            className="aspect-[4/3] w-full rounded-3xl border border-border object-cover shadow-card"
          />
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="shell grid gap-12 py-14 lg:grid-cols-2 lg:py-20">
          <img
            src={communitySupport}
            alt="Transgender and gender-diverse adults in a community support meeting with a counsellor"
            loading="lazy"
            width={1200}
            height={912}
            className="aspect-[4/3] w-full rounded-3xl border border-border object-cover shadow-card lg:order-2"
          />
          <div>
            <SectionHeading eyebrow="Our solution" title="One structured place to look" />
            <p className="mt-5 leading-relaxed text-muted-foreground">
              TransCare brings healthcare discovery, affordability information, government benefits
              and support resources together. Providers carry the same structured fields — services,
              cost band, distance, accessibility, languages and assistance — so comparing them is
              quick instead of exhausting.
            </p>
            <ul className="mt-6 space-y-2 text-muted-foreground">
              {[
                "Search and filter by the service you actually need",
                "See cost bands and consultation ranges upfront",
                "Read benefit summaries in a consistent format",
                "Find community and crisis support in the same place",
              ].map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="shell py-14 lg:py-20">
        <div className="card-surface p-8 text-center lg:p-14">
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            Our mission
          </p>
          <p className="mx-auto mt-5 max-w-3xl text-2xl leading-snug font-semibold sm:text-3xl">
            “Make healthcare information easier to discover, understand and access.”
          </p>
        </div>

        <div className="mt-14">
          <SectionHeading
            align="center"
            eyebrow="Discover → Understand → Afford → Access"
            title="How the product is structured"
          />
          <ol className="mt-12 grid gap-6 lg:grid-cols-4">
            {flow.map((step, index) => (
              <li key={step.title} className="card-surface p-6">
                <span className="bg-brand-gradient grid size-11 place-items-center rounded-2xl text-primary-foreground">
                  <step.icon className="size-5" aria-hidden="true" />
                </span>
                <p className="mt-4 text-xs font-semibold tracking-[0.18em] text-muted-foreground">
                  0{index + 1}
                </p>
                <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Disclaimer>
            Provider entries, cost ranges and scheme summaries can change over time, so always
            confirm them with the provider or official source. No
            payments or medical services are part of this build, and it never diagnoses, prescribes or
            recommends treatment for an individual.
          </Disclaimer>
          <div className="card-surface flex flex-col justify-center gap-3 p-6">
            <p className="font-semibold">Want a guided tour?</p>
            <Button asChild className="rounded-full">
              <Link to="/explore" search={{ service: "Hormone Care", city: "Chennai" }}>
                Start with hormone care in Chennai
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/schemes">Browse government benefits</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
