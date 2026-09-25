"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowRight, FaCompass, FaMapMarkerAlt } from "react-icons/fa";

export interface DestinationApiItem {
    id: string;
    name: string;
    slug: string;
    priceFrom?: number | null;
    heroImageUrl?: string | null;
    href: string;
    featuredOnOverview?: boolean;
}

const FALLBACK_DESTINATIONS: DestinationApiItem[] = [
    {
        id: "turkey",
        name: "Turkey",
        slug: "turkey",
        priceFrom: 95,
        heroImageUrl: "/assets/Antalya.jpg",
        href: "/destinations/turkey",
    },
    {
        id: "greece",
        name: "Greece",
        slug: "greece",
        priceFrom: 382,
        heroImageUrl: "/assets/Santorini.jpg",
        href: "/destinations/greece",
    },
    {
        id: "dubai",
        name: "Dubai",
        slug: "dubai",
        priceFrom: 516,
        heroImageUrl: "/assets/Dubai.jpg",
        href: "/destinations/dubai",
    },
    {
        id: "spain",
        name: "Spain",
        slug: "spain",
        priceFrom: 145,
        heroImageUrl: "/assets/Tenerife.jpg",
        href: "/destinations/spain",
    },
    {
        id: "antalya",
        name: "Antalya",
        slug: "antalya",
        priceFrom: 129,
        heroImageUrl: "/assets/All_Inclusive_holidays.jpg",
        href: "/destinations/antalya",
    },
    {
        id: "portugal",
        name: "Portugal",
        slug: "portugal",
        priceFrom: 189,
        heroImageUrl: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=800&q=80",
        href: "/destinations/portugal",
    },
];

// Gradient themes for image-less fallback cards
const FALLBACK_GRADIENTS = [
    "from-[#0F172A] via-[#1E293B] to-[#334155]", // Slate dark
    "from-[#1E1B4B] via-[#312E81] to-[#4338CA]", // Deep Indigo
    "from-[#064E3B] via-[#047857] to-[#059669]", // Emerald Coast
    "from-[#4C1D95] via-[#6D28D9] to-[#7C3AED]", // Royal Purple
    "from-[#831843] via-[#9F1239] to-[#BE123C]", // Crimson Sun
    "from-[#0c1f40] via-[#1d3557] to-[#457b9d]", // Ocean Blue
];

