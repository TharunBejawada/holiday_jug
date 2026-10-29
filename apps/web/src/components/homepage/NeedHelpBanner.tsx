"use client";

import { FaPhoneAlt } from "react-icons/fa";

export function NeedHelpBanner() {
  return (
    <div className="relative w-full overflow-hidden rounded-[22px] sm:rounded-[28px] lg:rounded-[32px] border border-sky-100 shadow-sm bg-[#E6F3FB]">
      {/* Background Image: Desktop shows the full clean background, mobile shows soft watermark */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/travel_banner.jpg"
          alt=""
          className="w-full h-full object-cover object-left hidden md:block"
        />
        {/* Mobile watermark illustration */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/travel_banner.jpg"
          alt=""
          className="md:hidden w-full h-full object-cover object-left opacity-30"
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between py-5 sm:py-6 md:py-0 px-4 sm:px-6 lg:px-8 gap-4 sm:gap-5 md:gap-6 min-h-[110px] md:h-[120px] lg:h-[128px]">
        {/* Left spacer so center text never encroaches on suitcase/hat graphic on desktop */}
        <div
          className="hidden md:block w-[160px] lg:w-[220px] xl:w-[250px] shrink-0 pointer-events-none"
          aria-hidden="true"
        />

        {/* Center Text */}
        <div className="flex-1 text-center px-1 sm:px-2 md:px-4">
          <h3 className="text-lg sm:text-xl md:text-xl lg:text-[22px] xl:text-[24px] font-black text-[#071746] tracking-tight leading-tight uppercase">
            Need Help Choosing Your Holiday?
          </h3>
          <p className="mt-1 sm:mt-1.5 text-[11px] sm:text-xs md:text-xs lg:text-[13px] font-bold text-[#071746] tracking-wide uppercase leading-snug">
            Speak to our travel experts for personalised advice and exclusive deals.
          </p>
        </div>

        {/* Right Call Us Now CTA Button */}
        <div className="shrink-0 md:pr-2 lg:pr-4">
          <a
            href="tel:03301658879"
            aria-label="Call Holiday Jug at 0330 165 8879"
            className="group inline-flex items-center gap-3 sm:gap-3.5 bg-[#F8AC0B] hover:bg-[#e89f07] active:scale-95 px-5 sm:px-6 lg:px-7 py-2.5 sm:py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center justify-center shrink-0">
              <FaPhoneAlt className="text-[#071746] text-lg sm:text-xl lg:text-[22px] transform -rotate-12 group-hover:scale-110 transition-transform duration-200" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] sm:text-[11px] font-bold text-[#071746] tracking-wider uppercase leading-none mb-1">
                Call Us Now
              </span>
              <span className="text-base sm:text-lg lg:text-xl font-black text-[#071746] tracking-tight leading-none whitespace-nowrap">
                0330 165 8879
              </span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

