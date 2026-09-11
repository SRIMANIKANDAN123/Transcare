import { Link } from "@tanstack/react-router";
import { BadgeCheck, IndianRupee, MapPin, Navigation, Video } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Provider } from "@/data/types";

export function ProviderCard({ provider }: { provider: Provider }) {
  return (
    <article className="card-surface card-hover flex h-full flex-col overflow-hidden">
      <div className="relative h-40 shrink-0 overflow-hidden">
        <img
          src={provider.image}
          alt={`${provider.name} — inclusive healthcare setting`}
          loading="lazy"
          className="size-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold text-foreground">{provider.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{provider.type}</p>
          </div>
          <Badge variant="secondary" className="shrink-0 gap-1 rounded-full">
            <BadgeCheck className="size-3.5" aria-hidden="true" />
            {provider.sector}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {provider.services.slice(0, 3).map((service) => (
            <span
              key={service}
              className="rounded-full bg-teal-soft px-2.5 py-1 text-xs font-medium text-foreground/80"
            >
              {service}
            </span>
          ))}
          {provider.services.length > 3 ? (
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
              +{provider.services.length - 3} more
            </span>
          ) : null}
        </div>

        <dl className="grid gap-2 text-sm text-muted-foreground">
          <div className="flex min-w-0 items-center gap-2">
            <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
            <span className="truncate">{provider.location}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <Navigation className="size-4 shrink-0 text-primary" aria-hidden="true" />
              {provider.distanceKm} km
            </span>
            <span className="flex items-center gap-1.5">
              <IndianRupee className="size-4 shrink-0 text-primary" aria-hidden="true" />
              {provider.affordability}
            </span>
            {provider.teleconsultation ? (
              <span className="flex items-center gap-1.5">
                <Video className="size-4 shrink-0 text-primary" aria-hidden="true" />
                Online
              </span>
            ) : null}
          </div>
        </dl>

        <p className="text-sm text-muted-foreground">
          Consultation: <span className="font-medium text-foreground">{provider.consultationRange}</span>
          {provider.assistanceAvailable ? " · assistance desk available" : ""}
        </p>

        <div className="mt-auto pt-1">
          <Button asChild className="w-full">
            <Link to="/provider/$providerId" params={{ providerId: provider.id }}>
              View details
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

export function ProviderCardSkeleton() {
  return (
    <div className="card-surface h-[26rem] animate-pulse overflow-hidden">
      <div className="h-40 bg-muted" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 rounded bg-muted" />
        <div className="h-4 w-1/3 rounded bg-muted" />
        <div className="h-16 rounded bg-muted" />
        <div className="h-10 rounded bg-muted" />
      </div>
    </div>
  );
}
