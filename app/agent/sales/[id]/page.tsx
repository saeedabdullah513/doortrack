"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PORTALS, PROVIDERS, US_STATES } from "@/lib/sales-constants";
import { ArrowLeft, Building2, Loader2, Lock, MessageSquare, Save, ShoppingCart, X, User } from "lucide-react";

const services = [
  { key: "hasMobile", qtyKey: "mobileQty", label: "Mobile", icon: "📱" },
  { key: "hasInternet", qtyKey: "internetQty", label: "Internet", icon: "🌐" },
  { key: "hasTv", qtyKey: "tvQty", label: "TV", icon: "📺" },
  { key: "hasPhone", qtyKey: "phoneQty", label: "Phone", icon: "📞" },
  { key: "hasHomeSecurity", qtyKey: "homeSecurityQty", label: "Security", icon: "🛡️" },
] as const;

const sectionClass = "bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-200/50 overflow-hidden";
const sectionHeaderClass = "px-4 sm:px-5 py-3.5 sm:py-4 border-b border-gray-50 bg-gradient-to-r from-gray-50/80 to-white flex items-center gap-2.5";
const sectionBodyClass = "px-4 sm:px-5 py-4 sm:py-5 space-y-4 sm:space-y-5";
const inputClass = "w-full h-11 px-3.5 border border-gray-200 rounded-xl text-base sm:text-sm text-gray-900 placeholder-gray-400 bg-white transition-all duration-200 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 focus:shadow-sm hover:border-gray-300";
const selectClass = "w-full h-11 px-3.5 border border-gray-200 rounded-xl text-base sm:text-sm text-gray-900 bg-white transition-all duration-200 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 focus:shadow-sm hover:border-gray-300 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_14px_center] bg-no-repeat pr-10";
const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className={sectionHeaderClass}>
      <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
        <Icon size={14} className="text-red-500" />
      </div>
      <span className="text-sm font-bold text-gray-800">{title}</span>
    </div>
  );
}

