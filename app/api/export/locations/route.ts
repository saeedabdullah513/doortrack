import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { buildWorkbook, xlsxResponse } from "@/lib/excel";
import { formatDate, formatTime, formatDateIso, formatDateMonthDay, localMidnight, centralDaysAgo } from "@/lib/utils";

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

  const where: Record<string, unknown> = {
    day: { date: { gte: from, lte: to } },
  };
  if (agentId) where.userId = agentId;

  const entries = await prisma.punchEntry.findMany({
    where,
    include: {
      user: { select: { name: true, email: true } },
      day:  { select: { date: true } },
    },
    orderBy: [{ user: { name: "asc" } }, { punchInTime: "asc" }],
  });

  const rows = entries.flatMap((e) => {
    const base = {
      "Date":    formatDate(e.day.date),
      "Agent":   e.user.name,
      "Session": e.sequence,
    };
    const inRow = {
      ...base,
      "Event":     "PUNCH IN",
      "Time":      formatTime(e.punchInTime),
      "Address":   e.punchInAddress ?? "",
      "Latitude":  Number(e.punchInLat).toFixed(6),
      "Longitude": Number(e.punchInLng).toFixed(6),
      "Google Maps Link": `https://maps.google.com/?q=${e.punchInLat},${e.punchInLng}`,
    };
    if (!e.punchOutTime) return [inRow];
    const outRow = {
      ...base,
      "Event":     "PUNCH OUT",
      "Time":      formatTime(e.punchOutTime),
      "Address":   e.punchOutAddress ?? "",
      "Latitude":  Number(e.punchOutLat).toFixed(6),
      "Longitude": Number(e.punchOutLng).toFixed(6),
      "Google Maps Link": `https://maps.google.com/?q=${e.punchOutLat},${e.punchOutLng}`,
    };
    return [inRow, outRow];
  });

  const buf = buildWorkbook([{ name: "Location Activity", rows }]);
  const dateRange = `${formatDateMonthDay(from)}-${formatDateMonthDay(to)}`;
  return xlsxResponse(buf, `DoorTrack_Locations_${dateRange}.xlsx`);
}
