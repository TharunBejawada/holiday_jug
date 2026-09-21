"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiHeart,
  FiCalendar,
  FiSearch,
  FiUser,
  FiCompass,
  FiTag,
  FiArrowRight,
  FiClock,
  FiMapPin,
} from "react-icons/fi";

type RecentSearch = {
  id: string;
  destination: string | null;
  nights: number | null;
  createdAt: string;
};

type Props = {
  name: string | null;
  email: string;
  memberSince: string;
  savedCount: number;
  bookingCount: number;
  recentSearches: RecentSearch[];
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

function firstName(name: string | null, email: string) {
  if (name) return name.split(" ")[0];
  return email.split("@")[0];
}

export function DashboardView({
  name,
  email,
  memberSince,
  savedCount,
  bookingCount,
  recentSearches,
}: Props) {
  const memberSinceLabel = new Date(memberSince).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const stats = [
    { label: "Saved holidays", value: savedCount, icon: FiHeart, href: "/dashboard/saved" },
    { label: "Bookings", value: bookingCount, icon: FiCalendar, href: "/dashboard/bookings" },
    { label: "Searches run", value: recentSearches.length, icon: FiSearch, href: "/dashboard" },
  ];

  const quickActions = [
    { label: "Find a holiday", description: "Search destinations & deals", icon: FiCompass, href: "/" },
    { label: "Saved holidays", description: "Your wishlist", icon: FiHeart, href: "/dashboard/saved" },
    { label: "Today's deals", description: "Limited-time offers", icon: FiTag, href: "/deals/last-minute" },
    { label: "Edit profile", description: "Contact & preferences", icon: FiUser, href: "/profile" },
  ];

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/Homepage_Banner.png"
            alt=""
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900/90 via-brand-800/75 to-brand-700/40" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20"
        >
          <p className="text-sun-300 font-semibold text-sm tracking-wide uppercase">
            Welcome back
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-2">
            Hi {firstName(name, email)}, ready for your next escape?
          </h1>
          <p className="text-white/70 mt-2 text-sm">Member since {memberSinceLabel}</p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 pb-16">
        {/* Stat cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {stats.map((s) => (
            <motion.div key={s.label} variants={item}>
              <Link
                href={s.href}
                className="group flex items-center justify-between bg-white rounded-2xl border border-gray-100 p-5 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div>
                  <p className="text-sm font-medium text-gray-500">{s.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{s.value}</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  <s.icon className="text-lg" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-10"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((a) => (
              <motion.div key={a.label} whileHover={{ y: -3 }}>
                <Link
                  href={a.href}
                  className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-xl bg-sun-400/15 text-sun-500 flex items-center justify-center mb-3">
                    <a.icon className="text-lg" />
                  </div>
                  <p className="font-semibold text-gray-900">{a.label}</p>
                  <p className="text-sm text-gray-500 mt-0.5 flex-1">{a.description}</p>
                  <span className="flex items-center gap-1 text-sm font-semibold text-brand-600 mt-3">
                    Go <FiArrowRight className="text-xs" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent searches */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-10"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent searches</h2>
          {recentSearches.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center">
              <FiSearch className="text-3xl text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">
                No searches yet — start exploring and we&apos;ll remember where you looked.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 shadow-sm overflow-hidden">
              {recentSearches.map((s) => (
                <div key={s.id} className="flex items-center gap-3 px-5 py-3.5">
                  <FiMapPin className="text-brand-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {s.destination ?? "Anywhere"}
                      {s.nights ? ` · ${s.nights} nights` : ""}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                    <FiClock />
                    {new Date(s.createdAt).toLocaleDateString("en-GB")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
