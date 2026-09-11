import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CalendarClock, Check, ExternalLink, Landmark } from "lucide-react";

import { Disclaimer } from "@/components/site/DemoBadge";
import { Button } from "@/components/ui/button";
import { providers } from "@/data/providers";
import { schemes } from "@/data/schemes";

export const Route = createFileRoute("/schemes/$schemeId")({
  loader: ({ params }) => {
    const scheme = schemes.find((s) => s.id === params.schemeId);
    if (!scheme) throw notFound();
    return { scheme };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Scheme unavailable — TransCare" }, { name: "robots", content: "noindex" }],
      };
    }
    const { scheme } = loaderData;
    return {
      meta: [
        { title: `${scheme.name} — TransCare` },
        { name: "description", content: scheme.overview.slice(0, 155) },
        { property: "og:title", content: `${scheme.name} — TransCare` },
        { property: "og:description", content: scheme.overview.slice(0, 155) },
      ],
    };
  },
  component: SchemePage,
});

function SchemePage() {
  const { scheme } = Route.useLoaderData();
  const linkedProviders = providers.filter((p) => p.schemes.includes(scheme.id));

  return (
    <>
      <section className="bg-hero-gradient border-b border-border">
        <div className="shell py-10 lg:py-14">
          <Link
            to="/schemes"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All government benefits
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-background/85 px-3 py-1 text-xs font-semibold tracking-[0.08em] text-primary uppercase">
              <Landmark className="size-3.5" aria-hidden="true" />
              {scheme.level === "Central" ? "Central government" : "State government"}
            </span>
          </div>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold sm:text-4xl">{scheme.name}</h1>
          <p className="mt-2 text-muted-foreground">{scheme.authority}</p>
          <p className="mt-5 max-w-3xl leading-relaxed text-muted-foreground">{scheme.overview}</p>
          <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarClock className="size-4" aria-hidden="true" />
            {scheme.lastUpdated}
          </p>
        </div>
      </section>

      <div className="shell grid gap-8 py-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:py-16">
        <div className="space-y-6">
          <Block title="Eligibility" items={scheme.eligibility} />
          <Block title="Benefits" items={scheme.benefits} />
          <Block title="Required documents" items={scheme.documents} />
          <Block title="Application process" items={scheme.applicationSteps} ordered />

          <Disclaimer>
            This is a simplified summary. Eligibility rules and
            benefits are decided by the issuing authority and change over time — always confirm on
            the official source.
          </Disclaimer>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <section className="card-surface p-6">
            <h2 className="text-lg font-semibold">Official source</h2>
            <p className="mt-2 text-sm break-words text-muted-foreground">{scheme.officialSource}</p>
            <Button asChild variant="outline" className="mt-4 w-full rounded-full">
              <a
                href={scheme.officialSource.startsWith("http") ? scheme.officialSource : "https://www.india.gov.in"}
                target="_blank"
                rel="noreferrer noopener"
              >
                Open official portal
                <ExternalLink className="size-4" aria-hidden="true" />
              </a>
            </Button>
          </section>

          <section className="card-surface p-6">
            <h2 className="text-lg font-semibold">Providers listing this benefit</h2>
            {linkedProviders.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                No provider in the directory lists this benefit yet.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {linkedProviders.map((provider) => (
                  <li key={provider.id}>
                    <Link
                      to="/provider/$providerId"
                      params={{ providerId: provider.id }}
                      className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-muted"
                    >
                      <span className="block font-medium">{provider.name}</span>
                      <span className="block text-sm text-muted-foreground">{provider.location}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <Button asChild className="mt-4 w-full rounded-full">
              <Link to="/explore" search={{ affordable: true, verified: true }}>
                Find affordable providers
              </Link>
            </Button>
          </section>
        </aside>
      </div>
    </>
  );
}

function Block({
  title,
  items,
  ordered,
}: {
  title: string;
  items: string[];
  ordered?: boolean;
}) {
  return (
    <section className="card-surface p-6 lg:p-7">
      <h2 className="text-lg font-semibold">{title}</h2>
      {ordered ? (
        <ol className="mt-4 space-y-4">
          {items.map((item, index) => (
            <li key={item} className="flex gap-3">
              <span className="bg-brand-gradient grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold text-primary-foreground">
                {index + 1}
              </span>
              <span className="text-sm leading-relaxed text-muted-foreground">{item}</span>
            </li>
          ))}
        </ol>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item} className="flex gap-3">
              <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
              <span className="text-sm leading-relaxed text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
