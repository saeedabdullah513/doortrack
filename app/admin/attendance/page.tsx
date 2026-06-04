import { Fragment } from "react";
import { prisma } from "@/lib/db";
import { formatTime, toDecimal, getStatusColor, getStatusLabel, localMidnight } from "@/lib/utils";
import { AttendanceFilters } from "@/components/admin/attendance-filters";
import { ExportButton } from "@/components/ui/export-button";
import { format } from "date-fns";
import { MapPin } from "lucide-react";

interface SearchParams {
  date?: string;
  agentId?: string;
  status?: string;
}

export default async function AdminAttendancePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const dateFilter = localMidnight(params.date); // local midnight, not UTC

  const where: Record<string, unknown> = { date: dateFilter };
  if (params.agentId) where.userId = params.agentId;
  if (params.status) where.status = params.status;

  const [days, agents] = await Promise.all([
    prisma.attendanceDay.findMany({
      where,
      include: {
        user: { select: { id: true, name: true } },
        punchEntries: { orderBy: { sequence: "asc" } },
      },
      orderBy: [{ user: { name: "asc" } }],
    }),
    prisma.user.findMany({
      where: { role: "AGENT", isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  // Find max punch entries per day so we know how many In/Out columns to render
  const maxEntries = days.reduce((m, d) => Math.max(m, d.punchEntries.length), 1);

  const dateStr = format(dateFilter, "yyyy-MM-dd");
  const agentParam = params.agentId ? `&agentId=${params.agentId}` : "";

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Attendance</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {format(dateFilter, "EEEE, dd MMMM yyyy")}
          </p>
        </div>
        <ExportButton
          url={`/api/export/attendance?from=${dateStr}&to=${dateStr}${agentParam}`}
          label="Export to Excel"
        />
      </div>

      <AttendanceFilters
        agents={agents}
        selectedDate={format(dateFilter, "yyyy-MM-dd")}
        selectedAgent={params.agentId ?? ""}
        selectedStatus={params.status ?? ""}
      />

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table styled like the reference image */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  Agent
                </th>
                {/* Dynamic In/Location/Out columns */}
                {Array.from({ length: maxEntries }).map((_, i) => (
                  <Fragment key={i}>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap border-l border-gray-100">
                      In {maxEntries > 1 ? i + 1 : ""}
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      Location
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      Out {maxEntries > 1 ? i + 1 : ""}
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      Out Location
                    </th>
                  </Fragment>
                ))}
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap border-l border-gray-200">
                  Daily Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  Edit
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {days.length === 0 && (
                <tr>
                  <td
                    colSpan={3 + maxEntries * 4}
                    className="px-4 py-10 text-center text-gray-400"
                  >
                    No attendance records for this date.
                  </td>
                </tr>
              )}
              {days.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50/60">
                  <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap font-medium">
                    {format(d.date, "EEE MM-dd-yyyy")}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">
                    {d.user.name}
                  </td>

                  {/* Render up to maxEntries columns */}
                  {Array.from({ length: maxEntries }).map((_, i) => {
                    const entry = d.punchEntries[i];
                    return (
                      <Fragment key={`${d.id}-${i}`}>
                        {/* In time */}
                        <td className="px-3 py-3 whitespace-nowrap border-l border-gray-100">
                          {entry ? (
                            <span className="text-gray-800 font-medium text-xs">
                              {formatTime(entry.punchInTime)}
                            </span>
                          ) : (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
                        </td>
                        {/* In location */}
                        <td className="px-3 py-3 max-w-[160px]">
                          {entry?.punchInAddress ? (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3 flex-shrink-0 text-green-500" />
                              <span className="truncate">{entry.punchInAddress}</span>
                            </span>
                          ) : (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
                        </td>
                        {/* Out time */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          {entry?.punchOutTime ? (
                            <span className="text-gray-800 font-medium text-xs">
                              {formatTime(entry.punchOutTime)}
                            </span>
                          ) : entry ? (
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                              Active
                            </span>
                          ) : (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
                        </td>
                        {/* Out location */}
                        <td className="px-3 py-3 max-w-[160px]">
                          {entry?.punchOutAddress ? (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3 flex-shrink-0 text-red-400" />
                              <span className="truncate">{entry.punchOutAddress}</span>
                            </span>
                          ) : (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
                        </td>
                      </Fragment>
                    );
                  })}

                  {/* Daily total */}
                  <td className="px-4 py-3 text-right font-bold whitespace-nowrap border-l border-gray-200">
                    {d.totalHours ? (
                      <span className={Number(d.totalHours) >= 8 ? "text-green-600" : "text-amber-600"}>
                        {toDecimal(Number(d.totalHours))}
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(d.status)}`}>
                      {getStatusLabel(d.status)}
                    </span>
                    {d.editedByAdmin && (
                      <span className="ml-1.5 text-[10px] text-amber-500 font-medium">(edited)</span>
                    )}
                  </td>
                  {/* Edit link */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <a
                      href={`/admin/attendance/${d.id}`}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Edit →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {days.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
            {days.length} record{days.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}
