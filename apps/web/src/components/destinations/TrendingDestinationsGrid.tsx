"use client";

import Link from "next/link";
import type { DestinationApiItem } from "./DestinationsExplorer";

export const DEFAULT_TRENDING_DESTINATIONS: DestinationApiItem[] = [
    {
        id: "turkey",
        name: "Turkey",
        slug: "turkey",
        priceFrom: 95,
        heroImageUrl: "https://holidayjug-assets-prod.s3.eu-west-2.amazonaws.com/uploads/2026-09-25/140cb279-ab56-4878-acc3-9b498a0eccb6.jpg",
        cardImageUrl: "https://holidayjug-assets-prod.s3.eu-west-2.amazonaws.com/uploads/2026-09-25/140cb279-ab56-4878-acc3-9b498a0eccb6.jpg",
        href: "/destinations/turkey",
    },
    {
        id: "greece",
        name: "Greece",
        slug: "greece",
        priceFrom: 189,
        heroImageUrl: "https://holidayjug-assets-prod.s3.eu-west-2.amazonaws.com/uploads/2026-09-25/afb03492-79f0-4308-9312-47506b6aed0b.jpg",
        cardImageUrl: "https://holidayjug-assets-prod.s3.eu-west-2.amazonaws.com/uploads/2026-09-25/afb03492-79f0-4308-9312-47506b6aed0b.jpg",
        href: "/destinations/greece",
    },
    {
        id: "dubai",
        name: "Dubai",
        slug: "dubai",
        priceFrom: 548,
        heroImageUrl: "https://holidayjug-assets-prod.s3.eu-west-2.amazonaws.com/uploads/2026-09-25/e1536319-3c0d-456f-b8c7-973285f148a9.jpg",
        cardImageUrl: "https://holidayjug-assets-prod.s3.eu-west-2.amazonaws.com/uploads/2026-09-25/e1536319-3c0d-456f-b8c7-973285f148a9.jpg",
        href: "/destinations/dubai",
    },
    {
        id: "spain",
        name: "Spain",
        slug: "spain",
        priceFrom: 145,
        heroImageUrl: "https://holidayjug-assets-prod.s3.eu-west-2.amazonaws.com/uploads/2026-09-25/4005cca2-cffa-4e17-9be6-74f88ca53780.jpg",
        cardImageUrl: "https://holidayjug-assets-prod.s3.eu-west-2.amazonaws.com/uploads/2026-09-25/4005cca2-cffa-4e17-9be6-74f88ca53780.jpg",
        href: "/destinations/spain",
    },
    {
        id: "antalya",
        name: "Antalya",
        slug: "antalya",
        priceFrom: 878,
        heroImageUrl: "https://holidayjug-assets-prod.s3.eu-west-2.amazonaws.com/uploads/2026-09-25/7a33396e-ed2d-4fcd-a632-54837c254b4c.jpg",
        cardImageUrl: "https://holidayjug-assets-prod.s3.eu-west-2.amazonaws.com/uploads/2026-09-25/7a33396e-ed2d-4fcd-a632-54837c254b4c.jpg",
        href: "/destinations/antalya",
    },
    {
        id: "portugal",
        name: "Portugal",
        slug: "portugal",
        priceFrom: 169,
        heroImageUrl: "https://holidayjug-assets-prod.s3.eu-west-2.amazonaws.com/uploads/2026-09-25/5f77e945-62ab-465e-b55c-96a21fc82975.jpg",
        cardImageUrl: "https://holidayjug-assets-prod.s3.eu-west-2.amazonaws.com/uploads/2026-09-25/5f77e945-62ab-465e-b55c-96a21fc82975.jpg",
        href: "/destinations/portugal",
    },
];

