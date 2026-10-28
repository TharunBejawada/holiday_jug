import { NextRequest, NextResponse } from "next/server";
import { getSearchRecord, formatUkTime, calculateTimeGap } from "@/lib/search-id";
import { searchGrnHotels } from "@/lib/grn-client";
import { roundUpPenny } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const searchId = body.searchId;

    if (!searchId) {
      return NextResponse.json({ success: false, error: "Search ID is required" }, { status: 400 });
    }

    const record = getSearchRecord(searchId);
    if (!record) {
      return NextResponse.json(
        { success: false, error: `Search ID "${searchId}" was not found or has expired.` },
        { status: 404 }
      );
    }

    const { customerSearch, selectedOption, customerPricing } = record;
    const flightFareGbp = selectedOption.flightDetails?.flightPriceGbp || 0;

    // Re-run live search with supplier (Section 8 A6)
    const liveResults = await searchGrnHotels(
      {
        hotelCodes: [selectedOption.hotelCode],
        checkIn: customerSearch.checkIn,
        checkOut: customerSearch.checkOut,
        rooms: customerSearch.rooms,
        clientNationality: "GB",
      },
      flightFareGbp
    );

    const liveHotel = liveResults[0];
    const liveMatchingRate =
      liveHotel?.availableRates.find((r) => r.boardBasis === selectedOption.boardBasis) ||
      liveHotel?.availableRates[0];

    const currentUkTime = formatUkTime(new Date());

    if (!liveHotel || !liveMatchingRate) {
      return NextResponse.json({
        success: true,
        searchId: record.searchId,
        isAvailable: false,
        message: "No live inventory currently returned by supplier for these exact dates/room. Offer alternative dates or hotel to customer.",
        customerOriginalPrice: customerPricing.totalPrice,
        checkedAtUk: currentUkTime,
      });
    }

    const liveTotalPrice = liveMatchingRate.customerPricing.totalPrice;
    const customerOriginalPrice = customerPricing.totalPrice;
    const diff = roundUpPenny(liveTotalPrice - customerOriginalPrice);

    return NextResponse.json({
      success: true,
      searchId: record.searchId,
      isAvailable: true,
      checkedAtUk: currentUkTime,
      comparison: {
        customerOriginalPrice,
        livePrice: liveTotalPrice,
        difference: Math.abs(diff),
        differenceSigned: diff,
        isPriceChanged: Math.abs(diff) > 0.01,
        direction: diff > 0 ? "INCREASED" : diff < 0 ? "DECREASED" : "UNCHANGED",
        explanation:
          diff > 0
            ? `Live supplier rate has increased by £${diff.toFixed(2)}. Inform customer of the updated rate before confirming booking.`
            : diff < 0
            ? `Live supplier rate has decreased by £${Math.abs(diff).toFixed(2)}! Great news to share with the customer.`
            : `Price is unchanged! Exactly matches what the customer was quoted (£${customerOriginalPrice.toFixed(2)}).`,
      },
      liveBreakdown: {
        hotelPrice: liveMatchingRate.customerPricing.hotelPrice,
        localTax: liveMatchingRate.customerPricing.localTax,
        flightPrice: liveMatchingRate.customerPricing.flightPrice,
        totalPrice: liveTotalPrice,
        currency: "GBP",
      },
    });
  } catch (error: any) {
    console.error("Agent Recheck API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to re-check live price" },
      { status: 500 }
    );
  }
}
