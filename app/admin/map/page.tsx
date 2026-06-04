import { prisma } from "@/lib/db";
import { LiveMapClient } from "@/components/admin/live-map-client";
import { formatTime, localMidnight } from "@/lib/utils";

export default async function AdminMapPage() {
  const today = localMidnight();

  // Agents with an open punch entry = currently in field
  const openEntries = await prisma.punchEntry.findMany({
    where: { punchOutTime: null, day: { date: today } },
    include: { user: { select: { name: true } } },
    orderBy: { punchInTime: "asc" },
  });

  const activeMarkers = openEntries.map((e) => ({
    id: e.id,
    name: e.user.name,
    lat: Number(e.punchInLat),
    lng: Number(e.punchInLng),
    address: e.punchInAddress ?? "",
      since: formatTime(e.punchInTime),
    orderBy: { punchInTime: "asc" },
  });

  const routePoints = allEntries.flatMap((e) => {
    const pts = [
      {
        id: `in-${e.id}`,
        name: e.user.name,
        lat: Number(e.punchInLat),
        lng: Number(e.punchInLng),
        type: "IN" as "IN" | "OUT",
        time: formatTime(e.punchInTime),
        address: e.punchInAddress ?? "",
      },
    ];
    if (e.punchOutTime && e.punchOutLat && e.punchOutLng) {
      pts.push({
        id: `out-${e.id}`,
        name: e.user.name,
        lat: Number(e.punchOutLat),
        lng: Number(e.punchOutLng),
        type: "OUT" as const,
        time: formatTime(e.punchOutTime),
        address: e.punchOutAddress ?? "",
      });
    }
    return pts;
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Live Map</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {activeMarkers.length} agent{activeMarkers.length !== 1 ? "s" : ""} currently in field
        </p>
      </div>
      <LiveMapClient markers={activeMarkers} routePoints={routePoints} />
    </div>
  );
}
