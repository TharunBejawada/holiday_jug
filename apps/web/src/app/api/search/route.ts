import { NextRequest, NextResponse } from "next/server";
import { findDestination } from "@/lib/destinations-master";
import { searchGrnHotels, searchAllGrnHotelsForDestination, HotelSearchResultItem } from "@/lib/grn-client";
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
  const checkOut = payload.checkOut || new Date(new Date(checkIn).getTime() + 7 * 86400000).toISOString().split("T")[0];

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
  let grnCityIdToSearch: string | undefined = undefined;

  if (payload.hotelCode) {
    hotelCodesToSearch = [payload.hotelCode];
    const item = findDestination(destinationInput);
    if (item) {
      destinationName = item.destination;
      countryName = item.country;
      destinationSlug = item.slug;
    }
  } else if (!destinationInput || destinationInput === "all" || destinationInput === "featured") {
    destinationName = "Featured Worldwide";
    countryName = "Top Destinations";
    destinationSlug = "all";
    grnCityIdToSearch = "121449"; // Live Dubai & UAE hotels from GRN
    hotelCodesToSearch = [
      "1848131",
      "1847631",
      "1847658",
      "ES-TEN-01",
      "GR-SAN-01",
      "ES-MAJ-01",
    ];
  } else {
    const destinationItem = findDestination(destinationInput);
    if (destinationItem) {
      destinationName = destinationItem.destination;
      countryName = destinationItem.country;
      destinationSlug = destinationItem.slug;
      hotelCodesToSearch = destinationItem.featuredHotelCodes;
      grnCityIdToSearch = destinationItem.grnCityId;
    } else {
      // User specified a destination that could not be found.
      // NEVER silently fall back to Antalya or Turkey!
      return NextResponse.json({
        success: true,
        hotels: [],
        searchId: generateSearchId(),
        priceCheckedAt: formatUkTime(new Date()),
        message: `No hotels found matching "${payload.destination}". Please try another destination.`,
      });
    }
  }

  // Hotel search only: No flight fare added
  const flightFareGbp = 0;

  // Search GRN availability (Hotels Only)
  let hotels: HotelSearchResultItem[] = [];

  if (payload.hotelCode) {
    hotels = await searchGrnHotels(
      {
        hotelCodes: hotelCodesToSearch,
        checkIn,
        checkOut,
        rooms,
        clientNationality: "GB",
      },
      flightFareGbp
    );
  } else if (grnCityIdToSearch) {
    hotels = await searchAllGrnHotelsForDestination({
      cityId: grnCityIdToSearch,
      secondaryCityId: destinationSlug === "all" ? "121449" : undefined,
      destinationName,
      countryName,
      destinationSlug,
      featuredHotelCodes: hotelCodesToSearch,
      totalAdults,
      flightFareGbp,
    });
  } else {
    hotels = await searchGrnHotels(
      {
        hotelCodes: hotelCodesToSearch,
        checkIn,
        checkOut,
        rooms,
        clientNationality: "GB",
      },
      flightFareGbp
    );
  }

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