export default function AgentEditSalePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    saleDate: "",
    portal: "",
    provider: "",
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    city: "",
    state: "",
    zipCode: "",
    hasMobile: false,
    hasInternet: false,
    hasTv: false,
    hasPhone: false,
    hasHomeSecurity: false,
    mobileQty: 0,
    internetQty: 0,
    tvQty: 0,
    phoneQty: 0,
    homeSecurityQty: 0,
    comments: "",
    paymentStatus: "",
  });

  useEffect(() => {
    fetch("/api/sales")
      .then((r) => r.json())
      .then((data: Record<string, unknown>[]) => {
        const sale = data.find((s) => s.id === id) as Record<string, unknown> | undefined;
        if (!sale) { setError("Sale not found"); setLoading(false); return; }
        const d = new Date(sale.saleDate as string);
        const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
        setForm({
          saleDate: local,
          portal: sale.portal as string,
          provider: sale.provider as string,
          customerName: sale.customerName as string,
          customerPhone: sale.customerPhone as string,
          customerAddress: sale.customerAddress as string,
          city: sale.city as string,
          state: sale.state as string,
          zipCode: sale.zipCode as string,
          hasMobile: sale.hasMobile as boolean,
          hasInternet: sale.hasInternet as boolean,
          hasTv: sale.hasTv as boolean,
          hasPhone: sale.hasPhone as boolean,
          hasHomeSecurity: sale.hasHomeSecurity as boolean,
          mobileQty: (sale.mobileQty as number) || 0,
          internetQty: (sale.internetQty as number) || 0,
          tvQty: (sale.tvQty as number) || 0,
          phoneQty: (sale.phoneQty as number) || 0,
          homeSecurityQty: (sale.homeSecurityQty as number) || 0,
          comments: (sale.comments as string) || "",
          paymentStatus: sale.paymentStatus as string,
        });
        setLoading(false);
      })
      .catch(() => { setError("Failed to load sale"); setLoading(false); });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch(`/api/sales/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        portal: form.portal,
        provider: form.provider,
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerAddress: form.customerAddress,
        city: form.city,
        state: form.state,
        zipCode: form.zipCode,
        hasMobile: form.hasMobile,
        hasInternet: form.hasInternet,
        hasTv: form.hasTv,
        hasPhone: form.hasPhone,
        hasHomeSecurity: form.hasHomeSecurity,
        mobileQty: form.mobileQty,
        internetQty: form.internetQty,
        tvQty: form.tvQty,
        phoneQty: form.phoneQty,
        homeSecurityQty: form.homeSecurityQty,
        comments: form.comments,
        saleDate: form.saleDate ? `${form.saleDate}T00:00:00.000Z` : undefined,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setError(err.error || "Failed to update");
      setSubmitting(false);
      return;
    }

    router.push("/agent/sales");
    router.refresh();
  }

  function set(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  if (loading) {
    return <div className="text-center py-16 text-gray-400">Loading...</div>;
  }

  if (error && !submitting) {
    return <div className="text-center py-16 text-gray-400">{error}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-w-4xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
      <div className="flex items-center gap-3 mb-2">
        <button type="button" onClick={() => router.back()} className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50">
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Edit Sale</h1>
          <p className="text-sm text-gray-500">Updating record for {form.customerName}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl border border-red-200 flex items-start gap-2.5 sm:gap-3">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <X size={12} className="text-red-600" />
          </div>
          <span>{error}</span>
        </div>
      )}

      <div className={sectionClass}>
        <SectionHeader icon={User} title="Sale Date" />
        <div className={sectionBodyClass}>
          <div>
            <label className={labelClass}>Sale Date</label>
            <input type="date" value={form.saleDate} onChange={(e) => set("saleDate", e.target.value)} className={inputClass} />
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <SectionHeader icon={Building2} title="Sale Details" />
        <div className={sectionBodyClass}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
            <div>
              <label className={labelClass}>Portal <span className="text-red-400">*</span></label>
              <select value={form.portal} onChange={(e) => set("portal", e.target.value)} required className={selectClass}>
                <option value="">Select portal</option>
                {PORTALS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Provider <span className="text-red-400">*</span></label>
              <select value={form.provider} onChange={(e) => set("provider", e.target.value)} required className={selectClass}>
                <option value="">Select provider</option>
                {PROVIDERS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
            <div>
              <label className={labelClass}>Customer Name <span className="text-red-400">*</span></label>
              <input type="text" value={form.customerName} onChange={(e) => set("customerName", e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Customer Phone <span className="text-red-400">*</span></label>
              <input type="tel" value={form.customerPhone} onChange={(e) => set("customerPhone", e.target.value)} required className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Customer Address <span className="text-red-400">*</span></label>
            <input type="text" value={form.customerAddress} onChange={(e) => set("customerAddress", e.target.value)} required className={inputClass} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-5">
            <div>
              <label className={labelClass}>City <span className="text-red-400">*</span></label>
              <input type="text" value={form.city} onChange={(e) => set("city", e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>State <span className="text-red-400">*</span></label>
              <select value={form.state} onChange={(e) => set("state", e.target.value)} required className={selectClass}>
                <option value="">Select</option>
                {US_STATES.map((st) => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Zip Code <span className="text-red-400">*</span></label>
              <input type="text" value={form.zipCode} onChange={(e) => set("zipCode", e.target.value)} required className={inputClass} />
            </div>
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <SectionHeader icon={ShoppingCart} title="Services Sold" />
        <div className="px-4 sm:px-5 py-4 sm:py-5">
          <div className="space-y-3">
            {services.map((svc) => {
              const checked = form[svc.key];
              return (
                <div key={svc.key} className={`rounded-xl border-2 p-3 transition-all ${checked ? "border-red-300 bg-red-50/30" : "border-gray-100 bg-white"}`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => { set(svc.key, e.target.checked); if (!e.target.checked) set(svc.qtyKey, 0); else if (form[svc.qtyKey] === 0) set(svc.qtyKey, 1); }}
                      className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-400"
                    />
                    <span className="text-lg">{svc.icon}</span>
                    <span className={`text-sm font-semibold ${checked ? "text-red-700" : "text-gray-700"}`}>{svc.label}</span>
                  </label>
                  {checked && (
                    <div className="mt-2.5 sm:mt-3 pl-7 sm:pl-9">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <label className="text-[11px] sm:text-xs text-gray-500 font-medium">Qty:</label>
                        <input
                          type="number"
                          min={1}
                          value={form[svc.qtyKey]}
                          onChange={(e) => set(svc.qtyKey, Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-16 sm:w-20 h-8 sm:h-9 px-2 sm:px-2.5 border border-gray-200 rounded-lg text-base sm:text-sm text-gray-900 bg-white focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <SectionHeader icon={Lock} title="Payment Status" />
        <div className={sectionBodyClass}>
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Current Status</p>
                <p className="text-lg font-bold text-gray-800 mt-0.5">{form.paymentStatus}</p>
              </div>
              <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
                <Lock size={14} />
                <span className="text-[11px] font-semibold uppercase">Locked</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Payment status cannot be changed by agents. Contact your admin for changes.</p>
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <SectionHeader icon={MessageSquare} title="Comments" />
        <div className={sectionBodyClass}>
          <textarea value={form.comments} onChange={(e) => set("comments", e.target.value)} rows={3}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-base sm:text-sm text-gray-900 placeholder-gray-400 bg-white transition-all duration-200 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 focus:shadow-sm hover:border-gray-300 resize-none"
            placeholder="Additional notes..."
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
        <button type="button" onClick={() => router.back()}
          className="w-full sm:w-1/3 h-12 rounded-2xl border-2 border-gray-200 text-sm sm:text-base font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-[0.98]">
          Cancel
        </button>
        <button type="submit" disabled={submitting}
          className="w-full sm:flex-1 h-12 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-sm sm:text-base font-bold shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300 hover:from-red-700 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2">
          {submitting ? (
            <><Loader2 size={18} className="animate-spin" /> Saving...</>
          ) : (
            <><Save size={18} /> Save Changes</>
          )}
        </button>
      </div>
    </form>
  );
}
