import { NextRequest, NextResponse } from "next/server";
import { Prisma, prisma } from "@holiday-jug/db";
import { requireAdmin } from "@/lib/api-auth";
import { placeSchema } from "@/lib/destinations-schemas";

export async function GET(request: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const countryId = request.nextUrl.searchParams.get("countryId");
  const places = await prisma.destination.findMany({
    where: countryId ? { countryId } : undefined,
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { countryPage: { select: { id: true, name: true } } },
  });
  return NextResponse.json({ items: places });
}

export async function POST(request: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const parsed = placeSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  try {
    const place = await prisma.destination.create({ data: parsed.data });
    return NextResponse.json(place, { status: 201 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ error: "A place with this slug already exists." }, { status: 409 });
    }
    throw err;
  }
}
