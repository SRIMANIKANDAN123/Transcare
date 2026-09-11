/**
 * Data access layer.
 *
 * Every function here mirrors a future REST endpoint, so the UI never touches
 * the mock arrays directly. When the backend is ready, swap the bodies for
 * fetch calls and nothing in the components has to change.
 *
 *   getProviders()      -> GET /api/providers
 *   getProvider(id)     -> GET /api/providers/:id
 *   getDoctors()        -> GET /api/doctors
 *   getServices()       -> GET /api/services
 *   getSchemes()        -> GET /api/schemes
 *   getScheme(id)       -> GET /api/schemes/:id
 *   getOrganisations()  -> GET /api/organizations
 *   getArticles()       -> GET /api/articles
 *   globalSearch(q)     -> GET /api/search
 *   getNearby(params)   -> GET /api/nearby
 */
import { articles } from "@/data/articles";
import { doctors } from "@/data/doctors";
import { organisations } from "@/data/organisations";
import { providers } from "@/data/providers";
import { schemes } from "@/data/schemes";
import { services } from "@/data/services";
import type { Article, Doctor, Organisation, Provider, Scheme, ServiceItem } from "@/data/types";

const LATENCY = 220;

function respond<T>(payload: T, delay = LATENCY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(payload), delay));
}

export interface ProviderQuery {
  q?: string | undefined;
  city?: string | undefined;
  service?: string | undefined;
  type?: string | undefined;
  sector?: string | undefined;
  affordable?: boolean | undefined;
  verified?: boolean | undefined;
  maxDistance?: number | undefined;
  sort?: "relevance" | "distance" | "affordability" | undefined;
}

const affordabilityRank: Record<string, number> = {
  "Low cost": 0,
  Moderate: 1,
  Premium: 2,
};

const typeBuckets: Record<string, string[]> = {
  Hospitals: ["Government Hospital", "Private Hospital"],
  Clinics: ["Clinic", "Community Clinic"],
  "Mental Healthcare": ["Mental Healthcare Centre"],
  "Support Organisations": ["Support Organisation"],
};

export function filterProviders(list: Provider[], query: ProviderQuery): Provider[] {
  const q = query.q?.trim().toLowerCase();
  let result = list.filter((p) => {
    if (q) {
      const haystack = [p.name, p.type, p.location, p.city, ...p.services].join(" ").toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (query.city && query.city !== "All cities" && p.city !== query.city) return false;
    if (query.service && query.service !== "All services" && !p.services.includes(query.service))
      return false;
    if (query.type && query.type !== "All types") {
      const allowed = typeBuckets[query.type] ?? [query.type];
      if (!allowed.includes(p.type)) return false;
    }
    if (query.sector && query.sector !== "All" && p.sector !== query.sector) return false;
    if (query.affordable && p.affordability !== "Low cost") return false;
    if (query.verified && p.listingStatus !== "Directory listed") return false;
    if (query.maxDistance && p.distanceKm > query.maxDistance) return false;
    return true;
  });

  if (query.sort === "distance") {
    result = [...result].sort((a, b) => a.distanceKm - b.distanceKm);
  } else if (query.sort === "affordability") {
    result = [...result].sort(
      (a, b) => (affordabilityRank[a.affordability] ?? 9) - (affordabilityRank[b.affordability] ?? 9),
    );
  }
  return result;
}

export async function getProviders(query: ProviderQuery = {}): Promise<Provider[]> {
  return respond(filterProviders(providers, query));
}

export async function getProvider(id: string): Promise<Provider | undefined> {
  return respond(providers.find((p) => p.id === id));
}

export async function getDoctors(city?: string): Promise<Doctor[]> {
  return respond(city ? doctors.filter((d) => d.city === city) : doctors);
}

export async function getServices(): Promise<ServiceItem[]> {
  return respond(services);
}

export async function getSchemes(query: { q?: string | undefined; category?: string | undefined } = {}): Promise<Scheme[]> {
  const q = query.q?.trim().toLowerCase();
  return respond(
    schemes.filter((s) => {
      if (query.category && query.category !== "All" && s.category !== query.category) return false;
      if (!q) return true;
      return [s.name, s.overview, s.authority, s.category].join(" ").toLowerCase().includes(q);
    }),
  );
}

export async function getScheme(id: string): Promise<Scheme | undefined> {
  return respond(schemes.find((s) => s.id === id));
}

export async function getOrganisations(type?: string): Promise<Organisation[]> {
  return respond(type && type !== "All" ? organisations.filter((o) => o.type === type) : organisations);
}

export async function getArticles(): Promise<Article[]> {
  return respond(articles);
}

export async function getNearby(params: { city?: string | undefined; service?: string | undefined; maxDistance?: number | undefined }) {
  return respond(
    filterProviders(providers, {
      city: params.city,
      service: params.service,
      maxDistance: params.maxDistance,
      sort: "distance",
    }),
  );
}

export interface SearchResults {
  providers: Provider[];
  doctors: Doctor[];
  services: ServiceItem[];
  schemes: Scheme[];
  organisations: Organisation[];
  total: number;
}

export function searchAll(term: string): SearchResults {
  const q = term.trim().toLowerCase();
  if (!q) {
    return { providers: [], doctors: [], services: [], schemes: [], organisations: [], total: 0 };
  }
  const match = (...parts: (string | string[])[]) =>
    parts.flat().join(" ").toLowerCase().includes(q);

  const p = providers.filter((x) => match(x.name, x.type, x.city, x.location, x.services)).slice(0, 5);
  const d = doctors.filter((x) => match(x.name, x.specialty, x.city, x.focusAreas)).slice(0, 5);
  const s = services.filter((x) => match(x.title, x.group, x.description)).slice(0, 5);
  const sc = schemes.filter((x) => match(x.name, x.overview, x.category)).slice(0, 5);
  const o = organisations.filter((x) => match(x.name, x.type, x.city, x.services)).slice(0, 5);

  return {
    providers: p,
    doctors: d,
    services: s,
    schemes: sc,
    organisations: o,
    total: p.length + d.length + s.length + sc.length + o.length,
  };
}

export async function globalSearch(term: string): Promise<SearchResults> {
  return respond(searchAll(term), 160);
}

export const cities = ["Chennai", "Hyderabad", "Mumbai"] as const;
export const providerTypeFilters = [
  "All types",
  "Hospitals",
  "Clinics",
  "Mental Healthcare",
  "Support Organisations",
] as const;
