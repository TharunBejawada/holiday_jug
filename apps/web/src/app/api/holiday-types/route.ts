import { NextResponse } from "next/server";
import { prisma } from "@holiday-jug/db";

export async function GET() {
    const items = await prisma.holidayType.findMany({
        where: { isPublished: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: { id: true, slug: true, name: true, iconUrl: true, description: true },
    });

    return NextResponse.json({ items, source: "database" });
}
