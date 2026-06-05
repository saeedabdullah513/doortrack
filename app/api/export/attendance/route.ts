import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { buildWorkbook, xlsxResponse } from "@/lib/excel";
import { centralDaysAgo, formatDate, formatDateIso, formatDateMonthDay, formatHours, formatTime, getStatusLabel, localMidnight } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role === "AGENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const from    = localMidnight(searchParams.get("from") ?? formatDateIso(centralDaysAgo(30)));
  const to      = localMidnight(searchParams.get("to")   ?? formatDateIso(localMidnight()));
  const agentId = searchParams.get("agentId") ?? undefined;
  to.setHours(23, 59, 59, 999);

  const where: Record<string, unknown> = { date: { gte: from, lte: to } };
  if (agentId) where.userId = agentId;

  const days = await prisma.attendanceDay.findMany({
    where,
    include: {
      user:         { select: { name: true, email: true } },
      punchEntries: { orderBy: { sequence: "asc" } },
    },
    orderBy: [{ user: { name: "asc" } }, { date: "desc" }],
  });

  // Find the max number of sessions across all days — drives column count
  const maxSessions = days.reduce((m, d) => Math.max(m, d.punchEntries.length), 1);

  // ── Sheet 1: Table-style (matches the admin attendance UI) ──
  const tableRows = days.map((d) => {
    const row: Record<string, string | number> = {
      "Date":  formatDate(d.date),
      "Agent": d.user.name,
    };

    for (let i = 0; i < maxSessions; i++) {
      const n = i + 1;
      const e = d.punchEntries[i];

      row[`In ${n}`]          = e ? formatTime(e.punchInTime) : "";
      row[`In Location ${n}`] = e?.punchInAddress  ?? "";
      row[`Out ${n}`]         = e?.punchOutTime ? formatTime(e.punchOutTime) : "";
      row[`Out Location ${n}`] = e?.punchOutAddress ?? "";
    }

    row["Daily Total"] = d.totalHours ? formatHours(Number(d.totalHours)) : "—";
    row["Status"]      = getStatusLabel(d.status);
    if (d.editedByAdmin) row["Edited"] = "Yes (Admin)";

    return row;
  });

  // ── Sheet 2: Detailed punch entries (one row per session) ──
  const detailRows = days.flatMap((d) =>
    d.punchEntries.map((e) => ({
      "Date":          formatDate(d.date),
      "Agent":         d.user.name,
      "Email":         d.user.email,
      "Session #":     e.sequence,
      "Punch In Time": e.punchInTime  ? formatTime(e.punchInTime) : "",
      "In Address":    e.punchInAddress  ?? "",
      "In Latitude":   Number(e.punchInLat).toFixed(6),
      "In Longitude":  Number(e.punchInLng).toFixed(6),
      "Punch Out Time": e.punchOutTime ? formatTime(e.punchOutTime) : "",
      "Out Address":   e.punchOutAddress ?? "",
      "Out Latitude":  e.punchOutLat ? Number(e.punchOutLat).toFixed(6) : "",
      "Out Longitude": e.punchOutLng ? Number(e.punchOutLng).toFixed(6) : "",
      "Session Hours": e.entryHours   ? Number(e.entryHours).toFixed(2) : "",
      "In Maps Link":  `https://maps.google.com/?q=${e.punchInLat},${e.punchInLng}`,
      "Out Maps Link": e.punchOutLat  ? `https://maps.google.com/?q=${e.punchOutLat},${e.punchOutLng}` : "",
    }))
  );

  const buf = buildWorkbook([
    { name: "Attendance",   rows: tableRows  },
    { name: "Punch Detail", rows: detailRows },
  ]);

  const dateRange = `${formatDateMonthDay(from)}-${formatDateMonthDay(to)}`;
  return xlsxResponse(buf, `DoorTrack_Attendance_${dateRange}.xlsx`);
}
