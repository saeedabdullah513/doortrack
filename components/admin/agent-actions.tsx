"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { KeyRound, Power, Pencil, ChevronDown } from "lucide-react";

interface Props {
  agentId: string;
  agentName: string;
  isActive: boolean;
}

export function AgentActions({ agentId, agentName, isActive }: Props) {
  const router = useRouter();
  const [showReset, setShowReset] = useState(false);
  const [newPass, setNewPass]     = useState("");
  const [loading, setLoading]     = useState<string | null>(null);
  const [msg, setMsg]             = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function handleReset() {
    if (!newPass || newPass.length < 6) {
      setMsg({ type: "err", text: "Min 6 characters." });
      return;
    }
    setLoading("reset");
    const res = await fetch(`/api/agents/${agentId}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPass }),
    });
    setLoading(null);
    if (res.ok) {
      setMsg({ type: "ok", text: "Password updated." });
      setNewPass("");
      setShowReset(false);
    } else {
      setMsg({ type: "err", text: "Failed to reset." });
    }
    setTimeout(() => setMsg(null), 3000);
  }

  async function handleToggle() {
    setLoading("toggle");
    await fetch(`/api/agents/${agentId}/toggle`, { method: "POST" });
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {/* Edit */}
      <Link
        href={`/admin/agents/${agentId}`}
        className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 px-2.5 py-1.5 rounded-lg transition-colors"
      >
        <Pencil className="w-3 h-3" /> Edit
      </Link>

      {/* Reset Password */}
      <div className="relative">
        <button
          onClick={() => { setShowReset((v) => !v); setMsg(null); }}
          className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-amber-600 bg-gray-50 hover:bg-amber-50 border border-gray-200 hover:border-amber-200 px-2.5 py-1.5 rounded-lg transition-colors"
        >
          <KeyRound className="w-3 h-3" /> Reset Password <ChevronDown className="w-3 h-3" />
        </button>

        {showReset && (
          <div className="absolute right-0 top-9 z-20 bg-white border border-gray-200 rounded-xl shadow-lg p-3 w-56">
            <p className="text-xs font-semibold text-gray-700 mb-2">New password for {agentName}</p>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="Min 6 characters"
              className="w-full px-2.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 mb-2"
              onKeyDown={(e) => e.key === "Enter" && handleReset()}
            />
            {msg && (
              <p className={`text-xs mb-2 ${msg.type === "ok" ? "text-green-600" : "text-red-500"}`}>
                {msg.text}
              </p>
            )}
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                disabled={loading === "reset"}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium py-1.5 rounded-lg disabled:opacity-50"
              >
                {loading === "reset" ? "Saving…" : "Save"}
              </button>
              <button
                onClick={() => { setShowReset(false); setNewPass(""); }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium py-1.5 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enable / Disable */}
      <button
        onClick={handleToggle}
        disabled={loading === "toggle"}
        className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
          isActive
            ? "text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border-red-200"
            : "text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 border-green-200"
        }`}
      >
        <Power className="w-3 h-3" />
        {loading === "toggle" ? "…" : isActive ? "Disable" : "Enable"}
      </button>
    </div>
  );
}
