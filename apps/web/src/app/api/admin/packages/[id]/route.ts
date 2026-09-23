import { NextRequest, NextResponse } from "next/server";
import { Prisma, prisma } from "@holiday-jug/db";
import { requireAdmin } from "@/lib/api-auth";
import { packageSchema } from "@/lib/package-schema";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const item = await prisma.package.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const parsed = packageSchema.partial().safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const { departureAirport, ...rest } = parsed.data;
  try {
    const item = await prisma.package.update({
      where: { id },
      data: { ...rest, ...(departureAirport !== undefined && { departureAirport: departureAirport || null }) },
    });
    return NextResponse.json(item);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return NextResponse.json({ error: "A package with this slug already exists." }, { status: 409 });
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

  // Checked up front rather than relying on catching the DB's error shape —
  // see the comment in places/[id]/route.ts's DELETE for why.
  const bookingCount = await prisma.booking.count({ where: { packageId: id } });
  if (bookingCount > 0) {
    return NextResponse.json(
      { error: `This deal has ${bookingCount} booking${bookingCount === 1 ? "" : "s"} linked to it and can't be deleted.` },
      { status: 409 }
    );
  }

  try {
    await prisma.package.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    throw err;
  }
}
