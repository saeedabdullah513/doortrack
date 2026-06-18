import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";

export default async function AgentSalesPage() {
  const session = await auth();
  const sales = await prisma.salesEntry.findMany({
    where: { agentId: session!.user.id },
    orderBy: { saleDate: "desc" },
  });

  return (
    <div className="px-3 sm:px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">My Sales</h1>
          <p className="text-xs sm:text-sm text-gray-500">{sales.length} record{sales.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/agent/sales/new"
          className="bg-red-600 text-white px-3.5 sm:px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 shadow-sm flex items-center gap-1.5"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">New Sale</span>
        </Link>
      </div>

      {sales.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No sales yet</p>
          <p className="text-sm mt-1">Submit your first sale to get started.</p>
        </div>
      ) : (
        <>
          {/* Mobile card view */}
          <div className="sm:hidden space-y-3">
            {sales.map((s) => {
              const services = [
                s.hasMobile && "Mobile",
                s.hasInternet && "Internet",
                s.hasTv && "TV",
                s.hasPhone && "Phone",
                s.hasHomeSecurity && "Security",
              ].filter(Boolean);

              return (
                <div key={s.id} className="bg-white rounded-xl border border-gray-100 p-3.5 space-y-2.5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{s.customerName}</p>
                      <p className="text-xs text-gray-400">{s.customerPhone}</p>
                    </div>
                    <Link
                      href={`/agent/sales/${s.id}`}
                      className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all flex-shrink-0 ml-2"
                      title="Edit"
                    >
                      <Pencil size={13} className="text-gray-500" />
                    </Link>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-medium">{s.portal}</span>
                    <span className="text-gray-300">·</span>
                    <span>{s.provider}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400">
                    <span>{formatDate(s.saleDate)}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {services.map((svc) => (
                      <span key={svc} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700">
                        {svc}
                      </span>
                    ))}
                    {services.length === 0 && <span className="text-gray-400 text-[10px]">No services</span>}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      s.activationStatus === "Active" ? "bg-green-50 text-green-700" :
                      s.activationStatus === "Pending" ? "bg-amber-50 text-amber-700" :
                      s.activationStatus === "Chargeback" || s.activationStatus === "Cancel" ? "bg-red-50 text-red-700" :
                      "bg-gray-50 text-gray-600"
                    }`}>
                      {s.activationStatus}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      s.paymentStatus === "100% Paid" ? "bg-green-50 text-green-700" :
                      s.paymentStatus === "Unpaid" ? "bg-gray-50 text-gray-600" :
                      s.paymentStatus?.includes("Chargeback") ? "bg-red-50 text-red-700" :
                      s.paymentStatus?.includes("Paid") ? "bg-blue-50 text-blue-700" :
                      "bg-gray-50 text-gray-600"
                    }`}>
                      {s.paymentStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-left">Customer</th>
                  <th className="px-3 py-2 text-left">Portal</th>
                  <th className="px-3 py-2 text-left">Services</th>
                  <th className="px-3 py-2 text-left">Activation</th>
                  <th className="px-3 py-2 text-left">Payment</th>
                  <th className="px-3 py-2 text-center w-16">Edit</th>
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
                      <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap text-xs">{formatDate(s.saleDate)}</td>
                      <td className="px-3 py-2.5">
                        <div className="font-medium text-gray-800 text-sm">{s.customerName}</div>
                        <div className="text-gray-400 text-xs">{s.customerPhone}</div>
                      </td>
                      <td className="px-3 py-2.5 text-gray-600 text-xs">
                        <div>{s.portal}</div>
                        <div className="text-gray-400">{s.provider}</div>
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
                          s.activationStatus === "Active" ? "bg-green-50 text-green-700" :
                          s.activationStatus === "Pending" ? "bg-amber-50 text-amber-700" :
                          s.activationStatus === "Chargeback" || s.activationStatus === "Cancel" ? "bg-red-50 text-red-700" :
                          "bg-gray-50 text-gray-600"
                        }`}>
                          {s.activationStatus}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          s.paymentStatus === "100% Paid" ? "bg-green-50 text-green-700" :
                          s.paymentStatus === "Unpaid" ? "bg-gray-50 text-gray-600" :
                          s.paymentStatus?.includes("Chargeback") ? "bg-red-50 text-red-700" :
                          s.paymentStatus?.includes("Paid") ? "bg-blue-50 text-blue-700" :
                          "bg-gray-50 text-gray-600"
                        }`}>
                          {s.paymentStatus}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <Link
                          href={`/agent/sales/${s.id}`}
                          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all mx-auto"
                          title="Edit"
                        >
                          <Pencil size={14} className="text-gray-500" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
