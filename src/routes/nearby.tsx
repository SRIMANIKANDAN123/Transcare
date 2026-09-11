import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Disclaimer } from "@/components/site/DemoBadge";
import { NearbyMap } from "@/components/site/NearbyMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { providers } from "@/data/providers";
import { services } from "@/data/services";
import { cities, filterProviders } from "@/lib/api";

export const Route = createFileRoute("/nearby")({
  head: () => ({
    meta: [
      { title: "Healthcare near you — TransCare" },
      {
        name: "description",
        content:
          "A map view of hospitals, clinics, mental healthcare centres and support organisations near you.",
      },
      { property: "og:title", content: "Healthcare near you — TransCare" },
      {
        property: "og:description",
        content: "Map discovery of nearby healthcare providers and support organisations.",
      },
    ],
  }),
  component: NearbyPage,
});

function NearbyPage() {
  const [term, setTerm] = useState("");
  const [city, setCity] = useState<string>("Chennai");
  const [service, setService] = useState("All services");
  const [distance, setDistance] = useState(20);
  const [activeId, setActiveId] = useState<string | null>(null);

  const results = useMemo(
    () =>
      filterProviders(providers, {
        q: term,
        city,
        service,
        maxDistance: distance,
        sort: "distance",
      }),
    [term, city, service, distance],
  );

  const active = results.find((p) => p.id === activeId) ?? results[0];

  return (
    <div className="shell py-10 lg:py-14">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold sm:text-4xl">Healthcare near you</h1>
          <p className="mt-2 text-muted-foreground">
            Healthcare around <span className="font-medium text-foreground">{city}</span>.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <aside className="card-surface space-y-6 p-6 lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-2">
            <Label htmlFor="nearby-search">Search</Label>
            <div className="relative">
              <Search
                className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="nearby-search"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Provider or service"
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger>
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
          </div>

          <div className="space-y-2">
            <Label>Service</Label>
            <Select value={service} onValueChange={setService}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All services">All services</SelectItem>
                {services.map((s) => (
                  <SelectItem key={s.id} value={s.searchKey}>
                    {s.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Within {distance} km</Label>
            <Slider
              value={[distance]}
              min={2}
              max={40}
              step={1}
              onValueChange={([v]) => setDistance(v ?? 20)}
              aria-label="Distance in kilometres"
            />
          </div>

        </aside>

        <section className="space-y-6">
          <NearbyMap providers={results} city={city} onCityChange={setCity} />

          {active ? (
            <article className="card-surface grid gap-5 p-6 sm:grid-cols-[10rem_minmax(0,1fr)]">
              <img
                src={active.image}
                alt={`${active.name} setting`}
                loading="lazy"
                className="h-32 w-full rounded-2xl object-cover sm:h-full"
              />
              <div className="min-w-0">
                <h2 className="text-lg font-semibold">{active.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {active.type} · {active.affordability} · {active.distanceKm} km
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4 text-primary" aria-hidden="true" />
                  {active.location}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">{active.services.join(" · ")}</p>
                <Button asChild className="mt-4 rounded-full">
                  <Link to="/provider/$providerId" params={{ providerId: active.id }}>
                    View details
                  </Link>
                </Button>
              </div>
            </article>
          ) : (
            <div className="card-surface p-10 text-center">
              <h2 className="text-lg font-semibold">Nothing within {distance} km</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Increase the distance or choose “All services”.
              </p>
            </div>
          )}

          <div className="grid gap-3">
            {results.map((provider) => (
              <button
                key={provider.id}
                type="button"
                onClick={() => setActiveId(provider.id)}
                className={`card-surface grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4 text-left transition-colors hover:border-primary ${
                  active?.id === provider.id ? "border-primary" : ""
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">{provider.name}</span>
                  <span className="block truncate text-sm text-muted-foreground">
                    {provider.type} · {provider.location}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-semibold text-primary">
                  {provider.distanceKm} km
                </span>
              </button>
            ))}
          </div>

          <Disclaimer>
            Distances are approximate. Confirm services, costs and timings directly with the
            provider before travelling.
          </Disclaimer>
        </section>
      </div>
    </div>
  );
}
