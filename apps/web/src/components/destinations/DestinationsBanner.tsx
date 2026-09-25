"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DestinationsBanner() {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/destinations?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <section className="relative w-full overflow-hidden min-h-[440px] sm:min-h-[520px] lg:min-h-[600px] flex items-center bg-[#0d1b3e]">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/assets/Destinations_overview_page_Banner.jpg"
                    alt="Where will your next holiday take you"
                    className="w-full h-full object-cover object-center lg:object-[center_35%]"
                />
                {/* Dark Blue Gradient Overlay for Left Content Contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0b1b4f]/95 via-[#0b1b4f]/80 to-transparent sm:w-4/5 lg:w-3/5" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1b4f]/60 via-transparent to-transparent lg:hidden" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                <div className="max-w-xl lg:max-w-2xl text-left">
                    {/* Subheading / Tagline */}
                    <span className="block text-[#F7941D] text-lg sm:text-2xl lg:text-3xl font-medium tracking-normal mb-1 sm:mb-2">
                        where will your
                    </span>

                    {/* Main Headline */}
                    <h1 className="text-white text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight uppercase leading-[1.1] mb-3 sm:mb-4 drop-shadow-sm">
                        NEXT HOLIDAY TAKE YOU?
                    </h1>

                    {/* Paragraph */}
                    <p className="text-white/90 text-sm sm:text-base lg:text-xl font-normal leading-relaxed mb-6 sm:mb-8 max-w-lg">
                        explore incredible destinations and find the holiday that&apos;s right for you.
                    </p>

                    {/* Search Form Pill */}
                    <form onSubmit={handleSearch} className="w-full max-w-md sm:max-w-lg">
                        <div className="relative flex items-center bg-white rounded-full p-1.5 sm:p-2 pl-5 sm:pl-6 shadow-2xl border border-white/20 transition-all focus-within:ring-2 focus-within:ring-[#F7941D]">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="where would you like to go?"
                                className="w-full bg-transparent text-gray-800 placeholder-gray-400 text-xs sm:text-sm md:text-base font-normal focus:outline-none pr-3"
                                aria-label="Where would you like to go"
                            />
                            <button
                                type="submit"
                                className="bg-[#F7941D] hover:bg-[#e08314] active:scale-95 text-white font-semibold text-xs sm:text-sm md:text-base px-6 sm:px-8 py-2.5 sm:py-3 rounded-full transition-all duration-200 shadow-md shrink-0 cursor-pointer"
                            >
                                search
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
