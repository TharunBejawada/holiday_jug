import { NextRequest, NextResponse } from "next/server";
import { getSearchRecord, formatUkTime, calculateTimeGap } from "@/lib/search-id";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchId = url.searchParams.get("searchId");

    if (!searchId) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid Search ID." },
        { status: 400 }
      );
    }

    const record = getSearchRecord(searchId);

    if (!record) {
      return NextResponse.json(
        {
          success: false,
          error: `Search ID "${searchId.toUpperCase().trim()}" is invalid or has expired (searches are kept for 30 days).`,
        },
        { status: 404 }
      );
    }

    const currentUkTime = formatUkTime(new Date());
    const gap = calculateTimeGap(record.searchGeneratedAtIso, new Date().toISOString());

    return NextResponse.json({
      success: true,
      record: {
        searchId: record.searchId,
        customerSearch: record.customerSearch,
        selectedOption: record.selectedOption,
        customerPricing: record.customerPricing,
        timestamps: {
          searchGeneratedAtUk: record.searchGeneratedAtUk,
          priceFetchedAtUk: record.internalAudit.priceFetchedAtUk,
          currentUkTime,
          timeGapFormatted: gap.formatted,
          gapHours: gap.hours,
          gapMinutes: gap.minutes,
        },
        internalAudit: {
          supplierCostGbp: record.internalAudit.supplierCostGbp,
          supplierCostInr: record.internalAudit.supplierCostInr,
          marginRateUsed: `${(record.internalAudit.marginRate * 100).toFixed(1)}%`,
          currencyRateUsed: record.internalAudit.currencyRate,
        },
      },
    });
  } catch (error: any) {
    console.error("Agent Lookup API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to lookup search record" },
      { status: 500 }
    );
  }
}
