"use client";

import Link from "next/link";
import type { DestinationApiItem } from "./DestinationsExplorer";

function DestinationCard({ item }: { item: DestinationApiItem }) {
    const formattedPrice = item.priceFrom ? `£${item.priceFrom}` : "£XXX";

    return (
        <Link
            href={item.href}
            className="group rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
        >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                {item.heroImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={item.heroImageUrl}
                        alt={item.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gray-200" />
                )}
            </div>
            <div className="p-4 sm:p-5">
                <h3 className="font-bold text-[#1D1248] text-base sm:text-lg mb-1">{item.name}</h3>
                {item.description && (
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description}</p>
                )}
                <p className="text-sm text-gray-700 mb-1">
                    From <span className="font-bold text-[#F7941D]">{formattedPrice}</span> pp
                </p>
                <span className="text-sm font-semibold text-[#1D1248] group-hover:underline">
                    Explore {item.name}
                </span>
            </div>
        </Link>
    );
}

export function PopularDestinationsGrid({ items, loading = false }: { items: DestinationApiItem[]; loading?: boolean }) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden bg-white border border-gray-100">
                        <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
                        <div className="p-4 sm:p-5 space-y-2">
                            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                            <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                            <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-gray-200 p-10 text-center bg-white">
                <p className="text-gray-500 text-sm">No destinations match your filters. Try clearing some.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => (
                <DestinationCard key={item.id} item={item} />
            ))}
        </div>
    );
}
