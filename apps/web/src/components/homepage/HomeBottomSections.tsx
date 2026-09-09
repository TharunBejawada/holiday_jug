"use client";

import { useState } from "react";
import Link from "next/link";
import { FaArrowRight, FaPlane } from "react-icons/fa";

interface BannerItem {
    id: string;
    title: string;
    subtitle: string;
    buttonText: string;
    image: string;
    href: string;
}

const promoBanners: BannerItem[] = [
    {
        id: "all-inclusive",
        title: "All-Inclusive Holidays",
        subtitle: "Everything you need, all in one place.",
        buttonText: "Explore Now",
        image: "/assets/All_Inclusive_holidays.jpg",
        href: "/holidays?type=all-inclusive",
    },
    {
        id: "last-minute",
        title: "Last Minute Deals",
        subtitle: "Big savings on last minute getaways!",
        buttonText: "Book Now",
        image: "/assets/Last_minute_Deals.jpg",
        href: "/deals/last-minute",
    },
];

export function HomeBottomSections() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            setSubmitted(true);
            setEmail("");
        }
    };

    return (
        <div className="space-y-6 sm:space-y-10">
            {/* SECTION 7: PROMOTIONAL BANNERS */}
            <section className="bg-white py-6 sm:py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                        {promoBanners.map((banner) => (
                            <Link
                                key={banner.id}
                                href={banner.href}
                                className="group relative flex flex-row items-stretch rounded-[22px] sm:rounded-[28px] bg-[#071746] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-h-[210px] sm:min-h-[230px] lg:min-h-[250px]"
                            >
                                {/* LEFT TEXT CONTENT */}
                                <div className="flex flex-col justify-center px-5 sm:px-8 lg:px-8 py-5 sm:py-7 z-20 w-[45%] shrink-0 text-left">
                                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white tracking-tight leading-snug mb-1.5 sm:mb-2">
                                        {banner.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm lg:text-[15px] font-normal text-white/90 leading-relaxed mb-4 sm:mb-6 max-w-xs">
                                        {banner.subtitle}
                                    </p>
                                    <div className="mt-auto">
                                        <span className="inline-flex items-center justify-center rounded-lg sm:rounded-xl px-5 sm:px-7 py-2 sm:py-2.5 text-xs sm:text-sm lg:text-base font-semibold text-[#071746] bg-white border border-transparent shadow-sm group-hover:bg-[#F7941D] group-hover:text-white group-hover:border-[#F7941D] transition-all duration-300">
                                            {banner.buttonText}
                                        </span>
                                    </div>
                                </div>

                                {/* RIGHT IMAGE WITH YELLOW ARC CURVE OVERLAY */}
                                <div className="relative w-[55%] h-auto min-h-[210px] overflow-hidden shrink-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={banner.image}
                                        alt={banner.title}
                                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                                    />

                                    {/* SVG CURVE MASK & YELLOW ARC OUTLINE */}
                                    <svg
                                        className="absolute inset-0 w-full h-full pointer-events-none z-10"
                                        viewBox="0 0 100 100"
                                        preserveAspectRatio="none"
                                    >
                                        <path
                                            d="M 0,0 L 54,0 C 4,25 4,75 54,100 L 0,100 Z"
                                            fill="#071746"
                                        />
                                        <path
                                            d="M 54,0 C 4,25 4,75 54,100"
                                            fill="none"
                                            stroke="#F7941D"
                                            strokeWidth="8"
                                            vectorEffect="non-scaling-stroke"
                                        />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 8 & 9: WHY CHOOSE HOLIDAY JUG & READY TO FIND CTA */}
            <section className="bg-white py-6 sm:py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
                    {/* WHY CHOOSE HOLIDAY JUG */}
                    <div>
                        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#F7941D] uppercase tracking-wide">
                                WHY CHOOSE HOLIDAY JUG?
                            </h2>
                            <p className="mt-2 text-lg sm:text-2xl lg:text-3xl font-semibold text-[#071746] leading-tight">
                                More choice. Greater value. A simpler way to book your next holiday.
                            </p>
                        </div>

                        <div className="relative rounded-[26px] sm:rounded-[32px] bg-[#071746] overflow-hidden shadow-xl min-h-[420px] flex flex-col lg:flex-row items-stretch">
                            {/* LEFT FEATURES */}
                            <div className="w-full lg:w-[58%] p-6 sm:p-10 lg:p-12 z-20 flex flex-col justify-center space-y-6 sm:space-y-7">
                                <div>
                                    <span className="inline-block bg-[#F7941D] text-white font-semibold text-sm sm:text-base px-4 py-1.5 rounded-lg shadow-sm">
                                        Best Holiday Deals
                                    </span>
                                    <p className="text-white/90 text-xs sm:text-sm lg:text-[15px] font-medium mt-2 leading-relaxed">
                                        Find great-value holidays and hotel stays without the hassle.
                                    </p>
                                </div>

                                <div>
                                    <span className="inline-block bg-[#F7941D] text-white font-semibold text-sm sm:text-base px-4 py-1.5 rounded-lg shadow-sm">
                                        Wide Choice of Hotels
                                    </span>
                                    <p className="text-white/90 text-xs sm:text-sm lg:text-[15px] font-medium mt-2 leading-relaxed">
                                        From beachfront resorts to city stays, find accommodation to suit your style.
                                    </p>
                                </div>

                                <div>
                                    <span className="inline-block bg-[#F7941D] text-white font-semibold text-sm sm:text-base px-4 py-1.5 rounded-lg shadow-sm">
                                        Easy &amp; Secure Booking
                                    </span>
                                    <p className="text-white/90 text-xs sm:text-sm lg:text-[15px] font-medium mt-2 leading-relaxed">
                                        A simple booking experience designed to make planning your holiday easy.
                                    </p>
                                </div>

                                <div>
                                    <span className="inline-block bg-[#F7941D] text-white font-semibold text-sm sm:text-base px-4 py-1.5 rounded-lg shadow-sm">
                                        Trusted Support
                                    </span>
                                    <p className="text-white/90 text-xs sm:text-sm lg:text-[15px] font-medium mt-2 leading-relaxed">
                                        Our team is here to help before, during and after your booking.
                                    </p>
                                </div>
                            </div>

                            {/* RIGHT IMAGE */}
                            <div className="w-full lg:w-[42%] relative flex items-end justify-center lg:justify-end overflow-hidden pt-4 lg:pt-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/assets/Why_Choose.png"
                                    alt="Why Choose Holiday Jug"
                                    className="w-auto h-auto max-h-[380px] sm:max-h-[440px] lg:max-h-[480px] object-contain object-bottom drop-shadow-2xl z-10"
                                />
                            </div>
                        </div>
                    </div>

                    {/* READY TO FIND YOUR PERFECT HOLIDAY CTA BANNER */}
                    <div className="relative rounded-2xl sm:rounded-3xl bg-[#071746] py-6 sm:py-8 px-6 sm:px-10 lg:px-12 overflow-hidden shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 z-10">
                        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
                            <svg className="w-full h-full" viewBox="0 0 1000 150" fill="none" preserveAspectRatio="none">
                                <path d="M-50,75 Q250,140 500,75 T1050,75" stroke="white" strokeWidth="2" strokeDasharray="6 6" />
                            </svg>
                        </div>

                        <div className="relative z-10 flex items-center gap-4 text-center md:text-left">
                            <FaPlane className="text-white/40 text-xl sm:text-2xl transform -rotate-45 hidden sm:block" />
                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white tracking-wide">
                                Ready to find your{" "}
                                <span className="font-serif italic font-normal text-2xl sm:text-3xl lg:text-4xl text-white">
                                    perfect holiday?
                                </span>
                            </h3>
                        </div>

                        <div className="relative z-10 shrink-0">
                            <Link
                                href="/holidays"
                                className="inline-flex items-center gap-3 rounded-full bg-[#F7941D] px-7 sm:px-9 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-white shadow-md hover:bg-[#e08316] transition-all duration-300 transform hover:scale-105"
                            >
                                Explore Holidays
                                <FaArrowRight className="text-xs sm:text-sm" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 10: NEWSLETTER EMAIL SUBSCRIPTION */}
            <section className="bg-[#071746] py-8 sm:py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12">
                    <div className="text-left w-full lg:w-auto">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#F7941D] tracking-wide">
                            Let&apos;s plan your perfect holiday
                        </h3>
                        <p className="text-xs sm:text-sm lg:text-base font-normal text-white mt-1.5 leading-relaxed">
                            Get exclusive deals, travel inspiration and holiday tips straight to your inbox.
                        </p>
                    </div>

                    <div className="w-full lg:w-auto lg:min-w-[480px] xl:min-w-[540px]">
                        {submitted ? (
                            <div className="bg-white/10 border border-[#F7941D] text-white rounded-full px-6 py-3 text-sm sm:text-base font-semibold text-center animate-fade-in">
                                ✓ Thank you for subscribing to HolidayJug!
                            </div>
                        ) : (
                            <form
                                onSubmit={handleSubscribe}
                                className="relative flex items-center bg-white rounded-full p-1 sm:p-1.5 shadow-lg w-full"
                            >
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    required
                                    className="w-full bg-transparent px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm lg:text-base text-gray-800 placeholder-gray-400 focus:outline-none rounded-full"
                                />
                                <button
                                    type="submit"
                                    className="shrink-0 bg-[#F7941D] hover:bg-[#e08316] text-white font-semibold text-xs sm:text-sm lg:text-base px-6 sm:px-9 py-2.5 sm:py-3.5 rounded-full shadow-md transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
                                >
                                    Subscribe
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
