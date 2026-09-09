"use client";

import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

interface DestinationItem {
    id: string;
    name: string;
    price: string;
    image: string;
    href: string;
}

const destinations: DestinationItem[] = [
    {
        id: "spain",
        name: "Spain",
        price: "£145",
        image: "/assets/Tenerife.jpg",
        href: "/destinations/spain",
    },
    {
        id: "turkey",
        name: "Turkey",
        price: "£95",
        image: "/assets/Antalya.jpg",
        href: "/destinations/turkey",
    },
    {
        id: "greece",
        name: "Greece",
        price: "£382",
        image: "/assets/Santorini.jpg",
        href: "/destinations/greece",
    },
    {
        id: "dubai",
        name: "Dubai & Ras Al Khaimah",
        price: "£516",
        image: "/assets/Dubai.jpg",
        href: "/destinations/dubai",
    },
    {
        id: "florida",
        name: "Florida",
        price: "£449",
        image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80",
        href: "/destinations/florida",
    },
    {
        id: "mexico",
        name: "Mexico",
        price: "£778",
        image: "https://images.unsplash.com/photo-1512813195386-6cf811ad3542?auto=format&fit=crop&w=800&q=80",
        href: "/destinations/mexico",
    },
    {
        id: "mauritius",
        name: "Mauritius",
        price: "£791",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
        href: "/destinations/mauritius",
    },
    {
        id: "egypt",
        name: "Egypt",
        price: "£268",
        image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80",
        href: "/destinations/egypt",
    },
];

export function TopDestinationsSection() {
    return (
        <section className="bg-gray-50/50 py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* SECTION HEADER */}
                <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
                    <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#1D1248] uppercase">
                        EXPLORE THE WORLD
                    </span>
                    <h2 className="mt-1.5 text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#F7941D]">
                        Top Destinations
                    </h2>
                    <p className="mt-2 text-sm sm:text-base text-gray-500 font-medium">
                        choose from thousands of worldwide holidays
                    </p>
                </div>

                {/* DESTINATIONS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                    {destinations.map((dest) => (
                        <Link
                            key={dest.id}
                            href={dest.href}
                            className="group relative overflow-hidden rounded-3xl h-56 sm:h-60 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer block"
                        >
                            {/* BACKGROUND IMAGE */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={dest.image}
                                alt={dest.name}
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            />

                            {/* GRADIENT OVERLAY */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                            {/* BOTTOM CONTENT */}
                            <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-4 flex items-end justify-between gap-2">
                                {/* DESTINATION NAME */}
                                <span className="text-base sm:text-lg lg:text-xl font-semibold text-white leading-tight drop-shadow-md max-w-[50%]">
                                    {dest.name}
                                </span>

                                {/* PRICE BADGE BOX */}
                                <div className="bg-white/95 backdrop-blur-xs rounded-2xl px-3 py-2 flex items-center gap-2.5 shadow-lg border border-white/50">
                                    <div className="flex flex-col text-left leading-none">
                                        <span className="text-[10px] text-gray-500 font-medium mb-0.5">from</span>
                                        <span className="text-base sm:text-lg font-semibold text-[#1D1248]">
                                            {dest.price}
                                        </span>
                                        <span className="text-[9px] text-gray-400 font-medium mt-0.5">per person</span>
                                    </div>
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F7941D] text-white flex items-center justify-center text-xs group-hover:translate-x-1 transition-transform shadow-xs">
                                        <FaArrowRight />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* BOTTOM ACTION BUTTON */}
                <div className="mt-10 sm:mt-12 text-center">
                    <Link
                        href="/destinations"
                        className="inline-block rounded-full bg-[#F7941D] hover:bg-[#e08314] active:scale-[0.98] px-8 py-3.5 text-sm sm:text-base font-semibold text-white transition-all shadow-md hover:shadow-lg"
                    >
                        view all destinations
                    </Link>
                </div>
            </div>
        </section>
    );
}
