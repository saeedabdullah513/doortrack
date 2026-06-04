import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatTime, formatHours, localMidnight } from "@/lib/utils";
import { APP_CONFIG } from "@/lib/config";
import { AgentDashboardClient } from "@/components/agent/agent-dashboard-client";
import { format } from "date-fns";

export default async function AgentDashboardPage() {
  const session = await auth();
  const userId = session!.user.id;
  const today = new Date();
  const todayDate = localMidnight();

  const day = await prisma.attendanceDay.findUnique({
    where: { userId_date: { userId, date: todayDate } },
    include: {
      punchEntries: { orderBy: { sequence: "asc" } },
    },
  });

  const entries = day?.punchEntries ?? [];
  const hasOpenEntry = entries.some((e) => !e.punchOutTime);
  const totalHours = day?.totalHours ? Number(day.totalHours) : null;
  const targetHours = APP_CONFIG.attendance.targetHours;
  const progressPct = totalHours
    ? Math.min((totalHours / targetHours) * 100, 100)
    : 0;

  const entryRows = entries.map((e) => ({
    id: e.id,
    sequence: e.sequence,
    inTime: formatTime(e.punchInTime),
    inAddress: e.punchInAddress ?? `${Number(e.punchInLat).toFixed(4)}, ${Number(e.punchInLng).toFixed(4)}`,
    outTime: e.punchOutTime ? formatTime(e.punchOutTime) : null,
    outAddress: e.punchOutAddress
      ? e.punchOutAddress
      : e.punchOutLat
      ? `${Number(e.punchOutLat).toFixed(4)}, ${Number(e.punchOutLng).toFixed(4)}`
      : null,
    hours: e.entryHours ? formatHours(Number(e.entryHours)) : null,
    isOpen: !e.punchOutTime,
  }));

  return (
    <AgentDashboardClient
      userName={session!.user.name}
      today={format(today, "EEE, dd MMM yyyy")}
      totalHours={totalHours ? formatHours(totalHours) : null}
      targetHours={targetHours}
      progressPct={progressPct}
      hasOpenEntry={hasOpenEntry}
      isPunchedOutForDay={entries.length > 0 && !hasOpenEntry}
      entries={entryRows}
    />
  );
}
