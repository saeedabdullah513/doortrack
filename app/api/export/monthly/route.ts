import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { buildWorkbook, xlsxResponse } from "@/lib/excel";
import { localMidnight, toDecimal, formatHours, getStatusLabel } from "@/lib/utils";
import { startOfMonth, endOfMonth, getDaysInMonth, format } from "date-fns";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role === "AGENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const monthParam = searchParams.get("month") ?? format(new Date(), "yyyy-MM");
  const [y, m]     = monthParam.split("-").map(Number);
  const baseDate   = new Date(y, m - 1, 1);

  const monthStart = localMidnight(format(startOfMonth(baseDate), "yyyy-MM-dd"));
  const monthEnd   = localMidnight(format(endOfMonth(baseDate),   "yyyy-MM-dd"));
  monthEnd.setHours(23, 59, 59, 999);

  const totalDays = getDaysInMonth(baseDate);
  const monthLabel = format(baseDate, "MMMM yyyy");

  const agents = await prisma.user.findMany({
    where: { role: "AGENT", isActive: true },
    orderBy: { name: "asc" },
  });

  const days = await prisma.attendanceDay.findMany({
    where: { date: { gte: monthStart, lte: monthEnd } },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { date: "asc" },
  });

  // ── Sheet 1: Agent Summary ──
  const summaryRows = agents.map((agent) => {
    const agentDays    = days.filter((d) => d.userId === agent.id);
    const workingDays  = agentDays.filter((d) => d.status !== "ABSENT").length;
    const completed    = agentDays.filter((d) => d.status === "COMPLETED").length;
    const belowTarget  = agentDays.filter((d) => d.status === "BELOW_TARGET").length;
    const absent       = agentDays.filter((d) => d.status === "ABSENT").length;
    const totalHours   = agentDays.reduce((s, d) => s + (d.totalHours ? Number(d.totalHours) : 0), 0);
    const avgHours     = workingDays > 0 ? totalHours / workingDays : 0;
    const unrecorded   = Math.max(0, totalDays - agentDays.length);
    const targetPct    = workingDays > 0 ? Math.round((completed / workingDays) * 100) : 0;

    return {
      "Agent":                 agent.name,
      "Email":                 agent.email,
      "Month":                 monthLabel,
      "Calendar Days":         totalDays,
      "Days Worked":           workingDays,
      "Target Met (≥8h)":      completed,
      "Below Target (<8h)":    belowTarget,
      "Absent Days":           absent,
      "Not Recorded":          unrecorded,
      "Total Hours (decimal)": toDecimal(totalHours),
      "Total Hours (h:m)":     formatHours(totalHours),
      "Avg Daily (decimal)":   toDecimal(avgHours),
      "Target %":              `${targetPct}%`,
    };
  });

  // ── Sheet 2: Daily Detail with running Period Total ──
  const running: Record<string, number> = {};
  const detailRows = days.map((d) => {
    const h = d.totalHours ? Number(d.totalHours) : 0;
    running[d.userId] = (running[d.userId] ?? 0) + h;
    return {
      "Date":           format(d.date, "EEE MM/dd/yyyy"),
      "Agent":          d.user.name,
      "Daily Total":    h > 0 ? toDecimal(h) : "",
      "Period Total":   running[d.userId] > 0 ? toDecimal(running[d.userId]) : "",
      "Status":         getStatusLabel(d.status),
      "Edited by Admin": d.editedByAdmin ? "Yes" : "No",
    };
  });

  const buf = buildWorkbook([
    { name: `${format(baseDate, "MMM yyyy")} Summary`, rows: summaryRows },
    { name: "Daily Detail",                            rows: detailRows  },
  ]);

  return xlsxResponse(buf, `DoorTrack_Monthly_${monthParam}.xlsx`);
}
