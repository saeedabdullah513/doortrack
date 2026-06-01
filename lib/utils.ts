import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(date: Date | string | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function formatHours(hours: number | null): string {
  if (hours === null || hours === undefined) return "—";
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}

export function calcHours(start: Date, end: Date): number {
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
}

/**
 * Returns UTC midnight for the current LOCAL calendar date (or a given YYYY-MM-DD string).
 *
 * Prisma serialises DateTime → MySQL DATE using the UTC date component.
 * So we must always pass UTC midnight of the local calendar date —
 * never `new Date(y, m, d)` (local midnight) which Prisma would write
 * as the PREVIOUS calendar date in UTC+5 or later timezones.
 */
export function localMidnight(dateStr?: string): Date {
  if (dateStr) {
    return new Date(`${dateStr}T00:00:00.000Z`);
  }
  const n = new Date();
  const y = n.getFullYear();
  const m = String(n.getMonth() + 1).padStart(2, "0");
  const d = String(n.getDate()).padStart(2, "0");
  return new Date(`${y}-${m}-${d}T00:00:00.000Z`);
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    IN_PROGRESS: "Active",
    COMPLETED: "Completed",
    BELOW_TARGET: "Below Target",
    ABSENT: "Absent",
  };
  return map[status] ?? status;
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    IN_PROGRESS: "text-blue-600 bg-blue-50",
    COMPLETED: "text-green-600 bg-green-50",
    BELOW_TARGET: "text-amber-600 bg-amber-50",
    ABSENT: "text-red-600 bg-red-50",
  };
  return map[status] ?? "text-gray-600 bg-gray-50";
}