export function TrendingDestinationsSection() {
    const [destinations, setDestinations] = useState<DestinationApiItem[]>(FALLBACK_DESTINATIONS);
    const [loading, setLoading] = useState(true);
    const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

    useEffect(() => {
        let isMounted = true;

        async function fetchDestinations() {
            try {
                const res = await fetch("/api/destinations", { cache: "no-store" });
                if (res.ok) {
                    const data = await res.json();
                    if (isMounted && data?.items && Array.isArray(data.items) && data.items.length > 0) {
                        setDestinations(data.items);
                        setLoading(false);
                        return;
                    }
                }
            } catch (err) {
                console.warn("Client fetch to /api/destinations failed, using default list:", err);
            }

            if (isMounted) {
                setDestinations(FALLBACK_DESTINATIONS);
                setLoading(false);
            }
        }

        fetchDestinations();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleImageError = (id: string) => {
        setFailedImages((prev) => ({ ...prev, [id]: true }));
    };

    // Ensure we have 6 items for the masonry grid
    const tallCard = destinations[0];
    const topRowCards = destinations.slice(1, 3);
    const bottomRowCards = destinations.slice(3, 6);

    const renderCardContent = (item: DestinationApiItem, index: number, isTall = false) => {
        const hasValidImage = item?.heroImageUrl && !failedImages[item.id];
        const formattedPrice = item?.priceFrom ? `£${item.priceFrom}` : "£XXX";
        const fallbackGradient = FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length];

        return (
            <Link
                key={item.id || index}
                href={item.href || `/destinations/${item.slug || ""}`}
                className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-end p-5 sm:p-6 text-white w-full ${isTall ? "min-h-[360px] sm:min-h-[440px] lg:h-full" : "min-h-[200px] sm:min-h-[220px]"
                    }`}
            >
                {/* Image Background */}
                {hasValidImage ? (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={item.heroImageUrl!}
                            alt={item.name}
                            onError={() => handleImageError(item.id)}
                            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        {/* Dark Gradient Overlay matching reference mockup */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1638]/90 via-[#0a1638]/40 to-transparent group-hover:from-[#0a1638]/95 transition-colors" />
                    </>
                ) : (
                    /* Image-less Alternative Card (Stylized Gradient Grid Card) */
                    <div className={`absolute inset-0 bg-gradient-to-br ${fallbackGradient} p-6 flex flex-col justify-between overflow-hidden border border-white/10`}>
                        {/* Subtle background glow effect */}
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
                        <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-[#F7941D]/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />

                        {/* Top Icon Badge */}
                        <div className="relative z-10 flex justify-between items-start">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider bg-white/15 backdrop-blur-md text-white border border-white/20">
                                <FaCompass className="text-[#F7941D]" /> DESTINATION
                            </span>
                            <FaMapMarkerAlt className="text-white/20 text-2xl group-hover:text-[#F7941D] transition-colors" />
                        </div>
                    </div>
                )}

                {/* Card Content Overlay */}
                <div className="relative z-10 flex flex-col gap-1">
                    <h3 className={`font-bold tracking-tight text-white drop-shadow-sm transition-transform duration-300 group-hover:translate-x-1 ${isTall ? "text-2xl sm:text-3xl lg:text-4xl mb-1" : "text-xl sm:text-2xl"
                        }`}>
                        {item.name}
                    </h3>

                    <div className="flex items-baseline gap-1 text-sm sm:text-base font-medium text-white/95">
                        <span className="font-normal">From</span>
                        <span className="font-bold text-base sm:text-lg lg:text-xl text-white">
                            {formattedPrice}
                        </span>
                        <span className="font-normal text-xs sm:text-sm text-white/90">pp</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 text-[#F7941D] font-semibold text-xs sm:text-sm mt-1 group-hover:text-amber-400 transition-colors">
                        <span>Explore</span>
                        <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1.5" />
                    </div>
                </div>
            </Link>
        );
    };

    if (loading) {
        return (
            <section className="py-12 sm:py-16 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="h-6 w-36 bg-gray-200 rounded animate-pulse mb-3" />
                    <div className="h-9 w-80 bg-gray-200 rounded animate-pulse mb-8" />
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
                        <div className="lg:col-span-4 h-96 bg-gray-200 rounded-3xl animate-pulse" />
                        <div className="lg:col-span-8 flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4 h-44">
                                <div className="bg-gray-200 rounded-3xl animate-pulse" />
                                <div className="bg-gray-200 rounded-3xl animate-pulse" />
                            </div>
                            <div className="grid grid-cols-3 gap-4 h-44">
                                <div className="bg-gray-200 rounded-3xl animate-pulse" />
                                <div className="bg-gray-200 rounded-3xl animate-pulse" />
                                <div className="bg-gray-200 rounded-3xl animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header Title Section matching mockup */}
                <div className="mb-8 sm:mb-10">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 sm:w-10 h-[3px] bg-[#F7941D] rounded-full" />
                        <span className="text-xs sm:text-sm font-bold tracking-widest text-[#1D1248] uppercase">
                            TRENDING NOW
                        </span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#1D1248] tracking-tight">
                        The destinations everyone&apos;s dreaming about.
                    </h2>
                </div>

                {/* Masonry Layout matching mockup */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
                    {/* Left Tall Card (Turkey) */}
                    {tallCard && (
                        <div className="lg:col-span-4 flex">
                            {renderCardContent(tallCard, 0, true)}
                        </div>
                    )}

                    {/* Right Side Container */}
                    <div className="lg:col-span-8 flex flex-col gap-4 sm:gap-5">
                        {/* Top Row: 2 Cards (Greece, Dubai) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                            {topRowCards.map((item, idx) => renderCardContent(item, idx + 1, false))}
                        </div>

                        {/* Bottom Row: 3 Cards (Spain, Antalya, Portugal) */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                            {bottomRowCards.map((item, idx) => renderCardContent(item, idx + 3, false))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
