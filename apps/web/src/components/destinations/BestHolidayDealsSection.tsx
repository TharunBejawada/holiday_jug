"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";

export type DealItem = {
    id: string;
    title: string;
    slug: string;
    imageUrl: string | null;
    basePriceGbp: number;
    originalPriceGbp: number | null;
    saveAmount?: number | null;
    nights: number;
    boardType: string;
    rating?: number;
    reviewCount?: number;
};

interface BestHolidayDealsSectionProps {
    countryName: string;
    countrySlug: string;
    initialDeals?: DealItem[];
}

function formatBoardType(boardType: string) {
    switch (boardType) {
        case "ALL_INCLUSIVE":
            return "All Inclusive";
        case "BED_AND_BREAKFAST":
            return "Breakfast";
        case "HALF_BOARD":
            return "Half Board";
        case "FULL_BOARD":
            return "Full Board";
        case "SELF_CATERING":
            return "Self Catering";
        default:
            return boardType.replace(/_/g, " ");
    }
}

function getFallbackDeals(countryName: string): DealItem[] {
    return [
        {
            id: "fallback-1",
            title: `Antalya All Inclusive Escape`,
            slug: "antalya-all-inclusive-escape",
            imageUrl:
                "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
            basePriceGbp: 299,
            originalPriceGbp: 419,
            saveAmount: 120,
            nights: 7,
            boardType: "All Inclusive",
            rating: 5,
            reviewCount: 128,
        },
        {
            id: "fallback-2",
            title: `Bodrum Beach Getaway`,
            slug: "bodrum-beach-getaway",
            imageUrl:
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
            basePriceGbp: 349,
            originalPriceGbp: 449,
            saveAmount: 100,
            nights: 5,
            boardType: "Breakfast",
            rating: 5,
            reviewCount: 86,
        },
        {
            id: "fallback-3",
            title: `Marmaris Summer Special`,
            slug: "marmaris-summer-special",
            imageUrl:
                "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80",
            basePriceGbp: 319,
            originalPriceGbp: 399,
            saveAmount: 80,
            nights: 7,
            boardType: "All Inclusive",
            rating: 5,
            reviewCount: 74,
        },
        {
            id: "fallback-4",
            title: `Fethiye Family Holiday`,
            slug: "fethiye-family-holiday",
            imageUrl:
                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
            basePriceGbp: 349,
            originalPriceGbp: 499,
            saveAmount: 150,
            nights: 7,
            boardType: "All Inclusive",
            rating: 5,
            reviewCount: 92,
        },
        {
            id: "fallback-5",
            title: `Istanbul City Break`,
            slug: "istanbul-city-break",
            imageUrl:
                "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=800&q=80",
            basePriceGbp: 299,
            originalPriceGbp: 419,
            saveAmount: 120,
            nights: 4,
            boardType: "Breakfast",
            rating: 5,
            reviewCount: 56,
        },
    ];
}

export function BestHolidayDealsSection({
    countryName,
    countrySlug,
    initialDeals,
}: BestHolidayDealsSectionProps) {
    const [deals, setDeals] = useState<DealItem[]>(initialDeals ?? []);

    useEffect(() => {
        fetch(`/api/destinations/${countrySlug}/deals`)
            .then((res) => res.json())
            .then((data) => {
                if (data.items && data.items.length > 0) {
                    const mapped: DealItem[] = data.items.map((pkg: any) => {
                        const basePrice = Number(pkg.basePriceGbp);
                        const origPrice = pkg.originalPriceGbp ? Number(pkg.originalPriceGbp) : null;
                        const save = origPrice && origPrice > basePrice ? Math.round(origPrice - basePrice) : null;
                        return {
                            id: pkg.id,
                            title: pkg.title,
                            slug: pkg.slug,
                            imageUrl: pkg.imageUrl || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
                            basePriceGbp: basePrice,
                            originalPriceGbp: origPrice,
                            saveAmount: save,
                            nights: pkg.nights,
                            boardType: formatBoardType(pkg.boardType),
                            rating: pkg.ratingOverride ? Number(pkg.ratingOverride) : 5,
                            reviewCount: pkg.reviewCountOverride ? pkg.reviewCountOverride : 100,
                        };
                    });
                    setDeals(mapped);
                } else if (!initialDeals || initialDeals.length === 0) {
                    setDeals(getFallbackDeals(countryName));
                }
            })
            .catch(() => {
                if (!initialDeals || initialDeals.length === 0) {
                    setDeals(getFallbackDeals(countryName));
                }
            });
    }, [countrySlug, countryName, initialDeals]);

    const displayDeals = deals.length > 0 ? deals.slice(0, 5) : getFallbackDeals(countryName);

    return (
        <section className="w-full bg-white py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Heading */}
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1248] text-center mb-8 sm:mb-12">
                    Best Holiday Deals to {countryName}
                </h2>

                {/* Deals Cards Row / Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
                    {displayDeals.map((deal) => (
                        <div
                            key={deal.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group"
                        >
                            {/* Card Image Wrapper */}
                            <div className="relative w-full h-40 sm:h-44 bg-gray-100 overflow-hidden">
                                {deal.saveAmount && deal.saveAmount > 0 ? (
                                    <div className="absolute top-3 left-3 z-10 bg-[#F7941D] text-white text-[11px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-xs">
                                        SAVE £{deal.saveAmount}
                                    </div>
                                ) : null}
                                <Image
                                    src={deal.imageUrl || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"}
                                    alt={deal.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Card Content Body */}
                            <div className="p-4 flex flex-col justify-between flex-1">
                                <div>
                                    <h3
                                        className="font-bold text-[#1D1248] text-sm sm:text-[15px] leading-snug line-clamp-1 mb-1.5"
                                        title={deal.title}
                                    >
                                        {deal.title}
                                    </h3>
                                    <p className="text-xs font-semibold text-gray-500 mb-2.5">
                                        {deal.nights} Nights • {deal.boardType}
                                    </p>

                                    {/* Star Rating & Reviews */}
                                    <div className="flex items-center gap-1.5 mb-4">
                                        <div className="flex items-center text-[#F59E0B] text-xs">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} className="w-3 h-3 fill-current" />
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-400 font-normal">
                                            ({deal.reviewCount ?? 100})
                                        </span>
                                    </div>
                                </div>

                                {/* Price */}
                                <div>
                                    <p className="font-extrabold text-[#1D1248] text-base sm:text-lg">
                                        From £{deal.basePriceGbp}{" "}
                                        <span className="text-xs font-semibold text-gray-500">pp</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Deals Button (No functionality as requested) */}
                <div className="flex justify-center mt-8 sm:mt-12">
                    <button
                        type="button"
                        className="px-8 py-3.5 rounded-full bg-[#F7941D] hover:bg-[#e08316] text-white font-extrabold text-sm tracking-wide shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                    >
                        view all deals
                    </button>
                </div>
            </div>
        </section>
    );
}
