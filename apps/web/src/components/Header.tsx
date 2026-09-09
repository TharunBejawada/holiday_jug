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
} from "react-icons/fa";

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const toggleDropdown = (name: string) => {
        setActiveDropdown(activeDropdown === name ? null : name);
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-xs font-medium">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                {/* LOGO */}
                <Link href="/" className="flex items-center group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/assets/Holiday_Jug_Logo.png"
                        alt="HolidayJug - Pack Dreams, Collect Memories"
                        className="h-12 sm:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
                    />
                </Link>

                {/* DESKTOP NAVIGATION MENU */}
                <nav className="hidden lg:flex items-center gap-6 text-[15px] font-semibold text-[#1D1248]">
                    {/* Holidays */}
                    <div className="relative group" onMouseLeave={() => setActiveDropdown(null)}>
                        <button
                            onClick={() => toggleDropdown("holidays")}
                            className="flex items-center gap-1.5 hover:text-[#F7941D] transition-colors py-2"
                        >
                            Holidays
                            <FaChevronDown className="text-[10px] text-[#F7941D] transition-transform duration-200 group-hover:rotate-180" />
                        </button>

                        {/* Dropdown Menu */}
                        <div className="absolute left-0 top-full hidden group-hover:block w-56 rounded-xl bg-white p-2 shadow-xl border border-gray-100 animate-in fade-in slide-in-from-top-2">
                            <Link
                                href="/holidays?type=all-inclusive"
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F7941D] transition-colors"
                            >
                                <FaUmbrellaBeach className="text-[#F7941D]" /> All Inclusive Holidays
                            </Link>
                            <Link
                                href="/holidays?type=family"
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F7941D] transition-colors"
                            >
                                <FaUsers className="text-[#F7941D]" /> Family Package Holidays
                            </Link>
                            <Link
                                href="/holidays?type=beach"
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F7941D] transition-colors"
                            >
                                <FaSun className="text-[#F7941D]" /> Beach Escapes
                            </Link>
                            <Link
                                href="/holidays?type=luxury"
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F7941D] transition-colors"
                            >
                                <FaGem className="text-[#F7941D]" /> Luxury Holidays
                            </Link>
                        </div>
                    </div>

                    {/* Hotels */}
                    <div className="relative group">
                        <button
                            onClick={() => toggleDropdown("hotels")}
                            className="flex items-center gap-1.5 hover:text-[#F7941D] transition-colors py-2"
                        >
                            Hotels
                            <FaChevronDown className="text-[10px] text-[#F7941D] transition-transform duration-200 group-hover:rotate-180" />
                        </button>
                        <div className="absolute left-0 top-full hidden group-hover:block w-52 rounded-xl bg-white p-2 shadow-xl border border-gray-100 animate-in fade-in slide-in-from-top-2">
                            <Link
                                href="/hotels?rating=5"
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F7941D] transition-colors"
                            >
                                <FaStar className="text-[#F7941D]" /> 5-Star Luxury Hotels
                            </Link>
                            <Link
                                href="/hotels?type=beachfront"
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F7941D] transition-colors"
                            >
                                <FaHotel className="text-[#F7941D]" /> Beachfront Resorts
                            </Link>
                            <Link
                                href="/hotels?type=boutique"
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F7941D] transition-colors"
                            >
                                <FaHome className="text-[#F7941D]" /> Boutique Stays
                            </Link>
                        </div>
                    </div>

                    {/* Destinations */}
                    <div className="relative group">
                        <button
                            onClick={() => toggleDropdown("destinations")}
                            className="flex items-center gap-1.5 hover:text-[#F7941D] transition-colors py-2"
                        >
                            Destinations
                            <FaChevronDown className="text-[10px] text-[#F7941D] transition-transform duration-200 group-hover:rotate-180" />
                        </button>
                        <div className="absolute left-0 top-full hidden group-hover:block w-52 rounded-xl bg-white p-2 shadow-xl border border-gray-100 animate-in fade-in slide-in-from-top-2">
                            <Link
                                href="/destinations/spain"
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F7941D] transition-colors"
                            >
                                <FaMapMarkerAlt className="text-[#F7941D]" /> Spain & Canaries
                            </Link>
                            <Link
                                href="/destinations/greece"
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F7941D] transition-colors"
                            >
                                <FaMapMarkerAlt className="text-[#F7941D]" /> Greece Islands
                            </Link>
                            <Link
                                href="/destinations/turkey"
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F7941D] transition-colors"
                            >
                                <FaMapMarkerAlt className="text-[#F7941D]" /> Turkey Riviera
                            </Link>
                            <Link
                                href="/destinations/portugal"
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F7941D] transition-colors"
                            >
                                <FaMapMarkerAlt className="text-[#F7941D]" /> Portugal Algarve
                            </Link>
                        </div>
                    </div>

                    {/* Deals */}
                    <div className="relative group">
                        <button
                            onClick={() => toggleDropdown("deals")}
                            className="flex items-center gap-1.5 hover:text-[#F7941D] transition-colors py-2"
                        >
                            Deals
                            <FaChevronDown className="text-[10px] text-[#F7941D] transition-transform duration-200 group-hover:rotate-180" />
                        </button>
                        <div className="absolute left-0 top-full hidden group-hover:block w-52 rounded-xl bg-white p-2 shadow-xl border border-gray-100 animate-in fade-in slide-in-from-top-2">
                            <Link
                                href="/deals/last-minute"
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F7941D] transition-colors"
                            >
                                <FaFire className="text-[#F7941D]" /> Last Minute Deals
                            </Link>
                            <Link
                                href="/deals/under-300"
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F7941D] transition-colors"
                            >
                                <FaTag className="text-[#F7941D]" /> Holidays Under £300
                            </Link>
                            <Link
                                href="/deals/early-bird"
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F7941D] transition-colors"
                            >
                                <FaSun className="text-[#F7941D]" /> 2026 Sun Getaways
                            </Link>
                        </div>
                    </div>

                    {/* About Us */}
                    <div className="relative group">
                        <button
                            onClick={() => toggleDropdown("about")}
                            className="flex items-center gap-1.5 hover:text-[#F7941D] transition-colors py-2"
                        >
                            About Us
                            <FaChevronDown className="text-[10px] text-[#F7941D] transition-transform duration-200 group-hover:rotate-180" />
                        </button>
                        <div className="absolute left-0 top-full hidden group-hover:block w-48 rounded-xl bg-white p-2 shadow-xl border border-gray-100 animate-in fade-in slide-in-from-top-2">
                            <Link
                                href="/about"
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F7941D] transition-colors"
                            >
                                <FaBookOpen className="text-[#F7941D]" /> Our Story
                            </Link>
                            <Link
                                href="/atol-protection"
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F7941D] transition-colors"
                            >
                                <FaShieldAlt className="text-[#F7941D]" /> ATOL Protection
                            </Link>
                            <Link
                                href="/contact"
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-[#F7941D] transition-colors"
                            >
                                <FaPhoneAlt className="text-[#F7941D]" /> Contact Support
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* CALL US & SEARCH BUTTON */}
                <div className="hidden sm:flex items-center gap-6">
                    {/* Call us */}
                    <div className="flex flex-col text-left">
                        <span className="text-[11px] font-medium text-gray-600">Call us at</span>
                        <a
                            href="tel:040XXXXXXXX"
                            className="text-base font-semibold text-[#F7941D] hover:underline tracking-tight"
                        >
                            040 xxxxxxxxx
                        </a>
                    </div>

                    {/* Find a Holiday / Hotel */}
                    <Link
                        href="/search"
                        className="flex items-center gap-2 text-base font-semibold text-[#1D1248] hover:text-[#F7941D] transition-colors"
                    >
                        Find a Holiday
                        <br className="hidden xl:inline" /> / Hotel
                    </Link>
                </div>

                {/* MOBILE MENU TOGGLE BUTTON */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 text-[#1D1248] lg:hidden focus:outline-none"
                    aria-label="Toggle Navigation Menu"
                >
                    {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
                </button>
            </div>

            {/* MOBILE NAV DRAWER */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-gray-100 bg-white px-4 pb-6 pt-2 shadow-lg animate-in slide-in-from-top-2">
                    <nav className="flex flex-col space-y-1 font-semibold text-[#1D1248]">
                        {/* Holidays */}
                        <div>
                            <button
                                type="button"
                                onClick={() => toggleDropdown("holidays")}
                                className="flex w-full items-center justify-between py-2.5 hover:text-[#F7941D] text-left cursor-pointer"
                            >
                                <span>Holidays</span>
                                <FaChevronDown className={`text-xs text-[#F7941D] transition-transform duration-200 ${activeDropdown === "holidays" ? "rotate-180" : ""}`} />
                            </button>
                            {activeDropdown === "holidays" && (
                                <div className="pl-4 pb-2 space-y-2 flex flex-col text-sm font-normal text-gray-700 animate-in fade-in">
                                    <Link href="/holidays?type=all-inclusive" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 py-1 hover:text-[#F7941D]">
                                        <FaUmbrellaBeach className="text-[#F7941D]" /> All Inclusive Holidays
                                    </Link>
                                    <Link href="/holidays?type=family" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 py-1 hover:text-[#F7941D]">
                                        <FaUsers className="text-[#F7941D]" /> Family Package Holidays
                                    </Link>
                                    <Link href="/holidays?type=beach" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 py-1 hover:text-[#F7941D]">
                                        <FaSun className="text-[#F7941D]" /> Beach Escapes
                                    </Link>
                                    <Link href="/holidays?type=luxury" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 py-1 hover:text-[#F7941D]">
                                        <FaGem className="text-[#F7941D]" /> Luxury Holidays
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Hotels */}
                        <div>
                            <button
                                type="button"
                                onClick={() => toggleDropdown("hotels")}
                                className="flex w-full items-center justify-between py-2.5 hover:text-[#F7941D] text-left cursor-pointer"
                            >
                                <span>Hotels</span>
                                <FaChevronDown className={`text-xs text-[#F7941D] transition-transform duration-200 ${activeDropdown === "hotels" ? "rotate-180" : ""}`} />
                            </button>
                            {activeDropdown === "hotels" && (
                                <div className="pl-4 pb-2 space-y-2 flex flex-col text-sm font-normal text-gray-700 animate-in fade-in">
                                    <Link href="/hotels?rating=5" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 py-1 hover:text-[#F7941D]">
                                        <FaStar className="text-[#F7941D]" /> 5-Star Luxury Hotels
                                    </Link>
                                    <Link href="/hotels?type=beachfront" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 py-1 hover:text-[#F7941D]">
                                        <FaHotel className="text-[#F7941D]" /> Beachfront Resorts
                                    </Link>
                                    <Link href="/hotels?type=boutique" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 py-1 hover:text-[#F7941D]">
                                        <FaHome className="text-[#F7941D]" /> Boutique Stays
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Destinations */}
                        <div>
                            <button
                                type="button"
                                onClick={() => toggleDropdown("destinations")}
                                className="flex w-full items-center justify-between py-2.5 hover:text-[#F7941D] text-left cursor-pointer"
                            >
                                <span>Destinations</span>
                                <FaChevronDown className={`text-xs text-[#F7941D] transition-transform duration-200 ${activeDropdown === "destinations" ? "rotate-180" : ""}`} />
                            </button>
                            {activeDropdown === "destinations" && (
                                <div className="pl-4 pb-2 space-y-2 flex flex-col text-sm font-normal text-gray-700 animate-in fade-in">
                                    <Link href="/destinations/spain" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 py-1 hover:text-[#F7941D]">
                                        <FaMapMarkerAlt className="text-[#F7941D]" /> Spain &amp; Canaries
                                    </Link>
                                    <Link href="/destinations/greece" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 py-1 hover:text-[#F7941D]">
                                        <FaMapMarkerAlt className="text-[#F7941D]" /> Greece Islands
                                    </Link>
                                    <Link href="/destinations/turkey" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 py-1 hover:text-[#F7941D]">
                                        <FaMapMarkerAlt className="text-[#F7941D]" /> Turkey Riviera
                                    </Link>
                                    <Link href="/destinations/portugal" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 py-1 hover:text-[#F7941D]">
                                        <FaMapMarkerAlt className="text-[#F7941D]" /> Portugal Algarve
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Deals */}
                        <div>
                            <button
                                type="button"
                                onClick={() => toggleDropdown("deals")}
                                className="flex w-full items-center justify-between py-2.5 hover:text-[#F7941D] text-left cursor-pointer"
                            >
                                <span>Deals</span>
                                <FaChevronDown className={`text-xs text-[#F7941D] transition-transform duration-200 ${activeDropdown === "deals" ? "rotate-180" : ""}`} />
                            </button>
                            {activeDropdown === "deals" && (
                                <div className="pl-4 pb-2 space-y-2 flex flex-col text-sm font-normal text-gray-700 animate-in fade-in">
                                    <Link href="/deals/last-minute" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 py-1 hover:text-[#F7941D]">
                                        <FaFire className="text-[#F7941D]" /> Last Minute Deals
                                    </Link>
                                    <Link href="/deals/under-300" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 py-1 hover:text-[#F7941D]">
                                        <FaTag className="text-[#F7941D]" /> Holidays Under £300
                                    </Link>
                                    <Link href="/deals/early-bird" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 py-1 hover:text-[#F7941D]">
                                        <FaSun className="text-[#F7941D]" /> 2026 Sun Getaways
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* About Us */}
                        <div>
                            <button
                                type="button"
                                onClick={() => toggleDropdown("about")}
                                className="flex w-full items-center justify-between py-2.5 hover:text-[#F7941D] text-left cursor-pointer"
                            >
                                <span>About Us</span>
                                <FaChevronDown className={`text-xs text-[#F7941D] transition-transform duration-200 ${activeDropdown === "about" ? "rotate-180" : ""}`} />
                            </button>
                            {activeDropdown === "about" && (
                                <div className="pl-4 pb-2 space-y-2 flex flex-col text-sm font-normal text-gray-700 animate-in fade-in">
                                    <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 py-1 hover:text-[#F7941D]">
                                        <FaBookOpen className="text-[#F7941D]" /> Our Story
                                    </Link>
                                    <Link href="/atol-protection" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 py-1 hover:text-[#F7941D]">
                                        <FaShieldAlt className="text-[#F7941D]" /> ATOL Protection
                                    </Link>
                                    <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 py-1 hover:text-[#F7941D]">
                                        <FaPhoneAlt className="text-[#F7941D]" /> Contact Support
                                    </Link>
                                </div>
                            )}
                        </div>
                    </nav>

                    <div className="mt-4 border-t border-gray-100 pt-4 flex flex-col gap-3">
                        <div>
                            <span className="text-xs text-gray-500 block">Call us at</span>
                            <a href="tel:040XXXXXXXX" className="text-lg font-semibold text-[#F7941D]">
                                040 xxxxxxxxx
                            </a>
                        </div>
                        <Link
                            href="/search"
                            className="flex items-center justify-center gap-2 rounded-xl bg-[#1D1248] px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-[#2A1B6A]"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <FaSearch className="text-xs" /> Find a Holiday / Hotel
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
