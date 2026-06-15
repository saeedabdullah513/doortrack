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
  if (!session || session.user.role === "AGENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.salesEntry.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { saleDate, activationStatus, paymentStatus, ...data } = parsed.data;
  const isSuperAdmin = session.user.role === "SUPER_ADMIN";

  await prisma.salesEntry.update({
    where: { id },
    data: {
      ...data,
      ...(saleDate ? { createdAt: new Date(saleDate) } : {}),
      ...(isSuperAdmin && activationStatus ? { activationStatus } : {}),
      ...(isSuperAdmin && paymentStatus ? { paymentStatus } : {}),
    },
  });

  return NextResponse.json({ ok: true });
}
