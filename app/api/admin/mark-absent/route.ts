import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { localMidnight } from "@/lib/utils";
import { subDays } from "date-fns";

// Marks agents who never punched in as ABSENT for yesterday.
// Call via: GET /api/admin/mark-absent
// Or automate with a cron job on the server: curl https://yourdomain.com/api/admin/mark-absent
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role === "AGENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const yesterday = localMidnight(
    subDays(new Date(), 1).toISOString().slice(0, 10)
  );

  const agents = await prisma.user.findMany({
    where: { role: "AGENT", isActive: true },
    select: { id: true },
  });

  let marked = 0;
  for (const agent of agents) {
    const existing = await prisma.attendanceDay.findUnique({
      where: { userId_date: { userId: agent.id, date: yesterday } },
    });
    if (!existing) {
      await prisma.attendanceDay.create({
        data: { userId: agent.id, date: yesterday, status: "ABSENT", totalHours: 0 },
      });
      marked++;
    }
  }

  return NextResponse.json({ ok: true, markedAbsent: marked });
}
