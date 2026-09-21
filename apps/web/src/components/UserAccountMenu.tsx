"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronDown, FiUser, FiHeart, FiCalendar, FiLogOut } from "react-icons/fi";
import { FaUser } from "react-icons/fa";

function initialsFor(name?: string | null, email?: string | null) {
  if (name) {
    const parts = name.trim().split(/\s+/);
    return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
  }
  return email?.[0]?.toUpperCase() ?? "U";
}

export function UserAccountMenu({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (status !== "authenticated") {
    if (variant === "mobile") {
      return (
        <Link
          href="/login"
          className="flex items-center justify-center gap-2 rounded-xl border border-[#1D1248]/15 px-4 py-2.5 text-center text-sm font-semibold text-[#1D1248]"
        >
          <FaUser className="text-xs" /> Sign in
        </Link>
      );
    }
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 rounded-full border border-[#1D1248]/15 px-4 py-2 text-sm font-semibold text-[#1D1248] hover:border-[#F7941D] hover:text-[#F7941D] transition-colors"
      >
        <FaUser className="text-xs" /> Sign in
      </Link>
    );
  }

  const name = session?.user?.name ?? null;
  const email = session?.user?.email ?? "";

  if (variant === "mobile") {
    return (
      <div className="space-y-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 rounded-xl bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-bold">
            {initialsFor(name, email)}
          </span>
          My dashboard
        </Link>
        <Link href="/profile" className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700">
          <FiUser /> Profile
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2.5 px-4 py-2 text-sm text-red-600"
        >
          <FiLogOut /> Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 rounded-full pl-2 pr-3 py-1.5 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-600 text-white text-xs font-bold">
          {initialsFor(name, email)}
        </span>
        <span className="text-sm font-semibold text-[#1D1248] max-w-[120px] truncate">
          {name ?? email}
        </span>
        <FiChevronDown className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-60 rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden z-50"
          >
            <div className="px-4 py-3.5 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900 truncate">{name ?? "Holiday Jug member"}</p>
              <p className="text-xs text-gray-500 truncate">{email}</p>
            </div>
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FiUser /> Dashboard
            </Link>
            <Link
              href="/dashboard/saved"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FiHeart /> Saved holidays
            </Link>
            <Link
              href="/dashboard/bookings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FiCalendar /> Bookings
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
            >
              <FiLogOut /> Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
