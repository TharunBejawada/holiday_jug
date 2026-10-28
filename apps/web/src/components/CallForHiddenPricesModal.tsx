"use client";

import { useState, useEffect } from "react";
import { FaTimes, FaPhoneAlt, FaPercent, FaPlane, FaHeadset } from "react-icons/fa";

const STORAGE_KEY = "holidayjug_hidden_prices_popup_dismissed";

export function CallForHiddenPricesModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user already closed popup during this visit
    const dismissed = typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) : null;
    if (dismissed === "true") return;

    // Trigger 1: Time-delayed popup (6 seconds)
    const timer = setTimeout(() => {
      const alreadyDismissed = sessionStorage.getItem(STORAGE_KEY);
      if (alreadyDismissed !== "true") {
        setIsOpen(true);
      }
    }, 6000);

    // Trigger 2: Exit-intent on desktop (when cursor approaches top viewport)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10) {
        const alreadyDismissed = sessionStorage.getItem(STORAGE_KEY);
        if (alreadyDismissed !== "true") {
          setIsOpen(true);
        }
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Once closed, must not reappear for the rest of that visit (G2)
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, "true");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-300"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-[540px] max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-gray-100 p-6 sm:p-8 text-center text-[#1D1248] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON (G2: Easy to close) */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 z-20 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors cursor-pointer"
        >
          <FaTimes className="text-sm sm:text-base" />
        </button>

        {/* TOP DECORATIVE FLIGHT ICON & TRAIL */}
        <div className="relative mx-auto flex items-center justify-center mb-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 text-[#F7941D]">
            <FaPlane className="text-xl rotate-[-20deg]" />
          </div>
        </div>

        {/* HEADLINE (Matches Figma) */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1D1248] tracking-tight">
          Call For
        </h2>
        <div className="text-3xl sm:text-4xl font-black text-[#F7941D] tracking-tight mt-0.5 uppercase drop-shadow-xs">
          Hidden Prices
        </div>

        {/* SUBTITLE */}
        <p className="mt-2 text-sm sm:text-base text-gray-600 font-medium max-w-sm mx-auto leading-relaxed">
          Get exclusive deals and special fares that you won&apos;t find online!
        </p>

        {/* THREE VALUE PROPOSITION PILLS (Matches Figma) */}
        <div className="my-6 grid grid-cols-3 gap-2 sm:gap-3">
          {/* 1. Exclusive Deals */}
          <div className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-amber-50/70 border border-amber-100/80">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-[#F7941D] mb-1.5">
              <FaPercent className="text-sm sm:text-base" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#1D1248] leading-tight">
              Exclusive Deals
            </span>
          </div>

          {/* 2. Best Fares */}
          <div className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-blue-50/70 border border-blue-100/80">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-[#071746] mb-1.5">
              <FaPlane className="text-sm sm:text-base" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#1D1248] leading-tight">
              Best Fares
            </span>
          </div>

          {/* 3. Personalised Assistance */}
          <div className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-purple-50/70 border border-purple-100/80">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-[#2B1B6D] mb-1.5">
              <FaHeadset className="text-sm sm:text-base" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#1D1248] leading-tight">
              Personalised Support
            </span>
          </div>
        </div>

        {/* PROMINENT CALL US BUTTON (Matches Figma) */}
        <div className="mt-4">
          <a
            href="tel:03301658879"
            className="group flex flex-col items-center justify-center rounded-2xl bg-gradient-to-r from-[#F7941D] to-[#f47c0b] py-3.5 px-6 text-white shadow-xl shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-white/90 flex items-center gap-1.5">
              <FaPhoneAlt className="text-xs animate-bounce" /> Call Us Directly
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-0.5">
              0330 165 8879
            </span>
          </a>
        </div>

        <p className="mt-3 text-[11px] sm:text-xs text-gray-500 font-medium">
          Lines open 7 days a week • UK standard rate or included in free minutes
        </p>
      </div>
    </div>
  );
}
