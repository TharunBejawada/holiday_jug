"use client";

import { useState, useEffect } from "react";
import { FaTimes, FaPhoneAlt, FaTag, FaStar } from "react-icons/fa";

const STORAGE_KEY = "holidayjug_hidden_prices_popup_dismissed";

export function CallForHiddenPricesModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if user requested force preview or already closed popup during this visit
    const searchParams = new URLSearchParams(window.location.search);
    const forcePreview = searchParams.get("popup") === "true";
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (dismissed === "true" && !forcePreview) return;

    // Requirement: Show popup as soon as the page fully mounts!
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Once closed, must not reappear for the rest of that visit
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, "true");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      // Explicit requirement: "it has to close only when user click on close icon."
      // No onClick handler on the outer backdrop.
    >
      <div
        className="relative w-full max-w-[850px] aspect-[1243/848] rounded-[20px] sm:rounded-[36px] bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 select-none border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Full uncropped banner background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/popup_banner.png"
          alt="Call for hidden prices"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />

        {/* CLOSE BUTTON - The ONLY element that closes the popup */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute right-2 top-2 sm:right-4 sm:top-4 md:right-5 md:top-5 z-30 flex h-6 w-6 sm:h-9 sm:w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-white text-black border border-black/80 sm:border-2 shadow-md hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <FaTimes className="text-[10px] sm:text-base md:text-lg text-black" />
        </button>

        {/* CONTENT OVERLAY - Mobile-compact & Desktop-prominent typography */}
        <div className="absolute inset-0 flex pointer-events-none">
          <div className="w-[56%] sm:w-[54%] h-full flex flex-col justify-between pt-[9%] sm:pt-[13%] pb-[6%] sm:pb-[8%] pl-[6%] sm:pl-[7.5%] pr-[2%] z-10 text-left pointer-events-auto">
            {/* 1. HEADLINE & SUBTITLE */}
            <div>
              <h2 className="text-base sm:text-3xl md:text-4xl lg:text-[46px] font-black text-[#071746] tracking-tight leading-none">
                Call For
              </h2>
              <div className="mt-0.5 sm:mt-1.5 inline-block">
                <span className="inline-block bg-[#F7941D] text-white font-black text-xs sm:text-2xl md:text-3xl lg:text-[42px] px-1.5 sm:px-3.5 md:px-4 py-0.5 sm:py-1 rounded-sm sm:rounded-lg tracking-tight leading-tight shadow-xs">
                  Hidden Prices
                </span>
              </div>
              <p className="mt-1 sm:mt-3 text-[8px] sm:text-xs md:text-sm lg:text-[16px] font-bold text-[#071746] leading-tight sm:leading-relaxed max-w-[95%] sm:max-w-md">
                Get exclusive deals and special fares that you won&apos;t find online!
              </p>
            </div>

            {/* 2. THREE VALUE BADGES */}
            <div className="flex items-start gap-1.5 sm:gap-4 md:gap-6 my-0.5 sm:my-3 md:my-4">
              {/* Exclusive Deals */}
              <div className="flex flex-col items-center text-center">
                <div className="w-5 h-5 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-[#FFF1E3] flex items-center justify-center text-[#071746] mb-0.5 sm:mb-1.5 shadow-2xs">
                  <FaTag className="text-[8px] sm:text-sm md:text-base text-[#071746]" />
                </div>
                <span className="text-[6.5px] sm:text-xs md:text-[13px] font-bold text-[#071746] leading-[1.1] sm:leading-tight">
                  Exclusive<br />Deals
                </span>
              </div>

              {/* Best Fares */}
              <div className="flex flex-col items-center text-center">
                <div className="w-5 h-5 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-[#FFF1E3] flex items-center justify-center text-[#071746] mb-0.5 sm:mb-1.5 shadow-2xs">
                  <FaPhoneAlt className="text-[8px] sm:text-sm md:text-base text-[#071746]" />
                </div>
                <span className="text-[6.5px] sm:text-xs md:text-[13px] font-bold text-[#071746] leading-[1.1] sm:leading-tight">
                  Best<br />Fares
                </span>
              </div>

              {/* Personalised Assistance */}
              <div className="flex flex-col items-center text-center">
                <div className="w-5 h-5 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-[#FFF1E3] flex items-center justify-center text-[#071746] mb-0.5 sm:mb-1.5 shadow-2xs">
                  <FaStar className="text-[8px] sm:text-sm md:text-base text-[#071746]" />
                </div>
                <span className="text-[6.5px] sm:text-xs md:text-[13px] font-bold text-[#071746] leading-[1.1] sm:leading-tight">
                  Personalised<br />Assistance
                </span>
              </div>
            </div>

            {/* 3. CALL US TAP-TO-CALL BUTTON */}
            <div>
              <a
                href="tel:03301658879"
                className="inline-flex items-center gap-1.5 sm:gap-3.5 md:gap-4 rounded-full bg-[#F7941D] hover:bg-[#e08316] text-white px-2.5 sm:px-5 md:px-7 py-1 sm:py-3 md:py-3.5 shadow-md sm:shadow-xl shadow-amber-500/35 hover:shadow-2xl transition-all active:scale-95 group w-fit cursor-pointer"
              >
                <div className="w-4 h-4 sm:w-10 sm:h-10 md:w-13 md:h-13 rounded-full bg-white text-[#F7941D] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <FaPhoneAlt className="text-[8px] sm:text-lg md:text-xl" />
                </div>
                <div className="flex flex-col text-left pr-0.5 sm:pr-2">
                  <span className="text-[6px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-white/95">
                    Call Us
                  </span>
                  <span className="text-[10px] sm:text-xl md:text-2xl lg:text-[28px] font-black tracking-tight leading-tight whitespace-nowrap text-white">
                    0330 165 8879
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}