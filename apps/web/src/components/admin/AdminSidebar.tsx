"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiGrid,
  FiPackage,
  FiCalendar,
  FiImage,
  FiUsers,
  FiSettings,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: FiGrid },
  { href: "/admin/packages", label: "Packages", icon: FiPackage },
  { href: "/admin/bookings", label: "Bookings", icon: FiCalendar },
  { href: "/admin/assets", label: "Assets", icon: FiImage },
  { href: "/admin/users", label: "Users", icon: FiUsers },
  { href: "/admin/settings", label: "Settings", icon: FiSettings },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 248 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="relative flex flex-col shrink-0 h-screen sticky top-0 bg-brand-900 text-white overflow-hidden"
    >
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10">
        <div className="relative w-8 h-8 shrink-0">
          <Image src="/assets/Holiday_Jug_Logo.png" alt="Holiday Jug" fill className="object-contain" />
        </div>
        {!collapsed && (
          <span className="font-bold text-sm tracking-wide whitespace-nowrap">Holiday Jug</span>
        )}
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="text-lg shrink-0" />
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              {active && (
                <motion.span
                  layoutId="admin-nav-active"
                  className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full bg-sun-400"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center gap-2 px-4 h-14 border-t border-white/10 text-white/60 hover:text-white transition-colors text-sm"
      >
        {collapsed ? <FiChevronsRight className="text-lg" /> : <FiChevronsLeft className="text-lg" />}
        {!collapsed && <span>Collapse</span>}
      </button>
    </motion.aside>
  );
}
