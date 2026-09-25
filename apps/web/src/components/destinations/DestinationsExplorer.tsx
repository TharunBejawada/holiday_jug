"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
    DestinationsFilterSidebar,
    EMPTY_FILTERS,
    DEFAULT_MAX_BUDGET,
    type DestinationFilters,
    type HolidayTypeOption,
} from "./DestinationsFilterSidebar";
import { PopularDestinationsGrid } from "./PopularDestinationsGrid";
import { HolidayStyleSection, type HolidayTypeApiItem } from "./HolidayStyleSection";
import { TrendingDestinationsGrid } from "./TrendingDestinationsGrid";
import { DreamToDepartureSection } from "./DreamToDepartureSection";
import { FaqSection } from "./FaqSection";

export interface DestinationApiItem {
    id: string;
    name: string;
    slug: string;
    priceFrom?: number | null;
    cardImageUrl?: string | null;
    heroImageUrl?: string | null;
    href: string;
    featuredOnOverview?: boolean;
    sortOrder?: number;
    description?: string;
    region?: string;
    flightTimeBand?: string;
    bestFor?: string[];
    holidayTypes?: string[];
}

export function DestinationsExplorer() {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("search")?.toLowerCase().trim() ?? "";
    const holidayTypeParam = searchParams.get("holidayType");

    const [destinations, setDestinations] = useState<DestinationApiItem[]>([]);
    const [holidayTypes, setHolidayTypes] = useState<HolidayTypeApiItem[]>([]);
    const [loadingDestinations, setLoadingDestinations] = useState(true);
    const [loadingHolidayTypes, setLoadingHolidayTypes] = useState(true);
    const [filters, setFilters] = useState<DestinationFilters>({
        ...EMPTY_FILTERS,
        holidayTypes: holidayTypeParam ? [holidayTypeParam] : [],
    });

    useEffect(() => {
        let isMounted = true;

        fetch("/api/destinations", { cache: "no-store" })
            .then((res) => (res.ok ? res.json() : { items: [] }))
            .then((data) => {
                if (isMounted) setDestinations(Array.isArray(data?.items) ? data.items : []);
            })
            .catch(() => { })
            .finally(() => {
                if (isMounted) setLoadingDestinations(false);
            });

        fetch("/api/holiday-types", { cache: "no-store" })
            .then((res) => (res.ok ? res.json() : { items: [] }))
            .then((data) => {
                if (isMounted) setHolidayTypes(Array.isArray(data?.items) ? data.items : []);
            })
            .catch(() => { })
            .finally(() => {
                if (isMounted) setLoadingHolidayTypes(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const holidayTypeOptions: HolidayTypeOption[] = useMemo(
        () => holidayTypes.map((ht) => ({ slug: ht.slug, name: ht.name })),
        [holidayTypes]
    );

    const filteredDestinations = useMemo(() => {
        return destinations.filter((item) => {
            if (searchQuery && !item.name.toLowerCase().includes(searchQuery)) return false;
            if (filters.holidayTypes.length > 0) {
                const itemTypes = item.holidayTypes ?? [];
                if (!filters.holidayTypes.some((t) => itemTypes.includes(t))) return false;
            }
            if (filters.regions.length > 0 && !(item.region && filters.regions.includes(item.region))) return false;
            if (filters.bestFor.length > 0) {
                const itemBestFor = item.bestFor ?? [];
                if (!filters.bestFor.some((tag) => itemBestFor.includes(tag))) return false;
            }
            if (
                filters.flightTimeBands.length > 0 &&
                !(item.flightTimeBand && filters.flightTimeBands.includes(item.flightTimeBand))
            )
                return false;
            if (filters.maxBudget < DEFAULT_MAX_BUDGET && (item.priceFrom ?? 0) > filters.maxBudget) return false;
            return true;
        });
    }, [destinations, filters, searchQuery]);

    return (
        <section className="py-10 sm:py-14 lg:py-16 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* 1. Trending Now Section (Top 6 Destinations based on sort order) */}
                <TrendingDestinationsGrid items={destinations} loading={loadingDestinations} />

                {/* 2. Explore All Destinations Heading */}
                <div className="mb-8 sm:mb-10">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 sm:w-10 h-[3px] bg-[#F7941D] rounded-full" />
                        <span className="text-xs sm:text-sm font-bold tracking-widest text-[#1D1248] uppercase">
                            Explore All Destinations
                        </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1D1248] ">
                        Find a destination that matches the way you want to travel.
                    </h2>
                </div>

                {/* 3. Sidebar + Popular Destinations Grid + Holiday Style Section */}
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    <DestinationsFilterSidebar
                        holidayTypeOptions={holidayTypeOptions}
                        filters={filters}
                        onChange={setFilters}
                    />

                    <div className="flex-1 min-w-0 space-y-10 sm:space-y-14">
                        <div>
                            <h3 className="text-xs sm:text-sm font-bold text-[#1D1248] uppercase tracking-wide mb-5">
                                Popular Holiday Destinations
                            </h3>
                            <PopularDestinationsGrid items={filteredDestinations} loading={loadingDestinations} />
                        </div>

                        <HolidayStyleSection items={holidayTypes} loading={loadingHolidayTypes} />
                    </div>
                </div>

                {/* 4. From Dream to Departure Banner Section */}
                <DreamToDepartureSection />

                {/* 5. Frequently Asked Questions Accordion Section */}
                <FaqSection />
            </div>
        </section>
    );
}
