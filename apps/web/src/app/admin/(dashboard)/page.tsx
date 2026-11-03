"use client";

import Link from "next/link";
import {
  FiHome,
  FiPackage,
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiSettings,
  FiArrowRight,
  FiHeadphones,
  FiImage,
  FiDatabase,
  FiMail,
} from "react-icons/fi";

const QUICK_MODULES = [
  {
    href: "/admin/inquiries",
    label: "Customer Inquiries",
    description: "Review and respond to messages submitted through the website contact form.",
    icon: FiMail,
    color: "text-rose-600 bg-rose-50 border-rose-100",
  },
  {
    href: "/admin/master-data",
    label: "Master Data Catalog",
    description: "Browse 254 countries & 81,790 supplier cities master records.",
    icon: FiDatabase,
    color: "text-amber-600 bg-amber-50 border-amber-100",
  },
  {
    href: "/admin/hotels",
    label: "Hotels & Inventory",
    description: "Manage hotel inventory, board types, rates, and search availability.",
    icon: FiHome,
    color: "text-blue-600 bg-blue-50 border-blue-100",
  },
  {
    href: "/admin/packages",
    label: "Packages",
    description: "Create, publish, and manage holiday packages and itineraries.",
    icon: FiPackage,
    color: "text-purple-600 bg-purple-50 border-purple-100",
  },
  {
    href: "/admin/destinations",
    label: "Destinations",
    description: "Configure countries, cities, tourist spots, and travel guides.",
    icon: FiMapPin,
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  {
    href: "/admin/bookings",
    label: "Quotes & Bookings",
    description: "View customer quotes, bookings, and customer phone enquiries.",
    icon: FiCalendar,
    color: "text-amber-600 bg-amber-50 border-amber-100",
  },
  {
    href: "/admin/agent",
    label: "Agent Tool",
    description: "Search ID lookup, custom pricing calculations, and quote builder.",
    icon: FiHeadphones,
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
  },
  {
    href: "/admin/users",
    label: "Users & Staff",
    description: "Manage staff accounts, admin access, roles, and permissions.",
    icon: FiUsers,
    color: "text-sky-600 bg-sky-50 border-sky-100",
  },
  {
    href: "/admin/assets",
    label: "Media & Assets",
    description: "Upload and organize hotel banners, destination photography, and assets.",
    icon: FiImage,
    color: "text-teal-600 bg-teal-50 border-teal-100",
  },
  {
    href: "/admin/settings",
    label: "System Settings",
    description: "System parameters, currency exchange rates, markup formulas, and configuration.",
    icon: FiSettings,
    color: "text-slate-600 bg-slate-50 border-slate-100",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-xs">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1.5">
          Welcome to the Holiday Jug management portal. Select a module below to get started.
        </p>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {QUICK_MODULES.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link
              key={mod.href}
              href={mod.href}
              className="group bg-white rounded-2xl border border-gray-200/80 hover:border-brand-500/40 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${mod.color}`}>
                    <Icon className="text-xl" />
                  </div>
                  <span className="text-gray-300 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all">
                    <FiArrowRight className="text-base" />
                  </span>
                </div>
                <h3 className="font-bold text-base text-gray-900 group-hover:text-brand-900 transition mt-4">
                  {mod.label}
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {mod.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
