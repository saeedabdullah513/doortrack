"use client";
import { signOut } from "next-auth/react";
import { LogOut, Bell } from "lucide-react";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/admin/dashboard":  "Dashboard",
  "/admin/attendance": "Attendance",
  "/admin/agents":     "Agents",
  "/admin/reports":    "Reports",
  "/admin/monthly":    "Monthly Summary",
  "/admin/map":        "Live Map",
  "/admin/settings":   "Settings",
};

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export function AdminTopbar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const title = Object.entries(pageTitles).find(([k]) => pathname.startsWith(k))?.[1] ?? "Admin";

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      {/* Page title */}
      <div>
        <h1 className="text-lg font-bold text-gray-900 leading-none">{title}</h1>
        <p className="text-xs text-gray-400 mt-0.5">DoorTrack Admin Panel</p>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Bell (placeholder) */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors text-gray-400">
          <Bell className="w-4.5 h-4.5" size={18} />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* User badge */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-sm shadow-red-100 flex-shrink-0">
            <span className="text-white text-xs font-bold">{getInitials(userName)}</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 leading-none">{userName}</p>
            <p className="text-xs text-gray-400 mt-0.5">Administrator</p>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="ml-1 flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors px-3 py-2 rounded-xl"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}
