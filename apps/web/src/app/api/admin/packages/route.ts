import { NextRequest, NextResponse } from "next/server";
import { Prisma, prisma } from "@holiday-jug/db";
import { requireAdmin } from "@/lib/api-auth";
import { packageSchema } from "@/lib/package-schema";

export async function GET(request: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const destinationId = request.nextUrl.searchParams.get("destinationId");
  const items = await prisma.package.findMany({
    where: destinationId ? { destinationId } : undefined,
    orderBy: { createdAt: "desc" },
    include: { destination: { select: { id: true, name: true } } },
  });
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const parsed = packageSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const { departureAirport, ...rest } = parsed.data;
  try {
    const item = await prisma.package.create({
      data: { ...rest, departureAirport: departureAirport || null },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ error: "A package with this slug already exists." }, { status: 409 });
    }
    throw err;
  }
}
