import { prisma } from "@/lib/db";
import { StatCard } from "@/components/ui/stat-card";
import { formatTime, formatHours, getStatusColor, getStatusLabel, localMidnight } from "@/lib/utils";
import { Users, UserCheck, TrendingDown, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const today = localMidnight();

  const [totalAgents, todayDays, inFieldNow] = await Promise.all([
    prisma.user.count({ where: { role: "AGENT", isActive: true } }),
    prisma.attendanceDay.findMany({
      where: { date: today },
      include: {
        user: { select: { name: true } },
        punchEntries: { orderBy: { sequence: "asc" } },
      },
      orderBy: { user: { name: "asc" } },
    }),
    // Agents with an open punch entry (punched in, not yet out)
    prisma.punchEntry.groupBy({
      by: ["userId"],
      where: { punchOutTime: null, day: { date: today } },
    }),
  ]);

  const belowTarget = todayDays.filter((d) => d.status === "BELOW_TARGET").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {format(new Date(), "EEEE, dd MMMM yyyy")}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Agents" value={totalAgents} icon={Users} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard label="In Field Now" value={inFieldNow.length} icon={UserCheck} iconColor="text-green-600" iconBg="bg-green-50" sub="Punched in" />
        <StatCard label="Punched In Today" value={todayDays.length} icon={TrendingDown} iconColor="text-red-600" iconBg="bg-red-50" />
        <StatCard label="Below 8h Target" value={belowTarget} icon={AlertTriangle} iconColor="text-amber-600" iconBg="bg-amber-50" />
      </div>

      {/* Today's attendance — reference-image-style table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Today&apos;s Attendance</h2>
          <Link href="/admin/attendance" className="text-sm text-red-600 hover:text-red-700">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">Agent</th>
                <th className="px-4 py-3 text-left">Sessions</th>
                <th className="px-4 py-3 text-left">First In</th>
                <th className="px-4 py-3 text-left">Last Out</th>
                <th className="px-4 py-3 text-right">Daily Total</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {todayDays.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                    No attendance records for today.
                  </td>
                </tr>
              )}
              {todayDays.map((d) => {
                const first = d.punchEntries[0];
                const last = d.punchEntries[d.punchEntries.length - 1];
                return (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{d.user.name}</td>
                    <td className="px-4 py-3 text-gray-600">{d.punchEntries.length}</td>
                    <td className="px-4 py-3 text-gray-600">{first ? formatTime(first.punchInTime) : "—"}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {last?.punchOutTime ? formatTime(last.punchOutTime) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-bold">
                      {d.totalHours ? (
                        <span className={Number(d.totalHours) >= 8 ? "text-green-600" : "text-amber-600"}>
                          {formatHours(Number(d.totalHours))}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(d.status)}`}>
                        {getStatusLabel(d.status)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
