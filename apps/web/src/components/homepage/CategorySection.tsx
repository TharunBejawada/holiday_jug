"use client";

import Link from "next/link";
import Image from "next/image";

interface CategoryItem {
    id: string;
    title: string;
    href?: string;
    icon: string;
    isLink?: boolean;
}

const categories: CategoryItem[] = [
    {
        id: "hotels-only",
        title: "Hotels Only",
        href: "/hotels",
        icon: "/assets/HOME PAGE/ICONS/hotels_only.png",
        isLink: true,
    },
    {
        id: "beach",
        title: "Beach Holidays",
        icon: "/assets/HOME PAGE/ICONS/beach_holiday.png",
    },
    {
        id: "family",
        title: "Family Holidays",
        icon: "/assets/HOME PAGE/ICONS/Family Holidays.png",
    },
    {
        id: "couple",
        title: "Couple Getaways",
        icon: "/assets/HOME PAGE/ICONS/Couple Gateways.png",
    },
    {
        id: "luxury",
        title: "Luxury Holidays",
        icon: "/assets/HOME PAGE/ICONS/Luxury Holidays.png",
    },
    {
        id: "honeymoon",
        title: "Honeymoon",
        icon: "/assets/HOME PAGE/ICONS/Honeymoon.png",
    },
    {
        id: "last-minute",
        title: "Last-Minute Deals",
        icon: "/assets/HOME PAGE/ICONS/Last Minute Deals.png",
    },
];

export function CategorySection() {
    return (
        <section className="bg-white py-10 sm:py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-5">
                    {categories.map((cat) => {
                        const cardClasses =
                            "group cursor-pointer rounded-2xl bg-white p-4 sm:p-5 shadow-md hover:shadow-xl border border-gray-100 flex flex-col items-center justify-center text-center gap-3.5 transition-all duration-300 hover:bg-[#F7941D] hover:-translate-y-1.5 min-h-[140px] sm:min-h-[155px]";

                        const innerContent = (
                            <>
                                {/* ICON WRAPPER */}
                                <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                                    <Image
                                        src={cat.icon}
                                        alt={cat.title}
                                        width={56}
                                        height={56}
                                        className="w-full h-full object-contain transition-all duration-300 group-hover:brightness-0 group-hover:invert"
                                    />
                                </div>

                                {/* TITLE */}
                                <span className="text-xs sm:text-sm font-semibold text-[#1D1248] group-hover:text-white transition-colors duration-300 leading-snug">
                                    {cat.title}
                                </span>
                            </>
                        );

                        if (cat.isLink && cat.href) {
                            return (
                                <Link key={cat.id} href={cat.href} className={cardClasses}>
                                    {innerContent}
                                </Link>
                            );
                        }

                        return (
                            <div key={cat.id} className={cardClasses}>
                                {innerContent}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
