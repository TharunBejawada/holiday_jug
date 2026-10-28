import { NextRequest, NextResponse } from "next/server";
import {
  INDEXED_SANDBOX_HOTELS,
  getIndexedSandboxHotels,
  SANDBOX_HOTELS_DATABASE,
  searchGrnHotels,
} from "@/lib/grn-client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const search = searchParams.get("search") || "";
  const cityId = searchParams.get("cityId") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "25", 10)));

  // Filter local static index (1,842 hotels) with 0 API credits burned!
  let filtered = INDEXED_SANDBOX_HOTELS;

  if (cityId) {
    filtered = filtered.filter((h) => h.cityId === cityId);
  }

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (h) =>
        h.hotelName.toLowerCase().includes(s) ||
        h.cityName.toLowerCase().includes(s) ||
        h.countryName.toLowerCase().includes(s) ||
        h.hotelCode.includes(s) ||
        h.address.toLowerCase().includes(s)
    );
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginatedItems = filtered.slice(offset, offset + limit);

  // Group city options for quick dropdown filtering
  const cityMap: Record<string, { cityId: string; cityName: string; countryName: string; count: number }> = {};
  for (const h of INDEXED_SANDBOX_HOTELS) {
    if (!cityMap[h.cityId]) {
      cityMap[h.cityId] = {
        cityId: h.cityId,
        cityName: h.cityName,
        countryName: h.countryName,
        count: 0,
      };
    }
    cityMap[h.cityId].count++;
  }
  const cities = Object.values(cityMap).sort((a, b) => b.count - a.count);

  return NextResponse.json({
    success: true,
    total,
    page,
    totalPages,
    limit,
    hotels: paginatedItems.map((h) => ({
      ...h,
      hasCuratedProfile: Boolean(SANDBOX_HOTELS_DATABASE[h.hotelCode]),
    })),
    cities,
    source: "static-sandbox-index",
    creditsConsumed: 0,
    creditNotice: "⚡ Browsing and searching static sandbox hotels consumes 0 API credits.",
  });
}

/**
 * Optional Test Rate check for a single hotel with strict 20-min cache TTL
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const hotelCode = body.hotelCode;

    if (!hotelCode) {
      return NextResponse.json({ success: false, error: "Missing hotelCode" }, { status: 400 });
    }

    const checkIn = body.checkIn || new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];
    const checkOut = body.checkOut || new Date(Date.now() + 18 * 86400000).toISOString().split("T")[0];

    const results = await searchGrnHotels({
      hotelCodes: [hotelCode],
      checkIn,
      checkOut,
      rooms: [{ adults: 2, childrenAges: [] }],
    });

    const hotelResult = results[0];
    if (!hotelResult) {
      return NextResponse.json({ success: false, error: "Hotel not found in availability" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      hotelResult,
      isFromCache: false,
      notice: "Live availability checked directly with supplier.",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
