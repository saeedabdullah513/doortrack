import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role === "AGENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id }, select: { isActive: true } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.user.update({ where: { id }, data: { isActive: !user.isActive } });
  return NextResponse.json({ ok: true, isActive: !user.isActive });
}
