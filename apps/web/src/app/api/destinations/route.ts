import { NextResponse } from "next/server";
import sanitizeHtml from "sanitize-html";
import { prisma } from "@holiday-jug/db";

function toPlainText(html: string | null, maxLength = 120): string {
    if (!html) return "";
    const text = sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, " ").trim();
    return text.length > maxLength ? `${text.slice(0, maxLength - 1).trimEnd()}…` : text;
}

function resolveImageUrl(cardImg?: string | null, heroImg?: string | null): string | null {
    if (cardImg && cardImg.trim() !== "") return cardImg.trim();
    if (heroImg && heroImg.trim() !== "") return heroImg.trim();
    return null;
}

export async function GET() {
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
            heroDescription: true,
            featuredOnOverview: true,
            region: true,
            flightTimeBand: true,
            bestFor: true,
            sortOrder: true,
            holidayTypes: { select: { holidayType: { select: { slug: true } } } },
        },
    });

    const items = dbCountries.map((c) => {
        const imageUrl = resolveImageUrl(c.cardImageUrl, c.heroImageUrl);
        return {
            id: c.id,
            name: c.name,
            slug: c.slug,
            priceFrom: c.priceFrom ? Number(c.priceFrom) : null,
            cardImageUrl: imageUrl,
            heroImageUrl: imageUrl,
            href: `/destinations/${c.slug}`,
            featuredOnOverview: c.featuredOnOverview,
            sortOrder: c.sortOrder,
            description: toPlainText(c.heroDescription),
            region: c.region,
            flightTimeBand: c.flightTimeBand,
            bestFor: c.bestFor,
            holidayTypes: c.holidayTypes.map((ht) => ht.holidayType.slug),
        };
    });

    return NextResponse.json({ items, source: "database" });
}
