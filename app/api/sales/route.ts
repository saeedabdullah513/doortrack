import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
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
  activationStatus: z.string().min(1),
  paymentStatus: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
  }

  const sale = await prisma.salesEntry.create({
    data: {
      ...parsed.data,
      agentId: session.user.id,
      agentName: session.user.name,
    },
  });

  return NextResponse.json({ ok: true, id: sale.id });
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const isAdmin = session.user.role !== "AGENT";

  const where: Record<string, unknown> = {};

  if (!isAdmin) {
    where.agentId = session.user.id;
  } else {
    const agentId = searchParams.get("agentId");
    if (agentId) where.agentId = agentId;
  }

  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) (where.createdAt as Record<string, unknown>).gte = new Date(dateFrom);
    if (dateTo) (where.createdAt as Record<string, unknown>).lte = new Date(dateTo + "T23:59:59.999Z");
  }

  const sales = await prisma.salesEntry.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(sales);
}
