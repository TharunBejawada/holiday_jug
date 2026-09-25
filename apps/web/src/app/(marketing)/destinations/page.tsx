import { Metadata } from "next";
import { Suspense } from "react";
import { DestinationsBanner } from "@/components/destinations/DestinationsBanner";
import { DestinationsExplorer } from "@/components/destinations/DestinationsExplorer";

export const metadata: Metadata = {
    title: "Destinations Overview | HolidayJug",
    description: "Explore incredible destinations around the world and find the perfect holiday that's right for you.",
};

export default function DestinationsPage() {
    return (
        <main className="min-h-screen bg-gray-50">
            {/* 1. Banner Section */}
            <DestinationsBanner />

            {/* 2. Trending Grid + Filter sidebar + Popular destinations grid + Holiday style section + Dream to Departure */}
            <Suspense fallback={null}>
                <DestinationsExplorer />
            </Suspense>
        </main>
    );
}
