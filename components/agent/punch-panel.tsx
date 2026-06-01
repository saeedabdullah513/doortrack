"use client";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, AlertTriangle } from "lucide-react";

interface PunchPanelProps {
  hasOpenEntry: boolean;     // currently punched in, awaiting punch-out
  isPunchedOutForDay: boolean; // all entries closed — can still punch in again
  onAction: (
    type: "PUNCH_IN" | "PUNCH_OUT",
    coords: GeolocationCoordinates
  ) => Promise<void>;
}

function getGpsPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("GPS is not available on this device."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    });
  });
}

export function PunchPanel({ hasOpenEntry, isPunchedOutForDay, onAction }: PunchPanelProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAction = useCallback(
    async (type: "PUNCH_IN" | "PUNCH_OUT") => {
      setError(null);
      setLoading(type);
      try {
        const pos = await getGpsPosition();
        await onAction(type, pos.coords);
      } catch (err: unknown) {
        if (err instanceof GeolocationPositionError) {
          setError("Unable to get GPS. Please allow location access and try again.");
        } else {
          setError((err as Error).message ?? "Something went wrong.");
        }
      } finally {
        setLoading(null);
      }
    },
    [onAction]
  );

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Not punched in — show Punch In */}
      {!hasOpenEntry && (
        <Button
          size="xl"
          loading={loading === "PUNCH_IN"}
          onClick={() => handleAction("PUNCH_IN")}
          className="bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white text-lg py-5 rounded-2xl shadow-lg shadow-green-200"
        >
          <MapPin className="w-6 h-6" />
          Punch In
        </Button>
      )}

      {/* Punched in — show Punch Out */}
      {hasOpenEntry && (
        <Button
          size="xl"
          variant="danger"
          loading={loading === "PUNCH_OUT"}
          onClick={() => handleAction("PUNCH_OUT")}
          className="py-5 rounded-2xl text-lg shadow-lg shadow-red-100 border-red-300"
        >
          <MapPin className="w-6 h-6" />
          Punch Out
        </Button>
      )}

      {/* Helper text */}
      <p className="text-xs text-center text-gray-400">
        {hasOpenEntry
          ? "You are currently punched in. Punch out when you leave a location."
          : isPunchedOutForDay
          ? "All sessions closed. You can punch in again at your next location."
          : "Punch in when you arrive at your first location."}
      </p>
    </div>
  );
}
