"use client";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

interface Props {
  monthLabel: string;
  prevMonth: string;   // "2026-05"
  nextMonth: string;   // "2026-07"
  isCurrentMonth: boolean;
}

export function MonthNav({ monthLabel, prevMonth, nextMonth, isCurrentMonth }: Props) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-3">
      <button
        onClick={() => router.push(`/admin/monthly?month=${prevMonth}`)}
        className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2 flex-1 justify-center">
        <CalendarDays className="w-4 h-4 text-red-500" />
        <span className="text-base font-bold text-gray-900">{monthLabel}</span>
        {isCurrentMonth && (
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full ml-1">
            Current Month
          </span>
        )}
      </div>

      <button
        onClick={() => router.push(`/admin/monthly?month=${nextMonth}`)}
        disabled={isCurrentMonth}
        className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
