"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronDown, FiUser, FiLogOut, FiShield } from "react-icons/fi";

function initialsFor(name?: string | null, email?: string | null) {
  if (name) {
    const parts = name.trim().split(/\s+/);
    return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
  }
  return email?.[0]?.toUpperCase() ?? "A";
}

export function AdminTopbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const name = session?.user?.name ?? null;
  const email = session?.user?.email ?? "";
  const role = (session?.user as { role?: string } | undefined)?.role ?? "ADMIN";

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-gray-100 bg-white/80 backdrop-blur">
      <h1 className="text-lg font-bold text-gray-900">Admin</h1>

      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2.5 rounded-full pl-2 pr-3 py-1.5 hover:bg-gray-50 transition-colors"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-600 text-white text-xs font-bold">
            {initialsFor(name, email)}
          </span>
          <span className="hidden sm:block text-sm font-semibold text-gray-800">
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
              className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-3.5 border-b border-gray-100">
                <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-1">
                  <FiShield /> {role}
                </div>
                <p className="text-sm font-semibold text-gray-900 truncate">{name ?? "Admin"}</p>
                <p className="text-xs text-gray-500 truncate">{email}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FiUser /> View profile
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <FiLogOut /> Sign out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
