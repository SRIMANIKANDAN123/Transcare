import { Link } from "@tanstack/react-router";
import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import { Button } from "@/components/ui/button";
import type { Provider } from "@/data/types";
import { formatDistance, type Coords } from "@/lib/geo";

const markerColor: Record<string, string> = {
  hospital: "#2563eb",
  doctor: "#0d9488",
  mental: "#7c5cd6",
  support: "#e05780",
};

function kindOf(provider: Provider) {
  if (provider.type === "Support Organisation") return "support";
  if (provider.type === "Mental Healthcare Centre") return "mental";
  if (provider.type.includes("Hospital")) return "hospital";
  return "doctor";
}

function pinIcon(color: string, active: boolean) {
  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:${active ? 30 : 24}px;height:${
      active ? 30 : 24
    }px;border-radius:9999px;background:${color};border:3px solid #fff;box-shadow:0 4px 12px rgba(15,23,42,.28)"></span>`,
    iconSize: [active ? 30 : 24, active ? 30 : 24],
    iconAnchor: [active ? 15 : 12, active ? 15 : 12],
  });
}

const userIcon = L.divIcon({
  className: "",
  html: `<span style="display:block;width:20px;height:20px;border-radius:9999px;background:#2563eb;border:4px solid #fff;box-shadow:0 0 0 8px rgba(37,99,235,.20)"></span>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function Recenter({ center, zoom }: { center: Coords; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], zoom);
  }, [center.lat, center.lng, zoom, map]);
  return null;
}

export interface LeafletMapProps {
  center: Coords;
  zoom?: number;
  providers: Provider[];
  userCoords?: Coords | null;
  activeId?: string | null;
  onSelect?: (id: string) => void;
}

export default function LeafletMap({
  center,
  zoom = 12,
  providers,
  userCoords,
  activeId,
  onSelect,
}: LeafletMapProps) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      scrollWheelZoom={false}
      zoomControl
      className="size-full"
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Recenter center={center} zoom={zoom} />

      {userCoords ? (
        <Marker position={[userCoords.lat, userCoords.lng]} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>
      ) : null}

      {providers.map((provider) => (
        <Marker
          key={provider.id}
          position={[provider.coordinates.lat, provider.coordinates.lng]}
          icon={pinIcon(markerColor[kindOf(provider)] ?? "#2563eb", activeId === provider.id)}
          eventHandlers={{ click: () => onSelect?.(provider.id) }}
        >
          <Popup>
            <div className="min-w-[13rem] space-y-1.5">
              <p className="text-sm font-semibold text-foreground">{provider.name}</p>
              <p className="text-xs text-muted-foreground">
                {provider.type} · {formatDistance(provider.distanceKm)}
              </p>
              <p className="text-xs text-muted-foreground">
                {provider.services.slice(0, 3).join(" · ")}
              </p>
              <p className="text-xs text-muted-foreground">{provider.about.slice(0, 110)}…</p>
              <Button asChild size="sm" className="mt-1 w-full">
                <Link to="/provider/$providerId" params={{ providerId: provider.id }}>
                  View details
                </Link>
              </Button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
