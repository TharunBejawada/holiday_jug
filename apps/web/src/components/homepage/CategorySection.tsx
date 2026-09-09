"use client";

import Link from "next/link";
import {
    FaUmbrellaBeach,
    FaUsers,
    FaHeart,
    FaCrown,
    FaRing,
    FaSuitcaseRolling,
} from "react-icons/fa";

interface CategoryItem {
    id: string;
    title: string;
    href: string;
    icon: React.ReactNode;
}

const categories: CategoryItem[] = [
    {
        id: "beach",
        title: "Beach Holidays",
        href: "/holidays?type=beach",
        icon: <FaUmbrellaBeach className="text-4xl sm:text-5xl" />,
    },
    {
        id: "family",
        title: "Family Holidays",
        href: "/holidays?type=family",
        icon: <FaUsers className="text-4xl sm:text-5xl" />,
    },
    {
        id: "couple",
        title: "Couple Getaways",
        href: "/holidays?type=couple",
        icon: <FaHeart className="text-4xl sm:text-5xl" />,
    },
    {
        id: "luxury",
        title: "Luxury Holidays",
        href: "/holidays?type=luxury",
        icon: <FaCrown className="text-4xl sm:text-5xl" />,
    },
    {
        id: "honeymoon",
        title: "Honeymoon",
        href: "/holidays?type=honeymoon",
        icon: <FaRing className="text-4xl sm:text-5xl" />,
    },
    {
        id: "last-minute",
        title: "Last-Minute Deals",
        href: "/deals/last-minute",
        icon: <FaSuitcaseRolling className="text-4xl sm:text-5xl" />,
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
                            <div className="text-[#1D1248] group-hover:text-white transition-colors duration-300">
                                {cat.icon}
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
