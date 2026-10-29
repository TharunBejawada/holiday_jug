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
  hotelCode?: string; // Optional single hotel availability check
  checkIn?: string;
  checkOut?: string;
  adults?: number | string;
  childrenAges?: number[];
  rooms?: { adults: number; childrenAges: number[] }[];
}

async function handleSearch(payload: SearchPayload) {
  // RULE: The search and availability API is strictly for HOTELS ONLY.
  // Holidays data is not yet integrated into the live API.
  if (payload.type === "holidays") {
    return NextResponse.json({
      success: false,
      isHolidays: true,
      hotels: [],
      message:
        "Holiday flight + hotel packages are coming soon! We are actively integrating live airline inventory. For custom holiday quotes, please contact our travel advisors.",
    });
  }

  const destinationInput = (payload.destination || "all").toLowerCase().trim();
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

  // Resolve mapped destination or default to curated worldwide featured hotels
  let destinationName = "Featured Worldwide";
  let countryName = "Top Destinations";
  let destinationSlug = "all";
  let hotelCodesToSearch: string[] = [];

  if (payload.hotelCode) {
    hotelCodesToSearch = [payload.hotelCode];
    const item = findDestination(destinationInput);
    if (item) {
      destinationName = item.destination;
      countryName = item.country;
      destinationSlug = item.slug;
    }
  } else if (!destinationInput || destinationInput === "all" || destinationInput === "featured") {
    // Show a curated selection of "few hotels" across diverse top destinations on overview
    hotelCodesToSearch = [
      "1848131", // Sheraton Dubai Creek (Dubai, UAE)
      "TR-ANT-01", // Antalya Riviera Luxury Palace (Antalya, Turkey)
      "GR-SAN-01", // Santorini Caldera View Suites (Santorini, Greece)
      "ES-TEN-01", // Tenerife Royal Sun Resort (Tenerife, Spain)
      "1847658", // Al Habtoor Grand Resort (Dubai JBR)
      "PT-ALG-01", // Algarve Cliffside Resort (Algarve, Portugal)
      "1847631", // Grand Hyatt Dubai (Dubai, UAE)
      "ES-MAJ-01", // Palma Bay Luxury Resort (Majorca, Spain)
    ];
    destinationName = "Featured Worldwide";
    countryName = "Top Destinations";
    destinationSlug = "all";
  } else {
    const destinationItem = findDestination(destinationInput) || findDestination("dubai")!;
    destinationName = destinationItem.destination;
    countryName = destinationItem.country;
    destinationSlug = destinationItem.slug;
    hotelCodesToSearch = destinationItem.featuredHotelCodes;
  }

  // Hotel search only: No flight fare added
  const flightFareGbp = 0;

  // Search GRN availability (Hotels Only)
  const hotels = await searchGrnHotels(
    {
      hotelCodes: hotelCodesToSearch,
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
        destination: destinationSlug,
        destinationName,
        departureAirport: "",
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
      },
      customerPricing: {
        hotelPrice: leadRate.customerPricing.hotelPrice,
        localTax: leadRate.customerPricing.localTax,
        flightPrice: 0,
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
      type: "hotels",
      isHotelsOnly: true,
      destination: destinationName,
      country: countryName,
      destinationSlug,
      departureAirport: "",
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
    const hotelCode = url.searchParams.get("hotelCode") || undefined;
    const departureAirport = url.searchParams.get("departureAirport") || undefined;
    const checkIn = url.searchParams.get("checkIn") || undefined;
    const checkOut = url.searchParams.get("checkOut") || undefined;
    const adults = url.searchParams.get("adults") ? Number(url.searchParams.get("adults")) : undefined;

    return await handleSearch({ type, destination, hotelCode, departureAirport, checkIn, checkOut, adults });
  } catch (error: any) {
    console.error("Search API GET Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to search hotels" },
      { status: 500 }
    );
  }
}
