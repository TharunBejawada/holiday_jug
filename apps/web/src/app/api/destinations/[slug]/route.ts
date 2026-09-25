import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@holiday-jug/db";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
    const { slug } = await params;

    const country = await prisma.country.findFirst({
        where: { slug, isPublished: true },
        include: {
            holidayTypes: {
                include: { holidayType: true },
                orderBy: { sortOrder: "asc" },
            },
            destinations: {
                orderBy: { sortOrder: "asc" },
            },
            faqs: {
                where: { isPublished: true },
                orderBy: { sortOrder: "asc" },
            },
        },
    });

    if (!country) {
        return NextResponse.json({ error: "Destination not found" }, { status: 404 });
    }

    return NextResponse.json(country);
}
