import { Metadata } from "next";
import { DestinationsBanner } from "@/components/destinations/DestinationsBanner";
import { TrendingDestinationsSection } from "@/components/destinations/TrendingDestinationsSection";

export const metadata: Metadata = {
    title: "Destinations Overview | HolidayJug",
    description: "Explore incredible destinations around the world and find the perfect holiday that's right for you.",
};

export default function DestinationsPage() {
    return (
        <main className="min-h-screen bg-gray-50">
            {/* 1. Banner Section */}
            <DestinationsBanner />

            {/* 2. Trending Destinations Section */}
            <TrendingDestinationsSection />
        </main>
    );
}
