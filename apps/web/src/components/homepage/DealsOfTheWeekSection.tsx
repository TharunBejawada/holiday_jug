"use client";

import Link from "next/link";

export function DealsOfTheWeekSection() {
    return (
        <section className="bg-white py-4 sm:py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Link
                    href="/deals/of-the-week"
                    className="group block relative w-full rounded-3xl border border-gray-100/90 shadow-md hover:shadow-xl bg-white overflow-hidden transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
                >
                    <div className="flex flex-col md:flex-row items-center h-auto md:h-44">
                        {/* LEFT DARK NAVY BADGE BLOCK */}
                        <div className="relative bg-[#071746] text-white flex flex-col justify-center px-8 sm:px-10 py-6 md:py-0 h-full w-full md:w-[270px] lg:w-[290px] shrink-0 md:rounded-r-[4.5rem] z-20">
                            <div className="flex flex-col leading-none">
                                <span className="text-3xl lg:text-[34px] font-semibold tracking-wide text-white uppercase">
                                    DEALS
                                </span>
                                <span className="text-xs font-semibold text-[#F7941D] tracking-widest uppercase my-1">
                                    OF THE
                                </span>
                                <span className="text-3xl lg:text-[34px] font-semibold tracking-wide text-white uppercase">
                                    WEEK
                                </span>
                            </div>
                        </div>

                        {/* MIDDLE TEXT CONTENT */}
                        <div className="flex-1 flex flex-col justify-center px-6 lg:px-8 py-4 sm:py-5 z-10 bg-white">
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#1D1248] tracking-tight mb-1.5 group-hover:text-[#F7941D] transition-colors">
                                Get away with a September steal
                            </h3>
                            <p className="text-xs sm:text-sm lg:text-[15px] font-semibold text-[#1D1248]/85 leading-relaxed max-w-lg">
                                This week&apos;s top offers are putting September in the Spotlight. Tap to find a holiday you love at a price you love even more!
                            </p>
                        </div>

                        {/* RIGHT SIDE IMAGE WITH SMOOTH WHITE GRADIENT FADE */}
                        <div className="w-full md:w-[36%] lg:w-[38%] h-44 sm:h-48 md:h-full relative overflow-hidden shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/assets/Deals_of_the_week.jpg"
                                alt="Get away with a September steal"
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                            />
                            {/* Soft gradient fade on left edge of the image */}
                            <div className="hidden md:block absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none" />
                        </div>
                    </div>
                </Link>
            </div>
        </section>
    );
}
