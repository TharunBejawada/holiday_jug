import { NextRequest, NextResponse } from "next/server";
import { Prisma, prisma } from "@holiday-jug/db";
import { requireAdmin } from "@/lib/api-auth";
import { countrySchema } from "@/lib/destinations-schemas";
import { sanitizeRichText } from "@/lib/sanitize-html";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const countries = await prisma.country.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { destinations: true, holidayTypes: true } } },
  });
  return NextResponse.json({ items: countries });
}

export async function POST(request: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const parsed = countrySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const { holidayTypes, ...data } = parsed.data;

  try {
    const country = await prisma.country.create({
      data: {
        ...data,
        heroDescription: sanitizeRichText(data.heroDescription),
        whyVisitIntro: sanitizeRichText(data.whyVisitIntro),
        thingsToDoContent: sanitizeRichText(data.thingsToDoContent),
        whenToGoContent: sanitizeRichText(data.whenToGoContent),
        travelGuideContent: sanitizeRichText(data.travelGuideContent),
        holidayTypes: {
          create: holidayTypes.map((h) => ({
            holidayTypeId: h.holidayTypeId,
            description: h.description || null,
            sortOrder: h.sortOrder,
          })),
        },
      },
    });
    return NextResponse.json(country, { status: 201 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ error: "A destination with this slug already exists." }, { status: 409 });
    }
    throw err;
  }
}
