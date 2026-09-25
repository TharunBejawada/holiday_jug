import { NextResponse } from "next/server";
import { prisma } from "@holiday-jug/db";

// Fallback trending destinations if DB is not configured, column missing, or query returns empty
const DEFAULT_TRENDING_DESTINATIONS = [
    {
        id: "turkey",
        name: "Turkey",
        slug: "turkey",
        priceFrom: 95,
        heroImageUrl: "/assets/Antalya.jpg",
        href: "/destinations/turkey",
        featuredOnOverview: true,
    },
    {
        id: "greece",
        name: "Greece",
        slug: "greece",
        priceFrom: 382,
        heroImageUrl: "/assets/Santorini.jpg",
        href: "/destinations/greece",
        featuredOnOverview: true,
    },
    {
        id: "dubai",
        name: "Dubai",
        slug: "dubai",
        priceFrom: 516,
        heroImageUrl: "/assets/Dubai.jpg",
        href: "/destinations/dubai",
        featuredOnOverview: true,
    },
    {
        id: "spain",
        name: "Spain",
        slug: "spain",
        priceFrom: 145,
        heroImageUrl: "/assets/Tenerife.jpg",
        href: "/destinations/spain",
        featuredOnOverview: true,
    },
    {
        id: "antalya",
        name: "Antalya",
        slug: "antalya",
        priceFrom: 129,
        heroImageUrl: "/assets/All_Inclusive_holidays.jpg",
        href: "/destinations/antalya",
        featuredOnOverview: true,
    },
    {
        id: "portugal",
        name: "Portugal",
        slug: "portugal",
        priceFrom: 189,
        heroImageUrl: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=800&q=80",
        href: "/destinations/portugal",
        featuredOnOverview: true,
    },
];

export async function GET() {
    if (!process.env.DATABASE_URL) {
        return NextResponse.json({ items: DEFAULT_TRENDING_DESTINATIONS, source: "default" });
    }

    try {
        const dbCountries = await prisma.country.findMany({
            where: { isPublished: true },
            orderBy: [{ featuredOnOverview: "desc" }, { sortOrder: "asc" }],
            select: {
                id: true,
                name: true,
                slug: true,
                priceFrom: true,
                cardImageUrl: true,
                heroImageUrl: true,
                featuredOnOverview: true,
            },
        });

        if (dbCountries && dbCountries.length > 0) {
            const formatted = dbCountries.map((c) => ({
                id: c.id,
                name: c.name,
                slug: c.slug,
                priceFrom: c.priceFrom ? Number(c.priceFrom) : null,
                heroImageUrl: c.cardImageUrl || c.heroImageUrl || null,
                href: `/destinations/${c.slug}`,
                featuredOnOverview: c.featuredOnOverview,
            }));
            return NextResponse.json({ items: formatted, source: "database" });
        }
    } catch (error) {
        // Catch any DB query errors (e.g. missing column or connection issues)
    }

    return NextResponse.json({ items: DEFAULT_TRENDING_DESTINATIONS, source: "default" });
}
