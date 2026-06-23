import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatTime, formatDate, formatCentralDate, centralDaysAgo } from "@/lib/utils";
import { MapPin } from "lucide-react";

export default async function AgentHistoryPage() {
  const session = await auth();
  const userId = session!.user.id;

  const entries = await prisma.punchEntry.findMany({
    where: {
      userId,
      punchInTime: { gte: centralDaysAgo(7) },
    },
    orderBy: { punchInTime: "desc" },
    take: 60,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-red-600 text-white px-5 pt-12 pb-5 safe-top">
        <h1 className="text-xl font-bold">Location History</h1>
        <p className="text-red-200 text-sm mt-1">Last 7 days · all punch in/out locations</p>
      </div>

      <div className="px-4 py-4 space-y-2">
        {entries.length === 0 && (
          <div className="text-center py-12 text-gray-400">No activity found.</div>
        )}
        {entries.map((e) => (
          <div key={e.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-500">{formatCentralDate(e.punchInTime)} · Session {e.sequence}</p>
              {e.entryHours && (
                <span className="text-xs font-medium text-gray-600">{String(Number(e.entryHours).toFixed(2))}h</span>
              )}
            </div>
            <div className="divide-y divide-gray-50">
              {/* Punch In row */}
              <div className="px-4 py-3 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-green-700">PUNCH IN</p>
                  <p className="text-sm font-medium text-gray-800 mt-0.5">{formatTime(e.punchInTime)}</p>
                  {e.punchInAddress && (
                    <p className="text-xs text-gray-500 mt-0.5">{e.punchInAddress}</p>
                  )}
                  <p className="text-xs text-gray-300 mt-0.5">
                    {Number(e.punchInLat).toFixed(5)}, {Number(e.punchInLng).toFixed(5)}
                  </p>
                </div>
              </div>
              {/* Punch Out row */}
              {e.punchOutTime && (
                <div className="px-4 py-3 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-red-600">PUNCH OUT</p>
                    <p className="text-sm font-medium text-gray-800 mt-0.5">{formatTime(e.punchOutTime)}</p>
                    {e.punchOutAddress && (
                      <p className="text-xs text-gray-500 mt-0.5">{e.punchOutAddress}</p>
                    )}
                    {e.punchOutLat && (
                      <p className="text-xs text-gray-300 mt-0.5">
                        {Number(e.punchOutLat).toFixed(5)}, {Number(e.punchOutLng).toFixed(5)}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
