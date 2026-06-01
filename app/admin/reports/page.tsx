import { prisma } from "@/lib/db";
import { formatHours, formatDate, getStatusColor, getStatusLabel, localMidnight } from "@/lib/utils";
import { subDays, format } from "date-fns";

interface SearchParams { agentId?: string; from?: string; to?: string }

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const from = localMidnight(params.from ?? format(subDays(new Date(), 30), "yyyy-MM-dd"));
  const to = localMidnight(params.to ?? format(new Date(), "yyyy-MM-dd"));
  to.setHours(23, 59, 59, 999); // end of day

  const agents = await prisma.user.findMany({
    where: { role: "AGENT", isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const where: Record<string, unknown> = { date: { gte: from, lte: to } };
  if (params.agentId) where.userId = params.agentId;

  const days = await prisma.attendanceDay.findMany({
    where,
    include: {
      user: { select: { id: true, name: true } },
      punchEntries: { select: { entryHours: true } },
    },
    orderBy: [{ user: { name: "asc" } }, { date: "desc" }],
  });

  // Aggregate per agent
  const agentMap = new Map<string, { name: string; totalDays: number; totalHours: number; belowTarget: number }>();
  for (const d of days) {
    const h = d.totalHours ? Number(d.totalHours) : 0;
    const rec = agentMap.get(d.userId);
    if (rec) {
      rec.totalDays++;
      rec.totalHours += h;
      if (d.status === "BELOW_TARGET") rec.belowTarget++;
    } else {
      agentMap.set(d.userId, { name: d.user.name, totalDays: 1, totalHours: h, belowTarget: d.status === "BELOW_TARGET" ? 1 : 0 });
    }
  }
  const summaries = Array.from(agentMap.values()).map((a) => ({
    ...a,
    avgHours: a.totalDays > 0 ? a.totalHours / a.totalDays : 0,
  }));

  // Running period total per agent
  const periodTotals: Record<string, number> = {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {format(from, "MMM dd")} – {format(to, "MMM dd, yyyy")}
        </p>
      </div>

      {/* Filters */}
      <form className="flex flex-wrap gap-3 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">From</label>
          <input name="from" type="date" defaultValue={format(from, "yyyy-MM-dd")}
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">To</label>
          <input name="to" type="date" defaultValue={format(to, "yyyy-MM-dd")}
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Agent</label>
          <select name="agentId" defaultValue={params.agentId ?? ""}
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
            <option value="">All Agents</option>
            {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
            Apply
          </button>
        </div>
      </form>

      {/* Agent Summary */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Agent Summary</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">Agent</th>
                <th className="px-4 py-3 text-left">Working Days</th>
                <th className="px-4 py-3 text-left">Total Hours</th>
                <th className="px-4 py-3 text-left">Avg Daily</th>
                <th className="px-4 py-3 text-left">Days Below 8h</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {summaries.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400">No data for this period.</td></tr>
              )}
              {summaries.map((s) => (
                <tr key={s.name} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{s.name}</td>
                  <td className="px-4 py-3 text-gray-600">{s.totalDays}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{formatHours(s.totalHours)}</td>
                  <td className="px-4 py-3 text-gray-600">{formatHours(s.avgHours)}</td>
                  <td className="px-4 py-3">
                    <span className={s.belowTarget > 0 ? "text-amber-600 font-semibold" : "text-gray-400"}>
                      {s.belowTarget}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily detail — timecard style like reference image */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Daily Attendance Detail</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Agent</th>
                <th className="px-4 py-3 text-left">Sessions</th>
                <th className="px-4 py-3 text-right">Daily Total</th>
                <th className="px-4 py-3 text-right">Period Total</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {days.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No records found.</td></tr>
              )}
              {days.map((d) => {
                const h = d.totalHours ? Number(d.totalHours) : 0;
                periodTotals[d.userId] = (periodTotals[d.userId] ?? 0) + h;
                return (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">{formatDate(d.date)}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{d.user.name}</td>
                    <td className="px-4 py-3 text-gray-500">{d.punchEntries.length}</td>
                    <td className="px-4 py-3 text-right font-bold">
                      {d.totalHours
                        ? <span className={Number(d.totalHours) >= 8 ? "text-green-600" : "text-amber-600"}>{formatHours(Number(d.totalHours))}</span>
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500 font-medium">
                      {formatHours(periodTotals[d.userId])}
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
