"use client";

import { FaPhoneAlt, FaLock, FaFire } from "react-icons/fa";

interface BannerProps {
  variant?: "top-bar" | "inline";
}

export function CallForHiddenPricesBanner({ variant = "inline" }: BannerProps) {
  if (variant === "top-bar") {
    return (
      <div className="bg-[#1D1248] text-white py-2 px-4 text-xs sm:text-sm font-medium border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F7941D] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F7941D]"></span>
            </span>
            <span className="font-semibold text-[#F7941D] flex items-center gap-1.5">
              <FaLock className="text-xs" /> Call for hidden prices
            </span>
          </div>
          <a
            href="tel:03301658879"
            className="flex items-center gap-2 bg-[#F7941D] hover:bg-[#e08314] text-white font-bold px-3 py-1 rounded-full text-xs transition-colors shrink-0 shadow-sm"
          >
            <FaPhoneAlt className="text-[10px]" />
            <span>0330 165 8879</span>
          </a>
        </div>
      </div>
    );
  }

  // Inline Banner (for homepage, destination pages, search results, hotel pages)
  return (
    <div className="my-6 relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#071746] via-[#1D1248] to-[#2B1B6D] p-5 sm:p-7 text-white shadow-xl border border-amber-500/30">
      {/* Decorative background glow */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#F7941D]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#F7941D]/20 border border-[#F7941D]/40 px-3 py-1 text-xs font-bold text-[#F7941D] mb-2.5">
            <FaFire className="text-xs" /> EXCLUSIVE SECRET FARES
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Call for Hidden Prices &amp; Bespoke Packages
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-gray-200 leading-relaxed font-normal">
            Airlines and luxury resorts give us confidential offline rates that cannot be published on the web.
            Quote our team for instant additional savings!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <a
            href="tel:03301658879"
            className="flex items-center gap-2.5 rounded-xl bg-[#F7941D] hover:bg-[#e08314] active:scale-95 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-amber-500/25 transition-all"
          >
            <FaPhoneAlt className="text-sm" />
            <span>Call 0330 165 8879</span>
          </a>
          <span className="text-[11px] text-gray-300 font-medium">UK Freephone • Open Daily</span>
        </div>
      </div>
    </div>
  );
}
