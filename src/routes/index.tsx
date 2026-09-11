import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  BookOpenCheck,
  Check,
  FileCheck2,
  HandCoins,
  Landmark,
  MapPin,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

import { Disclaimer } from "@/components/site/DemoBadge";
import { NearbyMap } from "@/components/site/NearbyMap";
import { ProviderCard } from "@/components/site/ProviderCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ServiceIcon } from "@/components/site/ServiceIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { providers } from "@/data/providers";
import { homeCategories, services } from "@/data/services";
import { schemes } from "@/data/schemes";
import { useAuth } from "@/hooks/useAuth";
import { firstName, INTEREST_TO_SERVICE } from "@/lib/auth";

import benefitsHelp from "@/assets/benefits-help.jpg";
import careCheckup from "@/assets/care-checkup.jpg";
import clinicWelcome from "@/assets/clinic-welcome.jpg";
import communitySupport from "@/assets/community-support.jpg";
import heroConsultation from "@/assets/hero-consultation.jpg";
import telehealth from "@/assets/telehealth.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TransCare — Healthcare that understands you" },
      {
        name: "description",
        content:
          "Discover inclusive healthcare providers, affordable care, government benefits and support services for transgender people in India — all in one place.",
      },
      { property: "og:title", content: "TransCare — Healthcare that understands you" },
      {
        property: "og:description",
        content:
          "Inclusive healthcare discovery: providers, affordable care, government benefits and support in one place.",
      },
    ],
  }),
  component: HomePage,
});

const suggested = [
  { label: "Endocrinologist", service: "Hormone Care" },
  { label: "Mental Healthcare", service: "Counselling" },
  { label: "Hormone Care", service: "Hormone Care" },
  { label: "Gender-Affirming Care", service: "Gender-Affirming Care Information" },
  { label: "Voice Therapy", service: "Voice & Speech" },
];

const steps = [
  { no: "01", title: "Search", text: "Find the healthcare service you need.", icon: Search },
  {
    no: "02",
    title: "Compare",
    text: "Compare providers, services, locations and affordability.",
    icon: BadgeCheck,
  },
  {
    no: "03",
    title: "Check support",
    text: "Explore government benefits and financial assistance.",
    icon: Landmark,
  },
  { no: "04", title: "Connect", text: "Contact or visit the provider.", icon: MapPin },
];

