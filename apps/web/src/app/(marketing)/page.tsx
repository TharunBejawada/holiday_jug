import { HeroSection } from "@/components/homepage/HeroSection";
import { CategorySection } from "@/components/homepage/CategorySection";
import { TopDestinationsSection } from "@/components/homepage/TopDestinationsSection";
import { HotDealsBanner } from "@/components/homepage/HotDealsBanner";
import { StaysSection } from "@/components/homepage/StaysSection";
import { HomeBottomSections } from "@/components/homepage/HomeBottomSections";
import { CallForHiddenPricesModal } from "@/components/CallForHiddenPricesModal";
import { CallForHiddenPricesBanner } from "@/components/CallForHiddenPricesBanner";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Figma Exit-Intent & Time-Delayed Modal (G2) */}
      <CallForHiddenPricesModal />

      {/* Hero Banner & Search Overlay with Appendix A inputs (D3) */}
      <HeroSection />

      {/* Category Quick Cards */}
      <CategorySection />

      {/* Top Destinations */}
      <TopDestinationsSection />

      {/* Section 3 H1 & H2: Removed old Deals section; Replaced with one "Hot Deals" scrolling carousel banner */}
      <HotDealsBanner />

      {/* Inline Call For Hidden Prices Banner (G2) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CallForHiddenPricesBanner variant="inline" />
      </div>

      {/* Stays For Every Kind Of Holiday (G3: real prices, no placeholders) */}
      <StaysSection />

      {/* Homepage Banners, Why Choose & Newsletter Sections */}
      <HomeBottomSections />
    </main>
  );
}
