import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import * as XLSX from "xlsx";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role === "AGENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const where: Record<string, unknown> = {};

  const agentId = searchParams.get("agentId");
  if (agentId) where.agentId = agentId;

  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  if (dateFrom || dateTo) {
    where.saleDate = {};
    if (dateFrom) (where.saleDate as Record<string, unknown>).gte = new Date(dateFrom);
    if (dateTo) (where.saleDate as Record<string, unknown>).lte = new Date(dateTo + "T23:59:59.999Z");
  }

  const sales = await prisma.salesEntry.findMany({
    where,
    orderBy: { saleDate: "desc" },
  });

  const rows = sales.map((s, i) => ({
    "#": i + 1,
    "Date": new Date(s.saleDate).toLocaleDateString("en-US", { timeZone: "America/Chicago" }),
    "Agent Name": s.agentName,
    "Portal": s.portal,
    "Provider": s.provider,
    "Customer Name": s.customerName,
    "Customer Phone": s.customerPhone,
    "Customer Address": s.customerAddress,
    "City": s.city,
    "State": s.state,
    "Zip Code": s.zipCode,
    "Mobile Qty": s.mobileQty || (s.hasMobile ? 1 : 0),
    "Internet Qty": s.internetQty || (s.hasInternet ? 1 : 0),
    "TV Qty": s.tvQty || (s.hasTv ? 1 : 0),
    "Phone Qty": s.phoneQty || (s.hasPhone ? 1 : 0),
    "Security Qty": s.homeSecurityQty || (s.hasHomeSecurity ? 1 : 0),
    "Comments": s.comments ?? "",
    "Activation Status": s.activationStatus,
    "Payment Status": s.paymentStatus,
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, "Sales");

  const colWidths = [
    { wch: 4 }, { wch: 12 }, { wch: 18 }, { wch: 14 }, { wch: 14 },
    { wch: 22 }, { wch: 16 }, { wch: 26 }, { wch: 14 }, { wch: 6 },
    { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 8 }, { wch: 10 },
    { wch: 12 }, { wch: 22 }, { wch: 18 }, { wch: 16 },
  ];
  ws["!cols"] = colWidths;

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="sales-export-${Date.now()}.xlsx"`,
    },
  });
}
