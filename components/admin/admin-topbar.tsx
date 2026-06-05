"use client";
import { signOut } from "next-auth/react";
import { LogOut, Bell, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { adminLinks } from "@/components/admin/admin-sidebar";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const title = Object.entries(pageTitles).find(([k]) => pathname.startsWith(k))?.[1] ?? "Admin";

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Open navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-none">{title}</h1>
            <p className="text-xs text-gray-400 mt-0.5">DoorTrack Admin Panel</p>
          </div>
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

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            aria-hidden="true"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-10 h-full w-full max-w-xs bg-white shadow-2xl border-r border-gray-200 overflow-y-auto">
            <div className="px-4 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-sm shadow-red-100">
                  <span className="text-white text-lg font-bold">D</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">DoorTrack</p>
                  <p className="text-xs text-gray-500">Admin Menu</p>
                </div>
              </div>
              <button
                type="button"
                className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-3 space-y-1">
              {adminLinks.map(({ href, label, icon: Icon }) => {
                const active = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-medium transition-colors ${active ? "bg-red-50 text-red-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? "bg-red-100" : "bg-gray-100"}`}>
                      <Icon size={16} className={active ? "text-red-600" : "text-gray-500"} />
                    </div>
                    {label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
