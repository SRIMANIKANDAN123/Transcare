import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  Accessibility,
  ArrowLeft,
  CalendarCheck,
  Check,
  Globe,
  HandCoins,
  Landmark,
  Languages,
  MapPin,
  Phone,
  Navigation,
  Video,
} from "lucide-react";
import { toast } from "sonner";

import { Disclaimer } from "@/components/site/DemoBadge";
import { MapPanel } from "@/components/site/MapPanel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { providers } from "@/data/providers";
import { schemes } from "@/data/schemes";

export const Route = createFileRoute("/provider/$providerId")({
  loader: ({ params }) => {
    const provider = providers.find((p) => p.id === params.providerId);
    if (!provider) throw notFound();
    return { provider };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Provider unavailable — TransCare" }, { name: "robots", content: "noindex" }],
      };
    }
    const { provider } = loaderData;
    const description = `${provider.type} in ${provider.location}. See services, affordability and the support available.`;
    return {
      meta: [
        { title: `${provider.name} — TransCare` },
        { name: "description", content: description },
        { property: "og:title", content: `${provider.name} — TransCare` },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ProviderPage,
});

function ProviderPage() {
  const { provider } = Route.useLoaderData();
  const linkedSchemes = schemes.filter((s) => provider.schemes.includes(s.id));

  return (
    <>
      <section className="bg-hero-gradient border-b border-border">
        <div className="shell py-10 lg:py-14">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to Explore
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-background/80 px-3 py-1 text-xs font-semibold text-muted-foreground">
                  {provider.listingStatus}
                </span>
                <span className="rounded-full bg-background/80 px-3 py-1 text-xs font-semibold text-muted-foreground">
                  {provider.sector}
                </span>
              </div>
              <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">{provider.name}</h1>
              <p className="mt-2 text-lg text-muted-foreground">{provider.type}</p>
              <p className="mt-4 flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4 text-primary" aria-hidden="true" />
                {provider.location} · {provider.distanceKm} km away
              </p>
              <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">{provider.about}</p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button
                  className="rounded-full px-6"
                  onClick={() =>
                    toast.success("Contact number", {
                      description: `Prototype only — no call is placed. Listed number: ${provider.contact}`,
                    })
                  }
                >
                  <Phone className="size-4" aria-hidden="true" />
                  Call
                </Button>
                {/* <Button
                  variant="outline"
                  className="rounded-full px-6"
                  onClick={() =>
                    toast("Opening the provider website", {
                      description: provider.website,
                    })
                  }
                >
                  <Globe className="size-4" aria-hidden="true" />
                  Website
                </Button> */}
                
                <Button asChild variant="outline" className="rounded-full px-6">
  <a href={provider.website} target="_blank" rel="noopener noreferrer">
    <Globe className="size-4" aria-hidden="true" />
    Website
  </a>
</Button>
                <Button
                  variant="outline"
                  className="rounded-full px-6"
                  onClick={() =>
                    toast("Directions", {
                      description: `Opening directions to ${provider.location}.`,
                    })
                  }
                >
                  <Navigation className="size-4" aria-hidden="true" />
                  Directions
                </Button>
                <AppointmentDialog providerName={provider.name} hours={provider.hours} />
              </div>
            </div>

            <img
              src={provider.image}
              alt={`Inclusive healthcare setting at ${provider.name}`}
              className="aspect-[4/3] w-full rounded-3xl border border-border object-cover shadow-lift"
            />
          </div>
        </div>
      </section>

      <div className="shell grid gap-8 py-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:py-16">
        <div className="space-y-8">
          <Panel title="Services listed">
            <div className="flex flex-wrap gap-2">
              {provider.services.map((service) => (
                <Link
                  key={service}
                  to="/explore"
                  search={{ service }}
                  className="rounded-full bg-teal-soft px-3.5 py-1.5 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {service}
                </Link>
              ))}
            </div>
          </Panel>

          <Panel title="Healthcare professionals">
            <ul className="divide-y divide-border">
              {provider.professionals.map((person) => (
                <li key={person.name} className="flex items-center justify-between gap-4 py-3">
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{person.name}</span>
                    <span className="block truncate text-sm text-muted-foreground">{person.role}</span>
                  </span>
                                  </li>
              ))}
            </ul>
          </Panel>

          <div className="grid gap-6 sm:grid-cols-2">
            <Panel title="Accessibility" icon={Accessibility}>
              <List items={provider.accessibility} />
            </Panel>
            <Panel title="Languages" icon={Languages}>
              <List items={provider.languages} />
            </Panel>
          </div>

          <Panel title="Affordability & financial assistance" icon={HandCoins}>
            <dl className="grid gap-4 sm:grid-cols-2">
              <Stat label="Affordability band" value={provider.affordability} />
              <Stat label="Consultation range" value={provider.consultationRange} />
              <Stat
                label="Assistance desk"
                value={provider.assistanceAvailable ? "Available on request" : "Not listed"}
              />
              <Stat
                label="Teleconsultation"
                value={provider.teleconsultation ? "Offered" : "Not listed"}
              />
            </dl>
            <Button asChild variant="outline" className="mt-5 rounded-full">
              <Link to="/affordable-care">Explore financial assistance</Link>
            </Button>
          </Panel>

          <Panel title="Government benefits listed here" icon={Landmark}>
            {linkedSchemes.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No scheme is listed for this provider. You can still browse all benefit
                summaries.
              </p>
            ) : (
              <ul className="space-y-3">
                {linkedSchemes.map((scheme) => (
                  <li key={scheme.id}>
                    <Link
                      to="/schemes/$schemeId"
                      params={{ schemeId: scheme.id }}
                      className="card-surface card-hover block p-4"
                    >
                      <p className="font-medium">{scheme.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{scheme.authority}</p>
                      <p className="mt-2 text-sm font-semibold text-primary">
                        Eligibility, benefits & application steps →
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <Button asChild variant="outline" className="mt-5 rounded-full">
              <Link to="/schemes">All government benefits</Link>
            </Button>
          </Panel>

          <Disclaimer>
            Provider information can change. Confirm
            current services, prices and availability directly with providers.
          </Disclaimer>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Panel title="Visit & contact">
            <dl className="space-y-4 text-sm">
              <Stat label="Address" value={provider.location} />
              <Stat label="Hours" value={provider.hours} />
              <Stat label="Phone" value={provider.contact} />
              <Stat label="Website" value={provider.website} />
            </dl>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button
                size="sm"
                className="rounded-full"
                onClick={() => toast.success("Contact details copied")}
              >
                Save contact
              </Button>
              {provider.teleconsultation ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => toast("Teleconsultation is listed as available at this provider")}
                >
                  <Video className="size-4" aria-hidden="true" />
                  Online consult
                </Button>
              ) : null}
            </div>
          </Panel>

          <Panel title="Location">
            <MapPanel providers={[provider]} activeId={provider.id} city={provider.city} className="h-64" />
          </Panel>
        </aside>
      </div>
    </>
  );
}

function AppointmentDialog({ providerName, hours }: { providerName: string; hours: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full px-6">
          <CalendarCheck className="size-4" aria-hidden="true" />
          Appointment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request an appointment</DialogTitle>
          <DialogDescription>
            Online booking is not available yet. {providerName} lists these
            hours: {hours}.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          When the backend is connected, this dialog will submit a request and confirm it by
          notification.
        </p>
        <DialogFooter>
          <Button
            onClick={() =>
              toast.success("Appointment request noted", {
                description: "No real booking was created.",
              })
            }
          >
            Send request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <section className="card-surface p-6 lg:p-7">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        {Icon ? <Icon className="size-5 text-primary" aria-hidden="true" /> : null}
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm text-muted-foreground">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-1 break-words font-medium text-foreground">{value}</dd>
    </div>
  );
}
