import { NextRequest, NextResponse } from "next/server";
import { Prisma, prisma } from "@holiday-jug/db";
import { requireAdmin } from "@/lib/api-auth";
import { holidayTypeSchema } from "@/lib/destinations-schemas";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const items = await prisma.holidayType.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const parsed = holidayTypeSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  try {
    const item = await prisma.holidayType.create({ data: parsed.data });
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ error: "A holiday type with this slug already exists." }, { status: 409 });
    }
    throw err;
  }
}
