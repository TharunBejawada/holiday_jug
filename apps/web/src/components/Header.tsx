"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaChevronDown,
  FaUmbrellaBeach,
  FaUsers,
  FaSun,
  FaGem,
  FaStar,
  FaHotel,
  FaHome,
  FaMapMarkerAlt,
  FaFire,
  FaTag,
  FaBookOpen,
  FaShieldAlt,
  FaPhoneAlt,
  FaBars,
  FaTimes,
  FaSearch,
  FaHeadset,
} from "react-icons/fa";
import { UserAccountMenu } from "@/components/UserAccountMenu";
import { CallForHiddenPricesBanner } from "@/components/CallForHiddenPricesBanner";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT BAR (G2: "Call for hidden prices" bar on all pages) */}
      <CallForHiddenPricesBanner variant="top-bar" />

      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-xs font-medium">
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

          {/* DESKTOP NAVIGATION MENU */}
          <nav className="hidden lg:flex items-center gap-6 text-[15px] font-semibold text-[#1D1248]">
            {/* Holidays */}
            <div className="relative group" onMouseLeave={() => setActiveDropdown(null)}>
              <button
                type="button"
                onClick={() => toggleDropdown("holidays")}
                className="flex items-center gap-1.5 hover:text-[#F7941D] transition-colors py-2 cursor-pointer"
              >
                Holidays
                <FaChevronDown className="text-[10px] text-[#F7941D] transition-transform duration-200 group-hover:rotate-180" />
              </button>

              <div className="absolute left-0 top-full hidden group-hover:block w-56 rounded-xl bg-white p-2 shadow-xl border border-gray-100 animate-in fade-in slide-in-from-top-2">
                <Link
                  href="/search?type=all-inclusive"
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F7941D] transition-colors"
                >
                  <FaUmbrellaBeach className="text-[#F7941D]" /> All Inclusive Holidays
                </Link>
                <Link
                  href="/search?type=family"
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F7941D] transition-colors"
                >
                  <FaUsers className="text-[#F7941D]" /> Family Package Holidays
                </Link>
                <Link
                  href="/search?type=beach"
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F7941D] transition-colors"
                >
                  <FaSun className="text-[#F7941D]" /> Beach Escapes
                </Link>
                <Link
                  href="/search?type=luxury"
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F7941D] transition-colors"
                >
                  <FaGem className="text-[#F7941D]" /> Luxury Holidays
                </Link>
              </div>
            </div>

            {/* Hotels */}
            <div className="relative group">
              <button
                type="button"
                onClick={() => toggleDropdown("hotels")}
                className="flex items-center gap-1.5 hover:text-[#F7941D] transition-colors py-2 cursor-pointer"
              >
                Hotels
                <FaChevronDown className="text-[10px] text-[#F7941D] transition-transform duration-200 group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 top-full hidden group-hover:block w-52 rounded-xl bg-white p-2 shadow-xl border border-gray-100 animate-in fade-in slide-in-from-top-2">
                <Link
                  href="/search?rating=5"
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F7941D] transition-colors"
                >
                  <FaStar className="text-[#F7941D]" /> 5-Star Luxury Hotels
                </Link>
                <Link
                  href="/search?destination=dubai"
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F7941D] transition-colors"
                >
                  <FaHotel className="text-[#F7941D]" /> Dubai Resorts &amp; Spas
                </Link>
                <Link
                  href="/search?destination=santorini"
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F7941D] transition-colors"
                >
                  <FaHome className="text-[#F7941D]" /> Boutique Stays
                </Link>
              </div>
            </div>

            {/* Destinations (G3: Only destinations with mapped hotels) */}
            <div className="relative group">
              <Link
                href="/destinations"
                className="flex items-center gap-1.5 hover:text-[#F7941D] transition-colors py-2"
              >
                Destinations
                <FaChevronDown className="text-[10px] text-[#F7941D] transition-transform duration-200 group-hover:rotate-180" />
              </Link>
              <div className="absolute left-0 top-full hidden group-hover:block w-60 rounded-xl bg-white p-2 shadow-xl border border-gray-100 animate-in fade-in slide-in-from-top-2">
                <Link
                  href="/destinations"
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-[#F7941D] hover:bg-amber-50 transition-colors border-b border-gray-100 mb-1"
                >
                  <FaMapMarkerAlt className="text-[#F7941D]" /> All Destinations
                </Link>
                <Link
                  href="/search?destination=dubai"
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F7941D] transition-colors"
                >
                  <FaMapMarkerAlt className="text-[#F7941D]" /> Dubai &amp; Emirates
                </Link>
                <Link
                  href="/search?destination=tenerife"
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F7941D] transition-colors"
                >
                  <FaMapMarkerAlt className="text-[#F7941D]" /> Canary Islands (Tenerife)
                </Link>
                <Link
                  href="/search?destination=antalya"
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F7941D] transition-colors"
                >
                  <FaMapMarkerAlt className="text-[#F7941D]" /> Turkey Riviera (Antalya)
                </Link>
                <Link
                  href="/search?destination=santorini"
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F7941D] transition-colors"
                >
                  <FaMapMarkerAlt className="text-[#F7941D]" /> Greece (Santorini)
                </Link>
                <Link
                  href="/search?destination=majorca"
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F7941D] transition-colors"
                >
                  <FaMapMarkerAlt className="text-[#F7941D]" /> Spain (Majorca)
                </Link>
              </div>
            </div>

            {/* Hot Deals (H2) */}
            <Link
              href="/search?destination=maldives"
              className="flex items-center gap-1.5 hover:text-[#F7941D] transition-colors py-2"
            >
              <FaFire className="text-[#F7941D] text-xs" /> Hot Deals
            </Link>

            {/* Agent Lookup (Internal Tool A1) */}
            <Link
              href="/agent"
              className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#1D1248] py-2 border-l border-gray-200 pl-4"
            >
              <FaHeadset className="text-[#F7941D]" /> Agent Tool
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

            {/* Find a Holiday / Hotel */}
            <Link
              href="/search"
              className="flex items-center gap-2 rounded-xl bg-[#1D1248] hover:bg-[#2B1B6D] px-4 py-2 text-sm font-bold text-white transition-all shadow-xs"
            >
              <FaSearch className="text-xs" />
              <span>Search Holidays</span>
            </Link>

            <UserAccountMenu />
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

        {/* MOBILE NAV DRAWER */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 pb-6 pt-2 shadow-lg animate-in slide-in-from-top-2">
            <nav className="flex flex-col space-y-1 font-semibold text-[#1D1248]">
              <Link
                href="/search"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 py-2.5 text-[#F7941D] font-bold"
              >
                <FaSearch /> Search Holidays &amp; Hotels
              </Link>

              <Link
                href="/search?type=all-inclusive"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 py-2 hover:text-[#F7941D]"
              >
                <FaUmbrellaBeach className="text-[#F7941D]" /> All Inclusive Holidays
              </Link>
              <Link
                href="/search?destination=dubai"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 py-2 hover:text-[#F7941D]"
              >
                <FaHotel className="text-[#F7941D]" /> Dubai Resorts &amp; Hotels
              </Link>
              <Link
                href="/destinations"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 py-2 hover:text-[#F7941D]"
              >
                <FaMapMarkerAlt className="text-[#F7941D]" /> All Destinations
              </Link>
              <Link
                href="/agent"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 py-2 text-gray-600 hover:text-[#1D1248]"
              >
                <FaHeadset className="text-[#F7941D]" /> Agent Search ID Lookup Tool
              </Link>
            </nav>

            <div className="mt-4 border-t border-gray-100 pt-4 flex flex-col gap-3">
              <div>
                <span className="text-xs text-gray-500 block">Sales Line</span>
                <a href="tel:03301658879" className="text-lg font-bold text-[#F7941D] flex items-center gap-2">
                  <FaPhoneAlt className="text-sm" /> 0330 165 8879
                </a>
              </div>
              <div onClick={() => setMobileMenuOpen(false)}>
                <UserAccountMenu variant="mobile" />
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
