import { Brain, Hospital, Stethoscope, Handshake } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Provider } from "@/data/types";

/**
 * Map-style visual. Markers are positioned from provider coordinates using a
 * simple linear projection, so this component can be swapped for MapLibre /
 * OpenStreetMap later without changing its props.
 */
export function markerKind(provider: Provider) {
  if (provider.type === "Support Organisation") return "support" as const;
  if (provider.type === "Mental Healthcare Centre") return "mental" as const;
  if (provider.type.includes("Hospital")) return "hospital" as const;
  return "doctor" as const;
}

const markerMeta = {
  hospital: { label: "Hospital", Icon: Hospital, className: "bg-primary text-primary-foreground" },
  doctor: { label: "Doctor / clinic", Icon: Stethoscope, className: "bg-teal text-primary-foreground" },
  mental: { label: "Mental healthcare", Icon: Brain, className: "bg-lilac text-primary-foreground" },
  support: { label: "Support organisation", Icon: Handshake, className: "bg-rose text-primary-foreground" },
} as const;

export function MapLegend({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground", className)}>
      {Object.entries(markerMeta).map(([key, { label, Icon, className: dot }]) => (
        <li key={key} className="flex items-center gap-2">
          <span className={cn("grid size-6 place-items-center rounded-full", dot)}>
            <Icon className="size-3.5" aria-hidden="true" />
          </span>
          {label}
        </li>
      ))}
    </ul>
  );
}

export function MapPanel({
  providers,
  activeId,
  onSelect,
  className,
  city = "Chennai",
}: {
  providers: Provider[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
  city?: string;
}) {
  const lats = providers.map((p) => p.coordinates.lat);
  const lngs = providers.map((p) => p.coordinates.lng);
  const minLat = Math.min(...lats, 0);
  const maxLat = Math.max(...lats, 1);
  const minLng = Math.min(...lngs, 0);
  const maxLng = Math.max(...lngs, 1);

  const pos = (p: Provider) => ({
    left: `${12 + ((p.coordinates.lng - minLng) / (maxLng - minLng || 1)) * 76}%`,
    top: `${86 - ((p.coordinates.lat - minLat) / (maxLat - minLat || 1)) * 72}%`,
  });

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border bg-surface shadow-card",
        className,
      )}
      role="img"
      aria-label={`Map overview of healthcare locations in ${city}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--border) 70%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--border) 70%, transparent) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -top-16 -right-10 size-64 rounded-full bg-teal-soft blur-2xl"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-[-4rem] left-[-3rem] size-72 rounded-full bg-lilac-soft blur-2xl"
      />
      <svg aria-hidden="true" className="absolute inset-0 size-full" viewBox="0 0 400 300" fill="none">
        <path d="M-10 210 C 90 180, 160 240, 420 190" stroke="var(--border)" strokeWidth="10" />
        <path d="M60 -10 C 90 120, 190 150, 230 320" stroke="var(--border)" strokeWidth="8" />
        <path d="M-10 90 C 120 70, 240 40, 420 80" stroke="var(--border)" strokeWidth="6" />
      </svg>

      <div className="absolute top-4 left-4 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold text-foreground shadow-card backdrop-blur">
        📍 {city}
      </div>

      {providers.slice(0, 12).map((provider) => {
        const kind = markerKind(provider);
        const { Icon, className: dot } = markerMeta[kind];
        const active = activeId === provider.id;
        return (
          <button
            key={provider.id}
            type="button"
            onClick={() => onSelect?.(provider.id)}
            style={pos(provider)}
            aria-label={`${provider.name}, ${provider.location}`}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-1 transition-transform duration-200 hover:scale-110 focus-visible:scale-110",
              active && "scale-115",
            )}
          >
            <span
              className={cn(
                "grid size-9 place-items-center rounded-full shadow-lift ring-2 ring-background",
                dot,
                active && "ring-4 ring-primary/30",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
            </span>
          </button>
        );
      })}

    </div>
  );
}
