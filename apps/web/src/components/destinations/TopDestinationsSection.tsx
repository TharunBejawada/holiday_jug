"use client";

import Image from "next/image";
import type { CountryDetails } from "./DestinationHero";

function stripHtml(text?: string | null): string {
    if (!text) return "";
    return text.replace(/<[^>]*>?/gm, "").trim();
}

const DEFAULT_DESTINATIONS: Record<
    string,
    Array<{
        id: string;
        name: string;
        description: string;
        priceFrom: number;
        imageUrl: string;
    }>
> = {
    Turkey: [
        {
            id: "antalya",
            name: "Antalya",
            description: "Beautiful beaches, luxury resorts and a vibrant old town.",
            priceFrom: 95,
            imageUrl: "/assets/Antalya.jpg",
        },
        {
            id: "bodrum",
            name: "Bodrum",
            description: "Chic resorts, lively nightlife and stunning Aegean views.",
            priceFrom: 105,
            imageUrl: "/assets/Destiantion.png",
        },
        {
            id: "marmaris",
            name: "Marmaris",
            description: "A perfect mix of beaches, nature and entertainment.",
            priceFrom: 99,
            imageUrl: "/assets/Img1.jpg",
        },
        {
            id: "fethiye",
            name: "Fethiye",
            description: "Breathtaking scenery, crystal-clear waters.",
            priceFrom: 105,
            imageUrl: "/assets/Img2.jpg",
        },
        {
            id: "istanbul",
            name: "Istanbul",
            description: "A unique city of history, culture and modern charm.",
            priceFrom: 110,
            imageUrl: "/assets/Destinations_overview_page_Banner.jpg",
        },
    ],
};

export function TopDestinationsSection({ country }: { country: CountryDetails }) {
    const destinationsList =
        country.destinations && country.destinations.length > 0
            ? country.destinations.map((d, index) => ({
                id: d.id,
                name: d.name,
                description:
                    stripHtml(d.description) ||
                    `Discover stunning resorts, culture, and beaches in ${d.name}.`,
                priceFrom: d.priceFrom ?? 99,
                imageUrl:
                    d.imageUrl ||
                    DEFAULT_DESTINATIONS.Turkey[index % DEFAULT_DESTINATIONS.Turkey.length].imageUrl,
            }))
            : DEFAULT_DESTINATIONS[country.name] || DEFAULT_DESTINATIONS.Turkey;

    return (
        <section id="top-destinations" className="w-full bg-white py-10 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Heading */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1D1248] text-center mb-8 sm:mb-12 tracking-tight">
                    Top Destinations in {country.name}
                </h2>

                {/* Grid of Destination Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
                    {destinationsList.map((dest) => (
                        <div
                            key={dest.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between text-center p-3.5 sm:p-4"
                        >
                            <div>
                                {/* Image Container */}
                                <div className="relative w-full h-[150px] sm:h-[160px] rounded-xl overflow-hidden mb-3.5">
                                    <Image
                                        src={dest.imageUrl}
                                        alt={dest.name}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                                        className="object-cover object-center"
                                    />
                                </div>

                                {/* Destination Title & Short Description */}
                                <h3 className="text-base sm:text-lg font-bold text-[#1D1248] mb-1">
                                    {dest.name}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600 leading-snug line-clamp-2 min-h-[36px] mb-3">
                                    {stripHtml(dest.description)}
                                </p>
                            </div>

                            {/* Price Button Badge */}
                            <div className="pt-2">
                                <button
                                    type="button"
                                    className="w-full bg-[#F7941D] hover:bg-[#e08316] text-white font-bold text-xs sm:text-sm py-2 px-3 rounded-full shadow-2xs transition-colors cursor-default"
                                >
                                    From £{dest.priceFrom} pp
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Destinations Button */}
                <div className="flex justify-center mt-8 sm:mt-12">
                    <button
                        type="button"
                        className="bg-[#F7941D] hover:bg-[#e08316] text-white font-bold text-sm sm:text-base py-3 px-8 rounded-full shadow-sm transition-colors cursor-default"
                    >
                        view all destinations
                    </button>
                </div>
            </div>
        </section>
    );
}
