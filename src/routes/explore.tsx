import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Disclaimer } from "@/components/site/DemoBadge";
import { PageHero } from "@/components/site/PageHero";
import { ProviderCard } from "@/components/site/ProviderCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { providers } from "@/data/providers";
import { services } from "@/data/services";
import { filterProviders, providerTypeFilters, cities } from "@/lib/api";

export interface ExploreSearch {
  q?: string | undefined;
  city?: string | undefined;
  service?: string | undefined;
  type?: string | undefined;
  sector?: string | undefined;
  affordable?: boolean | undefined;
  verified?: boolean | undefined;
  distance?: number | undefined;
  sort?: "relevance" | "distance" | "affordability" | undefined;
}

export const Route = createFileRoute("/explore")({
  validateSearch: (search: Record<string, unknown>): ExploreSearch => ({
    q: typeof search['q'] === "string" ? search['q'] : undefined,
    city: typeof search['city'] === "string" ? search['city'] : undefined,
    service: typeof search['service'] === "string" ? search['service'] : undefined,
    type: typeof search['type'] === "string" ? search['type'] : undefined,
    sector: typeof search['sector'] === "string" ? search['sector'] : undefined,
    affordable: search['affordable'] === true || search['affordable'] === "true" ? true : undefined,
    verified: search['verified'] === true || search['verified'] === "true" ? true : undefined,
    distance: typeof search['distance'] === "number" ? search['distance'] : undefined,
    sort:
      search['sort'] === "distance" || search['sort'] === "affordability" || search['sort'] === "relevance"
        ? search['sort']
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Explore inclusive healthcare providers — TransCare" },
      {
        name: "description",
        content:
          "Filter healthcare providers by service, city, provider type, affordability and distance.",
      },
      { property: "og:title", content: "Explore inclusive healthcare providers — TransCare" },
      {
        property: "og:description",
        content: "Filter providers by service, city, type, affordability and distance.",
      },
    ],
  }),
  component: ExplorePage,
});

function ExplorePage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/explore" });
  const [term, setTerm] = useState(search.q ?? "");

  const update = (patch: Partial<ExploreSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }) });

  const results = useMemo(
    () =>
      filterProviders(providers, {
        q: search.q,
        city: search.city,
        service: search.service,
        type: search.type,
        sector: search.sector,
        affordable: search.affordable,
        verified: search.verified,
        maxDistance: search.distance,
        sort: search.sort ?? "relevance",
      }),
    [search],
  );

  const activeFilters = [
    search.service && { label: search.service, clear: { service: undefined } },
    search.city && { label: search.city, clear: { city: undefined } },
    search.type && search.type !== "All types" && { label: search.type, clear: { type: undefined } },
    search.sector && search.sector !== "All" && { label: search.sector, clear: { sector: undefined } },
    search.affordable && { label: "Low cost only", clear: { affordable: undefined } },
    search.verified && { label: "Directory listed", clear: { verified: undefined } },
    search.distance && { label: `Within ${search.distance} km`, clear: { distance: undefined } },
  ].filter(Boolean) as { label: string; clear: Partial<ExploreSearch> }[];

  const filterPanel = (
    <div className="space-y-6">
      <Field label="Location">
        <Select
          value={search.city ?? "All cities"}
          onValueChange={(v) => update({ city: v === "All cities" ? undefined : v })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All cities">All cities</SelectItem>
            {cities.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Healthcare service">
        <Select
          value={search.service ?? "All services"}
          onValueChange={(v) => update({ service: v === "All services" ? undefined : v })}
        >
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
      </Field>

      <Field label="Provider type">
        <Select
          value={search.type ?? "All types"}
          onValueChange={(v) => update({ type: v === "All types" ? undefined : v })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {providerTypeFilters.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Government / private">
        <Select
          value={search.sector ?? "All"}
          onValueChange={(v) => update({ sector: v === "All" ? undefined : v })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["All", "Government", "Private", "NGO"].map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label={`Distance — within ${search.distance ?? 600} km`}>
        <Slider
          value={[search.distance ?? 600]}
          min={5}
          max={600}
          step={5}
          onValueChange={([v]) => update({ distance: v ?? 600 })}
          aria-label="Maximum distance in kilometres"
        />
      </Field>

      <div className="space-y-3 rounded-2xl bg-muted/60 p-4">
        <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
          <Checkbox
            checked={!!search.affordable}
            onCheckedChange={(v) => update({ affordable: v ? true : undefined })}
          />
          Affordable (low cost) only
        </label>
        <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
          <Checkbox
            checked={!!search.verified}
            onCheckedChange={(v) => update({ verified: v ? true : undefined })}
          />
          Listed in the directory only
        </label>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setTerm("");
          navigate({ search: {} });
        }}
      >
        Reset all filters
      </Button>
    </div>
  );

  return (
    <>
      <PageHero
        eyebrow="Discover → Compare"
        title="Explore Healthcare"
        description="Search the TransCare directory and compare providers by service, cost, distance and support available."
      >
        <form
          className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"
          onSubmit={(e) => {
            e.preventDefault();
            update({ q: term || undefined });
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
              aria-label="Search providers"
              className="h-14 rounded-2xl bg-background pl-12 text-base shadow-card"
            />
          </div>
          <Button type="submit" size="lg" className="h-14 rounded-2xl px-8">
            Search
          </Button>
        </form>
      </PageHero>

      <div className="shell py-10 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="card-surface sticky top-24 p-6">
              <h2 className="flex items-center gap-2 text-sm font-semibold tracking-[0.12em] uppercase">
                <SlidersHorizontal className="size-4 text-primary" aria-hidden="true" />
                Filters
              </h2>
              <div className="mt-6">{filterPanel}</div>
            </div>
          </aside>

          <section aria-label="Results">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{results.length}</span> providers
                  match your filters
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <Filter className="size-4" aria-hidden="true" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl">
                    <SheetTitle>Filters</SheetTitle>
                    <div className="mt-6 pb-8">{filterPanel}</div>
                  </SheetContent>
                </Sheet>
                <Select
                  value={search.sort ?? "relevance"}
                  onValueChange={(v) => update({ sort: v as ExploreSearch["sort"] })}
                >
                  <SelectTrigger className="w-[10.5rem]" aria-label="Sort results">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="distance">Distance</SelectItem>
                    <SelectItem value="affordability">Affordability</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {activeFilters.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {activeFilters.map((f) => (
                  <button
                    key={f.label}
                    type="button"
                    onClick={() => update(f.clear)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    {f.label}
                    <X className="size-3.5" aria-hidden="true" />
                  </button>
                ))}
              </div>
            ) : null}

            {results.length === 0 ? (
              <div className="card-surface mt-8 p-12 text-center">
                <h3 className="text-lg font-semibold">No providers match these filters</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                  Try widening the distance, removing the affordability filter, or choosing “All
                  services”.
                </p>
                <Button className="mt-6" onClick={() => navigate({ search: {} })}>
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            )}

            <Disclaimer className="mt-10">
              Confirm services, costs and availability directly with any provider before your
              visit.
            </Disclaimer>
          </section>
        </div>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
    </div>
  );
}
