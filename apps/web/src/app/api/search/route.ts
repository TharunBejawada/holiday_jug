import { NextRequest, NextResponse } from "next/server";
import { findDestination } from "@/lib/destinations-master";
import { searchGrnHotels } from "@/lib/grn-client";
import { generateSearchId, formatUkTime, formatUkTimeShort, saveSearchRecord, StoredSearchRecord } from "@/lib/search-id";
import { getPricingConfig } from "@/lib/pricing";

export const dynamic = "force-dynamic";

interface SearchPayload {
  type?: "holidays" | "hotels";
  destination?: string;
  departureAirport?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number | string;
  childrenAges?: number[];
  rooms?: { adults: number; childrenAges: number[] }[];
}

async function handleSearch(payload: SearchPayload) {
  const isHotelsOnly = payload.type === "hotels" || payload.departureAirport === "";
  const destinationInput = payload.destination || "dubai";
  const departureAirport = isHotelsOnly ? "" : (payload.departureAirport || "LGW");
  const checkIn = payload.checkIn || new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];
  const checkOut = payload.checkOut || new Date(Date.now() + 21 * 86400000).toISOString().split("T")[0];

  // Parse rooms & guests
  const rawRooms = Array.isArray(payload.rooms) && payload.rooms.length > 0 ? payload.rooms : [
    { adults: payload.adults ? Number(payload.adults) : 2, childrenAges: payload.childrenAges || [] }
  ];

  const rooms = rawRooms.map((r: any) => ({
    adults: Math.max(1, Math.min(9, Number(r.adults) || 2)),
    childrenAges: Array.isArray(r.childrenAges)
      ? r.childrenAges.map(Number).filter((age: number) => age >= 1 && age <= 17)
      : [],
  }));

  const totalAdults = rooms.reduce((acc: number, r: any) => acc + r.adults, 0);
  const totalChildren = rooms.reduce((acc: number, r: any) => acc + r.childrenAges.length, 0);

  // Calculate nights
  const nights = Math.max(
    1,
    Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
  );

  // Resolve mapped destination (D1, D2, A.4)
  const destinationItem = findDestination(destinationInput) || findDestination("dubai")!;

  // Flight fare simulation (Section 5: Live fare converted to GBP, zero margin added. 0 for Hotels Only)
  const flightFareGbp = isHotelsOnly ? 0 : 120;

  // Search GRN availability (Section 4 & 6)
  const hotels = await searchGrnHotels(
    {
      hotelCodes: destinationItem.featuredHotelCodes,
      checkIn,
      checkOut,
      rooms,
      clientNationality: "GB",
    },
    flightFareGbp
  );

  const now = new Date();
  const ukTimeNow = formatUkTime(now);
  const ukTimeShort = formatUkTimeShort(now);
  const pricingConfig = getPricingConfig();

  // Generate unique 8-character unguessable Search ID (S1)
  const searchId = generateSearchId();

  // Select lead hotel/option for the primary search record
  const leadHotel = hotels[0];
  const leadRate = leadHotel?.availableRates[0];

  if (leadHotel && leadRate) {
    // Create and save complete Search Record with internal audit (S3, S4, P6)
    const record: StoredSearchRecord = {
      searchId,
      customerSearch: {
        destination: destinationItem.slug,
        destinationName: destinationItem.destination,
        departureAirport,
        checkIn,
        checkOut,
        nights,
        rooms,
        totalAdults,
        totalChildren,
      },
      selectedOption: {
        hotelCode: leadHotel.hotelCode,
        hotelName: leadHotel.hotelName,
        roomType: leadRate.roomType,
        boardBasis: leadRate.boardBasis,
        starRating: leadHotel.starRating,
        address: leadHotel.address,
        imageUrl: leadHotel.mainImage,
        flightDetails: flightFareGbp > 0 ? {
          airline: "British Airways",
          flightNumber: "BA-214",
          departureTime: "08:15 LGW",
          returnTime: "17:30 LHR",
          flightPriceGbp: flightFareGbp,
        } : undefined,
      },
      customerPricing: {
        hotelPrice: leadRate.customerPricing.hotelPrice,
        localTax: leadRate.customerPricing.localTax,
        flightPrice: leadRate.customerPricing.flightPrice,
        transfersPrice: leadRate.customerPricing.transfersPrice,
        totalPrice: leadRate.customerPricing.totalPrice,
        pricePerPerson: leadRate.customerPricing.pricePerPerson,
        currency: "GBP",
      },
      internalAudit: {
        supplierCostInr: leadRate.serverCalculation.supplierCostInr,
        supplierCostGbp: leadRate.serverCalculation.supplierCostGbp,
        marginRate: leadRate.serverCalculation.marginRateUsed,
        currencyRate: leadRate.serverCalculation.currencyRateUsed,
        priceFetchedAtIso: now.toISOString(),
        priceFetchedAtUk: ukTimeNow,
      },
      searchGeneratedAtIso: now.toISOString(),
      searchGeneratedAtUk: ukTimeNow,
      expiresAtIso: new Date(now.getTime() + pricingConfig.recordRetentionDays * 24 * 60 * 60 * 1000).toISOString(),
    };

    saveSearchRecord(record);
  }

  // Return client-sanitized response (Strictly NEVER exposing supplier net price P5)
  return NextResponse.json({
    success: true,
    searchId,
    salesNumber: "0330 165 8879",
    salesMessage: "Quote this ID when you call us",
    priceCheckedAt: ukTimeShort,
    priceCheckedAtFullUk: ukTimeNow,
    searchDetails: {
      type: isHotelsOnly ? "hotels" : "holidays",
      isHotelsOnly,
      destination: destinationItem.destination,
      country: destinationItem.country,
      departureAirport,
      checkIn,
      checkOut,
      nights,
      rooms,
      totalAdults,
      totalChildren,
    },
    hotels,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return await handleSearch(body);
  } catch (error: any) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to search hotels" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const type = (url.searchParams.get("type") as "holidays" | "hotels") || undefined;
    const destination = url.searchParams.get("destination") || undefined;
    const departureAirport = url.searchParams.get("departureAirport") || undefined;
    const checkIn = url.searchParams.get("checkIn") || undefined;
    const checkOut = url.searchParams.get("checkOut") || undefined;
    const adults = url.searchParams.get("adults") ? Number(url.searchParams.get("adults")) : undefined;

    return await handleSearch({ type, destination, departureAirport, checkIn, checkOut, adults });
  } catch (error: any) {
    console.error("Search API GET Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to search hotels" },
      { status: 500 }
    );
  }
}
