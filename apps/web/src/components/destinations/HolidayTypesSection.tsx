"use client";

import type { CountryDetails } from "./DestinationHero";

function stripHtml(text?: string | null): string {
    if (!text) return "";
    return text.replace(/<[^>]*>?/gm, "").trim();
}

const DEFAULT_HOLIDAY_TYPES: Record<
    string,
    Array<{
        id: string;
        name: string;
        description: string;
    }>
> = {
    Turkey: [
        {
            id: "beach",
            name: "Beach Holidays",
            description: "Relax on Turkey's stunning coastlines",
        },
        {
            id: "all-inclusive",
            name: "All-Inclusive Holidays",
            description: "Enjoy meals, drinks and more – all in one price",
        },
        {
            id: "family",
            name: "Family Holidays",
            description: "Fun for all ages with activities and resorts",
        },
        {
            id: "luxury",
            name: "Luxury Holidays",
            description: "Premium stays and world-class service",
        },
        {
            id: "adventure",
            name: "Adventure Holidays",
            description: "Explore nature, tours and exciting activities",
        },
    ],
};

export function HolidayTypesSection({ country }: { country: CountryDetails }) {
    const list =
        country.holidayTypes && country.holidayTypes.length > 0
            ? country.holidayTypes.map((ht, index) => {
                const name = ht.holidayType.name;
                const desc =
                    stripHtml(ht.description) ||
                    stripHtml(ht.holidayType.description) ||
                    `Enjoy amazing ${name.toLowerCase()} in ${country.name}.`;
                return {
                    id: ht.holidayType.id || `ht-${index}`,
                    name,
                    description: desc,
                };
            })
            : DEFAULT_HOLIDAY_TYPES[country.name] || DEFAULT_HOLIDAY_TYPES.Turkey;

    return (
        <section id="holiday-types" className="w-full bg-white py-10 sm:py-16 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Heading */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1D1248] text-center mb-8 sm:mb-12 tracking-tight">
                    Holiday Types in {country.name}
                </h2>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
                    {list.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-2xl p-5 sm:p-6 text-center flex flex-col justify-center items-center min-h-[140px] border border-gray-200 hover:border-[#F7941D] hover:shadow-md transition-all duration-200 cursor-pointer shadow-2xs"
                        >
                            <h3 className="text-base sm:text-lg font-bold text-[#1D1248] mb-2 leading-snug">
                                {item.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
