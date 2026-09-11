import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Disclaimer } from "@/components/site/DemoBadge";
import { PageHero } from "@/components/site/PageHero";
import { ServiceIcon } from "@/components/site/ServiceIcon";
import { Button } from "@/components/ui/button";
import { services, serviceGroups } from "@/data/services";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Healthcare Services — TransCare" },
      {
        name: "description",
        content:
          "Gender-affirming care, mental healthcare, general healthcare and other support services, each linked to providers offering them.",
      },
      { property: "og:title", content: "Healthcare Services — TransCare" },
      {
        property: "og:description",
        content: "Browse healthcare service categories and find providers offering each one.",
      },
    ],
  }),
  component: ServicesPage,
});

const groupBlurb: Record<string, string> = {
  "Gender-Affirming Care":
    "Services that support gender-affirming healthcare pathways. Decisions are always made with qualified professionals.",
  "Mental Healthcare": "Counselling, psychology, psychiatry and peer support options.",
  "General Healthcare": "Everyday healthcare that everyone needs, from check-ups to diagnostics.",
  "Other Support": "Remote care, pharmacy guidance and community organisations.",
};

function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Understand"
        title="Healthcare Services"
        description="Browse the services TransCare organises, then jump straight to the providers listing each one."
      >
        <div className="flex flex-wrap gap-2">
          {serviceGroups.map((group) => (
            <a
              key={group}
              href={`#${group.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              className="rounded-full border border-border bg-background/80 px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
            >
              {group}
            </a>
          ))}
        </div>
      </PageHero>

      <div className="shell space-y-16 py-14 lg:py-20">
        {serviceGroups.map((group) => (
          <section key={group} id={group.toLowerCase().replace(/[^a-z]+/g, "-")}>
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold sm:text-3xl">{group}</h2>
              <p className="mt-3 text-muted-foreground">{groupBlurb[group]}</p>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services
                .filter((service) => service.group === group)
                .map((service) => (
                  <article key={service.id} className="card-surface card-hover flex flex-col p-6">
                    <span className="grid size-11 place-items-center rounded-2xl bg-teal-soft text-primary">
                      <ServiceIcon name={service.icon} className="size-5" />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold">{service.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                    <Button asChild variant="outline" className="mt-5 w-full rounded-full">
                      <Link to="/explore" search={{ service: service.searchKey }}>
                        Find providers
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </article>
                ))}
            </div>
          </section>
        ))}

        <Disclaimer>
          TransCare provides general information and helps you discover providers. It does not
          diagnose conditions, prescribe medicines or recommend treatment for any individual.
        </Disclaimer>
      </div>
    </>
  );
}
