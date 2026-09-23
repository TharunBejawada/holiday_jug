-- CreateEnum
CREATE TYPE "DestinationRegion" AS ENUM ('EUROPE', 'MEDITERRANEAN', 'MIDDLE_EAST', 'INDIAN_OCEAN', 'ASIA', 'CARIBBEAN', 'AMERICAS');

-- CreateEnum
CREATE TYPE "FlightTimeBand" AS ENUM ('UNDER_4H', 'FOUR_TO_SIX_H', 'SIX_TO_TEN_H', 'TEN_PLUS_H');

-- CreateEnum
CREATE TYPE "BestForTag" AS ENUM ('FAMILIES', 'COUPLES', 'ADULTS_ONLY', 'LUXURY', 'ADVENTURE', 'RELAXATION');

-- CreateTable
CREATE TABLE "countries" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "region" "DestinationRegion" NOT NULL,
    "flightTimeBand" "FlightTimeBand" NOT NULL,
    "bestFor" "BestForTag"[],
    "heroImageUrl" TEXT,
    "heroDescription" TEXT,
    "whyVisitIntro" TEXT,
    "whyVisitHighlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "thingsToDoContent" TEXT,
    "whenToGoContent" TEXT,
    "travelGuideContent" TEXT,
    "featuredOnOverview" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "holiday_types" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "iconUrl" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "holiday_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "country_holiday_types" (
    "countryId" TEXT NOT NULL,
    "holidayTypeId" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "country_holiday_types_pkey" PRIMARY KEY ("countryId","holidayTypeId")
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "destinations"
  ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "seoTitle" TEXT,
  ADD COLUMN "seoDescription" TEXT,
  ADD COLUMN "seoKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "countryId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "countries_slug_key" ON "countries"("slug");

-- CreateIndex
CREATE INDEX "countries_region_idx" ON "countries"("region");

-- CreateIndex
CREATE UNIQUE INDEX "holiday_types_slug_key" ON "holiday_types"("slug");

-- CreateIndex
CREATE INDEX "faqs_category_idx" ON "faqs"("category");

-- CreateIndex
CREATE INDEX "destinations_countryId_idx" ON "destinations"("countryId");

-- AddForeignKey
ALTER TABLE "country_holiday_types" ADD CONSTRAINT "country_holiday_types_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "country_holiday_types" ADD CONSTRAINT "country_holiday_types_holidayTypeId_fkey" FOREIGN KEY ("holidayTypeId") REFERENCES "holiday_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destinations" ADD CONSTRAINT "destinations_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
