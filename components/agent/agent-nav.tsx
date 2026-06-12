"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Clock, History, User, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/agent/dashboard",  label: "Home",       icon: LayoutDashboard },
  { href: "/agent/attendance", label: "Attendance",  icon: Clock },
  { href: "/agent/sales",      label: "Sales",       icon: ShoppingCart },
  { href: "/agent/history",    label: "History",     icon: History },
  { href: "/agent/settings",   label: "Settings",    icon: User },
];

export function AgentNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
      <div className="flex h-16">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center gap-1 transition-colors"
            >
              <div className={cn(
                "w-10 h-6 flex items-center justify-center rounded-full transition-all",
                active ? "bg-red-50" : ""
              )}>
                <Icon
                  size={20}
                  className={cn(
                    "transition-colors",
                    active ? "text-red-600" : "text-gray-400"
                  )}
                />
              </div>
              <span className={cn(
                "text-[10px] font-semibold transition-colors",
                active ? "text-red-600" : "text-gray-400"
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
