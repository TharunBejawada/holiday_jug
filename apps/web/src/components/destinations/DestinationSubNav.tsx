"use client";

import { useState } from "react";

export type DestinationTabId =
    | "overview"
    | "top-destinations"
    | "things-to-do"
    | "when-to-go"
    | "holiday-types"
    | "travel-guide";

interface TabItem {
    id: DestinationTabId;
    label: string;
}

const TABS: TabItem[] = [
    { id: "overview", label: "Overview" },
    { id: "top-destinations", label: "Top Destinations" },
    { id: "things-to-do", label: "Things to Do" },
    { id: "when-to-go", label: "When to Go" },
    { id: "holiday-types", label: "Holiday Types" },
    { id: "travel-guide", label: "Travel Guide" },
];

export function DestinationSubNav() {
    const [activeTab, setActiveTab] = useState<DestinationTabId>("overview");

    const handleTabClick = (tabId: DestinationTabId) => {
        setActiveTab(tabId);
        const element = document.getElementById(tabId);
        if (element) {
            const offset = 80;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-30 shadow-2xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav
                    className="flex items-center justify-center space-x-6 sm:space-x-10 lg:space-x-14 overflow-x-auto no-scrollbar py-1"
                    aria-label="Destination Sections"
                >
                    {TABS.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTabClick(tab.id)}
                                className={`py-4 text-sm sm:text-base font-semibold whitespace-nowrap transition-all duration-200 border-b-2 relative ${isActive
                                        ? "text-[#1D1248] border-[#F7941D] font-bold"
                                        : "text-gray-600 hover:text-[#1D1248] border-transparent"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
