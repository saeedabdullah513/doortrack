"use client";

import { useEffect, useState, useCallback } from "react";
import { formatDate } from "@/lib/utils";
import { ACTIVATION_STATUSES, PAYMENT_STATUSES } from "@/lib/sales-constants";

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
  comments: string | null;
  activationStatus: string;
  paymentStatus: string;
  createdAt: string;
}

interface Agent {
  id: string;
  name: string;
}

export default function AdminSalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAgent, setFilterAgent] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

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

  function handleExport() {
    const params = new URLSearchParams();
    if (filterAgent) params.set("agentId", filterAgent);
    if (filterFrom) params.set("dateFrom", filterFrom);
    if (filterTo) params.set("dateTo", filterTo);

    window.open(`/api/sales/export?${params.toString()}`, "_blank");
  }

  const inputClass = "px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Sales Entry</h1>
          <p className="text-sm text-gray-500 mt-0.5">{sales.length} total record{sales.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 shadow-sm"
        >
          Export Excel
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Agent</label>
            <select value={filterAgent} onChange={(e) => setFilterAgent(e.target.value)} className={inputClass}>
              <option value="">All Agents</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">From Date</label>
            <input type="date" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">To Date</label>
            <input type="date" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} className={inputClass} />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => { setFilterAgent(""); setFilterFrom(""); setFilterTo(""); }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">
              <tr>
                <th className="px-3 py-3 text-left">Date</th>
                <th className="px-3 py-3 text-left">Agent</th>
                <th className="px-3 py-3 text-left">Customer</th>
                <th className="px-3 py-3 text-left">Phone</th>
                <th className="px-3 py-3 text-left">Address</th>
                <th className="px-3 py-3 text-left">Portal</th>
                <th className="px-3 py-3 text-left">Provider</th>
                <th className="px-3 py-3 text-left">Services</th>
                <th className="px-3 py-3 text-left">Activation</th>
                <th className="px-3 py-3 text-left">Payment</th>
                <th className="px-3 py-3 text-left">Comments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={11} className="px-3 py-10 text-center text-gray-400">Loading...</td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-3 py-10 text-center text-gray-400">No sales records found.</td>
                </tr>
              ) : (
                sales.map((s) => {
                  const services = [
                    s.hasMobile && "Mobile",
                    s.hasInternet && "Internet",
                    s.hasTv && "TV",
                    s.hasPhone && "Phone",
                    s.hasHomeSecurity && "Security",
                  ].filter(Boolean);

                  return (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{formatDate(s.createdAt)}</td>
                      <td className="px-3 py-3 font-medium text-gray-800">{s.agentName}</td>
                      <td className="px-3 py-3">
                        <div className="font-medium text-gray-800">{s.customerName}</div>
                      </td>
                      <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{s.customerPhone}</td>
                      <td className="px-3 py-3 text-gray-600 max-w-[200px] truncate">
                        {s.customerAddress}, {s.city}, {s.state} {s.zipCode}
                      </td>
                      <td className="px-3 py-3 text-gray-600">{s.portal}</td>
                      <td className="px-3 py-3 text-gray-600">{s.provider}</td>
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
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          s.activationStatus === "Activation" ? "bg-green-50 text-green-700" :
                          s.activationStatus === "Chargeback" ? "bg-red-50 text-red-700" :
                          "bg-gray-50 text-gray-600"
                        }`}>
                          {s.activationStatus}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          s.paymentStatus === "Paid" ? "bg-green-50 text-green-700" :
                          s.paymentStatus === "Chargeback" ? "bg-red-50 text-red-700" :
                          s.paymentStatus === "Refund" ? "bg-amber-50 text-amber-700" :
                          "bg-gray-50 text-gray-600"
                        }`}>
                          {s.paymentStatus}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-gray-400 max-w-[150px] truncate">
                        {s.comments || "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
