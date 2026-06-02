"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Clock, Users,
  BarChart2, Map, Settings, MapPin, CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/dashboard",  label: "Dashboard",       icon: LayoutDashboard },
  { href: "/admin/attendance", label: "Attendance",       icon: Clock },
  { href: "/admin/agents",     label: "Agents",           icon: Users },
  { href: "/admin/reports",    label: "Reports",          icon: BarChart2 },
  { href: "/admin/monthly",    label: "Monthly Summary",  icon: CalendarDays },
  { href: "/admin/map",        label: "Live Map",         icon: Map },
  { href: "/admin/settings",   label: "Settings",         icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 shadow-sm">

      {/* ── Logo ── */}
      <div className="px-5 py-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-md shadow-red-100 flex-shrink-0">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-extrabold text-gray-900 text-lg leading-none">DoorTrack</p>
            <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 py-5 px-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">
          Main Menu
        </p>
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                active
                  ? "bg-red-50 text-red-600 shadow-sm border border-red-100"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                active ? "bg-red-100" : "bg-gray-100 group-hover:bg-gray-200"
              )}>
                <Icon size={16} className={active ? "text-red-600" : "text-gray-500"} />
              </div>
              {label}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer ── */}
      <div className="px-4 py-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600">DoorTrack</p>
            <p className="text-[10px] text-gray-400">v1.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
