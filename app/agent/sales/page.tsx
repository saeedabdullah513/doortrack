import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function AgentSalesPage() {
  const session = await auth();
  const sales = await prisma.salesEntry.findMany({
    where: { agentId: session!.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">My Sales</h1>
          <p className="text-sm text-gray-500">{sales.length} record{sales.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/agent/sales/new"
          className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-700 shadow-sm"
        >
          + New Sale
        </Link>
      </div>

      {sales.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No sales yet</p>
          <p className="text-sm mt-1">Submit your first sale to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Customer</th>
                <th className="px-3 py-2 text-left">Portal</th>
                <th className="px-3 py-2 text-left">Services</th>
                <th className="px-3 py-2 text-left">Activation</th>
                <th className="px-3 py-2 text-left">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sales.map((s) => {
                const services = [
                  s.hasMobile && "Mobile",
                  s.hasInternet && "Internet",
                  s.hasTv && "TV",
                  s.hasPhone && "Phone",
                  s.hasHomeSecurity && "Security",
                ].filter(Boolean);

                return (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{formatDate(s.createdAt)}</td>
                    <td className="px-3 py-2.5">
                      <div className="font-medium text-gray-800">{s.customerName}</div>
                      <div className="text-gray-400 text-xs">{s.customerPhone}</div>
                    </td>
                    <td className="px-3 py-2.5 text-gray-600">
                      <div>{s.portal}</div>
                      <div className="text-xs text-gray-400">{s.provider}</div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {services.map((svc) => (
                          <span key={svc} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            {svc}
                          </span>
                        ))}
                        {services.length === 0 && <span className="text-gray-400 text-xs">None</span>}
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        s.activationStatus === "Activation" ? "bg-green-50 text-green-700" :
                        s.activationStatus === "Chargeback" ? "bg-red-50 text-red-700" :
                        "bg-gray-50 text-gray-600"
                      }`}>
                        {s.activationStatus}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        s.paymentStatus === "Paid" ? "bg-green-50 text-green-700" :
                        s.paymentStatus === "Chargeback" ? "bg-red-50 text-red-700" :
                        s.paymentStatus === "Refund" ? "bg-amber-50 text-amber-700" :
                        "bg-gray-50 text-gray-600"
                      }`}>
                        {s.paymentStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
