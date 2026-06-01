"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";

const MapView = dynamic(() => import("./map-view"), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
      Loading map…
    </div>
  ),
});

export interface ActiveMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  since: string;
}

export interface RoutePoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: "IN" | "OUT";
  time: string;
  address: string;
}

interface Props {
  markers: ActiveMarker[];
  routePoints: RoutePoint[];
}

export function LiveMapClient({ markers, routePoints }: Props) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const agentNames = Array.from(new Set(routePoints.map((p) => p.name)));
  const filtered = selectedAgent
    ? routePoints.filter((p) => p.name === selectedAgent)
    : routePoints;

  return (
    <div className="space-y-4">
      {/* Filter pills */}
      {agentNames.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedAgent(null)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
              !selectedAgent
                ? "bg-red-600 text-white border-red-600"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            )}
          >
            All Agents
          </button>
          {agentNames.map((name) => (
            <button
              key={name}
              onClick={() => setSelectedAgent(name === selectedAgent ? null : name)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                selectedAgent === name
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              )}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {/* Map */}
      <div
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        style={{ height: "500px" }}
      >
        <MapView markers={markers} routePoints={filtered} />
      </div>

      {/* Active agents list */}
      {markers.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 text-sm">Currently In Field</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {markers.map((m) => (
              <div key={m.id} className="px-5 py-3 flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800">{m.name}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {m.address || `${m.lat.toFixed(4)}, ${m.lng.toFixed(4)}`} · since {m.since}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center text-gray-400 text-sm">
          No agents currently in the field.
        </div>
      )}
    </div>
  );
}
