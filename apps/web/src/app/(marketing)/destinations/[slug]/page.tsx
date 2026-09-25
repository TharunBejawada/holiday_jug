import { notFound } from "next/navigation";
import { prisma } from "@holiday-jug/db";
import { DestinationHero, type CountryDetails } from "@/components/destinations/DestinationHero";
import { DestinationSubNav } from "@/components/destinations/DestinationSubNav";
import { WhyVisitSection } from "@/components/destinations/WhyVisitSection";
import { TopDestinationsSection } from "@/components/destinations/TopDestinationsSection";
import { HolidayTypesSection } from "@/components/destinations/HolidayTypesSection";

type PageParams = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageParams) {
    const { slug } = await params;
    const country = await prisma.country.findFirst({
        where: { slug, isPublished: true },
        select: { name: true, seoTitle: true, seoDescription: true, seoKeywords: true },
    });

    if (!country) return { title: "Destination Not Found" };

    return {
        title: country.seoTitle || `${country.name} Holidays | HolidayJug`,
        description: country.seoDescription || `Discover the best holiday deals in ${country.name} with HolidayJug.`,
        keywords: country.seoKeywords,
    };
}

export default async function DestinationLandingPage({ params }: PageParams) {
    const { slug } = await params;

    const rawCountry = await prisma.country.findFirst({
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

    if (!rawCountry) {
        notFound();
    }

    // Direct database query fallback for whyVisitImageUrl to bypass any stale in-memory Prisma client schemas
    let whyVisitImageUrl = (rawCountry as any).whyVisitImageUrl;
    if (!whyVisitImageUrl) {
        try {
            const dbRes: any = await prisma.$queryRaw`SELECT "whyVisitImageUrl" FROM "countries" WHERE "id" = ${rawCountry.id}`;
            if (dbRes && dbRes[0] && dbRes[0].whyVisitImageUrl) {
                whyVisitImageUrl = dbRes[0].whyVisitImageUrl;
            }
        } catch {
            // Ignore error if table doesn't exist
        }
    }

    const country: CountryDetails = {
        id: rawCountry.id,
        name: rawCountry.name,
        slug: rawCountry.slug,
        region: rawCountry.region,
        flightTimeBand: rawCountry.flightTimeBand,
        bestFor: rawCountry.bestFor,
        priceFrom: rawCountry.priceFrom ? Number(rawCountry.priceFrom) : null,
        cardImageUrl: rawCountry.cardImageUrl,
        heroImageUrl: rawCountry.heroImageUrl,
        heroDescription: rawCountry.heroDescription,
        whyVisitIntro: rawCountry.whyVisitIntro,
        whyVisitHighlights: rawCountry.whyVisitHighlights,
        whyVisitImageUrl: whyVisitImageUrl || null,
        thingsToDoContent: rawCountry.thingsToDoContent,
        whenToGoContent: rawCountry.whenToGoContent,
        travelGuideContent: rawCountry.travelGuideContent,
        holidayTypes: rawCountry.holidayTypes.map((ht) => ({
            holidayType: {
                id: ht.holidayType.id,
                name: ht.holidayType.name,
                slug: ht.holidayType.slug,
                description: ht.holidayType.description,
            },
            description: ht.description,
        })),
        destinations: rawCountry.destinations.map((d) => ({
            id: d.id,
            name: d.name,
            slug: d.slug,
            description: d.description,
            imageUrl: d.heroImageUrl,
            priceFrom: d.priceFrom ? Number(d.priceFrom) : null,
        })),
        faqs: rawCountry.faqs.map((f) => ({
            id: f.id,
            question: f.question,
            answer: f.answer,
        })),
    };

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <DestinationHero country={country} />

            {/* Static Sub-Navigation Tabs */}
            <DestinationSubNav />

            {/* Why Visit Section */}
            <WhyVisitSection country={country} />

            {/* Top Destinations Section */}
            <TopDestinationsSection country={country} />

            {/* Holiday Types Section */}
            <HolidayTypesSection country={country} />
        </main>
    );
}
