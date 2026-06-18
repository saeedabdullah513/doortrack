import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const stock = await prisma.productStock.findMany({
    orderBy: { productName: "asc" },
  });
  return NextResponse.json(stock);
}
