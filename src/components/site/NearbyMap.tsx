import { Crosshair, Loader2, MapPin } from "lucide-react";
import { Suspense, lazy, useEffect, useMemo, useState } from "react";

import { MapLegend } from "@/components/site/MapPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Provider } from "@/data/types";
import { useGeolocation } from "@/hooks/useGeolocation";
import { cn } from "@/lib/utils";
import { cityCentres, withDistance, type Coords } from "@/lib/geo";

const LeafletMap = lazy(() => import("@/components/site/LeafletMap"));

export interface NearbyMapProps {
  providers: Provider[];
  city: string;
  onCityChange?: (city: string) => void;
  /** Extra controls (service filters) rendered above the map. */
  controls?: React.ReactNode;
  className?: string;
  onProvidersResolved?: (providers: Provider[]) => void;
}

/**
 * "Healthcare near you" map. Uses OpenStreetMap tiles through Leaflet, asks for
 * device location on demand and degrades to a city-centred view when the
 * browser cannot share a location.
 */
export function NearbyMap({
  providers,
  city,
  onCityChange,
  controls,
  className,
  onProvidersResolved,
}: NearbyMapProps) {
  const { coords, status, request } = useGeolocation();
  const [mounted, setMounted] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [locationQuery, setLocationQuery] = useState("");

  useEffect(() => setMounted(true), []);

  const center: Coords = coords ?? cityCentres[city] ?? cityCentres["Chennai"]!;

  const ranked = useMemo(() => {
    const list = withDistance(providers, coords);
    return [...list].sort((a, b) => a.distanceKm - b.distanceKm);
  }, [providers, coords]);

  useEffect(() => {
    onProvidersResolved?.(ranked);
  }, [ranked, onProvidersResolved]);

  const active = ranked.find((p) => p.id === activeId) ?? null;

  const searchLocation = (event: React.FormEvent) => {
    event.preventDefault();
    const match = Object.keys(cityCentres).find(
      (name) => name.toLowerCase() === locationQuery.trim().toLowerCase(),
    );
    if (match) {
      onCityChange?.(match);
      setLocationQuery("");
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" className="rounded-full" onClick={request}>
          {status === "locating" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Crosshair className="size-4" aria-hidden="true" />
          )}
          {status === "granted" ? "Location on" : "Use my location"}
        </Button>
        <form onSubmit={searchLocation} className="flex min-w-[15rem] flex-1 items-center gap-2">
          <div className="relative flex-1">
            <MapPin
              className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder={`Search a city or area (currently ${city})`}
              aria-label="Search a city or area"
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="secondary">
            Go
          </Button>
        </form>
        {controls}
      </div>

      {status === "denied" ? (
        <p className="rounded-2xl border border-border bg-muted/60 p-3 text-sm text-muted-foreground">
          Location access is disabled. Search for a city or area to explore nearby healthcare.
        </p>
      ) : null}
      {status === "unavailable" ? (
        <p className="rounded-2xl border border-border bg-muted/60 p-3 text-sm text-muted-foreground">
          Your device could not share a location. Search for a city or area instead.
        </p>
      ) : null}

      <div className="relative h-[24rem] overflow-hidden rounded-3xl border border-border bg-surface shadow-card lg:h-[28rem]">
        {mounted ? (
          <Suspense
            fallback={
              <div className="grid size-full place-items-center text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Loading map…
                </span>
              </div>
            }
          >
            <LeafletMap
              center={center}
              zoom={coords ? 13 : 12}
              providers={ranked}
              userCoords={coords}
              activeId={activeId}
              onSelect={setActiveId}
            />
          </Suspense>
        ) : (
          <div className="grid size-full place-items-center text-sm text-muted-foreground">
            Preparing map…
          </div>
        )}
      </div>

      <MapLegend />

      {ranked.length === 0 ? (
        <p className="rounded-2xl border border-border bg-muted/60 p-4 text-sm text-muted-foreground">
          No healthcare providers found for this area or service. Try another service or a different
          city.
        </p>
      ) : null}

      {active ? (
        <p className="text-sm text-muted-foreground">
          Selected: <span className="font-medium text-foreground">{active.name}</span> ·{" "}
          {active.distanceKm} km
        </p>
      ) : null}
    </div>
  );
}
