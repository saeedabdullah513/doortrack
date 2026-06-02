import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { APP_CONFIG } from "@/lib/config";
import { z } from "zod";

const schema = z.object({
  notes: z.string().optional(),
  entries: z.array(z.object({
    id:           z.string(),
    punchInTime:  z.string(),
    punchOutTime: z.string().nullable(),
  })),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role === "AGENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body   = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const day = await prisma.attendanceDay.findUnique({ where: { id } });
  if (!day) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Update each entry's times
  for (const e of parsed.data.entries) {
    const inTime  = new Date(e.punchInTime);
    const outTime = e.punchOutTime ? new Date(e.punchOutTime) : null;
    const hours   = outTime
      ? (outTime.getTime() - inTime.getTime()) / (1000 * 60 * 60)
      : null;
    await prisma.punchEntry.update({
      where: { id: e.id },
      data: { punchInTime: inTime, punchOutTime: outTime, entryHours: hours },
    });
  }

  // Recalculate day totals
  const allEntries = await prisma.punchEntry.findMany({
    where: { dayId: id, entryHours: { not: null } },
  });
  const totalHours = allEntries.reduce((s, e) => s + Number(e.entryHours), 0);
  const stillOpen  = await prisma.punchEntry.findFirst({ where: { dayId: id, punchOutTime: null } });
  const status     = stillOpen ? "IN_PROGRESS"
    : totalHours >= APP_CONFIG.attendance.targetHours ? "COMPLETED" : "BELOW_TARGET";

  await prisma.attendanceDay.update({
    where: { id },
    data: { totalHours, status, editedByAdmin: true, notes: parsed.data.notes ?? day.notes },
  });

  return NextResponse.json({ ok: true });
}
