import { Suspense } from "react";
import { Metadata } from "next";
import HotelLandingClient from "./HotelLandingClient";
import { SANDBOX_HOTELS_DATABASE } from "@/lib/grn-client";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const rawSlug = decodeURIComponent(slug).trim().toLowerCase();

  const hotel =
    SANDBOX_HOTELS_DATABASE[rawSlug] ||
    Object.values(SANDBOX_HOTELS_DATABASE).find((h: any) => {
      const codeMatch = h.hotelCode.toLowerCase() === rawSlug;
      const nameSlug = h.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return codeMatch || nameSlug.includes(rawSlug) || rawSlug.includes(nameSlug);
    }) ||
    SANDBOX_HOTELS_DATABASE["rixos-downtown-antalya"] ||
    SANDBOX_HOTELS_DATABASE["TR-ANT-01"];

  const hotelName = hotel?.name || decodeURIComponent(slug).replace(/-/g, " ");

  return {
    title: `${hotelName} Holidays & Stays | HolidayJug`,
    description: `Book your holiday at ${hotelName} with verified rates, exclusive phone deals, and 100% ATOL protection. Call 0330 165 8879.`,
  };
}

export default async function HotelLandingPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1D1248]" />
        </div>
      }
    >
      <HotelLandingClient
        slug={resolvedParams.slug}
        initialSearchParams={resolvedSearchParams}
      />
    </Suspense>
  );
}

