"use client";

import Link from "next/link";
import Image from "next/image";

interface CategoryItem {
    id: string;
    title: string;
    href: string;
    icon: string;
}

const categories: CategoryItem[] = [
    {
        id: "beach",
        title: "Beach Holidays",
        href: "/holidays?type=beach",
        icon: "/assets/HOME PAGE/ICONS/beach_holiday.png",
    },
    {
        id: "family",
        title: "Family Holidays",
        href: "/holidays?type=family",
        icon: "/assets/HOME PAGE/ICONS/Family Holidays.png",
    },
    {
        id: "couple",
        title: "Couple Getaways",
        href: "/holidays?type=couple",
        icon: "/assets/HOME PAGE/ICONS/Couple Gateways.png",
    },
    {
        id: "luxury",
        title: "Luxury Holidays",
        href: "/holidays?type=luxury",
        icon: "/assets/HOME PAGE/ICONS/Luxury Holidays.png",
    },
    {
        id: "honeymoon",
        title: "Honeymoon",
        href: "/holidays?type=honeymoon",
        icon: "/assets/HOME PAGE/ICONS/Honeymoon.png",
    },
    {
        id: "last-minute",
        title: "Last-Minute Deals",
        href: "/holidays?type=last-minute",
        icon: "/assets/HOME PAGE/ICONS/Last Minute Deals.png",
    },
];

export function CategorySection() {
    return (
        <section className="bg-white py-10 sm:py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={cat.href}
                            className="group cursor-pointer rounded-2xl bg-white p-5 sm:p-6 shadow-md hover:shadow-xl border border-gray-100 flex flex-col items-center justify-center text-center gap-4 transition-all duration-300 hover:bg-[#F7941D] hover:-translate-y-1.5"
                        >
                            {/* ICON WRAPPER */}
                            <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                                <Image
                                    src={cat.icon}
                                    alt={cat.title}
                                    width={56}
                                    height={56}
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            {/* TITLE */}
                            <span className="text-sm sm:text-base font-semibold text-[#1D1248] group-hover:text-white transition-colors duration-300 leading-snug">
                                {cat.title}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
