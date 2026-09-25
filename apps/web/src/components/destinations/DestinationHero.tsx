"use client";

import Link from "next/link";
import Image from "next/image";

export type CountryDetails = {
    id: string;
    name: string;
    slug: string;
    region?: string;
    flightTimeBand?: string;
    bestFor?: string[];
    priceFrom?: number | null;
    cardImageUrl?: string | null;
    heroImageUrl?: string | null;
    heroDescription?: string | null;
    whyVisitIntro?: string | null;
    whyVisitHighlights?: string[];
    whyVisitImageUrl?: string | null;
    thingsToDoContent?: string | null;
    whenToGoContent?: string | null;
    travelGuideContent?: string | null;
    holidayTypes?: Array<{
        holidayType: {
            id: string;
            name: string;
            slug: string;
            description?: string | null;
        };
        description?: string | null;
    }>;
    destinations?: Array<{
        id: string;
        name: string;
        slug: string;
        description?: string | null;
        imageUrl?: string | null;
        priceFrom?: number | null;
    }>;
    faqs?: Array<{
        id: string;
        question: string;
        answer: string;
    }>;
};

export function DestinationHero({ country }: { country: CountryDetails }) {
    const bannerUrl = country.heroImageUrl || country.cardImageUrl || "/assets/Dream_to_Departure_Banner.png";
    const displayName = country.name.toUpperCase();

    // Helper to extract clean hero paragraph text if it contains HTML tags
    const renderHeroDescription = (htmlOrText?: string | null) => {
        if (!htmlOrText) return null;
        if (htmlOrText.includes("<")) {
            return (
                <div
                    className="text-white/95 text-sm sm:text-base leading-relaxed max-w-xl font-normal drop-shadow-xs"
                    dangerouslySetInnerHTML={{ __html: htmlOrText }}
                />
            );
        }
        return (
            <p className="text-white/95 text-sm sm:text-base leading-relaxed max-w-xl font-normal drop-shadow-xs">
                {htmlOrText}
            </p>
        );
    };

    return (
        <div className="w-full bg-white">
            {/* Top Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                <nav className="flex items-center text-sm sm:text-base font-semibold text-[#1D1248]">
                    <Link href="/" className="hover:text-[#F7941D] transition-colors">
                        Home
                    </Link>
                    <span className="mx-2 text-[#F7941D] font-bold">&rarr;</span>
                    <Link href="/destinations" className="hover:text-[#F7941D] transition-colors">
                        Destinations
                    </Link>
                    <span className="mx-2 text-[#F7941D] font-bold">&rarr;</span>
                    <span className="font-bold text-[#1D1248]">
                        {country.name} Holidays
                    </span>
                </nav>
            </div>

            {/* Hero Banner Container */}
            <div className="w-full pb-8">
                <div className="relative w-full h-[360px] sm:h-[420px] lg:h-[480px] overflow-hidden shadow-lg border border-gray-100">
                    {/* Background Banner Image */}
                    {bannerUrl ? (
                        <Image
                            src={bannerUrl}
                            alt={`${country.name} Banner`}
                            fill
                            priority
                            className="object-cover object-center"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800" />
                    )}

                    {/* Dark Gradient Overlay for Crisp Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0b1633]/90 via-[#0b1633]/55 to-transparent" />

                    {/* Banner Content Container */}
                    <div className="absolute inset-0 flex items-center">
                        <div className="px-6 sm:px-12 lg:px-16 w-full max-w-2xl text-white space-y-1 sm:space-y-2">
                            {/* Cursive / Serif Prefix */}
                            <p className="font-serif italic text-3xl sm:text-4xl lg:text-5xl text-white font-medium drop-shadow-md tracking-wide">
                                Discover
                            </p>

                            {/* Country Name (Bold Uppercase Gold/Yellow) */}
                            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#F7941D]  uppercase leading-none drop-shadow-lg">
                                {displayName}
                            </h1>

                            {/* Suffix Title */}
                            <p className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white uppercase tracking-wider leading-tight drop-shadow-md pb-2">
                                HOLIDAYS
                            </p>

                            {/* Hero Description */}
                            {renderHeroDescription(country.heroDescription)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
