"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PORTALS, PROVIDERS, US_STATES, ACTIVATION_STATUSES, PAYMENT_STATUSES } from "@/lib/sales-constants";
import { Building2, Wifi, CreditCard, MessageSquare, CalendarDays, X, Check, Loader2, Save, ArrowLeft, Lock } from "lucide-react";

const sectionClass = "bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-200/50 overflow-hidden";
const sectionHeaderClass = "px-5 py-4 border-b border-gray-50 bg-gradient-to-r from-gray-50/80 to-white flex items-center gap-2.5";
const sectionBodyClass = "px-4 sm:px-5 py-4 sm:py-5 space-y-4 sm:space-y-5";
const inputClass = "w-full h-11 px-3.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 bg-white transition-all duration-200 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 focus:shadow-sm hover:border-gray-300";
const selectClass = "w-full h-11 px-3.5 border border-gray-200 rounded-xl text-sm text-gray-900 bg-white transition-all duration-200 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 focus:shadow-sm hover:border-gray-300 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_14px_center] bg-no-repeat pr-10";
const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";
const fieldGroupClass = "grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5";

function SectionHeader({ icon: Icon, title, badge }: { icon: React.ElementType; title: string; badge?: string }) {
  return (
    <div className={sectionHeaderClass}>
      <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
        <Icon size={14} className="text-red-500" />
      </div>
      <span className="text-sm font-bold text-gray-800">{title}</span>
      {badge && (
        <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
          <Lock size={10} /> {badge}
        </span>
      )}
    </div>
  );
}

export default function EditSalePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState<string>("");

  const [form, setForm] = useState({
    saleDate: "",
    agentName: "",
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
    comments: "",
    activationStatus: "Pending",
    paymentStatus: "Unpaid",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/session").then((r) => r.json()),
      fetch("/api/sales").then((r) => r.json()),
    ]).then(([session, data]) => {
      setUserRole(session?.user?.role || "");
      const sale = (data as Record<string, unknown>[]).find((s) => s.id === id) as Record<string, string | boolean> | undefined;
      if (!sale) { setError("Sale not found"); setLoading(false); return; }
      const d = new Date(sale.createdAt as string);
      const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      setForm({
        saleDate: local,
        agentName: sale.agentName as string,
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
        comments: (sale.comments as string) || "",
        activationStatus: sale.activationStatus as string,
        paymentStatus: sale.paymentStatus as string,
      });
      setLoading(false);
    }).catch(() => { setError("Failed to load sale"); setLoading(false); });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const isSuperAdmin = userRole === "SUPER_ADMIN";

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
        comments: form.comments,
        ...(isSuperAdmin ? { activationStatus: form.activationStatus, paymentStatus: form.paymentStatus } : {}),
        saleDate: form.saleDate ? `${form.saleDate}T00:00:00.000Z` : undefined,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setError(err.error || "Failed to update");
      setSubmitting(false);
      return;
    }

    router.push("/admin/sales");
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

  const isSuperAdmin = userRole === "SUPER_ADMIN";

  const services = [
    { key: "hasMobile", label: "Mobile", icon: "📱" },
    { key: "hasInternet", label: "Internet", icon: "🌐" },
    { key: "hasTv", label: "TV", icon: "📺" },
    { key: "hasPhone", label: "Phone", icon: "📞" },
    { key: "hasHomeSecurity", label: "Security", icon: "🛡️" },
  ] as const;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
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
        <SectionHeader icon={CalendarDays} title="Sale Date & Agent" />
        <div className={sectionBodyClass}>
          <div className={fieldGroupClass}>
            <div>
              <label className={labelClass}>Sale Date</label>
              <input type="date" value={form.saleDate} onChange={(e) => set("saleDate", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Agent</label>
              <input type="text" value={form.agentName} disabled className={`${inputClass} bg-gray-50 text-gray-500`} />
            </div>
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <SectionHeader icon={Building2} title="Sale Details" />
        <div className={sectionBodyClass}>
          <div className={fieldGroupClass}>
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
          <div className={fieldGroupClass}>
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
        <SectionHeader icon={Wifi} title="Services Sold" />
        <div className="px-4 sm:px-5 py-4 sm:py-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {services.map((svc) => (
              <label key={svc.key} className="relative flex flex-col items-center gap-1 p-2.5 sm:p-3 rounded-xl border-2 border-gray-100 bg-white cursor-pointer transition-all duration-200 has-[:checked]:border-red-300 has-[:checked]:bg-red-50/30 hover:border-gray-200 active:scale-[0.98]">
                <input type="checkbox" checked={form[svc.key]} onChange={(e) => set(svc.key, e.target.checked)} className="peer sr-only" />
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-xs sm:text-sm flex-shrink-0 peer-checked:bg-red-50 peer-checked:border-red-200 transition-all duration-200">
                  <span>{svc.icon}</span>
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-gray-700 peer-checked:text-red-700 transition-colors duration-200 text-center leading-tight">{svc.label}</span>
                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-2 border-gray-300 flex items-center justify-center flex-shrink-0 peer-checked:bg-red-500 peer-checked:border-red-500 transition-all duration-200">
                  <Check size={8} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" />
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <SectionHeader
          icon={CreditCard}
          title="Payment & Activation"
          badge={isSuperAdmin ? undefined : "Super admin only"}
        />
        <div className={sectionBodyClass}>
          <div className={fieldGroupClass}>
            <div>
              <label className={labelClass}>Activation</label>
              <select
                value={form.activationStatus}
                onChange={(e) => set("activationStatus", e.target.value)}
                disabled={!isSuperAdmin}
                className={`${selectClass} ${!isSuperAdmin ? "opacity-60 cursor-not-allowed bg-gray-50" : ""}`}
              >
                {ACTIVATION_STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
              </select>
              {!isSuperAdmin && (
                <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1">
                  <Lock size={10} /> Only super admin can change this
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>Payment</label>
              <select
                value={form.paymentStatus}
                onChange={(e) => set("paymentStatus", e.target.value)}
                disabled={!isSuperAdmin}
                className={`${selectClass} ${!isSuperAdmin ? "opacity-60 cursor-not-allowed bg-gray-50" : ""}`}
              >
                {PAYMENT_STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
              </select>
              {!isSuperAdmin && (
                <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1">
                  <Lock size={10} /> Only super admin can change this
                </p>
              )}
            </div>
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
            <><Loader2 size={18} className="animate-spin" /> Updating...</>
          ) : (
            <><Save size={18} /> Update Sale</>
          )}
        </button>
      </div>
    </form>
  );
}