function HomePage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [term, setTerm] = useState("");
  const greeting = firstName(user);

  const preferredCity = profile?.district && providers.some((p) => p.city === profile.district)
    ? profile.district
    : "Chennai";
  const preferredServices = (profile?.interests ?? [])
    .map((i) => INTEREST_TO_SERVICE[i])
    .filter((s): s is string => !!s);
  const preferFree = profile?.affordability === "Free / Government-supported";
  const preferAffordable = preferFree || profile?.affordability === "Affordable";

  const [mapCity, setMapCity] = useState(preferredCity);
  const [mapService, setMapService] = useState<string>(preferredServices[0] ?? "All services");

  const featuredScheme = schemes[0]!;

  const score = (p: (typeof providers)[number]) => {
    let value = 0;
    if (preferredServices.some((s) => p.services.includes(s))) value -= 4;
    if (preferAffordable && p.affordability === "Low cost") value -= 2;
    if (preferFree && p.sector === "Government") value -= 1;
    if (profile?.carePreference === "Teleconsultation" && p.teleconsultation) value -= 1;
    return value + p.distanceKm / 100;
  };

  const cityProviders = providers.filter((p) => p.city === preferredCity);
  const featuredProviders = [...cityProviders].sort((a, b) => score(a) - score(b)).slice(0, 4);

  const mapProviders = providers.filter(
    (p) =>
      p.city === mapCity &&
      (mapService === "All services" ||
        p.services.some((s) => s.toLowerCase().includes(mapService.toLowerCase()))),
  );

  const runSearch = (patch: { q?: string | undefined; service?: string | undefined }) =>
    navigate({ to: "/explore", search: { city: preferredCity, ...patch } });

  return (
    <>
      {/* HERO */}
      <section className="bg-hero-gradient relative overflow-hidden border-b border-border">
        <div className="shell grid items-center gap-12 py-14 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3.5 py-1.5 text-xs font-semibold tracking-[0.14em] text-primary uppercase">
              <Sparkles className="size-3.5" aria-hidden="true" />
              {greeting ? `Welcome back, ${greeting}` : "Inclusive healthcare platform"}
            </span>
            <h1 className="mt-6 text-4xl leading-[1.05] font-semibold text-foreground sm:text-5xl lg:text-6xl">
              Healthcare that <span className="text-brand-gradient">understands</span> you.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Discover inclusive healthcare providers, affordable care, government benefits and
              support services — all in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-13 rounded-full px-7 text-base">
                <Link to="/explore" search={{ city: "Chennai" }}>
                  Find Healthcare
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-13 rounded-full bg-background/70 px-7 text-base"
              >
                <Link to="/schemes">Explore Benefits</Link>
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-muted-foreground">
              {["Inclusive healthcare", "Clear information", "Privacy focused"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="size-4 text-success" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-lift">
              <img
                src={heroConsultation}
                alt="A transgender woman talking comfortably with a doctor in a bright, welcoming clinic consultation room"
                width={1200}
                height={1408}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>

            <div className="animate-float card-surface absolute -bottom-6 -left-2 hidden w-52 p-4 sm:block lg:-left-10">
              <p className="text-2xl font-semibold text-foreground">120+</p>
              <p className="text-sm text-muted-foreground">Healthcare services listed</p>
            </div>
            <div
              className="animate-float card-surface absolute -top-4 right-0 hidden p-3.5 sm:block lg:-right-8"
              style={{ animationDelay: "1.2s" }}
            >
              <p className="flex items-center gap-2 text-sm font-semibold">
                <HandCoins className="size-4 text-primary" aria-hidden="true" />
                Affordable care
              </p>
            </div>
            <div
              className="animate-float card-surface absolute top-1/2 -right-2 hidden p-3.5 md:block lg:-right-12"
              style={{ animationDelay: "2.4s" }}
            >
              <p className="flex items-center gap-2 text-sm font-semibold">
                <ShieldCheck className="size-4 text-teal" aria-hidden="true" />
                Clear information
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="shell -mt-2 py-14 lg:py-16">
        <div className="card-surface mx-auto max-w-4xl p-6 sm:p-9">
          <h2 className="text-center text-2xl font-semibold sm:text-3xl">Find the care you need</h2>
          <form
            className="mt-7 grid gap-3 lg:grid-cols-[minmax(0,1fr)_11rem_auto]"
            onSubmit={(e) => {
              e.preventDefault();
              runSearch({ q: term || undefined });
            }}
          >
            <div className="relative">
              <Search
                className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search hospitals, doctors, services..."
                aria-label="Search hospitals, doctors, services"
                className="h-14 rounded-2xl pl-12 text-base"
              />
            </div>
            <div className="flex h-14 items-center gap-2 rounded-2xl border border-input bg-background px-4 text-base">
              <MapPin className="size-5 shrink-0 text-primary" aria-hidden="true" />
              <span className="truncate">Chennai</span>
            </div>
            <Button type="submit" size="lg" className="h-14 rounded-2xl px-9 text-base">
              Search
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Suggested:</span>
            {suggested.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => runSearch({ service: s.service })}
                className="rounded-full border border-border px-3.5 py-1.5 text-sm font-medium transition-colors hover:border-primary hover:bg-teal-soft hover:text-primary"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="shell pb-16 lg:pb-20">
        <SectionHeading
          align="center"
          eyebrow="Discover"
          title="What healthcare do you need?"
          description="Start from a service and TransCare shows the providers, costs and support that go with it."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {homeCategories.map((category) => (
            <Link
              key={category.title}
              to="/explore"
              search={{ city: "Chennai", ...category.search }}
              className="card-surface card-hover group flex flex-col p-7"
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-teal-soft text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <ServiceIcon name={category.icon} className="size-6" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{category.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {category.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Find providers
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-base font-semibold text-primary underline-offset-4 hover:underline"
          >
            View all services <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* NEARBY */}
      <section className="border-y border-border bg-surface">
        <div className="shell grid gap-10 py-16 lg:grid-cols-[20rem_minmax(0,1fr)] lg:py-20">
          <div>
            <SectionHeading
              eyebrow="Access"
              title="Healthcare near you"
              description="Share your location to see healthcare providers and support services around you, or search any city."
            />
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setMapService("All services")}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  mapService === "All services"
                    ? "border-primary bg-teal-soft text-primary"
                    : "border-border hover:border-primary"
                }`}
              >
                All services
              </button>
              {services.slice(0, 6).map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setMapService(service.searchKey)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    mapService === service.searchKey
                      ? "border-primary bg-teal-soft text-primary"
                      : "border-border hover:border-primary"
                  }`}
                >
                  {service.title}
                </button>
              ))}
            </div>
            <Button asChild size="lg" className="mt-7 rounded-full px-7">
              <Link to="/nearby">Explore Nearby</Link>
            </Button>
          </div>
          <NearbyMap providers={mapProviders} city={mapCity} onCityChange={setMapCity} />
        </div>
      </section>

      {/* AFFORDABLE */}
      <section className="shell py-16 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="relative">
            <img
              src={careCheckup}
              alt="An older transgender woman having a routine check-up with a nurse at a clinic"
              loading="lazy"
              width={912}
              height={1104}
              className="aspect-[4/5] w-full rounded-[2rem] border border-border object-cover shadow-card"
            />
            <div className="card-surface absolute right-4 bottom-4 flex items-center gap-3 p-4">
              <Banknote className="size-5 text-success" aria-hidden="true" />
              <span className="text-sm font-semibold">Low-cost options first</span>
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow="Afford"
              title="Need affordable healthcare?"
              description="Find government benefits, financial assistance and affordable healthcare options."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Link to="/schemes" className="card-surface card-hover p-5">
                <Landmark className="size-6 text-primary" aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold">Government schemes</p>
              </Link>
              <Link to="/affordable-care" className="card-surface card-hover p-5">
                <HandCoins className="size-6 text-primary" aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold">Financial assistance</p>
              </Link>
              <Link
                to="/explore"
                search={{ affordable: true, city: "Chennai" }}
                className="card-surface card-hover p-5"
              >
                <Banknote className="size-6 text-primary" aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold">Affordable providers</p>
              </Link>
            </div>
            <Button asChild size="lg" className="mt-8 rounded-full px-7">
              <Link to="/affordable-care">Find Assistance</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* GOVERNMENT BENEFITS */}
      <section className="border-y border-border bg-surface">
        <div className="shell grid gap-12 py-16 lg:grid-cols-[1fr_1.15fr] lg:py-20">
          <div>
            <SectionHeading
              eyebrow="Understand"
              title="Government healthcare benefits"
              description="Understand healthcare benefits, eligibility, required documents and application steps."
            />
            <img
              src={benefitsHelp}
              alt="A transgender woman reviewing scheme application documents with a health worker"
              loading="lazy"
              width={1200}
              height={912}
              className="mt-8 aspect-[4/3] w-full rounded-3xl border border-border object-cover shadow-card"
            />
          </div>

          <article className="card-surface p-7 lg:p-9">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-soft px-3 py-1 text-xs font-semibold tracking-[0.08em] text-primary uppercase">
                <Landmark className="size-3.5" aria-hidden="true" />
                Government
              </span>
              
            </div>
            <h3 className="mt-5 text-2xl font-semibold">Government healthcare benefits</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {featuredScheme.overview}
            </p>

            <dl className="mt-7 space-y-5">
              <Detail title="Eligibility" items={featuredScheme.eligibility.slice(0, 2)} />
              <Detail title="Benefits" items={featuredScheme.benefits.slice(0, 2)} />
              <Detail title="Required documents" items={featuredScheme.documents.slice(0, 2)} />
              <Detail title="Application process" items={featuredScheme.applicationSteps.slice(0, 2)} />
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="rounded-full px-6">
                <Link to="/schemes">Explore Schemes</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full px-6">
                <Link to="/schemes/$schemeId" params={{ schemeId: featuredScheme.id }}>
                  Open this summary
                </Link>
              </Button>
            </div>
          </article>
        </div>
      </section>

      {/* PROVIDERS */}
      <section className="shell py-16 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <SectionHeading
            eyebrow="Compare"
            title="Healthcare providers"
            description="Explore providers and healthcare services using our structured directory."
          />
          <Button asChild variant="outline" className="rounded-full px-6 lg:mb-2">
            <Link to="/explore" search={{ city: "Chennai" }}>
              Open Explore
            </Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {featuredProviders.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
        <Disclaimer className="mt-8">
          Always confirm services, costs and availability directly with the provider before your
          visit.
        </Disclaimer>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-border bg-surface">
        <div className="shell py-16 lg:py-20">
          <SectionHeading
            align="center"
            eyebrow="Discover → Understand → Afford → Access"
            title="How TransCare works"
          />
          <ol className="relative mt-14 grid gap-8 lg:grid-cols-4">
            <span
              aria-hidden="true"
              className="bg-brand-gradient absolute top-6 right-8 left-8 hidden h-0.5 opacity-30 lg:block"
            />
            {steps.map((step) => (
              <li key={step.no} className="relative">
                <span className="bg-brand-gradient relative z-10 grid size-12 place-items-center rounded-2xl text-primary-foreground shadow-glow">
                  <step.icon className="size-5" aria-hidden="true" />
                </span>
                <p className="mt-5 text-xs font-semibold tracking-[0.18em] text-muted-foreground">
                  {step.no}
                </p>
                <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* INCLUSIVE VISUAL */}
      <section className="shell py-16 lg:py-20">
        <SectionHeading
          align="center"
          eyebrow="Inclusive by design"
          title="Healthcare should be accessible to everyone."
          description="TransCare brings important healthcare information and support resources together in one place."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { src: communitySupport, alt: "A support group of transgender and gender-diverse adults with a counsellor", tall: true },
            { src: clinicWelcome, alt: "A transgender man checking in at a welcoming community clinic reception" },
            { src: telehealth, alt: "A young transgender person attending an online consultation with a doctor" },
            { src: careCheckup, alt: "A nurse checking an older transgender patient's blood pressure", tall: true },
          ].map((image, index) => (
            <img
              key={image.src}
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className={`w-full rounded-3xl border border-border object-cover shadow-card ${
                image.tall ? "aspect-[3/4]" : "aspect-square"
              } ${index % 2 === 1 ? "lg:mt-8" : ""}`}
            />
          ))}
        </div>
      </section>

      {/* TRUST */}
      <section className="border-t border-border bg-surface">
        <div className="shell py-16 lg:py-20">
          <SectionHeading align="center" eyebrow="Trust" title="Information you can trust" />
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Reviewed information", icon: BadgeCheck, text: "Listings are reviewed before they are published." },
              { title: "Official sources", icon: FileCheck2, text: "Scheme summaries always link to the official portal." },
              { title: "Regular updates", icon: RefreshCw, text: "Entries carry a last-updated note so you know how fresh they are." },
              { title: "Privacy-focused", icon: ShieldCheck, text: "We never ask for health records, diagnoses or identity numbers." },
            ].map((item) => (
              <div key={item.title} className="card-surface p-6">
                <item.icon className="size-6 text-primary" aria-hidden="true" />
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
          <Disclaimer className="mx-auto mt-10 max-w-3xl text-center">
            Always confirm current healthcare services, costs and eligibility directly with the
            provider or official source.
          </Disclaimer>
          <div className="mt-8 text-center">
            <Link
              to="/learn"
              className="inline-flex items-center gap-2 text-base font-semibold text-primary underline-offset-4 hover:underline"
            >
              <BookOpenCheck className="size-5" aria-hidden="true" />
              Read healthcare information
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Detail({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <dt className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
        {title}
      </dt>
      <dd className="mt-2 space-y-1.5">
        {items.map((item) => (
          <p key={item} className="flex gap-2 text-sm text-foreground/85">
            <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
            {item}
          </p>
        ))}
      </dd>
    </div>
  );
}
