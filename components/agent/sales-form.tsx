"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PORTALS, PROVIDERS, US_STATES } from "@/lib/sales-constants";
import { User, Building2, Wifi, MessageSquare, X, Check, Loader2, Save } from "lucide-react";

interface SalesFormProps {
  agentName: string;
}

const sectionClass = "bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-200/50 overflow-hidden";
const sectionHeaderClass = "px-4 sm:px-5 py-3.5 sm:py-4 border-b border-gray-50 bg-gradient-to-r from-gray-50/80 to-white flex items-center gap-2.5";
const sectionBodyClass = "px-4 sm:px-5 py-4 sm:py-5 space-y-4 sm:space-y-5";

const inputClass = "w-full h-11 px-3.5 border border-gray-200 rounded-xl text-base sm:text-sm text-gray-900 placeholder-gray-400 bg-white transition-all duration-200 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 focus:shadow-sm hover:border-gray-300";
const selectClass = "w-full h-11 px-3.5 border border-gray-200 rounded-xl text-base sm:text-sm text-gray-900 bg-white transition-all duration-200 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 focus:shadow-sm hover:border-gray-300 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_14px_center] bg-no-repeat pr-10";
const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";
const fieldGroupClass = "grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5";

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

export function SalesForm({ agentName }: SalesFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const form = new FormData(e.currentTarget);

    const services = [
      "hasMobile", "hasInternet", "hasTv", "hasPhone", "hasHomeSecurity",
    ] as const;

    type Service = typeof services[number];
    const data: Record<string, unknown> = {};
    data.portal = form.get("portal") as string;
    data.provider = form.get("provider") as string;
    data.customerName = form.get("customerName") as string;
    data.customerPhone = form.get("customerPhone") as string;
    data.customerAddress = form.get("customerAddress") as string;
    data.city = form.get("city") as string;
    data.state = form.get("state") as string;
    data.zipCode = form.get("zipCode") as string;
    data.comments = form.get("comments") as string || "";

    for (const svc of services) {
      data[svc] = form.get(svc) === "on";
    }

    const res = await fetch("/api/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setError(err.error || "Failed to save sale");
      setSubmitting(false);
      return;
    }

    router.push("/agent/sales");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl border border-red-200 flex items-start gap-2.5 sm:gap-3">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <X size={12} className="text-red-600" />
          </div>
          <span>{error}</span>
        </div>
      )}

      {/* Agent Info */}
      <div className={sectionClass}>
        <SectionHeader icon={User} title="Agent Info" />
        <div className={sectionBodyClass}>
          <div className="flex items-center gap-3 sm:gap-4 bg-gradient-to-r from-red-50/60 to-amber-50/40 rounded-2xl p-3.5 sm:p-4 border border-red-100/50">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <User size={16} className="text-white sm:hidden" />
              <User size={20} className="text-white hidden sm:block" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Logged in as</p>
              <p className="text-sm font-bold text-gray-800">{agentName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sale Details */}
      <div className={sectionClass}>
        <SectionHeader icon={Building2} title="Sale Details" />
        <div className={sectionBodyClass}>
          <div className={fieldGroupClass}>
            <div>
              <label className={labelClass}>Portal <span className="text-red-400">*</span></label>
              <select name="portal" required className={selectClass}>
                <option value="">Select portal</option>
                {PORTALS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Provider <span className="text-red-400">*</span></label>
              <select name="provider" required className={selectClass}>
                <option value="">Select provider</option>
                {PROVIDERS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className={fieldGroupClass}>
            <div>
              <label className={labelClass}>Customer Name <span className="text-red-400">*</span></label>
              <input type="text" name="customerName" required className={inputClass} placeholder="Full name" />
            </div>
            <div>
              <label className={labelClass}>Customer Phone <span className="text-red-400">*</span></label>
              <input type="tel" name="customerPhone" required className={inputClass} placeholder="(XXX) XXX-XXXX" />
            </div>
          </div>

          <div>
            <label className={labelClass}>Customer Address <span className="text-red-400">*</span></label>
            <input type="text" name="customerAddress" required className={inputClass} placeholder="Street address" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-5">
            <div>
              <label className={labelClass}>City <span className="text-red-400">*</span></label>
              <input type="text" name="city" required className={inputClass} placeholder="City" />
            </div>
            <div>
              <label className={labelClass}>State <span className="text-red-400">*</span></label>
              <select name="state" required className={selectClass}>
                <option value="">Select</option>
                {US_STATES.map((st) => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Zip Code <span className="text-red-400">*</span></label>
              <input type="text" name="zipCode" required className={inputClass} placeholder="XXXXX" />
            </div>
          </div>
        </div>
      </div>

      {/* Services Sold */}
      <div className={sectionClass}>
        <SectionHeader icon={Wifi} title="Services Sold" />
        <div className="px-4 sm:px-5 py-4 sm:py-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {[
              { name: "hasMobile", label: "Mobile", icon: "📱" },
              { name: "hasInternet", label: "Internet", icon: "🌐" },
              { name: "hasTv", label: "TV", icon: "📺" },
              { name: "hasPhone", label: "Phone", icon: "📞" },
              { name: "hasHomeSecurity", label: "Security", icon: "🛡️" },
            ].map((svc) => (
              <label key={svc.name} className="relative flex flex-col items-center gap-1 p-2.5 sm:p-3 rounded-xl border-2 border-gray-100 bg-white cursor-pointer transition-all duration-200 has-[:checked]:border-red-300 has-[:checked]:bg-red-50/30 hover:border-gray-200 active:scale-[0.98]">
                <input type="checkbox" name={svc.name} className="peer sr-only" />
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

      {/* Comments */}
      <div className={sectionClass}>
        <SectionHeader icon={MessageSquare} title="Comments" />
        <div className={sectionBodyClass}>
          <textarea
            name="comments"
            rows={3}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-base sm:text-sm text-gray-900 placeholder-gray-400 bg-white transition-all duration-200 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 focus:shadow-sm hover:border-gray-300 resize-none"
            placeholder="Any additional notes about this sale..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-full sm:w-1/3 h-12 rounded-2xl border-2 border-gray-200 text-sm sm:text-base font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-[0.98]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:flex-1 h-12 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-sm sm:text-base font-bold shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300 hover:from-red-700 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save Sale
            </>
          )}
        </button>
      </div>
    </form>
  );
}
