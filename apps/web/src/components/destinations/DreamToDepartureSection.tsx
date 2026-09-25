"use client";

import Link from "next/link";

interface StepItem {
    id: number;
    title: string;
    description: string;
    image: string;
}

const STEPS: StepItem[] = [
    {
        id: 1,
        title: "TELL US YOUR DREAM",
        description: "share your travel ideas, preferences and budget.",
        image: "/assets/Img1.jpg",
    },
    {
        id: 2,
        title: "WE PLAN YOUR TRIP",
        description: "our experts craft a personalised itinerary, just for you.",
        image: "/assets/Img2.jpg",
    },
    {
        id: 3,
        title: "YOU APPROVE & PACK",
        description: "review, make changes if needed, and get ready to go.",
        image: "/assets/Img2.jpg",
    },
    {
        id: 4,
        title: "GO MAKE MEMORIES",
        description: "enjoy a hassle-free holiday, with our support always by your side.",
        image: "/assets/Img1.jpg",
    },
];

export function DreamToDepartureSection() {
    return (
        <div className="rounded-3xl border border-gray-100 overflow-hidden relative py-10 sm:py-14 px-6 sm:px-8 lg:px-10 bg-[#e0f2fe] shadow-sm mt-10 sm:mt-14">
            {/* Background Banner Image */}
            <div className="absolute inset-0 z-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/assets/Dream_to_Departure_Banner.png"
                    alt="From Dream to Departure background"
                    className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/20" />
            </div>

            <div className="relative z-10 w-full">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
                    <div className="flex items-center justify-center gap-3 mb-2 sm:mb-3">
                        <div className="w-8 sm:w-10 h-[3.5px] bg-[#F7941D] rounded-full" />
                        <span className="text-xs sm:text-sm font-bold tracking-widest text-[#1D1248] uppercase">
                            FROM DREAM TO DEPARTURE
                        </span>
                        <div className="w-8 sm:w-10 h-[3.5px] bg-[#F7941D] rounded-full" />
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1D1248]  uppercase leading-tight">
                        YOUR DREAM HOLIDAY, MADE SIMPLE
                    </h2>

                    <p className="text-sm sm:text-base font-normal text-gray-800 mt-2">
                        tell us what you&apos;re dreaming of, and we&apos;ll take care of the rest.
                    </p>
                </div>

                {/* 4 Steps Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 items-start">
                    {STEPS.map((step) => (
                        <div key={step.id} className="flex flex-col items-center group">
                            {/* Arch/Dome Image Top */}
                            <div className="relative w-full aspect-[4/3] rounded-t-[100px] sm:rounded-t-[120px] overflow-hidden bg-gray-200 border-2 border-white/80 shadow-md">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={step.image}
                                    alt={step.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                />
                            </div>

                            {/* White Card Bottom */}
                            <div className="w-full bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-lg text-center flex flex-col items-center justify-center -mt-6 relative z-10 min-h-[130px]">
                                <h3 className="text-xs sm:text-sm font-bold text-[#F7941D] uppercase tracking-wide mb-1">
                                    {step.title}
                                </h3>
                                <p className="text-xs text-gray-600 leading-relaxed font-normal">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Plan My Holiday Button */}
                <div className="mt-8 sm:mt-12 text-center">
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 bg-[#F7941D] hover:bg-[#e08314] active:scale-95 text-white font-bold text-sm sm:text-base px-8 py-3.5 rounded-xl transition-all duration-200 shadow-md"
                    >
                        Plan My Holiday &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
}
