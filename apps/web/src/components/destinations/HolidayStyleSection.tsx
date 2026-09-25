"use client";

import Link from "next/link";

export interface HolidayTypeApiItem {
    id: string;
    slug: string;
    name: string;
    iconUrl?: string | null;
    description?: string | null;
}

export const DEFAULT_HOLIDAY_STYLES: HolidayTypeApiItem[] = [
    {
        id: "beach-escapes",
        slug: "beach-escapes",
        name: "Beach Escapes",
        description: "Sun, sea and sand. Sun...",
        iconUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    },
    {
        id: "all-inclusive",
        slug: "all-inclusive",
        name: "All-Inclusive",
        description: "Relax with everything taken care of.",
        iconUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    },
    {
        id: "family-holidays",
        slug: "family-holidays",
        name: "Family Holidays",
        description: "Fun-filled breaks for everyone.",
        iconUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80",
    },
    {
        id: "luxury-getaways",
        slug: "luxury-getaways",
        name: "Luxury Getaways",
        description: "Beautiful stays and exceptional experiences.",
        iconUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    },
    {
        id: "couple-getaways",
        slug: "couple-getaways",
        name: "Couple Getaways",
        description: "Make memories together.",
        iconUrl: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80",
    },
    {
        id: "last-minute-escapes",
        slug: "last-minute-escapes",
        name: "Last-Minute Escapes",
        description: "Spontaneous holidays at great prices.",
        iconUrl: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=800&q=80",
    },
];

export function HolidayStyleSection({
    items,
    loading = false,
}: {
    items: HolidayTypeApiItem[];
    loading?: boolean;
}) {
    const displayItems = items && items.length > 0 ? items : DEFAULT_HOLIDAY_STYLES;

    return (
        <div className="rounded-3xl bg-[#f8fafc] border border-gray-100 p-6 sm:p-8">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 sm:w-10 h-[3.5px] bg-[#F7941D] rounded-full" />
                    <span className="text-xs sm:text-sm font-bold tracking-widest text-[#1D1248] uppercase">
                        FIND YOUR PERFECT HOLIDAY STYLE
                    </span>
                </div>

                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#1D1248] ">
                    Wherever you go, make it your kind of holiday.
                </h2>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
                {(loading ? Array.from({ length: 6 }) : displayItems).map((item, idx) => {
                    const holidayType = item as HolidayTypeApiItem | undefined;
                    return (
                        <Link
                            key={holidayType?.id ?? idx}
                            href={holidayType ? `/destinations?holidayType=${holidayType.slug}` : "#"}
                            className="group flex flex-col text-left gap-2"
                        >
                            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200 shadow-sm group-hover:shadow-md transition-all duration-300">
                                {holidayType?.iconUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={holidayType.iconUrl}
                                        alt={holidayType.name}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                                )}
                            </div>

                            <div className="mt-0.5 space-y-0.5">
                                <h3 className="text-sm sm:text-base font-bold text-[#1D1248] leading-snug group-hover:text-[#F7941D] transition-colors">
                                    {holidayType?.name ?? ""}
                                </h3>
                                {holidayType?.description && (
                                    <p className="text-xs text-gray-500 font-normal line-clamp-2 leading-relaxed">
                                        {holidayType.description}
                                    </p>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
