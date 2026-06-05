import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { buildWorkbook, xlsxResponse } from "@/lib/excel";
import { centralDaysAgo, formatDateIso, formatDateMonthDay, formatDateSlash, localMidnight } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role === "AGENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const from = localMidnight(searchParams.get("from") ?? formatDateIso(centralDaysAgo(30)));
  const to   = localMidnight(searchParams.get("to")   ?? formatDateIso(localMidnight()));
  to.setHours(23, 59, 59, 999);

  const days = await prisma.attendanceDay.findMany({
    where: { date: { gte: from, lte: to } },
    include: { user: { select: { name: true, email: true, phone: true } } },
    orderBy: [{ user: { name: "asc" } }, { date: "asc" }],
  });

  // Aggregate per agent
  const map = new Map<string, {
    name: string; email: string; phone: string;
    totalDays: number; totalHours: number; belowTarget: number; absent: number;
    dailyHours: number[];
  }>();

  for (const d of days) {
    const h = d.totalHours ? Number(d.totalHours) : 0;
    const rec = map.get(d.userId);
    if (rec) {
      rec.totalDays++;
      rec.totalHours += h;
      if (d.status === "BELOW_TARGET") rec.belowTarget++;
      if (d.status === "ABSENT")       rec.absent++;
      rec.dailyHours.push(h);
    } else {
      map.set(d.userId, {
        name: d.user.name, email: d.user.email, phone: d.user.phone ?? "",
        totalDays: 1, totalHours: h,
        belowTarget: d.status === "BELOW_TARGET" ? 1 : 0,
        absent:      d.status === "ABSENT"       ? 1 : 0,
        dailyHours:  [h],
      });
    }
  }

  const summaryRows = Array.from(map.values()).map((a) => ({
    "Agent Name":        a.name,
    "Email":             a.email,
    "Phone":             a.phone,
    "Working Days":      a.totalDays,
    "Total Hours":       a.totalHours.toFixed(2),
    "Avg Daily Hours":   (a.totalDays ? a.totalHours / a.totalDays : 0).toFixed(2),
    "Days ≥ 8h (Target Met)": a.dailyHours.filter((h) => h >= 8).length,
    "Days < 8h (Below Target)": a.belowTarget,
    "Absent Days":       a.absent,
    "Period":            `${formatDateSlash(from)} – ${formatDateSlash(to)}`,
  }));

  const buf = buildWorkbook([{ name: "Agent Summary", rows: summaryRows }]);
  const dateRange = `${formatDateMonthDay(from)}-${formatDateMonthDay(to)}`;
  return xlsxResponse(buf, `DoorTrack_AgentSummary_${dateRange}.xlsx`);
}
