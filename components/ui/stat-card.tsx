import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  sub?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  iconColor = "text-red-600",
  iconBg = "bg-red-50",
  sub,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm",
        iconBg
      )}>
        <Icon className={cn("w-5 h-5", iconColor)} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-3xl font-extrabold text-gray-900 mt-1 leading-none">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1.5">{sub}</p>}
      </div>
    </div>
  );
}
