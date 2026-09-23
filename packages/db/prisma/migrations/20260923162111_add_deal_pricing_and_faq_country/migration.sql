-- AlterTable
ALTER TABLE "packages"
  ALTER COLUMN "hotelId" DROP NOT NULL,
  ADD COLUMN "originalPriceGbp" DECIMAL(10,2),
  ADD COLUMN "ratingOverride" DECIMAL(2,1),
  ADD COLUMN "reviewCountOverride" INTEGER;

-- AlterTable
ALTER TABLE "faqs" ADD COLUMN "countryId" TEXT;

-- CreateIndex
CREATE INDEX "faqs_countryId_idx" ON "faqs"("countryId");

-- AddForeignKey
ALTER TABLE "faqs" ADD CONSTRAINT "faqs_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
