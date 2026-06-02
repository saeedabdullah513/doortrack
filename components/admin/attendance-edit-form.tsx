"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Entry {
  id: string;
  sequence: number;
  punchInTime: string;
  punchOutTime: string | null;
  entryHours: number | null;
}

function toLocalInput(iso: string) {
  // Convert ISO to "YYYY-MM-DDTHH:MM" for datetime-local input
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function AttendanceEditForm({ dayId, entries: initial, notes: initNotes, editedByAdmin }: {
  dayId: string;
  entries: Entry[];
  notes: string;
  editedByAdmin: boolean;
}) {
  const router = useRouter();
  const [entries, setEntries] = useState(initial.map((e) => ({
    ...e,
    punchInTime:  toLocalInput(e.punchInTime),
    punchOutTime: e.punchOutTime ? toLocalInput(e.punchOutTime) : "",
  })));
  const [notes, setNotes]   = useState(initNotes);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  function setField(idx: number, field: "punchInTime" | "punchOutTime", val: string) {
    setEntries((prev) => prev.map((e, i) => i === idx ? { ...e, [field]: val } : e));
  }

  async function handleSave() {
    setError("");
    setLoading(true);
    const payload = {
      notes,
      entries: entries.map((e) => ({
        id:           e.id,
        punchInTime:  new Date(e.punchInTime).toISOString(),
        punchOutTime: e.punchOutTime ? new Date(e.punchOutTime).toISOString() : null,
      })),
    };
    const res = await fetch(`/api/attendance/${dayId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (!res.ok) { setError("Save failed. Please try again."); return; }
    router.push("/admin/attendance");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {editedByAdmin && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-xl text-sm text-amber-700">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          This record was previously edited by an admin.
        </div>
      )}

      {entries.map((e, i) => (
        <div key={e.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">
            Session {e.sequence}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Punch In</label>
              <input
                type="datetime-local"
                value={e.punchInTime}
                onChange={(ev) => setField(i, "punchInTime", ev.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Punch Out</label>
              <input
                type="datetime-local"
                value={e.punchOutTime ?? ""}
                onChange={(ev) => setField(i, "punchOutTime", ev.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Admin notes */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <label className="text-xs font-medium text-gray-600 block mb-1">Admin Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Reason for manual edit…"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
        />
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>}

      <div className="flex gap-3">
        <Button onClick={handleSave} loading={loading}>Save Changes</Button>
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>
    </div>
  );
}
