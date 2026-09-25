"use client";

import Image from "next/image";
import type { CountryDetails } from "./DestinationHero";

function stripHtml(text?: string | null): string {
    if (!text) return "";
    return text.replace(/<[^>]*>?/gm, "").trim();
}

const DEFAULT_HIGHLIGHTS: Record<string, string[]> = {
    Turkey: [
        "Stunning beaches along the Turquoise Coast",
        "Rich history and world-famous landmarks",
        "Luxury resorts and all-inclusive stays",
        "Great value for money",
        "Perfect for families, couples and adventure seekers",
    ],
};

export function WhyVisitSection({ country }: { country: CountryDetails }) {
    const rawHighlights =
        country.whyVisitHighlights && country.whyVisitHighlights.length > 0
            ? country.whyVisitHighlights
            : DEFAULT_HIGHLIGHTS[country.name] || [
                `Stunning beaches and coastlines in ${country.name}`,
                "Rich cultural heritage and iconic landmarks",
                "Luxury resorts and world-class hospitality",
                "Great value for money and memorable experiences",
                "Ideal for families, couples, and adventure seekers",
            ];

    const highlights = rawHighlights.map((h) => stripHtml(h));

    const imageUrl =
        country.whyVisitImageUrl ||
        country.heroImageUrl ||
        country.cardImageUrl ||
        "/assets/Img1.jpg";

    return (
        <section id="overview" className="w-full bg-white py-10 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* Left Content Column */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Title with Underline */}
                        <div className="inline-block">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#F7941D] tracking-tight pb-1 relative inline-block">
                                Why visit {country.name}?
                                <span className="block w-full h-[3px] bg-[#0094D4] mt-1 rounded-full" />
                            </h2>
                        </div>

                        {/* Intro Content */}
                        {country.whyVisitIntro ? (
                            <div
                                className="text-gray-700 text-base sm:text-lg leading-relaxed space-y-3 font-normal"
                                dangerouslySetInnerHTML={{ __html: country.whyVisitIntro }}
                            />
                        ) : (
                            <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-normal">
                                {country.name} is a land where rich history meet breathtaking landscapes. Relax on beautiful beaches, explore ancient ruins, enjoy world-class resorts and experience a rich culture with delicious cuisine and warm hospitality.
                            </p>
                        )}

                        {/* Bullet Highlights */}
                        {highlights.length > 0 && (
                            <ul className="space-y-3.5 pt-2">
                                {highlights.map((highlight, index) => (
                                    <li key={index} className="flex items-start space-x-3.5">
                                        <span className="w-3 h-3 rounded-full bg-[#F7941D] shrink-0 mt-1.5 shadow-2xs" />
                                        <span className="text-gray-700 text-base sm:text-lg leading-snug">
                                            {highlight}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Right Image Column */}
                    <div className="lg:col-span-5 flex justify-center lg:justify-end">
                        <div className="relative w-full h-[280px] sm:h-[360px] lg:h-[400px] rounded-3xl overflow-hidden shadow-lg border border-gray-100">
                            <Image
                                src={imageUrl}
                                alt={`Why visit ${country.name}`}
                                fill
                                sizes="(max-width: 1024px) 100vw, 45vw"
                                className="object-cover object-center"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
