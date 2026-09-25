import { NextRequest, NextResponse } from "next/server";
import { Prisma, prisma } from "@holiday-jug/db";
import { requireAdmin } from "@/lib/api-auth";
import { countrySchema } from "@/lib/destinations-schemas";
import { sanitizeRichText } from "@/lib/sanitize-html";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;

  const country = await prisma.country.findUnique({
    where: { id },
    include: {
      holidayTypes: { include: { holidayType: true }, orderBy: { sortOrder: "asc" } },
      destinations: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!country) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(country);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const parsed = countrySchema.partial().safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const { holidayTypes, ...data } = parsed.data;

  try {
    const country = await prisma.$transaction(async (tx) => {
      const updated = await tx.country.update({
        where: { id },
        data: {
          ...data,
          ...(data.heroDescription !== undefined && { heroDescription: sanitizeRichText(data.heroDescription) }),
          ...(data.whyVisitIntro !== undefined && { whyVisitIntro: sanitizeRichText(data.whyVisitIntro) }),
          ...(data.thingsToDoContent !== undefined && { thingsToDoContent: sanitizeRichText(data.thingsToDoContent) }),
          ...(data.whenToGoContent !== undefined && { whenToGoContent: sanitizeRichText(data.whenToGoContent) }),
          ...(data.travelGuideContent !== undefined && { travelGuideContent: sanitizeRichText(data.travelGuideContent) }),
        },
      });

      if (holidayTypes) {
        await tx.countryHolidayType.deleteMany({ where: { countryId: id } });
        if (holidayTypes.length > 0) {
          await tx.countryHolidayType.createMany({
            data: holidayTypes.map((h) => ({
              countryId: id,
              holidayTypeId: h.holidayTypeId,
              description: h.description || null,
              sortOrder: h.sortOrder,
            })),
          });
        }
      }

      return updated;
    });
    return NextResponse.json(country);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return NextResponse.json({ error: "A destination with this slug already exists." }, { status: 409 });
      }
      if (err.code === "P2025") {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
    }
    throw err;
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    await prisma.country.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    throw err;
  }
}
