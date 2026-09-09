"use client";

import { useState } from "react";
import {
    FaMapMarkerAlt,
    FaUserFriends,
    FaSearch,
    FaShieldAlt,
    FaPercent,
} from "react-icons/fa";

import { DatePicker } from "@/components/DatePicker";

export function HeroSection() {
    const [activeTab, setActiveTab] = useState<"holidays" | "hotels">("holidays");
    const [destination, setDestination] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [travellers, setTravellers] = useState("2 Adults, 1 Room");

    return (
        <section className="relative w-full bg-white pb-4 sm:pb-6">
            {/* HERO CONTAINER WITH FULL BACKGROUND IMAGE */}
            <div className="relative w-full min-h-[580px] sm:min-h-[640px] lg:h-[700px] flex flex-col justify-end pt-12 sm:pt-16 lg:pt-0 pb-4 sm:pb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/assets/Homepage_Banner.png"
                    alt="HolidayJug Beach Paradise"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />

                {/* Subtle Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent pointer-events-none" />

                {/* SEARCH PANEL POSITIONED INSIDE THE IMAGE AT THE BOTTOM */}
                <div className="relative z-20 mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 mt-auto">
                    <div className="w-full max-w-5xl">
                        {/* TABS (Holidays / Hotels) */}
                        <div className="inline-flex items-center gap-0">
                            <button
                                type="button"
                                onClick={() => setActiveTab("holidays")}
                                className={`px-5 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-lg font-semibold transition-all duration-200 rounded-t-xl sm:rounded-t-2xl shadow-sm ${activeTab === "holidays"
                                        ? "bg-white text-[#1D1248]"
                                        : "bg-[#F7941D] text-white hover:bg-[#e08314]"
                                    }`}
                            >
                                Holidays
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab("hotels")}
                                className={`px-5 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-lg font-semibold transition-all duration-200 rounded-t-xl sm:rounded-t-2xl shadow-sm ${activeTab === "hotels"
                                        ? "bg-white text-[#1D1248]"
                                        : "bg-[#F7941D] text-white hover:bg-[#e08314]"
                                    }`}
                            >
                                Hotels
                            </button>
                        </div>

                        {/* MAIN SEARCH CARD */}
                        <div className="bg-white rounded-b-2xl rounded-tr-2xl sm:rounded-r-3xl sm:rounded-b-3xl rounded-tl-none p-4 sm:p-7 shadow-2xl border border-gray-100/80">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    alert(`Searching for ${activeTab} in ${destination || "Anywhere"}`);
                                }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 sm:gap-4 items-end"
                            >
                                {/* WHERE TO? */}
                                <div className="lg:col-span-3 flex flex-col gap-1 sm:gap-1.5">
                                    <label className="text-xs sm:text-sm font-semibold text-[#1D1248]">Where to?</label>
                                    <div className="relative flex items-center">
                                        <input
                                            type="text"
                                            value={destination}
                                            onChange={(e) => setDestination(e.target.value)}
                                            placeholder="Search destination"
                                            className="w-full rounded-xl bg-gray-50/80 px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-800 placeholder-gray-400 border border-gray-100 focus:border-[#F7941D] focus:bg-white focus:outline-none transition-all font-semibold"
                                        />
                                        <FaMapMarkerAlt className="absolute right-3.5 text-gray-400 pointer-events-none text-xs sm:text-sm" />
                                    </div>
                                </div>

                                {/* CHECK-IN */}
                                <div className="lg:col-span-2 flex flex-col gap-1 sm:gap-1.5">
                                    <label className="text-xs sm:text-sm font-semibold text-[#1D1248]">Check-in</label>
                                    <DatePicker
                                        value={checkIn}
                                        onChange={setCheckIn}
                                        placeholder="Select date"
                                    />
                                </div>

                                {/* CHECK-OUT */}
                                <div className="lg:col-span-2 flex flex-col gap-1 sm:gap-1.5">
                                    <label className="text-xs sm:text-sm font-semibold text-[#1D1248]">Check-out</label>
                                    <DatePicker
                                        value={checkOut}
                                        onChange={setCheckOut}
                                        placeholder="Select date"
                                        minDate={checkIn}
                                    />
                                </div>

                                {/* TRAVELLERS & ROOMS */}
                                <div className="lg:col-span-3 flex flex-col gap-1 sm:gap-1.5">
                                    <label className="text-xs sm:text-sm font-semibold text-[#1D1248]">Travellers &amp; Rooms</label>
                                    <div className="relative flex items-center">
                                        <select
                                            value={travellers}
                                            onChange={(e) => setTravellers(e.target.value)}
                                            className="w-full rounded-xl bg-gray-50/80 px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-800 border border-gray-100 focus:border-[#F7941D] focus:bg-white focus:outline-none transition-all font-semibold appearance-none cursor-pointer"
                                        >
                                            <option value="1 Adult, 1 Room">1 Adult, 1 Room</option>
                                            <option value="2 Adults, 1 Room">2 Adults, 1 Room</option>
                                            <option value="2 Adults, 2 Children, 1 Room">2 Adults, 2 Children, 1 Room</option>
                                            <option value="4 Adults, 2 Rooms">4 Adults, 2 Rooms</option>
                                        </select>
                                        <FaUserFriends className="absolute right-3.5 text-gray-400 pointer-events-none text-xs sm:text-sm" />
                                    </div>
                                </div>

                                {/* SEARCH BUTTON */}
                                <div className="lg:col-span-2 flex flex-col">
                                    <button
                                        type="submit"
                                        className="w-full rounded-xl bg-[#F7941D] hover:bg-[#e08314] active:scale-[0.98] py-2.5 sm:py-3 px-6 text-sm sm:text-base font-semibold text-white transition-all shadow-md flex items-center justify-center gap-2"
                                    >
                                        <FaSearch className="text-xs sm:text-sm" />
                                        Search
                                    </button>
                                </div>
                            </form>

                            {/* BOTTOM BADGES / TRUST PROMISES */}
                            <div className="mt-4 sm:mt-6 pt-3.5 sm:pt-5 border-t border-gray-100 flex flex-wrap items-center justify-around gap-4 sm:gap-6 text-[#1D1248] text-xs sm:text-base font-semibold">
                                <div className="flex items-center gap-2">
                                    <FaPercent className="text-[#F7941D] text-sm sm:text-lg" />
                                    <span>Best Price Guarantee</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaShieldAlt className="text-[#F7941D] text-sm sm:text-lg" />
                                    <span>Secure Booking</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

