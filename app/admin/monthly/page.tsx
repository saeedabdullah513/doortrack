import { prisma } from "@/lib/db";
import { localMidnight, toDecimal, formatHours, formatDateIso, formatDateMonthLabel, formatDateMonth } from "@/lib/utils";
import { ExportButton } from "@/components/ui/export-button";
import { MonthNav } from "@/components/admin/month-nav";
import {
  startOfMonth, endOfMonth, getDaysInMonth,
  subMonths, addMonths,
} from "date-fns";

interface SearchParams { month?: string }   // "2026-06"

export default async function MonthlyReportPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  // Parse month param ("2026-06") or default to current month
  const monthParam = params.month ?? formatDateMonth(localMidnight());
  const baseDate = localMidnight(`${monthParam}-01`);

  const monthStart = localMidnight(formatDateIso(startOfMonth(baseDate)));
  const monthEnd   = localMidnight(formatDateIso(endOfMonth(baseDate)));
  monthEnd.setHours(23, 59, 59, 999);

  const totalCalendarDays  = getDaysInMonth(baseDate);
  const monthLabel         = formatDateMonthLabel(baseDate);
  const prevMonth          = formatDateMonth(subMonths(baseDate, 1));
  const nextMonth          = formatDateMonth(addMonths(baseDate, 1));
  const currentMonth       = formatDateMonth(localMidnight());
  const isCurrentMonth     = formatDateMonth(baseDate) === currentMonth;

  // All agents
  const agents = await prisma.user.findMany({
    where: { role: "AGENT", isActive: true },
    orderBy: { name: "asc" },
  });

  // All attendance days for this month
  const days = await prisma.attendanceDay.findMany({
    where: { date: { gte: monthStart, lte: monthEnd } },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { date: "asc" },
  });

  // Build per-agent stats
  const stats = agents.map((agent) => {
    const agentDays = days.filter((d) => d.userId === agent.id);

    const workingDays  = agentDays.filter((d) => d.status !== "ABSENT").length;
    const absentDays   = agentDays.filter((d) => d.status === "ABSENT").length;
    const completedDays = agentDays.filter((d) => d.status === "COMPLETED").length;
    const belowTarget  = agentDays.filter((d) => d.status === "BELOW_TARGET").length;
    const activeDays   = agentDays.filter((d) => d.status === "IN_PROGRESS").length;

    const totalHours   = agentDays.reduce((s, d) => s + (d.totalHours ? Number(d.totalHours) : 0), 0);
    const avgHours     = workingDays > 0 ? totalHours / workingDays : 0;

    // Days not yet recorded (no record at all) — only meaningful for past days
    const today        = localMidnight();
    const daysElapsed  = isCurrentMonth
      ? Math.min(today.getUTCDate(), totalCalendarDays)
      : totalCalendarDays;
    const unrecorded   = daysElapsed - agentDays.length;

    return {
      id:             agent.id,
      name:           agent.name,
      workingDays,
      completedDays,
      belowTarget,
      absentDays,
      activeDays,
      unrecorded:     Math.max(0, unrecorded),
      totalHours,
      avgHours,
      daysElapsed,
    };
  });

  const grandTotal = stats.reduce((s, a) => s + a.totalHours, 0);
  const monthParam = formatDateMonth(baseDate);

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Monthly Summary</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Auto-calculated · {monthLabel} · {totalCalendarDays} calendar days
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <ExportButton
            url={`/api/export/monthly?month=${monthParam}`}
            label="Export to Excel"
          />
        </div>
      </div>

      {/* ── Month navigation ── */}
      <MonthNav
        monthLabel={monthLabel}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
        isCurrentMonth={isCurrentMonth}
      />

      {/* ── Month overview cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Agents",    value: agents.length,                      color: "text-blue-600",  bg: "bg-blue-50" },
          { label: "Total Hours",     value: toDecimal(grandTotal) + "h",        color: "text-red-600",   bg: "bg-red-50" },
          { label: "Calendar Days",   value: totalCalendarDays,                  color: "text-gray-700",  bg: "bg-gray-50" },
          { label: isCurrentMonth ? "Days So Far" : "Days in Month",
                                      value: isCurrentMonth ? localMidnight().getUTCDate() : totalCalendarDays,
                                                                                 color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((c) => (
          <div key={c.label} className={`${c.bg} rounded-2xl border border-gray-100 shadow-sm p-5`}>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{c.label}</p>
            <p className={`text-3xl font-extrabold mt-1 ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* ── Per-agent breakdown table ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Agent Breakdown — {monthLabel}</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[
                  ["Agent",            "text-left"],
                  ["Days Worked",      "text-center"],
                  ["Target Met (≥8h)", "text-center"],
                  ["Below Target",     "text-center"],
                  ["Absent",           "text-center"],
                  ["Not Recorded",     "text-center"],
                  ["Total Hours",      "text-right"],
                  ["Avg / Day",        "text-right"],
                  ["Target %",         "text-right"],
                ].map(([h, align]) => (
                  <th key={h} className={`px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap ${align}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.map((s) => {
                const targetPct = s.workingDays > 0
                  ? Math.round((s.completedDays / s.workingDays) * 100)
                  : 0;

                return (
                  <tr key={s.id} className="hover:bg-gray-50/60">
                    {/* Agent */}
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{s.daysElapsed} day{s.daysElapsed !== 1 ? "s" : ""} elapsed</p>
                    </td>

                    {/* Days worked */}
                    <td className="px-4 py-4 text-center">
                      <span className="text-lg font-bold text-gray-800">{s.workingDays}</span>
                    </td>

                    {/* Target met */}
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-50 text-green-700 font-bold text-sm">
                        {s.completedDays}
                      </span>
                    </td>

                    {/* Below target */}
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                        s.belowTarget > 0 ? "bg-amber-50 text-amber-700" : "bg-gray-50 text-gray-300"
                      }`}>
                        {s.belowTarget}
                      </span>
                    </td>

                    {/* Absent */}
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                        s.absentDays > 0 ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-300"
                      }`}>
                        {s.absentDays}
                      </span>
                    </td>

                    {/* Not recorded */}
                    <td className="px-4 py-4 text-center">
                      <span className="text-gray-400 font-medium">{s.unrecorded}</span>
                    </td>

                    {/* Total hours */}
                    <td className="px-4 py-4 text-right">
                      <span className="text-lg font-extrabold text-gray-900">
                        {toDecimal(s.totalHours)}
                      </span>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatHours(s.totalHours)}
                      </p>
                    </td>

                    {/* Avg per day */}
                    <td className="px-4 py-4 text-right">
                      <span className={`text-sm font-bold ${s.avgHours >= 8 ? "text-green-600" : s.avgHours > 0 ? "text-amber-600" : "text-gray-300"}`}>
                        {s.avgHours > 0 ? toDecimal(s.avgHours) : "—"}
                      </span>
                    </td>

                    {/* Target % */}
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${targetPct >= 80 ? "bg-green-500" : targetPct >= 50 ? "bg-amber-400" : "bg-red-400"}`}
                            style={{ width: `${targetPct}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold w-9 text-right ${targetPct >= 80 ? "text-green-600" : targetPct >= 50 ? "text-amber-600" : "text-red-500"}`}>
                          {s.workingDays > 0 ? `${targetPct}%` : "—"}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* Grand total footer */}
              <tr className="bg-gray-50 border-t-2 border-gray-200 font-bold">
                <td className="px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">Grand Total</td>
                <td className="px-4 py-3 text-center text-gray-700">
                  {stats.reduce((s, a) => s + a.workingDays, 0)}
                </td>
                <td className="px-4 py-3 text-center text-green-600">
                  {stats.reduce((s, a) => s + a.completedDays, 0)}
                </td>
                <td className="px-4 py-3 text-center text-amber-600">
                  {stats.reduce((s, a) => s + a.belowTarget, 0)}
                </td>
                <td className="px-4 py-3 text-center text-red-500">
                  {stats.reduce((s, a) => s + a.absentDays, 0)}
                </td>
                <td className="px-4 py-3 text-center text-gray-400">
                  {stats.reduce((s, a) => s + a.unrecorded, 0)}
                </td>
                <td className="px-4 py-3 text-right text-gray-900 text-base">
                  {toDecimal(grandTotal)}
                  <p className="text-xs text-gray-400 font-normal">{formatHours(grandTotal)}</p>
                </td>
                <td colSpan={2} />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Daily detail for this month ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Daily Detail — {monthLabel}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Agent</th>
                <th className="px-4 py-3 text-right">Daily Total</th>
                <th className="px-4 py-3 text-right">Period Total</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(() => {
                const running: Record<string, number> = {};
                return days.map((d) => {
                  const h = d.totalHours ? Number(d.totalHours) : 0;
                  running[d.userId] = (running[d.userId] ?? 0) + h;
                  return (
                    <tr key={d.id} className="hover:bg-gray-50/60">
                      <td className="px-4 py-3 text-xs font-semibold text-gray-600 whitespace-nowrap">
                        {formatDate(d.date)}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">{d.user.name}</td>
                      <td className="px-4 py-3 text-right">
                        {h > 0 ? (
                          <span className={`font-bold ${h >= 8 ? "text-gray-800" : "text-amber-600"}`}>
                            {toDecimal(h)}
                          </span>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-500">
                        {running[d.userId] > 0 ? toDecimal(running[d.userId]) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          d.status === "COMPLETED"    ? "bg-green-50 text-green-700" :
                          d.status === "BELOW_TARGET" ? "bg-amber-50 text-amber-700" :
                          d.status === "IN_PROGRESS"  ? "bg-blue-50 text-blue-700" :
                                                        "bg-red-50 text-red-600"
                        }`}>
                          {d.status === "COMPLETED" ? "✓ Completed" :
                           d.status === "BELOW_TARGET" ? "↓ Below Target" :
                           d.status === "IN_PROGRESS"  ? "● Active" : "✗ Absent"}
                        </span>
                      </td>
                    </tr>
                  );
                });
              })()}
              {days.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-400">
                    No records for {monthLabel}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
