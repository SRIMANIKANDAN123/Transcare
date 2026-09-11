import type { Provider } from "@/data/types";

export interface Coords {
  lat: number;
  lng: number;
}

/** Approximate great-circle distance in kilometres. */
export function distanceKm(a: Coords, b: Coords) {
  const R = 6371;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function formatDistance(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} m away`;
  return `${km.toFixed(1)} km away`;
}

/**
 * Returns providers with a distance measured from `origin` when available,
 * otherwise keeps the distance recorded in the dataset.
 */
export function withDistance(list: Provider[], origin: Coords | null): Provider[] {
  if (!origin) return list;
  return list.map((p) => ({
    ...p,
    distanceKm: Number(distanceKm(origin, p.coordinates).toFixed(1)),
  }));
}

/** Fallback city centres used when the browser cannot share a location. */
export const cityCentres: Record<string, Coords> = {
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Delhi: { lat: 28.6139, lng: 77.209 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Madurai: { lat: 9.9252, lng: 78.1198 },
  Coimbatore: { lat: 11.0168, lng: 76.9558 },
};
