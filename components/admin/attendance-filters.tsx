"use client";
import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

interface Agent {
  id: string;
  name: string;
}

interface Props {
  agents: Agent[];
  selectedDate: string;
  selectedAgent: string;
  selectedStatus: string;
}

export function AttendanceFilters({
  agents,
  selectedDate,
  selectedAgent,
  selectedStatus,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams({
        date: selectedDate,
        agentId: selectedAgent,
        status: selectedStatus,
        [key]: value,
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, selectedDate, selectedAgent, selectedStatus]
  );

  return (
    <div className="flex flex-wrap gap-3 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => update("date", e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">Agent</label>
        <select
          value={selectedAgent}
          onChange={(e) => update("agentId", e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">All Agents</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">Status</label>
        <select
          value={selectedStatus}
          onChange={(e) => update("status", e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">All</option>
          <option value="IN_PROGRESS">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="BELOW_TARGET">Below Target</option>
        </select>
      </div>
    </div>
  );
}
