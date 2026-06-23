"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Pencil, Search, Download, Trash2, X, Loader2 } from "lucide-react";

interface Sale {
  id: string;
  agentName: string;
  portal: string;
  provider: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  city: string;
  state: string;
  zipCode: string;
  hasMobile: boolean;
  hasInternet: boolean;
  hasTv: boolean;
  hasPhone: boolean;
  hasHomeSecurity: boolean;
  mobileQty: number;
  internetQty: number;
  tvQty: number;
  phoneQty: number;
  homeSecurityQty: number;
  comments: string | null;
  activationStatus: string;
  paymentStatus: string;
  createdAt: string;
  saleDate: string;
}

interface Agent {
  id: string;
  name: string;
}

const SERVICE_KEYWORDS: Record<string, keyof Sale> = {
  mobile: "hasMobile",
  internet: "hasInternet",
  tv: "hasTv",
  phone: "hasPhone",
  security: "hasHomeSecurity",
};

function matchesSearch(sale: Sale, term: string): boolean {
  if (!term) return true;
  const q = term.toLowerCase().trim();
  const words = q.split(/\s+/);
  const matchedKeyword = words.find((w) => SERVICE_KEYWORDS[w]);
  if (matchedKeyword) {
    return sale[SERVICE_KEYWORDS[matchedKeyword]] === true;
  }
  const dateStr = formatDate(sale.saleDate).toLowerCase();
  const address = `${sale.customerAddress} ${sale.city} ${sale.state} ${sale.zipCode}`.toLowerCase();

  return (
    sale.customerName.toLowerCase().includes(q) ||
    sale.customerPhone.includes(q) ||
    sale.portal.toLowerCase().includes(q) ||
    sale.provider.toLowerCase().includes(q) ||
    sale.agentName.toLowerCase().includes(q) ||
    sale.activationStatus.toLowerCase().includes(q) ||
    sale.paymentStatus.toLowerCase().includes(q) ||
    address.includes(q) ||
    (sale.comments || "").toLowerCase().includes(q) ||
    dateStr.includes(q)
  );
}

