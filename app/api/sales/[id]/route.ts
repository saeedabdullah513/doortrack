import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateSchema = z.object({
  portal: z.string().min(1),
  provider: z.string().min(1),
  customerName: z.string().min(1),
  customerPhone: z.string().min(1),
  customerAddress: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zipCode: z.string().min(1),
  hasMobile: z.boolean().optional().default(false),
  hasInternet: z.boolean().optional().default(false),
  hasTv: z.boolean().optional().default(false),
  hasPhone: z.boolean().optional().default(false),
  hasHomeSecurity: z.boolean().optional().default(false),
  mobileQty: z.number().int().min(0).optional().default(0),
  internetQty: z.number().int().min(0).optional().default(0),
  tvQty: z.number().int().min(0).optional().default(0),
  phoneQty: z.number().int().min(0).optional().default(0),
  homeSecurityQty: z.number().int().min(0).optional().default(0),
  comments: z.string().optional(),
  activationStatus: z.string().optional(),
  paymentStatus: z.string().optional(),
  saleDate: z.string().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const isAgent = session.user.role === "AGENT";
  const isSuperAdmin = session.user.role === "SUPER_ADMIN";

  const existing = await prisma.salesEntry.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (isAgent && existing.agentId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
  }

  const { saleDate, activationStatus, paymentStatus, ...data } = parsed.data;

  await prisma.salesEntry.update({
    where: { id },
    data: {
      ...data,
      ...(saleDate ? { saleDate: new Date(saleDate) } : {}),
      ...(isAgent ? { activationStatus: "Pending", paymentStatus: "Unpaid" } : {}),
      ...(!isAgent && isSuperAdmin && activationStatus ? { activationStatus } : {}),
      ...(!isAgent && isSuperAdmin && paymentStatus ? { paymentStatus } : {}),
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role === "AGENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.salesEntry.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.salesEntry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
