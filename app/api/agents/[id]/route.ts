import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().nullable().optional(),
  password: z.string().min(6).optional(),
  isActive: z.boolean().optional(),
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
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const agent = await prisma.user.findUnique({ where: { id, role: "AGENT" } });
  if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 });

  const data: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.password) {
    data.password = await bcrypt.hash(parsed.data.password, 12);
  } else {
    delete data.password;
  }

  await prisma.user.update({ where: { id }, data });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.user.update({ where: { id }, data: { isActive: false } });
  return NextResponse.json({ ok: true });
}
