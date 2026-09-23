import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@holiday-jug/db";
import { requireAdmin } from "@/lib/api-auth";
import { faqSchema } from "@/lib/destinations-schemas";

export async function GET(request: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const category = request.nextUrl.searchParams.get("category");
  const items = await prisma.faq.findMany({
    where: category ? { category } : undefined,
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const parsed = faqSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const item = await prisma.faq.create({ data: parsed.data });
  return NextResponse.json(item, { status: 201 });
}
