"use client";

import { useEffect, useState } from "react";

export interface HolidayTypeOption {
    slug: string;
    name: string;
}

export interface DestinationFilters {
    holidayTypes: string[];
    regions: string[];
    bestFor: string[];
    flightTimeBands: string[];
    maxBudget: number;
}

export const DEFAULT_MAX_BUDGET = 2000;

export const EMPTY_FILTERS: DestinationFilters = {
    holidayTypes: [],
    regions: [],
    bestFor: [],
    flightTimeBands: [],
    maxBudget: DEFAULT_MAX_BUDGET,
};

const REGION_OPTIONS = [
    { value: "EUROPE", label: "Europe" },
    { value: "MEDITERRANEAN", label: "Mediterranean" },
    { value: "MIDDLE_EAST", label: "Middle East" },
    { value: "INDIAN_OCEAN", label: "Indian Ocean" },
    { value: "ASIA", label: "Asia" },
    { value: "CARIBBEAN", label: "Caribbean" },
    { value: "AMERICAS", label: "Americas" },
];

const BEST_FOR_OPTIONS = [
    { value: "FAMILIES", label: "Families" },
    { value: "COUPLES", label: "Couples" },
    { value: "ADULTS_ONLY", label: "Adults Only" },
    { value: "LUXURY", label: "Luxury" },
    { value: "ADVENTURE", label: "Adventure" },
    { value: "RELAXATION", label: "Relaxation" },
];

const FLIGHT_TIME_OPTIONS = [
    { value: "UNDER_4H", label: "Under 4 hours" },
    { value: "FOUR_TO_SIX_H", label: "4–6 hours" },
    { value: "SIX_TO_TEN_H", label: "6–10 hours" },
    { value: "TEN_PLUS_H", label: "10+ hours" },
];

function FilterCheckboxGroup({
    title,
    options,
    selected,
    onToggle,
}: {
    title: string;
    options: { value: string; label: string }[];
    selected: string[];
    onToggle: (value: string) => void;
}) {
    return (
        <div className="py-5 border-b border-gray-100 last:border-b-0">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">{title}</h4>
            <div className="space-y-2.5">
                {options.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={selected.includes(opt.value)}
                            onChange={() => onToggle(opt.value)}
                            className="rounded border-gray-300 text-brand-600 focus:ring-brand-500 focus:ring-offset-0"
                        />
                        {opt.label}
                    </label>
                ))}
            </div>
        </div>
    );
}

export function DestinationsFilterSidebar({
    holidayTypeOptions,
    filters,
    onChange,
}: {
    holidayTypeOptions: HolidayTypeOption[];
    filters: DestinationFilters;
    onChange: (filters: DestinationFilters) => void;
}) {
    function toggleIn(key: "holidayTypes" | "regions" | "bestFor" | "flightTimeBands", value: string) {
        const current = filters[key];
        const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
        onChange({ ...filters, [key]: next });
    }

    // The budget slider only updates the applied filter once the user releases it —
    // dragging shouldn't hide/show destinations on every intermediate pixel.
    const [draftBudget, setDraftBudget] = useState(filters.maxBudget);

    useEffect(() => {
        setDraftBudget(filters.maxBudget);
    }, [filters.maxBudget]);

    function commitBudget() {
        if (draftBudget !== filters.maxBudget) onChange({ ...filters, maxBudget: draftBudget });
    }

    const hasActiveFilters =
        filters.holidayTypes.length > 0 ||
        filters.regions.length > 0 ||
        filters.bestFor.length > 0 ||
        filters.flightTimeBands.length > 0 ||
        filters.maxBudget < DEFAULT_MAX_BUDGET;

    return (
        <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:sticky lg:top-24">
                <div className="flex items-center justify-between mb-2 pb-4 border-b border-gray-100">
                    <h3 className="text-xs font-bold text-[#1D1248] uppercase tracking-wide">Filter Destinations</h3>
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={() => onChange(EMPTY_FILTERS)}
                            className="text-xs font-semibold text-brand-600 hover:underline"
                        >
                            Clear all
                        </button>
                    )}
                </div>

                {holidayTypeOptions.length > 0 && (
                    <FilterCheckboxGroup
                        title="Holiday Type"
                        options={holidayTypeOptions.map((ht) => ({ value: ht.slug, label: ht.name }))}
                        selected={filters.holidayTypes}
                        onToggle={(v) => toggleIn("holidayTypes", v)}
                    />
                )}

                <FilterCheckboxGroup
                    title="Region"
                    options={REGION_OPTIONS}
                    selected={filters.regions}
                    onToggle={(v) => toggleIn("regions", v)}
                />

                <div className="py-5 border-b border-gray-100">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Budget</h4>
                    <input
                        type="range"
                        min={500}
                        max={DEFAULT_MAX_BUDGET}
                        step={50}
                        value={draftBudget}
                        onChange={(e) => setDraftBudget(Number(e.target.value))}
                        onMouseUp={commitBudget}
                        onTouchEnd={commitBudget}
                        onKeyUp={commitBudget}
                        className="w-full accent-[#F7941D]"
                    />
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                        <span>Under £500</span>
                        <span>{draftBudget >= DEFAULT_MAX_BUDGET ? "£2,000+" : `£${draftBudget}`}</span>
                    </div>
                </div>

                <FilterCheckboxGroup
                    title="Best For"
                    options={BEST_FOR_OPTIONS}
                    selected={filters.bestFor}
                    onToggle={(v) => toggleIn("bestFor", v)}
                />

                <FilterCheckboxGroup
                    title="Travel Time"
                    options={FLIGHT_TIME_OPTIONS}
                    selected={filters.flightTimeBands}
                    onToggle={(v) => toggleIn("flightTimeBands", v)}
                />
            </div>
        </aside>
    );
}
