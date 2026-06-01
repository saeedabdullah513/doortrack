import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { reverseGeocode } from "@/lib/geocode";
import { APP_CONFIG } from "@/lib/config";
import { z } from "zod";
import { localMidnight } from "@/lib/utils";

const schema = z.object({
  type: z.enum(["PUNCH_IN", "PUNCH_OUT"]),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "AGENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { type, latitude, longitude } = parsed.data;
    const userId = session.user.id;
    const now = new Date();
    const todayDate = localMidnight();

    // Fire geocoding — we await it just before we need the address
    const addressPromise = reverseGeocode(latitude, longitude);

    if (type === "PUNCH_IN") {
      // Find existing day or create a new one.
      // We use findUnique + create separately to avoid the upsert race condition
      // that throws P2002 when the record exists but the date param has a tiny offset.
      let day = await prisma.attendanceDay.findUnique({
        where: { userId_date: { userId, date: todayDate } },
      });

      if (!day) {
        day = await prisma.attendanceDay.create({
          data: { userId, date: todayDate, status: "IN_PROGRESS" },
        });
      }

      // Block a second punch-in if one is already open
      const openEntry = await prisma.punchEntry.findFirst({
        where: { dayId: day.id, punchOutTime: null },
      });
      if (openEntry) {
        return NextResponse.json(
          { error: "You are already punched in. Please punch out first." },
          { status: 409 }
        );
      }

      const nextSeq = await prisma.punchEntry.count({ where: { dayId: day.id } });
      const address = await addressPromise;

      await prisma.punchEntry.create({
        data: {
          dayId: day.id,
          userId,
          sequence: nextSeq + 1,
          punchInTime: now,
          punchInLat: latitude,
          punchInLng: longitude,
          punchInAddress: address,
        },
      });

      return NextResponse.json({ ok: true });
    }

    // PUNCH_OUT
    const day = await prisma.attendanceDay.findUnique({
      where: { userId_date: { userId, date: todayDate } },
    });
    if (!day) {
      return NextResponse.json(
        { error: "You haven't punched in today." },
        { status: 404 }
      );
    }

    const openEntry = await prisma.punchEntry.findFirst({
      where: { dayId: day.id, punchOutTime: null },
      orderBy: { sequence: "desc" },
    });
    if (!openEntry) {
      return NextResponse.json(
        { error: "No active punch-in found." },
        { status: 409 }
      );
    }

    const address = await addressPromise;
    const entryHours =
      (now.getTime() - openEntry.punchInTime.getTime()) / (1000 * 60 * 60);

    await prisma.punchEntry.update({
      where: { id: openEntry.id },
      data: {
        punchOutTime: now,
        punchOutLat: latitude,
        punchOutLng: longitude,
        punchOutAddress: address,
        entryHours,
      },
    });

    // Recalculate total hours and status for the day
    const allEntries = await prisma.punchEntry.findMany({
      where: { dayId: day.id, entryHours: { not: null } },
    });
    const totalHours = allEntries.reduce(
      (sum, e) => sum + Number(e.entryHours),
      0
    );

    const stillOpen = await prisma.punchEntry.findFirst({
      where: { dayId: day.id, punchOutTime: null },
    });

    const status: "IN_PROGRESS" | "COMPLETED" | "BELOW_TARGET" = stillOpen
      ? "IN_PROGRESS"
      : totalHours >= APP_CONFIG.attendance.targetHours
      ? "COMPLETED"
      : "BELOW_TARGET";

    await prisma.attendanceDay.update({
      where: { id: day.id },
      data: { totalHours, status },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[attendance/action]", err);
    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