function CardItem({ item, isTall = false }: { item: DestinationApiItem; isTall?: boolean }) {
    const formattedPrice = item.priceFrom ? `£${item.priceFrom}` : "£XXX";
    const imageUrl = item.cardImageUrl || item.heroImageUrl || null;

    return (
        <Link
            href={item.href}
            className={`group relative w-full rounded-2xl overflow-hidden border border-gray-100/50 shadow-sm hover:shadow-xl transition-all duration-300 ${isTall ? "min-h-[380px] sm:min-h-[460px] lg:min-h-full flex flex-col justify-end" : "min-h-[220px] sm:min-h-[240px] flex flex-col justify-end"
                }`}
        >
            {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={imageUrl}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
            ) : (
                <div className="absolute inset-0 bg-gray-800" />
            )}

            {/* Dark Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1633]/90 via-[#0b1633]/30 to-transparent" />

            {/* Card Content */}
            <div className="relative z-10 p-5 text-white space-y-1">
                <h3 className="font-extrabold text-white text-xl sm:text-2xl drop-shadow-sm group-hover:translate-x-0.5 transition-transform">
                    {item.name}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-white/90">
                    From <span className="font-extrabold text-white">{formattedPrice}</span> pp
                </p>
                <div className="pt-0.5">
                    <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#F7941D] group-hover:underline">
                        Explore &rarr;
                    </span>
                </div>
            </div>
        </Link>
    );
}

export function TrendingDestinationsGrid({
    items,
    loading = false,
}: {
    items: DestinationApiItem[];
    loading?: boolean;
}) {
    // Sort by sortOrder if available, then take top 6
    const sortedItems = [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    const displayItems = sortedItems.length > 0 ? sortedItems.slice(0, 6) : DEFAULT_TRENDING_DESTINATIONS;

    if (loading) {
        return (
            <div className="mb-12 sm:mb-16">
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 sm:w-10 h-[3.5px] bg-[#F7941D] rounded-full" />
                        <span className="text-xs sm:text-sm font-bold tracking-widest text-[#1D1248] uppercase">
                            TRENDING NOW
                        </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1D1248] ">
                        The destinations everyone&apos;s dreaming about.
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 min-h-[460px]">
                    <div className="lg:col-span-4 rounded-2xl bg-gray-200 animate-pulse min-h-[380px]" />
                    <div className="lg:col-span-8 flex flex-col gap-4 sm:gap-5 justify-between">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 h-1/2">
                            <div className="rounded-2xl bg-gray-200 animate-pulse min-h-[200px]" />
                            <div className="rounded-2xl bg-gray-200 animate-pulse min-h-[200px]" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 h-1/2">
                            <div className="rounded-2xl bg-gray-200 animate-pulse min-h-[200px]" />
                            <div className="rounded-2xl bg-gray-200 animate-pulse min-h-[200px]" />
                            <div className="rounded-2xl bg-gray-200 animate-pulse min-h-[200px]" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const item0 = displayItems[0];
    const item1 = displayItems[1];
    const item2 = displayItems[2];
    const item3 = displayItems[3];
    const item4 = displayItems[4];
    const item5 = displayItems[5];

    return (
        <section className="mb-12 sm:mb-16">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 sm:w-10 h-[3.5px] bg-[#F7941D] rounded-full" />
                    <span className="text-xs sm:text-sm font-bold tracking-widest text-[#1D1248] uppercase">
                        TRENDING NOW
                    </span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1D1248] ">
                    The destinations everyone&apos;s dreaming about.
                </h2>
            </div>

            {/* Asymmetric 6-Card Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
                {/* Left Column (1 Tall Card) */}
                <div className="lg:col-span-4 flex">
                    {item0 && <CardItem item={item0} isTall />}
                </div>

                {/* Right Column (5 Cards: Top 2, Bottom 3) */}
                <div className="lg:col-span-8 flex flex-col gap-4 sm:gap-5 justify-between">
                    {/* Top Row: 2 Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 flex-1">
                        {item1 && <CardItem item={item1} />}
                        {item2 && <CardItem item={item2} />}
                    </div>

                    {/* Bottom Row: 3 Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 flex-1">
                        {item3 && <CardItem item={item3} />}
                        {item4 && <CardItem item={item4} />}
                        {item5 && <CardItem item={item5} />}
                    </div>
                </div>
            </div>
        </section>
    );
}
