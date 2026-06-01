"use client";
import { useRouter } from "next/navigation";
import { PunchPanel } from "@/components/agent/punch-panel";
import { MapPin, LogOut, Clock, TrendingUp } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

interface EntryRow {
  id: string;
  sequence: number;
  inTime: string;
  inAddress: string;
  outTime: string | null;
  outAddress: string | null;
  hours: string | null;
  isOpen: boolean;
}

interface Props {
  userName: string;
  today: string;
  totalHours: string | null;
  targetHours: number;
  progressPct: number;
  hasOpenEntry: boolean;
  isPunchedOutForDay: boolean;
  entries: EntryRow[];
}

export function AgentDashboardClient({
  userName,
  today,
  totalHours,
  targetHours,
  progressPct,
  hasOpenEntry,
  isPunchedOutForDay,
  entries,
}: Props) {
  const router = useRouter();

  async function handleAction(
    type: "PUNCH_IN" | "PUNCH_OUT",
    coords: GeolocationCoordinates
  ) {
    const res = await fetch("/api/attendance/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
      }),
    });
    if (!res.ok) {
      let errorMsg = "Failed to record action. Please try again.";
      try {
        const text = await res.text();
        if (text) {
          const data = JSON.parse(text);
          if (data.error) errorMsg = data.error;
        }
      } catch { /* ignore */ }
      throw new Error(errorMsg);
    }
    router.refresh();
  }

  const statusColor =
    progressPct >= 100 ? "bg-emerald-500" : progressPct >= 50 ? "bg-amber-400" : "bg-red-400";

  return (
    <div className="min-h-screen bg-[#f5f6fa]">

      {/* ── Header ── */}
      <div className="relative bg-gradient-to-br from-red-600 to-rose-700 safe-top overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10" />
        <div className="absolute -bottom-14 -left-8 w-36 h-36 rounded-full bg-white/10" />

        <div className="relative px-5 pt-12 pb-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-red-200 text-sm font-medium">Good day 👋</p>
              <h1 className="text-2xl font-extrabold text-white mt-1 tracking-tight">
                {userName}
              </h1>
              <p className="text-red-200 text-sm mt-1">{today}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="mt-1 flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-medium px-3 py-2 rounded-xl transition-colors border border-white/20"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>

          {/* Hours summary chips */}
          <div className="flex gap-3 mt-5">
            <div className="flex-1 bg-white/15 backdrop-blur rounded-xl px-4 py-3 border border-white/20">
              <p className="text-red-100 text-xs mb-0.5">Today</p>
              <p className="text-white font-bold text-lg leading-none">
                {totalHours ?? "0h 00m"}
              </p>
            </div>
            <div className="flex-1 bg-white/15 backdrop-blur rounded-xl px-4 py-3 border border-white/20">
              <p className="text-red-100 text-xs mb-0.5">Target</p>
              <p className="text-white font-bold text-lg leading-none">{targetHours}h 00m</p>
            </div>
            <div className="flex-1 bg-white/15 backdrop-blur rounded-xl px-4 py-3 border border-white/20">
              <p className="text-red-100 text-xs mb-0.5">Sessions</p>
              <p className="text-white font-bold text-lg leading-none">{entries.length}</p>
            </div>
          </div>
        </div>

        {/* Progress bar pinned to bottom of header */}
        <div className="px-5 pb-5">
          <div className="flex justify-between text-xs text-red-100 mb-1.5">
            <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Progress</span>
            <span>{Math.round(progressPct)}%</span>
          </div>
          <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-700", statusColor)}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-4 py-5 space-y-4 pb-28">

        {/* Punch buttons */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Record Attendance
          </h2>
          <PunchPanel
            hasOpenEntry={hasOpenEntry}
            isPunchedOutForDay={isPunchedOutForDay}
            onAction={handleAction}
          />
        </div>

        {/* Today's sessions */}
        {entries.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-500" />
                <h2 className="font-semibold text-gray-800">Today&apos;s Sessions</h2>
              </div>
              <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border">
                {entries.length} session{entries.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="divide-y divide-gray-50">
              {entries.map((e) => (
                <div key={e.id} className="p-4">
                  {/* Session label row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{e.sequence}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">Session {e.sequence}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {e.hours && (
                        <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                          {e.hours}
                        </span>
                      )}
                      {e.isOpen && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Active
                        </span>
                      )}
                    </div>
                  </div>

                  {/* IN / OUT cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5">
                      <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-1.5">
                        Punch In
                      </p>
                      <p className="text-base font-extrabold text-gray-900">{e.inTime}</p>
                      <p className="text-xs text-gray-500 mt-1.5 flex items-start gap-1">
                        <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5 text-emerald-500" />
                        <span className="line-clamp-2">{e.inAddress}</span>
                      </p>
                    </div>
                    <div className={cn(
                      "rounded-xl p-3.5 border",
                      e.outTime
                        ? "bg-red-50 border-red-100"
                        : "bg-gray-50 border-dashed border-gray-200"
                    )}>
                      <p className={cn(
                        "text-xs font-bold uppercase tracking-wide mb-1.5",
                        e.outTime ? "text-red-500" : "text-gray-300"
                      )}>
                        Punch Out
                      </p>
                      {e.outTime ? (
                        <>
                          <p className="text-base font-extrabold text-gray-900">{e.outTime}</p>
                          <p className="text-xs text-gray-500 mt-1.5 flex items-start gap-1">
                            <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5 text-red-400" />
                            <span className="line-clamp-2">{e.outAddress}</span>
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-300 mt-1">Pending…</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
