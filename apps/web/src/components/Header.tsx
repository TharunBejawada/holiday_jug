"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  FaChevronDown,
  FaChevronRight,
  FaUmbrellaBeach,
  FaHotel,
  FaMapMarkerAlt,
  FaFire,
  FaPhoneAlt,
  FaBars,
  FaTimes,
  FaSearch,
  FaHeadset,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaInfoCircle,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { UserAccountMenu } from "@/components/UserAccountMenu";
import { CallForHiddenPricesBanner } from "@/components/CallForHiddenPricesBanner";
import { DESTINATIONS_NAV_DATA } from "@/lib/destinations-nav-data";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [destinationsMenuOpen, setDestinationsMenuOpen] = useState(false);
  const [activeCountryIndex, setActiveCountryIndex] = useState(0);
  const [mobileDestinationsOpen, setMobileDestinationsOpen] = useState(false);
  const [mobileCountryOpen, setMobileCountryOpen] = useState<string | null>("Spain");
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnterDestinations = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setDestinationsMenuOpen(true);
  };

  const handleMouseLeaveDestinations = () => {
    closeTimerRef.current = setTimeout(() => {
      setDestinationsMenuOpen(false);
    }, 150);
  };

  const activeCountry = DESTINATIONS_NAV_DATA[activeCountryIndex] || DESTINATIONS_NAV_DATA[0];

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT BAR (G2: "Call for hidden prices" bar on all pages) */}
      <CallForHiddenPricesBanner variant="top-bar" />

      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-xs font-medium relative">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* LOGO */}
          <Link href="/" className="flex items-center group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/Holiday_Jug_Logo.png"
              alt="HolidayJug - Pack Dreams, Collect Memories"
              className="h-11 sm:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
            />
          </Link>

          {/* DESKTOP NAVIGATION MENU (Shifted to right, ordered: Destinations -> Hotels Only -> About Us) */}
          <nav className="hidden lg:flex items-center gap-7 text-[15px] font-semibold text-[#1D1248] ml-auto mr-8">
            {/* 1. Destinations with Mega Menu */}
            <div
              className="relative py-2"
              onMouseEnter={handleMouseEnterDestinations}
              onMouseLeave={handleMouseLeaveDestinations}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setDestinationsMenuOpen(!destinationsMenuOpen);
                }}
                className={`flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
                  destinationsMenuOpen ? "text-[#F7941D]" : "hover:text-[#F7941D]"
                }`}
              >
                <span>Destinations</span>
                <FaChevronDown
                  className={`text-[10px] text-[#F7941D] transition-transform duration-200 ${
                    destinationsMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {/* 2. Hotels Only */}
            <Link
              href="/hotels"
              className="hover:text-[#F7941D] transition-colors py-2 whitespace-nowrap"
            >
              Hotels Only
            </Link>

            {/* 3. About Us */}
            <Link
              href="/about"
              className="hover:text-[#F7941D] transition-colors py-2 whitespace-nowrap"
            >
              About Us
            </Link>
          </nav>

          {/* CALL US & SEARCH BUTTON */}
          <div className="hidden sm:flex items-center gap-6">
            {/* Call us (G1: UK sales line 0330 165 8879) */}
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-medium text-gray-600">Sales Line</span>
              <a
                href="tel:03301658879"
                className="text-base font-bold text-[#F7941D] hover:underline flex items-center gap-1.5"
              >
                <FaPhoneAlt className="text-xs" />
                <span>0330 165 8879</span>
              </a>
            </div>

            {/* Find Hotels */}
            <Link
              href="/hotels"
              className="flex items-center gap-2 rounded-xl bg-[#1D1248] hover:bg-[#2B1B6D] px-4 py-2 text-sm font-bold text-white transition-all shadow-xs"
            >
              <FaSearch className="text-xs" />
              <span>Search Hotels</span>
            </Link>

            {/* Sign in - Hidden per request */}
            {/* <UserAccountMenu /> */}
          </div>

          {/* MOBILE CALL BUTTON & HAMBURGER */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href="tel:03301658879"
              className="flex items-center gap-1.5 rounded-full bg-[#F7941D] px-3 py-1.5 text-xs font-bold text-white shadow-xs"
            >
              <FaPhoneAlt className="text-[10px]" />
              <span>0330 165 8879</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#1D1248] focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>

        {/* DESTINATIONS MEGA MENU DROPDOWN (Reference layout from TX Hospitals) */}
        {destinationsMenuOpen && (
          <div
            className="hidden lg:block absolute top-full left-0 right-0 w-full bg-white border-t border-b border-gray-200 shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-150"
            onMouseEnter={handleMouseEnterDestinations}
            onMouseLeave={handleMouseLeaveDestinations}
          >
            <div className="max-w-7xl mx-auto flex min-h-[360px] bg-white">
              {/* LEFT COLUMN: COUNTRIES LIST */}
              <div className="w-72 bg-slate-50/70 border-r border-gray-100 p-4 space-y-1 shrink-0">
                {DESTINATIONS_NAV_DATA.map((group, idx) => {
                  const isActive = activeCountryIndex === idx;
                  return (
                    <button
                      key={group.country}
                      type="button"
                      onMouseEnter={() => setActiveCountryIndex(idx)}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveCountryIndex(idx);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-all text-left cursor-pointer ${
                        isActive
                          ? "bg-amber-50 text-[#F7941D] font-bold shadow-xs"
                          : "text-slate-700 hover:text-[#1D1248] hover:bg-white/80 font-semibold"
                      }`}
                    >
                      <span>{group.country}</span>
                      <FaChevronRight
                        className={`text-xs transition-colors ${
                          isActive ? "text-[#F7941D]" : "text-slate-400"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* RIGHT COLUMN: DESTINATIONS GRID */}
              <div className="flex-1 p-8">
                <div className="grid grid-cols-3 gap-x-12 gap-y-4">
                  {activeCountry.destinations.map((dest) => (
                    <button
                      key={dest.slug}
                      type="button"
                      onClick={(e) => e.preventDefault()}
                      className="text-left text-sm font-medium text-slate-800 hover:text-[#F7941D] transition-colors py-1 cursor-pointer truncate"
                    >
                      {dest.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MOBILE NAV DRAWER */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 pb-6 pt-2 shadow-lg animate-in slide-in-from-top-2">
            <nav className="flex flex-col space-y-1 font-semibold text-[#1D1248]">
              {/* 1. Destinations with Expandable Countries & Sub-destinations */}
              <div>
                <div className="flex items-center justify-between py-2.5">
                  <button
                    type="button"
                    onClick={() => setMobileDestinationsOpen(!mobileDestinationsOpen)}
                    className="flex items-center justify-between w-full hover:text-[#F7941D] transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <FaMapMarkerAlt className="text-[#F7941D]" /> Destinations
                    </span>
                    <FaChevronDown
                      className={`text-xs text-[#F7941D] transition-transform duration-200 ${
                        mobileDestinationsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                {mobileDestinationsOpen && (
                  <div className="ml-4 pl-3 border-l-2 border-amber-300 space-y-2 py-2 text-sm bg-amber-50/30 rounded-r-xl pr-2">
                    {DESTINATIONS_NAV_DATA.map((group) => {
                      const isCountryExpanded = mobileCountryOpen === group.country;
                      return (
                        <div key={group.country} className="border-b border-amber-200/40 pb-1.5 last:border-b-0">
                          <button
                            type="button"
                            onClick={() => setMobileCountryOpen(isCountryExpanded ? null : group.country)}
                            className="w-full flex items-center justify-between py-1 text-xs font-bold text-slate-800 hover:text-[#F7941D]"
                          >
                            <span>{group.country}</span>
                            <span className="text-[10px] text-slate-400">
                              {isCountryExpanded ? "−" : "+"}
                            </span>
                          </button>
                          {isCountryExpanded && (
                            <div className="grid grid-cols-2 gap-1.5 pt-1.5 pl-2">
                              {group.destinations.map((d) => (
                                <button
                                  key={d.slug}
                                  type="button"
                                  onClick={(e) => e.preventDefault()}
                                  className="text-left text-[11px] font-medium text-slate-600 hover:text-[#F7941D] py-0.5 truncate cursor-pointer"
                                >
                                  • {d.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 2. Hotels Only */}
              <Link
                href="/hotels"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 py-2.5 hover:text-[#F7941D] transition-colors"
              >
                <FaHotel className="text-[#F7941D]" /> Hotels Only
              </Link>

              {/* 3. About Us */}
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 py-2.5 hover:text-[#F7941D] transition-colors"
              >
                <FaInfoCircle className="text-[#F7941D]" /> About Us
              </Link>

              {/* Search Hotels Button */}
              <Link
                href="/hotels"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#1D1248] hover:bg-[#2B1B6D] px-4 py-2.5 text-sm font-bold text-white transition-all shadow-xs mt-3"
              >
                <FaSearch className="text-xs" />
                <span>Search Hotels</span>
              </Link>
            </nav>

            <div className="mt-4 border-t border-gray-100 pt-4 flex flex-col gap-3">
              <div>
                <span className="text-xs text-gray-500 block">Sales Line</span>
                <a href="tel:03301658879" className="text-lg font-bold text-[#F7941D] flex items-center gap-2">
                  <FaPhoneAlt className="text-sm" /> 0330 165 8879
                </a>
              </div>

              {/* Social Media Links */}
              <div className="pt-2 border-t border-gray-100 flex items-center gap-2.5">
                <a
                  href="https://www.facebook.com/HOLIDAYJUG/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="HolidayJug Facebook Page"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#F7941D] hover:text-white text-[#071746] flex items-center justify-center text-xs transition-all duration-300"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="https://www.instagram.com/holidayjug/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="HolidayJug Instagram Profile"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#F7941D] hover:text-white text-[#071746] flex items-center justify-center text-xs transition-all duration-300"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://x.com/Holidayjug"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="HolidayJug X Profile"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#F7941D] hover:text-white text-[#071746] flex items-center justify-center text-xs transition-all duration-300"
                >
                  <FaXTwitter />
                </a>
                <a
                  href="https://youtube.com/@holidayjug?si=rVl_T3N1wBdAUaaf"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="HolidayJug YouTube Channel"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#F7941D] hover:text-white text-[#071746] flex items-center justify-center text-xs transition-all duration-300"
                >
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* MOBILE STICKY CALL BAR (G1: Kept visible when scrolling on mobile) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1D1248] text-white py-2.5 px-4 shadow-2xl flex items-center justify-between border-t border-amber-500/30">
        <div className="flex flex-col">
          <span className="text-[10px] text-[#F7941D] font-bold uppercase tracking-wider">
            Call for hidden prices
          </span>
          <span className="text-xs text-white/90 font-medium">UK Sales Team</span>
        </div>
        <a
          href="tel:03301658879"
          className="flex items-center gap-2 rounded-xl bg-[#F7941D] px-4 py-2 text-xs font-bold text-white shadow-md active:scale-95 transition-all"
        >
          <FaPhoneAlt className="text-[10px] animate-bounce" />
          <span>0330 165 8879</span>
        </a>
      </div>
    </>
  );
}