export default function AdminSalesPage() {
  const router = useRouter();
  const [sales, setSales] = useState<Sale[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAgent, setFilterAgent] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;

  const fetchSales = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterAgent) params.set("agentId", filterAgent);
    if (filterFrom) params.set("dateFrom", filterFrom);
    if (filterTo) params.set("dateTo", filterTo);

    const res = await fetch(`/api/sales?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setSales(data);
    }
    setLoading(false);
  }, [filterAgent, filterFrom, filterTo]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  useEffect(() => {
    fetch("/api/agents")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setAgents(data))
      .catch(() => {});
  }, []);

  const filteredSales = useMemo(() => {
    if (!search) return sales;
    return sales.filter((s) => matchesSearch(s, search));
  }, [sales, search]);

  const totalPages = Math.ceil(filteredSales.length / PAGE_SIZE);
  const displaySales = filteredSales.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filterAgent, filterFrom, filterTo, search]);

  function handleExport() {
    const params = new URLSearchParams();
    if (filterAgent) params.set("agentId", filterAgent);
    if (filterFrom) params.set("dateFrom", filterFrom);
    if (filterTo) params.set("dateTo", filterTo);

    window.open(`/api/sales/export?${params.toString()}`, "_blank");
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const res = await fetch(`/api/sales/${deleteId}`, { method: "DELETE" });
    if (res.ok) {
      setSales((prev) => prev.filter((s) => s.id !== deleteId));
      setDeleteId(null);
    }
    setDeleting(false);
  }

  const inputClass = "px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full";

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Sales Entry</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{filteredSales.length} record{filteredSales.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={handleExport} className="px-3.5 sm:px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 shadow-sm flex items-center gap-1.5">
          <Download size={15} />
          <span className="hidden sm:inline">Export Excel</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, phone, portal, provider, status, date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 border border-gray-200 rounded-xl text-base sm:text-sm text-gray-900 placeholder-gray-400 bg-white transition-all duration-200 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3">
          <div>
            <label className="block text-[10px] sm:text-xs font-medium text-gray-500 mb-1">Agent</label>
            <select value={filterAgent} onChange={(e) => setFilterAgent(e.target.value)} className={inputClass}>
              <option value="">All Agents</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] sm:text-xs font-medium text-gray-500 mb-1">From</label>
            <input type="date" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-[10px] sm:text-xs font-medium text-gray-500 mb-1">To</label>
            <input type="date" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} className={inputClass} />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => { setFilterAgent(""); setFilterFrom(""); setFilterTo(""); setSearch(""); }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 w-full"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">
              <tr>
                <th className="px-3 py-3 text-left">Sale Date</th>
                <th className="px-3 py-3 text-left">Agent</th>
                <th className="px-3 py-3 text-left">Customer</th>
                <th className="px-3 py-3 text-left">Phone</th>
                <th className="px-3 py-3 text-left">Address</th>
                <th className="px-3 py-3 text-left">Portal</th>
                <th className="px-3 py-3 text-left">Provider</th>
                <th className="px-3 py-3 text-left">Services</th>
                <th className="px-3 py-3 text-left">Qty</th>
                <th className="px-3 py-3 text-left">Activation</th>
                <th className="px-3 py-3 text-left">Payment</th>
                <th className="px-3 py-3 text-left">Comments</th>
                <th className="px-3 py-3 text-center w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={13} className="px-3 py-10 text-center text-gray-400">Loading...</td>
                </tr>
              ) : displaySales.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-3 py-10 text-center text-gray-400">
                    {search ? "No sales match your search." : "No sales records found."}
                  </td>
                </tr>
              ) : (
                displaySales.map((s) => {
                  const services = [
                    s.hasMobile && "Mobile",
                    s.hasInternet && "Internet",
                    s.hasTv && "TV",
                    s.hasPhone && "Phone",
                    s.hasHomeSecurity && "Security",
                  ].filter(Boolean);

                  const qtyItems = [
                    s.hasMobile && { label: "Mobile", qty: s.mobileQty },
                    s.hasInternet && { label: "Internet", qty: s.internetQty },
                    s.hasTv && { label: "TV", qty: s.tvQty },
                    s.hasPhone && { label: "Phone", qty: s.phoneQty },
                    s.hasHomeSecurity && { label: "Security", qty: s.homeSecurityQty },
                  ].filter(Boolean) as { label: string; qty: number }[];

                  return (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 text-gray-600 whitespace-nowrap text-xs">{formatDate(s.saleDate)}</td>
                      <td className="px-3 py-3 font-medium text-gray-800 text-sm">{s.agentName}</td>
                      <td className="px-3 py-3">
                        <div className="font-medium text-gray-800 text-sm">{s.customerName}</div>
                      </td>
                      <td className="px-3 py-3 text-gray-600 whitespace-nowrap text-xs">{s.customerPhone}</td>
                      <td className="px-3 py-3 text-gray-600 max-w-[200px] truncate text-xs">
                        {s.customerAddress}, {s.city}, {s.state} {s.zipCode}
                      </td>
                      <td className="px-3 py-3 text-gray-600 text-xs">{s.portal}</td>
                      <td className="px-3 py-3 text-gray-600 text-xs">{s.provider}</td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-1">
                          {services.map((svc) => (
                            <span key={svc} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                              {svc}
                            </span>
                          ))}
                          {services.length === 0 && <span className="text-gray-400 text-xs">—</span>}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-col gap-0.5">
                          {qtyItems.map((item) => (
                            <span key={item.label} className="text-xs text-gray-600 whitespace-nowrap">
                              {item.label}: {item.qty}
                            </span>
                          ))}
                          {qtyItems.length === 0 && <span className="text-gray-400 text-xs">—</span>}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          s.activationStatus === "Active" ? "bg-green-50 text-green-700" :
                          s.activationStatus === "Chargeback" || s.activationStatus === "Cancel" ? "bg-red-50 text-red-700" :
                          s.activationStatus === "Pending" ? "bg-amber-50 text-amber-700" :
                          "bg-gray-50 text-gray-600"
                        }`}>
                          {s.activationStatus}
                        </span>
                      </td>
                      <td className="px-3 py-3">
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
                      <td className="px-3 py-3 text-gray-400 max-w-[150px] truncate text-xs">
                        {s.comments || "—"}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => router.push(`/admin/sales/${s.id}`)}
                            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all"
                            title="Edit"
                          >
                            <Pencil size={14} className="text-gray-500" />
                          </button>
                          <button
                            onClick={() => setDeleteId(s.id)}
                            className="w-8 h-8 rounded-lg border border-red-200 flex items-center justify-center hover:bg-red-50 hover:border-red-300 transition-all"
                            title="Delete"
                          >
                            <Trash2 size={14} className="text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              Page {currentPage} of {totalPages} ({filteredSales.length} total)
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile card view */}
      <div className="sm:hidden space-y-3">
        {loading ? (
          <div className="text-center py-10 text-gray-400 text-sm">Loading...</div>
        ) : displaySales.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            {search ? "No sales match your search." : "No sales records found."}
          </div>
        ) : (
          displaySales.map((s) => {
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
                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                      <button
                        onClick={() => router.push(`/admin/sales/${s.id}`)}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                        title="Edit"
                      >
                        <Pencil size={13} className="text-gray-500" />
                      </button>
                      <button
                        onClick={() => setDeleteId(s.id)}
                        className="w-8 h-8 rounded-lg border border-red-200 flex items-center justify-center hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={13} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="font-medium text-gray-600">{s.agentName}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-gray-400">{formatDate(s.saleDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{s.portal}</span>
                  <span className="text-gray-300">·</span>
                  <span>{s.provider}</span>
                </div>
                <div className="text-xs text-gray-400 truncate">
                  {s.customerAddress}, {s.city}, {s.state} {s.zipCode}
                </div>
                <div className="flex flex-wrap gap-1">
                  {services.map((svc) => (
                    <span key={svc} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700">
                      {svc}
                    </span>
                  ))}
                  {services.length === 0 && <span className="text-gray-400 text-[10px]">No services</span>}
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-gray-500">
                  {s.hasMobile && <span>Mobile: {s.mobileQty}</span>}
                  {s.hasInternet && <span>Internet: {s.internetQty}</span>}
                  {s.hasTv && <span>TV: {s.tvQty}</span>}
                  {s.hasPhone && <span>Phone: {s.phoneQty}</span>}
                  {s.hasHomeSecurity && <span>Security: {s.homeSecurityQty}</span>}
                  {!s.hasMobile && !s.hasInternet && !s.hasTv && !s.hasPhone && !s.hasHomeSecurity && <span>—</span>}
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
                {s.comments && (
                  <p className="text-[10px] text-gray-400 italic leading-relaxed">{s.comments}</p>
                )}
              </div>
            );
          })
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Delete confirmation dialog */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => !deleting && setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Trash2 size={18} className="text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-900">Delete Sale</h3>
                <p className="text-sm text-gray-500 mt-1">Are you sure you want to delete this sale? This action cannot be undone.</p>
              </div>
              <button onClick={() => setDeleteId(null)} disabled={deleting} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 flex-shrink-0">
                <X size={16} className="text-gray-400" />
              </button>
            </div>
            <div className="flex gap-2.5 mt-6">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="flex-1 h-11 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 h-11 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <><Loader2 size={16} className="animate-spin" /> Deleting...</>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
