import { NextRequest, NextResponse } from "next/server";
import { getPricingConfig, updatePricingConfig } from "@/lib/pricing";
import { getAllHotDealsSlidesForAdmin, updateHotDealSlide, addHotDealSlide, deleteHotDealSlide } from "@/lib/hot-deals-store";
import { listAllSearchRecords } from "@/lib/search-id";

export const dynamic = "force-dynamic";

export async function GET() {
  const pricing = getPricingConfig();
  const hotDeals = getAllHotDealsSlidesForAdmin();
  const searchRecords = listAllSearchRecords(30);

  return NextResponse.json({
    success: true,
    pricing,
    hotDeals,
    searchRecords,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.pricing) {
      updatePricingConfig({
        defaultHotelMargin: body.pricing.defaultHotelMargin !== undefined ? Number(body.pricing.defaultHotelMargin) : undefined,
        inrToGbpRate: body.pricing.inrToGbpRate !== undefined ? Number(body.pricing.inrToGbpRate) : undefined,
        recordRetentionDays: body.pricing.recordRetentionDays !== undefined ? Number(body.pricing.recordRetentionDays) : undefined,
      });
    }

    if (body.updateHotDeal) {
      updateHotDealSlide(body.updateHotDeal.id, body.updateHotDeal.updates);
    }

    if (body.addHotDeal) {
      addHotDealSlide(body.addHotDeal);
    }

    if (body.deleteHotDealId) {
      deleteHotDealSlide(body.deleteHotDealId);
    }

    return NextResponse.json({
      success: true,
      pricing: getPricingConfig(),
      hotDeals: getAllHotDealsSlidesForAdmin(),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
