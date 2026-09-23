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
  FiMapPin,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: FiGrid },
  { href: "/admin/destinations", label: "Destinations", icon: FiMapPin },
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
      animate={{ width: collapsed ? 84 : 252 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="relative z-20 flex flex-col shrink-0 h-screen sticky top-0 bg-brand-900 text-white overflow-visible"
    >
      <div className="overflow-hidden h-full flex flex-col">
        <div className="flex items-center justify-center px-3 h-24 border-b border-white/10">
          <Link href="/admin" className="relative block">
            <motion.div
              animate={{ width: collapsed ? 48 : 156 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              style={{ aspectRatio: "750 / 334" }}
              className="relative"
            >
              <Image
                src="/assets/Holiday_Jug_Logo.png"
                alt="Holiday Jug"
                fill
                priority
                className="object-contain"
              />
            </motion.div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
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
      </div>

      {/* Circular collapse toggle floating on the sidebar's edge, so it
          slides along with the width animation above rather than jumping.
          Solid brand fill + white ring keeps it visible whether it's
          sitting over the dark sidebar or the light content area. */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute top-9 -right-4 w-8 h-8 rounded-full bg-brand-600 text-white shadow-lg ring-2 ring-white flex items-center justify-center hover:bg-sun-400 transition-colors z-30"
      >
        {collapsed ? <FiChevronRight className="text-sm" /> : <FiChevronLeft className="text-sm" />}
      </button>
    </motion.aside>
  );
}
