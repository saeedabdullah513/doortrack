import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatTime, formatHours, getStatusLabel, getStatusColor } from "@/lib/utils";
import { format, subDays } from "date-fns";
import { MapPin } from "lucide-react";

export default async function AgentAttendancePage() {
  const session = await auth();
  const userId = session!.user.id;

  const days = await prisma.attendanceDay.findMany({
    where: { userId, date: { gte: subDays(new Date(), 30) } },
    include: { punchEntries: { orderBy: { sequence: "asc" } } },
    orderBy: { date: "desc" },
    take: 30,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-red-600 text-white px-5 pt-12 pb-5 safe-top">
        <h1 className="text-xl font-bold">My Attendance</h1>
        <p className="text-red-200 text-sm mt-1">Last 30 days</p>
      </div>

      <div className="px-4 py-4 space-y-3">
        {days.length === 0 && (
          <div className="text-center py-12 text-gray-400">No records found.</div>
        )}
        {days.map((d) => {
          const variant =
            d.status === "COMPLETED" ? "text-green-700 bg-green-50 border-green-100"
            : d.status === "BELOW_TARGET" ? "text-amber-700 bg-amber-50 border-amber-100"
            : d.status === "IN_PROGRESS" ? "text-blue-700 bg-blue-50 border-blue-100"
            : "text-red-700 bg-red-50 border-red-100";

          return (
            <div key={d.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Day header */}
              <div className="px-4 py-3 flex items-center justify-between border-b border-gray-50">
                <p className="font-semibold text-gray-800 text-sm">
                  {format(d.date, "EEE, MMM dd yyyy")}
                </p>
                <div className="flex items-center gap-2">
                  {d.totalHours && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${variant}`}>
                      {formatHours(Number(d.totalHours))}
                    </span>
                  )}
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${variant}`}>
                    {getStatusLabel(d.status)}
                  </span>
                </div>
              </div>

              {/* Punch entries */}
              {d.punchEntries.map((e) => (
                <div key={e.id} className="px-4 py-3 border-b border-gray-50 last:border-0">
                  <p className="text-xs font-semibold text-gray-400 mb-2">Session {e.sequence}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-400">In</p>
                      <p className="text-sm font-semibold text-gray-800">{formatTime(e.punchInTime)}</p>
                      {e.punchInAddress && (
                        <p className="text-xs text-gray-500 mt-0.5 flex items-start gap-1">
                          <MapPin className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                          {e.punchInAddress}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Out</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {e.punchOutTime ? formatTime(e.punchOutTime) : "—"}
                      </p>
                      {e.punchOutAddress && (
                        <p className="text-xs text-gray-500 mt-0.5 flex items-start gap-1">
                          <MapPin className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" />
                          {e.punchOutAddress}
                        </p>
                      )}
                    </div>
                  </div>
                  {e.entryHours && (
                    <p className="text-xs text-gray-400 mt-2">
                      Duration: <span className="font-medium text-gray-600">{formatHours(Number(e.entryHours))}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
