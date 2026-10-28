"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaPhoneAlt,
  FaShieldAlt,
  FaPlane,
} from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-[#071746] text-white font-medium pb-14 sm:pb-0">
      {/* MAIN FOOTER CONTENT */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* COLUMN 1: BRAND LOGO & SOCIAL (G4) */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/Holiday_Jug_Footer.png"
                alt="HolidayJug"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </Link>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal max-w-xs">
              our trusted travel partner for unforgettable holidays and comfortable stays.
            </p>

            {/* SOCIAL ICONS (G4: Must open the actual HolidayJug page handle: holidayjug in a new tab) */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://facebook.com/holidayjug"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="HolidayJug Facebook Page"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#F7941D] text-white flex items-center justify-center text-sm transition-all duration-300"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://instagram.com/holidayjug"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="HolidayJug Instagram Profile"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#F7941D] text-white flex items-center justify-center text-sm transition-all duration-300"
              >
                <FaInstagram />
              </a>
              <a
                href="https://youtube.com/@holidayjug"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="HolidayJug YouTube Channel"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#F7941D] text-white flex items-center justify-center text-sm transition-all duration-300"
              >
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* COLUMN 2: HOLIDAYS */}
          <div>
            <h4 className="text-sm sm:text-base font-bold text-[#F7941D] uppercase tracking-wider mb-4">
              HOLIDAYS
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-normal text-white/90">
              <li>
                <Link href="/search?type=beach" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                  <span className="text-[#F7941D]">•</span> Beach Holidays
                </Link>
              </li>
              <li>
                <Link href="/search?type=all-inclusive" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                  <span className="text-[#F7941D]">•</span> All-Inclusive Holidays
                </Link>
              </li>
              <li>
                <Link href="/search?type=family" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                  <span className="text-[#F7941D]">•</span> Family Holidays
                </Link>
              </li>
              <li>
                <Link href="/search?type=luxury" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                  <span className="text-[#F7941D]">•</span> Luxury Holidays
                </Link>
              </li>
              <li>
                <Link href="/search?type=honeymoon" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                  <span className="text-[#F7941D]">•</span> Honeymoon Holidays
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: HOTELS */}
          <div>
            <h4 className="text-sm sm:text-base font-bold text-[#F7941D] uppercase tracking-wider mb-4">
              HOTELS
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-normal text-white/90">
              <li>
                <Link href="/search?destination=dubai" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                  <span className="text-[#F7941D]">•</span> Dubai Luxury Resorts
                </Link>
              </li>
              <li>
                <Link href="/search?destination=tenerife" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                  <span className="text-[#F7941D]">•</span> Tenerife Beach Hotels
                </Link>
              </li>
              <li>
                <Link href="/search?destination=santorini" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                  <span className="text-[#F7941D]">•</span> Santorini Caldera Stays
                </Link>
              </li>
              <li>
                <Link href="/search?destination=antalya" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                  <span className="text-[#F7941D]">•</span> Antalya All-Inclusive
                </Link>
              </li>
              <li>
                <Link href="/search?destination=majorca" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                  <span className="text-[#F7941D]">•</span> Majorca Holiday Hotels
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: COMPANY & LEGAL (G6) */}
          <div>
            <h4 className="text-sm sm:text-base font-bold text-[#F7941D] uppercase tracking-wider mb-4">
              COMPANY
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-normal text-white/90">
              <li>
                <Link href="/terms" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                  <span className="text-[#F7941D]">•</span> Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                  <span className="text-[#F7941D]">•</span> Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                  <span className="text-[#F7941D]">•</span> Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/booking-conditions" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                  <span className="text-[#F7941D]">•</span> Booking Conditions
                </Link>
              </li>
              <li>
                <Link href="/complaints-procedure" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                  <span className="text-[#F7941D]">•</span> Complaints Procedure
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#F7941D] transition-colors flex items-center gap-2">
                  <span className="text-[#F7941D]">•</span> Contact Information
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 5: UK SALES NUMBER & CONTACT (G1) */}
          <div className="space-y-4">
            <h4 className="text-sm sm:text-base font-bold text-[#F7941D] uppercase tracking-wider mb-4">
              UK SALES LINE
            </h4>

            {/* UK Sales Contact Repeated (G1) */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs font-semibold text-[#F7941D] uppercase tracking-wide block">
                Speak to our travel experts
              </span>
              <a
                href="tel:03301658879"
                className="text-xl sm:text-2xl font-black text-white hover:text-[#F7941D] transition-colors flex items-center gap-2"
              >
                <FaPhoneAlt className="text-base text-[#F7941D]" />
                <span>0330 165 8879</span>
              </a>
              <p className="text-[11px] text-white/70">
                UK Freephone • Mon - Sun 08:00 - 22:00
              </p>
            </div>

            <div className="space-y-1 text-xs text-white/80">
              <p className="font-semibold text-white">Registered UK Office:</p>
              <p>128 City Road, London, EC1V 2NX, United Kingdom</p>
            </div>
          </div>
        </div>

        {/* SECTION FOR IATA & ATOL LOGOS (G5: Add IATA and ATOL logos at bottom of site) */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-6 sm:gap-8">
            {/* ATOL PROTECTION BADGE (G5) */}
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2.5 rounded-xl border border-white/15">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-[#071746] flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                ATOL
              </div>
              <div className="text-left">
                <span className="text-xs font-extrabold tracking-wide text-white block uppercase">
                  ATOL Protected
                </span>
                <span className="text-[10px] text-white/75 block">
                  100% Financial Protection for Package Holidays
                </span>
              </div>
            </div>

            {/* IATA ACCREDITED BADGE (G5) */}
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2.5 rounded-xl border border-white/15">
              <div className="w-10 h-10 rounded-full bg-blue-400 text-[#071746] flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                IATA
              </div>
              <div className="text-left">
                <span className="text-xs font-extrabold tracking-wide text-white block uppercase">
                  IATA Member
                </span>
                <span className="text-[10px] text-white/75 block">
                  International Air Transport Association Standard
                </span>
              </div>
            </div>
          </div>

          <div className="text-center md:text-right text-xs text-white/70">
            <p>All flight-inclusive packages are financially protected by ATOL.</p>
            <p>Prices subject to live supplier availability.</p>
          </div>
        </div>
      </div>

      {/* COPYRIGHT BAR */}
      <div className="border-t border-white/10 py-6 text-center text-xs sm:text-sm font-normal text-white/80">
        <p>© 2026 Holiday Jug. All Rights Reserved. Authorised and Regulated.</p>
      </div>
    </footer>
  );
}
