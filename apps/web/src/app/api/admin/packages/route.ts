import { NextRequest, NextResponse } from "next/server";
import { Prisma, prisma } from "@holiday-jug/db";
import { requireAdmin } from "@/lib/api-auth";
import { packageSchema } from "@/lib/package-schema";

import { getAllHotDealsSlidesForAdmin } from "@/lib/hot-deals-store";

export async function GET(request: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const destinationId = request.nextUrl.searchParams.get("destinationId");

  try {
    const items = await prisma.package.findMany({
      where: destinationId ? { destinationId } : undefined,
      orderBy: { createdAt: "desc" },
      include: { destination: { select: { id: true, name: true } } },
    });
    if (items && items.length > 0) {
      return NextResponse.json({ items });
    }
  } catch (err) {
    console.warn("DB query failed, falling back to hot deals:", err);
  }

  // Fallback to active hot deals mapped as packages
  const hotDeals = getAllHotDealsSlidesForAdmin();
  const fallbackItems = hotDeals.map((deal) => ({
    id: deal.id,
    title: `${deal.destination} Luxury Breakaway`,
    slug: deal.id.toLowerCase(),
    nights: 7,
    boardType: "ALL_INCLUSIVE",
    basePriceGbp: deal.fromPriceGbp.toString(),
    originalPriceGbp: (deal.fromPriceGbp + 120).toString(),
    imageUrl: deal.image,
    isActive: deal.isActive,
    destination: { id: deal.id, name: deal.destination },
  }));

  return NextResponse.json({ items: fallbackItems });
}

export async function POST(request: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const parsed = packageSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const { departureAirport, imageUrl, ...rest } = parsed.data;
  try {
    const item = await prisma.package.create({
      data: {
        ...rest,
        departureAirport: departureAirport || null,
        imageUrl: imageUrl || null,
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ error: "A package with this slug already exists." }, { status: 409 });
    }
    throw err;
  }
}
