import { NextResponse } from "next/server";
import { getApiCreditAndCacheStats, INDEXED_SANDBOX_HOTELS } from "@/lib/grn-client";
import { listAllSearchRecords } from "@/lib/search-id";
import { getAllHotDealsSlidesForAdmin } from "@/lib/hot-deals-store";
import { DESTINATIONS_MASTER } from "@/lib/destinations-master";
import { getPricingConfig } from "@/lib/pricing";

export const dynamic = "force-dynamic";

// Short 15s server-side cache for admin stats to strictly avoid duplicate calculations
let cachedStats: { data: any; expiresAt: number } | null = null;
const STATS_CACHE_TTL = 15 * 1000;

export async function GET() {
  const now = Date.now();
  if (cachedStats && now < cachedStats.expiresAt) {
    return NextResponse.json(cachedStats.data);
  }

  try {
    const apiCreditData = await getApiCreditAndCacheStats();
    const searchRecords = listAllSearchRecords(50);
    const hotDeals = getAllHotDealsSlidesForAdmin();
    const pricingConfig = getPricingConfig();

    // Group city counts from the 1,842 indexed sandbox hotels
    const cityCountMap: Record<string, { cityName: string; countryName: string; cityId: string; count: number }> = {};
    for (const h of INDEXED_SANDBOX_HOTELS) {
      const key = h.cityId;
      if (!cityCountMap[key]) {
        cityCountMap[key] = {
          cityName: h.cityName,
          countryName: h.countryName,
          cityId: h.cityId,
          count: 0,
        };
      }
      cityCountMap[key].count++;
    }

    const cityClusters = Object.values(cityCountMap).sort((a, b) => b.count - a.count);

    // Calculate totals from search records
    const todayStr = new Date().toISOString().split("T")[0];
    let totalQuoteVolumeGbp = 0;
    let totalMarginGeneratedGbp = 0;
    let todaySearchQuotes = 0;

    for (const r of searchRecords) {
      if (r.customerPricing?.totalPrice) {
        totalQuoteVolumeGbp += r.customerPricing.totalPrice;
        const estMargin = Math.max(0, r.customerPricing.totalPrice - (r.customerPricing.flightPrice || 0) - (r.customerPricing.localTax || 0) - (r.internalAudit?.supplierCostGbp || 0));
        totalMarginGeneratedGbp += estMargin;
      }
      if (r.searchGeneratedAtIso && r.searchGeneratedAtIso.startsWith(todayStr)) {
        todaySearchQuotes++;
      }
    }

    const responseData = {
      success: true,
      telemetry: {
        creditStatus: apiCreditData.creditStatus,
        totalCreditsAllocated: apiCreditData.totalCreditsAllocated,
        creditsUsed: apiCreditData.creditsUsed,
        creditsRemaining: apiCreditData.creditsRemaining,
        cachedSearchesCount: apiCreditData.cachedSearchesCount,
        totalCacheHits: apiCreditData.totalCacheHits,
        creditsSavedCount: apiCreditData.creditsSavedCount,
        apiBaseUrl: apiCreditData.apiBaseUrl,
        lastApiCallAt: apiCreditData.lastApiCallAt,
        totalIndexedHotels: INDEXED_SANDBOX_HOTELS.length,
        staticAssetFeed: "https://cdn.grnconnect.com/static-assets/",
        cacheEfficiencyPct:
          apiCreditData.totalCacheHits + apiCreditData.creditsUsed > 0
            ? Math.round(
                (apiCreditData.totalCacheHits /
                  (apiCreditData.totalCacheHits + Math.max(1, Math.round(apiCreditData.creditsUsed / 5)))) *
                  100
              )
            : 100,
      },
      metrics: {
        totalSearchQuotes: searchRecords.length,
        todaySearchQuotes,
        totalQuoteVolumeGbp: Math.round(totalQuoteVolumeGbp),
        totalMarginGeneratedGbp: Math.round(totalMarginGeneratedGbp),
        activeHotDealsCount: hotDeals.filter((d) => d.isActive).length,
        totalHotDealsCount: hotDeals.length,
        masterDestinationsCount: DESTINATIONS_MASTER.length,
        defaultHotelMarginPct: Math.round(pricingConfig.defaultHotelMargin * 100),
      },
      recentQuotes: searchRecords.slice(0, 10),
      cityClusters: cityClusters.slice(0, 10),
      cachedAt: new Date().toISOString(),
    };

    cachedStats = {
      data: responseData,
      expiresAt: now + STATS_CACHE_TTL,
    };

    return NextResponse.json(responseData);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
