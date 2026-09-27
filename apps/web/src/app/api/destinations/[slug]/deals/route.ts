import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@holiday-jug/db";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
    const { slug } = await params;

    try {
        const country = await prisma.country.findFirst({
            where: { slug },
            select: { id: true, name: true, slug: true },
        });

        const packages = await prisma.package.findMany({
            where: {
                isActive: true,
                destination: {
                    OR: [
                        ...(country ? [{ countryId: country.id }] : []),
                        { countryPage: { slug } },
                        { slug },
                    ],
                },
            },
            include: {
                destination: true,
            },
            orderBy: { basePriceGbp: "asc" },
            take: 10,
        });

        return NextResponse.json({ items: packages, countryName: country?.name ?? null });
    } catch (err) {
        console.error("Failed to fetch destination deals:", err);
        return NextResponse.json({ items: [], countryName: null });
    }
}
