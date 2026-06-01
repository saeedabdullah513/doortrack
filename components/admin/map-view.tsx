"use client";
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { ActiveMarker, RoutePoint } from "./live-map-client";

// Fix Leaflet default icon broken by webpack
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const AGENT_COLORS = [
  "#dc2626", "#2563eb", "#16a34a", "#d97706",
  "#7c3aed", "#db2777", "#0891b2", "#65a30d",
];

function colorFor(name: string, names: string[]): string {
  return AGENT_COLORS[names.indexOf(name) % AGENT_COLORS.length];
}

export default function MapView({
  markers,
  routePoints,
}: {
  markers: ActiveMarker[];
  routePoints: RoutePoint[];
}) {
  // Default center: geographic center of the contiguous US
  const defaultCenter: [number, number] = [39.5, -98.35];
  const center: [number, number] =
    markers.length > 0
      ? [markers[0].lat, markers[0].lng]
      : routePoints.length > 0
      ? [routePoints[0].lat, routePoints[0].lng]
      : defaultCenter;

  const zoom = markers.length > 0 || routePoints.length > 0 ? 13 : 4;
  const agentNames = Array.from(new Set(routePoints.map((p) => p.name)));

  // Build polyline per agent: in-time order
  const polylines: Record<string, [number, number][]> = {};
  for (const p of routePoints) {
    if (!polylines[p.name]) polylines[p.name] = [];
    polylines[p.name].push([p.lat, p.lng]);
  }

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Active agent markers */}
      {markers.map((m) => (
        <Marker key={m.id} position={[m.lat, m.lng]}>
          <Popup>
            <strong>{m.name}</strong>
            <br />
            {m.address && <span>{m.address}<br /></span>}
            Punched in at {m.since}
          </Popup>
        </Marker>
      ))}

      {/* Route polylines */}
      {Object.entries(polylines).map(([name, pts]) => (
        <Polyline
          key={name}
          positions={pts}
          color={colorFor(name, agentNames)}
          weight={2.5}
          opacity={0.7}
          dashArray="5, 5"
        />
      ))}

      {/* Punch-in/out dots */}
      {routePoints.map((p) => (
        <CircleMarker
          key={p.id}
          center={[p.lat, p.lng]}
          radius={6}
          fillColor={p.type === "IN" ? "#16a34a" : "#dc2626"}
          color="#ffffff"
          weight={2}
          fillOpacity={1}
        >
          <Popup>
            <strong>{p.name}</strong>
            <br />
            {p.type === "IN" ? "Punched In" : "Punched Out"} at {p.time}
            {p.address && <><br />{p.address}</>}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
