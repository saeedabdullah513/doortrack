import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CENTRAL_TIMEZONE = "America/Chicago";

function centralDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: CENTRAL_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).formatToParts(date);

  const year = parts.find((p) => p.type === "year")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const day = parts.find((p) => p.type === "day")?.value ?? "";
  return { year, month, day };
}

function formatCentral(date: Date | string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: CENTRAL_TIMEZONE,
    ...options,
  }).format(new Date(date));
}

export function formatTime(date: Date | string | null): string {
  if (!date) return "—";
  return formatCentral(date, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDate(date: Date | string): string {
  return formatCentral(date, {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function formatDateIso(date: Date | string): string {
  const parts = centralDateParts(new Date(date));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function formatDateMonthDay(date: Date | string): string {
  const parts = centralDateParts(new Date(date));
  return `${parts.month}${parts.day}`;
}

export function formatDateSlash(date: Date | string): string {
  const parts = centralDateParts(new Date(date));
  return `${parts.month}/${parts.day}/${parts.year}`;
}

export function formatDateMonth(date: Date | string): string {
  const parts = centralDateParts(new Date(date));
  return `${parts.year}-${parts.month}`;
}

export function formatDateMonthLabel(date: Date | string): string {
  return formatCentral(date, {
    month: "long",
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

/** Decimal hours: 8h 08m → 8.13 (US timecard standard) */
export function toDecimal(hours: number | null): string {
  if (hours === null || hours === undefined) return "";
  return hours.toFixed(2);
}

/**
 * Returns UTC midnight for the current US Central calendar date,
 * or for the given YYYY-MM-DD central date string.
 *
 * Prisma serialises DateTime → MySQL DATE using the UTC date component.
 * Passing a UTC midnight timestamp for the target Central calendar date
 * preserves the intended date when Prisma writes the DATE value.
 */
export function localMidnight(dateStr?: string): Date {
  if (dateStr) {
    return new Date(`${dateStr}T00:00:00.000Z`);
  }
  const parts = centralDateParts(new Date());
  return new Date(`${parts.year}-${parts.month}-${parts.day}T00:00:00.000Z`);
}

export function centralDaysAgo(days: number): Date {
  const date = localMidnight();
  date.setUTCDate(date.getUTCDate() - days);
  return date;
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
