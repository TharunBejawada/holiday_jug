import { HeroSection } from "@/components/homepage/HeroSection";
import { CategorySection } from "@/components/homepage/CategorySection";
import { TopDestinationsSection } from "@/components/homepage/TopDestinationsSection";
import { DealsOfTheWeekSection } from "@/components/homepage/DealsOfTheWeekSection";
import { StaysSection } from "@/components/homepage/StaysSection";
import { HomeBottomSections } from "@/components/homepage/HomeBottomSections";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Banner & Search Overlay */}
      <HeroSection />

      {/* Category Quick Cards */}
      <CategorySection />

      {/* Top Destinations */}
      <TopDestinationsSection />

      {/* Deals Of The Week Banner */}
      <DealsOfTheWeekSection />

      {/* Stays For Every Kind Of Holiday */}
      <StaysSection />

      {/* Homepage Banners, Why Choose & Newsletter Sections */}
      <HomeBottomSections />
    </main>
  );
}
