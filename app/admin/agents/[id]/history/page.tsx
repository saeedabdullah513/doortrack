import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { formatHours, formatTime, getStatusColor, getStatusLabel, formatDate, centralDaysAgo } from "@/lib/utils";
import { MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AgentHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agent = await prisma.user.findUnique({
    where: { id, role: "AGENT" },
    select: { name: true, email: true, phone: true },
  });
  if (!agent) notFound();

  const days = await prisma.attendanceDay.findMany({
    where: { userId: id, date: { gte: centralDaysAgo(30) } },
    include: { punchEntries: { orderBy: { sequence: "asc" } } },
    orderBy: { date: "desc" },
  });

  const totalDays  = days.length;
  const totalHours = days.reduce((s, d) => s + (d.totalHours ? Number(d.totalHours) : 0), 0);
  const belowTarget = days.filter((d) => d.status === "BELOW_TARGET").length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/admin/agents" className="text-gray-400 hover:text-gray-600 mt-1">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{agent.name}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{agent.email} {agent.phone ? `· ${agent.phone}` : ""}</p>
        </div>
      </div>

      {/* 30-day summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Working Days", value: totalDays },
          { label: "Total Hours", value: formatHours(totalHours) },
          { label: "Days Below Target", value: belowTarget },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{s.label}</p>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Day-by-day */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Last 30 Days</h2>
        </div>
        {days.length === 0 && (
          <p className="px-5 py-10 text-center text-gray-400 text-sm">No records found.</p>
        )}
        <div className="divide-y divide-gray-100">
          {days.map((d) => (
            <div key={d.id} className="px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-gray-800 text-sm">
                  {formatDate(d.date)}
                </p>
                <div className="flex items-center gap-2">
                  {d.totalHours && (
                    <span className={`text-xs font-bold ${Number(d.totalHours) >= 8 ? "text-green-600" : "text-amber-600"}`}>
                      {formatHours(Number(d.totalHours))}
                    </span>
                  )}
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(d.status)}`}>
                    {getStatusLabel(d.status)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {d.punchEntries.map((e) => (
                  <div key={e.id} className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-emerald-50 rounded-lg px-3 py-2 flex items-start gap-2">
                      <MapPin className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-emerald-700">IN · {formatTime(e.punchInTime)}</p>
                        <p className="text-gray-500 mt-0.5">{e.punchInAddress ?? "—"}</p>
                      </div>
                    </div>
                    {e.punchOutTime && (
                      <div className="bg-red-50 rounded-lg px-3 py-2 flex items-start gap-2">
                        <MapPin className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-red-600">OUT · {formatTime(e.punchOutTime)}</p>
                          <p className="text-gray-500 mt-0.5">{e.punchOutAddress ?? "—"}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
