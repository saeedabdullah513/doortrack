import { Fragment } from "react";
import { prisma } from "@/lib/db";
import {
  formatTime,
  formatDate,
  formatDateIso,
  toDecimal,
  getStatusColor,
  getStatusLabel,
  localMidnight,
  centralDaysAgo,
} from "@/lib/utils";
import { ExportButton } from "@/components/ui/export-button";

interface SearchParams { agentId?: string; from?: string; to?: string }

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params  = await searchParams;
  const from    = localMidnight(params.from ?? formatDateIso(centralDaysAgo(30)));
  const to      = localMidnight(params.to   ?? formatDateIso(localMidnight()));
  to.setHours(23, 59, 59, 999);

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
      punchEntries: { orderBy: { sequence: "asc" } },
    },
    orderBy: [{ user: { name: "asc" } }, { date: "asc" }],
  });

  // Max sessions in any single day — drives dynamic column count
  const maxSessions = days.reduce((m, d) => Math.max(m, d.punchEntries.length), 1);

  // Agent summary aggregates
  const agentMap = new Map<string, {
    name: string; totalDays: number; totalHours: number; belowTarget: number;
  }>();
  for (const d of days) {
    const h = d.totalHours ? Number(d.totalHours) : 0;
    const r = agentMap.get(d.userId);
    if (r) { r.totalDays++; r.totalHours += h; if (d.status === "BELOW_TARGET") r.belowTarget++; }
    else agentMap.set(d.userId, { name: d.user.name, totalDays: 1, totalHours: h, belowTarget: d.status === "BELOW_TARGET" ? 1 : 0 });
  }
  const summaries = Array.from(agentMap.values());

  // Running period totals per agent (resets per agent group)
  const periodRunning: Record<string, number> = {};

  const fromStr    = formatDateIso(from);
  const toStr      = formatDateIso(to);
  const agentParam = params.agentId ? `&agentId=${params.agentId}` : "";
  const exportBase = `?from=${fromStr}&to=${toStr}${agentParam}`;

  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {formatDate(from)} – {formatDate(to)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ExportButton url={`/api/export/attendance${exportBase}`} label="Export Attendance" />
          <ExportButton url={`/api/export/summary${exportBase}`}    label="Export Summary" />
          <ExportButton url={`/api/export/locations${exportBase}`}  label="Export Locations" />
        </div>
      </div>

      {/* ── Filters ── */}
      <form className="flex flex-wrap gap-3 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">From</label>
          <input name="from" type="date" defaultValue={formatDateIso(from)}
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">To</label>
          <input name="to" type="date" defaultValue={formatDateIso(to)}
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

      {/* ── Agent summary cards ── */}
      {summaries.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {summaries.map((s) => (
            <div key={s.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="font-bold text-gray-800">{s.name}</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-extrabold text-gray-900">{s.totalDays}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">Days</p>
                </div>
                <div>
                  <p className="text-lg font-extrabold text-gray-900">{toDecimal(s.totalHours)}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">Total Hrs</p>
                </div>
                <div>
                  <p className={`text-lg font-extrabold ${s.belowTarget > 0 ? "text-amber-600" : "text-green-600"}`}>
                    {s.belowTarget}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">Below 8h</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Timecard table (matches reference image) ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Timecard Detail</h2>
          <span className="text-xs text-gray-400">{days.length} record{days.length !== 1 ? "s" : ""}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  Date
                </th>
                {!params.agentId && (
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    Agent
                  </th>
                )}
                {/* Dynamic In/Location/Out columns */}
                {Array.from({ length: maxSessions }).map((_, i) => (
                  <Fragment key={i}>
                    <th className="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap border-l border-gray-100">
                      In {maxSessions > 1 ? i + 1 : ""}
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      Location
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      Out {maxSessions > 1 ? i + 1 : ""}
                    </th>
                  </Fragment>
                ))}
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap border-l border-gray-200">
                  Daily Total
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  Period Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {days.length === 0 && (
                <tr>
                  <td colSpan={99} className="px-4 py-12 text-center text-gray-400">
                    No records for the selected period.
                  </td>
                </tr>
              )}

              {days.map((d) => {
                const daily = d.totalHours ? Number(d.totalHours) : 0;
                periodRunning[d.userId] = (periodRunning[d.userId] ?? 0) + daily;
                const period = periodRunning[d.userId];
                const hasPunches = d.punchEntries.length > 0;

                return (
                  <tr key={d.id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Date */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-xs font-semibold ${hasPunches ? "text-red-600" : "text-gray-400"}`}>
                        {formatDate(d.date)}
                      </span>
                    </td>

                    {/* Agent (only when showing all agents) */}
                    {!params.agentId && (
                      <td className="px-4 py-3 whitespace-nowrap font-semibold text-gray-800 text-xs">
                        {d.user.name}
                      </td>
                    )}

                    {/* Dynamic session columns */}
                    {Array.from({ length: maxSessions }).map((_, i) => {
                      const e = d.punchEntries[i];
                      return (
                        <Fragment key={`${d.id}-${i}`}>
                          {/* In time */}
                          <td className="px-3 py-3 text-center whitespace-nowrap border-l border-gray-100">
                            {e ? (
                              <span className="text-xs font-semibold text-gray-800 bg-gray-50 px-2 py-0.5 rounded">
                                {formatTime(e.punchInTime)}
                              </span>
                            ) : (
                              <span className="block w-16 h-px bg-red-300 mx-auto" />
                            )}
                          </td>
                          {/* In location */}
                          <td className="px-3 py-3 max-w-[140px]">
                            {e?.punchInAddress ? (
                              <span className="text-[11px] text-gray-500 truncate block">
                                {e.punchInAddress}
                              </span>
                            ) : (
                              <span className="text-gray-300 text-xs">—</span>
                            )}
                          </td>
                          {/* Out time */}
                          <td className="px-3 py-3 text-center whitespace-nowrap">
                            {e?.punchOutTime ? (
                              <span className="text-xs font-semibold text-gray-800 bg-gray-50 px-2 py-0.5 rounded">
                                {formatTime(e.punchOutTime)}
                              </span>
                            ) : e ? (
                              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                Active
                              </span>
                            ) : (
                              <span className="block w-16 h-px bg-red-300 mx-auto" />
                            )}
                          </td>
                        </Fragment>
                      );
                    })}

                    {/* Daily Total */}
                    <td className="px-4 py-3 text-right whitespace-nowrap border-l border-gray-200">
                      {daily > 0 ? (
                        <span className={`text-sm font-bold ${daily >= 8 ? "text-gray-800" : "text-amber-600"}`}>
                          {toDecimal(daily)}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>

                    {/* Period Total */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {period > 0 ? (
                        <span className="text-sm font-bold text-gray-500">
                          {toDecimal(period)}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${getStatusColor(d.status)}`}>
                        {getStatusLabel(d.status)}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {/* Totals footer row */}
              {days.length > 0 && (
                <tr className="bg-gray-50 border-t-2 border-gray-200">
                  <td colSpan={(!params.agentId ? 2 : 1) + maxSessions * 3}
                    className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Total
                  </td>
                  <td className="px-4 py-3 text-right border-l border-gray-200">
                    <span className="text-sm font-extrabold text-gray-900">
                      {toDecimal(Array.from(agentMap.values()).reduce((s, a) => s + a.totalHours, 0))}
                    </span>
                  </td>
                  <td colSpan={2} />
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
