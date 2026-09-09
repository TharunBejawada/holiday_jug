"use client";

import { useState } from "react";
import Link from "next/link";

interface StayCard {
    id: string;
    title: string;
    location: string;
    price: string;
    image: string;
    href: string;
}

type TabCategory = "beach" | "city" | "family" | "luxury" | "wellness";

const staysData: Record<TabCategory, StayCard[]> = {
    beach: [
        {
            id: "antalya",
            title: "Antalya",
            location: "Turkish Riviera, Turkey",
            price: "£XX",
            image: "/assets/Antalya.jpg",
            href: "/hotels/antalya",
        },
        {
            id: "tenerife",
            title: "Tenerife",
            location: "Canary Islands, Spain",
            price: "£XX",
            image: "/assets/Tenerife.jpg",
            href: "/hotels/tenerife",
        },
        {
            id: "santorini",
            title: "Santorini",
            location: "Cyclades, Greece",
            price: "£XX",
            image: "/assets/Santorini.jpg",
            href: "/hotels/santorini",
        },
        {
            id: "dubai",
            title: "Dubai",
            location: "United Arab Emirates",
            price: "£XX",
            image: "/assets/Dubai.jpg",
            href: "/hotels/dubai",
        },
    ],
    city: [
        {
            id: "barcelona",
            title: "Barcelona",
            location: "Catalonia, Spain",
            price: "£XX",
            image: "/assets/Tenerife.jpg",
            href: "/hotels/barcelona",
        },
        {
            id: "istanbul",
            title: "Istanbul",
            location: "Marmara, Turkey",
            price: "£XX",
            image: "/assets/Antalya.jpg",
            href: "/hotels/istanbul",
        },
        {
            id: "athens",
            title: "Athens",
            location: "Attica, Greece",
            price: "£XX",
            image: "/assets/Santorini.jpg",
            href: "/hotels/athens",
        },
        {
            id: "abudhabi",
            title: "Abu Dhabi",
            location: "United Arab Emirates",
            price: "£XX",
            image: "/assets/Dubai.jpg",
            href: "/hotels/abu-dhabi",
        },
    ],
    family: [
        {
            id: "majorca",
            title: "Majorca",
            location: "Balearic Islands, Spain",
            price: "£XX",
            image: "/assets/Tenerife.jpg",
            href: "/hotels/majorca",
        },
        {
            id: "dalaman",
            title: "Dalaman",
            location: "Aegean, Turkey",
            price: "£XX",
            image: "/assets/Antalya.jpg",
            href: "/hotels/dalaman",
        },
        {
            id: "crete",
            title: "Crete",
            location: "Greek Islands, Greece",
            price: "£XX",
            image: "/assets/Santorini.jpg",
            href: "/hotels/crete",
        },
        {
            id: "dubaiparks",
            title: "Dubai Parks",
            location: "United Arab Emirates",
            price: "£XX",
            image: "/assets/Dubai.jpg",
            href: "/hotels/dubai-parks",
        },
    ],
    luxury: [
        {
            id: "marbella",
            title: "Marbella",
            location: "Costa del Sol, Spain",
            price: "£XX",
            image: "/assets/Tenerife.jpg",
            href: "/hotels/marbella",
        },
        {
            id: "bodrum",
            title: "Bodrum",
            location: "Aegean Riviera, Turkey",
            price: "£XX",
            image: "/assets/Antalya.jpg",
            href: "/hotels/bodrum",
        },
        {
            id: "mykonos",
            title: "Mykonos",
            location: "Cyclades, Greece",
            price: "£XX",
            image: "/assets/Santorini.jpg",
            href: "/hotels/mykonos",
        },
        {
            id: "palmjumeirah",
            title: "Palm Jumeirah",
            location: "Dubai, UAE",
            price: "£XX",
            image: "/assets/Dubai.jpg",
            href: "/hotels/palm-jumeirah",
        },
    ],
    wellness: [
        {
            id: "grancanaria",
            title: "Gran Canaria",
            location: "Canary Islands, Spain",
            price: "£XX",
            image: "/assets/Tenerife.jpg",
            href: "/hotels/gran-canaria",
        },
        {
            id: "fethiye",
            title: "Fethiye",
            location: "Turkish Riviera, Turkey",
            price: "£XX",
            image: "/assets/Antalya.jpg",
            href: "/hotels/fethiye",
        },
        {
            id: "rhodes",
            title: "Rhodes",
            location: "Dodecanese, Greece",
            price: "£XX",
            image: "/assets/Santorini.jpg",
            href: "/hotels/rhodes",
        },
        {
            id: "rak",
            title: "Ras Al Khaimah",
            location: "United Arab Emirates",
            price: "£XX",
            image: "/assets/Dubai.jpg",
            href: "/hotels/ras-al-khaimah",
        },
    ],
};

const tabs: { id: TabCategory; label: string }[] = [
    { id: "beach", label: "Beach" },
    { id: "city", label: "City Breaks" },
    { id: "family", label: "Family" },
    { id: "luxury", label: "Luxury" },
    { id: "wellness", label: "Wellness & Relaxation" },
];

export function StaysSection() {
    const [activeTab, setActiveTab] = useState<TabCategory>("beach");

    return (
        <section className="bg-white py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* HEADER */}
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#F7941D] tracking-tight">
                        STAYS FOR EVERY KIND OF HOLIDAY
                    </h2>
                    <p className="mt-2 text-sm sm:text-base font-semibold text-[#1D1248]">
                        Discover popular destinations, handpicked for every travel style and budget.
                    </p>
                </div>

                {/* TAB NAVIGATION BAR */}
                <div className="border-b border-gray-200 mt-8 mb-10 overflow-x-auto">
                    <div className="flex items-center justify-center gap-6 sm:gap-12 min-w-max mx-auto px-4">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative pb-3 text-sm sm:text-base font-semibold transition-colors duration-200 cursor-pointer ${isActive ? "text-[#1D1248]" : "text-gray-500 hover:text-[#1D1248]"
                                        }`}
                                >
                                    {tab.label}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#F7941D] rounded-t-full" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* CARDS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {staysData[activeTab].map((stay) => (
                        <Link
                            key={stay.id}
                            href={stay.href}
                            className="group flex flex-col cursor-pointer"
                        >
                            {/* IMAGE CONTAINER */}
                            <div className="relative overflow-hidden rounded-3xl h-52 sm:h-56 shadow-sm group-hover:shadow-xl transition-all duration-300">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={stay.image}
                                    alt={stay.title}
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* CARD DETAILS */}
                            <div className="mt-4 flex flex-col text-left">
                                <h3 className="text-xl sm:text-2xl font-semibold text-[#F7941D] leading-tight">
                                    {stay.title}
                                </h3>
                                <span className="text-xs sm:text-sm font-semibold text-[#1D1248] mt-0.5">
                                    {stay.location}
                                </span>

                                <div className="mt-3 flex flex-col leading-none">
                                    <span className="text-2xl sm:text-3xl font-semibold text-[#F7941D]">
                                        {stay.price}
                                    </span>
                                    <span className="text-xs font-semibold text-[#1D1248] mt-1">
                                        avg. per night
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
