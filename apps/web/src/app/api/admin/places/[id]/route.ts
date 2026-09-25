import { NextRequest, NextResponse } from "next/server";
import { Prisma, prisma } from "@holiday-jug/db";
import { requireAdmin } from "@/lib/api-auth";
import { placeSchema } from "@/lib/destinations-schemas";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const place = await prisma.destination.findUnique({ where: { id } });
  if (!place) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(place);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const parsed = placeSchema.partial().safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  try {
    const place = await prisma.destination.update({ where: { id }, data: parsed.data });
    return NextResponse.json(place);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return NextResponse.json({ error: "A place with this slug already exists." }, { status: 409 });
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

  const packageCount = await prisma.package.count({ where: { destinationId: id } });
  if (packageCount > 0) {
    return NextResponse.json(
      {
        error: `This place has ${packageCount} deal${packageCount === 1 ? "" : "s"} linked to it. Delete or reassign ${packageCount === 1 ? "it" : "them"
          } first.`,
      },
      { status: 409 }
    );
  }

  try {
    await prisma.destination.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    throw err;
  }
}
