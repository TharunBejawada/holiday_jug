"use client";

import { useState } from "react";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { SANDBOX_HOTELS_DATABASE } from "@/lib/grn-client";

interface StayCard {
  hotelCode: string;
  title: string;
  location: string;
  starRating: number;
  pricePerNightGbp: number;
  image: string;
  href: string;
  tag: string;
}

type TabCategory = "beach" | "city" | "family" | "luxury" | "wellness";

// Helper to compute selling price per night with 13% true margin
function getCalculatedStayPrice(baseRateInr: number, localTaxGbp: number): number {
  const inrToGbpRate = 0.0093;
  const supplierCostGbp = baseRateInr * inrToGbpRate;
  const sellingPriceGbp = Math.ceil(supplierCostGbp / (1 - 0.13));
  return Math.round(sellingPriceGbp + localTaxGbp);
}

// Dynamically generate stay cards from real sandbox hotels with real GRN codes
const h1848131 = SANDBOX_HOTELS_DATABASE["1848131"]; // Sheraton Dubai Creek
const h1847631 = SANDBOX_HOTELS_DATABASE["1847631"]; // Grand Hyatt Dubai
const h1847445 = SANDBOX_HOTELS_DATABASE["1847445"]; // Millennium Plaza
const h1848002 = SANDBOX_HOTELS_DATABASE["1848002"]; // Radisson Blu Deira
const h1847658 = SANDBOX_HOTELS_DATABASE["1847658"]; // Al Habtoor Grand Resort
const h1848134 = SANDBOX_HOTELS_DATABASE["1848134"]; // Sheraton JBR
const h1847874 = SANDBOX_HOTELS_DATABASE["1847874"]; // Millennium Airport
const h1848044 = SANDBOX_HOTELS_DATABASE["1848044"]; // Mövenpick Grand Al Bustan

const dynamicStaysData: Record<TabCategory, StayCard[]> = {
  beach: [
    {
      hotelCode: h1847658.hotelCode,
      title: h1847658.name,
      location: "Jumeirah Beach Residence, Dubai",
      starRating: h1847658.starRating,
      pricePerNightGbp: getCalculatedStayPrice(h1847658.baseRateInr, h1847658.localTaxGbp),
      image: h1847658.mainImage,
      href: `/hotels?destination=dubai&hotelCode=${h1847658.hotelCode}`,
      tag: "Private Beachfront",
    },
    {
      hotelCode: h1848134.hotelCode,
      title: h1848134.name,
      location: "Jumeirah Beach, Dubai",
      starRating: h1848134.starRating,
      pricePerNightGbp: getCalculatedStayPrice(h1848134.baseRateInr, h1848134.localTaxGbp),
      image: h1848134.mainImage,
      href: `/hotels?destination=dubai&hotelCode=${h1848134.hotelCode}`,
      tag: "Palm Garden Resort",
    },
    {
      hotelCode: "1848002",
      title: "Antalya Riviera Luxury Seaside",
      location: "Lara Beach, Turkish Riviera",
      starRating: 5,
      pricePerNightGbp: 89,
      image: "/assets/Antalya.jpg",
      href: "/hotels?destination=turkey",
      tag: "All-Inclusive Beach",
    },
    {
      hotelCode: "1847874",
      title: "Tenerife Ocean Palace Suites",
      location: "Costa Adeje, Canary Islands",
      starRating: 4,
      pricePerNightGbp: 95,
      image: "/assets/Tenerife.jpg",
      href: "/hotels?destination=spain",
      tag: "Oceanfront Views",
    },
  ],
  city: [
    {
      hotelCode: h1847445.hotelCode,
      title: h1847445.name,
      location: "Sheikh Zayed Road, Financial Centre, Dubai",
      starRating: h1847445.starRating,
      pricePerNightGbp: getCalculatedStayPrice(h1847445.baseRateInr, h1847445.localTaxGbp),
      image: h1847445.mainImage,
      href: `/hotels?destination=dubai&hotelCode=${h1847445.hotelCode}`,
      tag: "Burj Khalifa Views",
    },
    {
      hotelCode: h1848002.hotelCode,
      title: h1848002.name,
      location: "Deira Creek & Gold Souk, Dubai",
      starRating: h1848002.starRating,
      pricePerNightGbp: getCalculatedStayPrice(h1848002.baseRateInr, h1848002.localTaxGbp),
      image: h1848002.mainImage,
      href: `/hotels?destination=dubai&hotelCode=${h1848002.hotelCode}`,
      tag: "Historic Creek Waterfront",
    },
    {
      hotelCode: h1847874.hotelCode,
      title: h1847874.name,
      location: "Al Garhoud, Airport Road, Dubai",
      starRating: h1847874.starRating,
      pricePerNightGbp: getCalculatedStayPrice(h1847874.baseRateInr, h1847874.localTaxGbp),
      image: h1847874.mainImage,
      href: `/hotels?destination=dubai&hotelCode=${h1847874.hotelCode}`,
      tag: "Saltwater Pool & English Pub",
    },
    {
      hotelCode: "1848131",
      title: "The Westin Bonaventure Downtown",
      location: "Los Angeles, California, USA",
      starRating: 4,
      pricePerNightGbp: 142,
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      href: "/hotels?destination=usa",
      tag: "Financial District LA",
    },
  ],
  family: [
    {
      hotelCode: h1848044.hotelCode,
      title: h1848044.name,
      location: "Al Garhoud, Dubai Airport, Dubai",
      starRating: h1848044.starRating,
      pricePerNightGbp: getCalculatedStayPrice(h1848044.baseRateInr, h1848044.localTaxGbp),
      image: h1848044.mainImage,
      href: `/hotels?destination=dubai&hotelCode=${h1848044.hotelCode}`,
      tag: "7 Dining Venues & Tennis",
    },
    {
      hotelCode: h1847631.hotelCode,
      title: h1847631.name,
      location: "Sheikh Rashid Road, Dubai",
      starRating: h1847631.starRating,
      pricePerNightGbp: getCalculatedStayPrice(h1847631.baseRateInr, h1847631.localTaxGbp),
      image: h1847631.mainImage,
      href: `/hotels?destination=dubai&hotelCode=${h1847631.hotelCode}`,
      tag: "37 Acres Lagoon Resort",
    },
    {
      hotelCode: "1848134",
      title: "Majorca Sunny Bay Family Splash",
      location: "Balearic Islands, Spain",
      starRating: 4,
      pricePerNightGbp: 78,
      image: "/assets/Tenerife.jpg",
      href: "/hotels?destination=spain",
      tag: "Kids Club & Water Park",
    },
    {
      hotelCode: "1847658",
      title: "Dalaman Riviera Sun Family Club",
      location: "Aegean Coast, Turkey",
      starRating: 4,
      pricePerNightGbp: 64,
      image: "/assets/Antalya.jpg",
      href: "/hotels?destination=turkey",
      tag: "Family Suites & Slides",
    },
  ],
  luxury: [
    {
      hotelCode: h1848131.hotelCode,
      title: h1848131.name,
      location: "Baniyas Street, Dubai Creek, Dubai",
      starRating: h1848131.starRating,
      pricePerNightGbp: getCalculatedStayPrice(h1848131.baseRateInr, h1848131.localTaxGbp),
      image: h1848131.mainImage,
      href: `/hotels?destination=dubai&hotelCode=${h1848131.hotelCode}`,
      tag: "5★ Iconic Waterfront",
    },
    {
      hotelCode: h1847631.hotelCode,
      title: h1847631.name,
      location: "Riyadh Street, Dubai",
      starRating: h1847631.starRating,
      pricePerNightGbp: getCalculatedStayPrice(h1847631.baseRateInr, h1847631.localTaxGbp),
      image: h1847631.mainImage,
      href: `/hotels?destination=dubai&hotelCode=${h1847631.hotelCode}`,
      tag: "Luxury Private Cabanas",
    },
    {
      hotelCode: h1847658.hotelCode,
      title: h1847658.name,
      location: "JBR Beach, Dubai Marina, Dubai",
      starRating: h1847658.starRating,
      pricePerNightGbp: getCalculatedStayPrice(h1847658.baseRateInr, h1847658.localTaxGbp),
      image: h1847658.mainImage,
      href: `/hotels?destination=dubai&hotelCode=${h1847658.hotelCode}`,
      tag: "Autograph Collection Resort",
    },
    {
      hotelCode: "1848044",
      title: "Santorini Cliffside Luxury Suites",
      location: "Oia, Cyclades, Greece",
      starRating: 5,
      pricePerNightGbp: 185,
      image: "/assets/Santorini.jpg",
      href: "/hotels?destination=greece",
      tag: "Private Infinity Pools",
    },
  ],
  wellness: [
    {
      hotelCode: h1847631.hotelCode,
      title: "Ahasees Spa Sanctuary at Grand Hyatt",
      location: "Sheikh Rashid Road, Dubai",
      starRating: 5,
      pricePerNightGbp: getCalculatedStayPrice(h1847631.baseRateInr, h1847631.localTaxGbp),
      image: h1847631.mainImage,
      href: `/hotels?destination=dubai&hotelCode=${h1847631.hotelCode}`,
      tag: "Award-Winning Ahasees Spa",
    },
    {
      hotelCode: h1848131.hotelCode,
      title: "Sheraton Creek Wellness Retreat",
      location: "Dubai Creek, Dubai",
      starRating: 5,
      pricePerNightGbp: getCalculatedStayPrice(h1848131.baseRateInr, h1848131.localTaxGbp),
      image: h1848131.mainImage,
      href: `/hotels?destination=dubai&hotelCode=${h1848131.hotelCode}`,
      tag: "Full Service Wellness & Pool",
    },
    {
      hotelCode: "1848002",
      title: "Algarve Coastal Thermal Spa Sanctuary",
      location: "Algarve, Portugal",
      starRating: 4,
      pricePerNightGbp: 88,
      image: "/assets/Tenerife.jpg",
      href: "/hotels?destination=portugal",
      tag: "Hydrotherapy & Thalasso",
    },
    {
      hotelCode: "1847445",
      title: "Luxor Nile Palace Heritage Retreat",
      location: "Nile River Bank, Luxor, Egypt",
      starRating: 5,
      pricePerNightGbp: 75,
      image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80",
      href: "/hotels?destination=egypt",
      tag: "Historic Nile Waterfront",
    },
  ],
};

const categories: { key: TabCategory; label: string }[] = [
  { key: "beach", label: "Beach" },
  { key: "city", label: "City Breaks" },
  { key: "family", label: "Family" },
  { key: "luxury", label: "Luxury" },
  { key: "wellness", label: "Wellness & Relaxation" },
];

export function StaysSection() {
  const [activeTab, setActiveTab] = useState<TabCategory>("beach");

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#F7941D] tracking-tight">
            Stays for Every Kind of Holiday
          </h2>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveTab(cat.key)}
              className={`rounded-full px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === cat.key
                  ? "bg-[#1D1248] text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* STAYS CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dynamicStaysData[activeTab].map((stay) => (
            <Link
              key={stay.hotelCode + stay.title}
              href={stay.href}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative h-48 w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={stay.image}
                  alt={stay.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80";
                  }}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Tag Badge */}
                <span className="absolute top-3 left-3 rounded-lg bg-black/60 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-bold text-white">
                  {stay.tag}
                </span>

                {/* Price per night */}
                <span className="absolute bottom-3 right-3 rounded-lg bg-[#1D1248]/90 backdrop-blur-xs px-2.5 py-1 text-xs font-bold text-white">
                  from £{stay.pricePerNightGbp}/night
                </span>
              </div>
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({ length: stay.starRating }).map((_, i) => (
                      <FaStar key={i} className="text-amber-400 text-xs" />
                    ))}
                  </div>
                  <h3 className="font-bold text-sm text-[#1D1248] group-hover:text-[#F7941D] transition-colors line-clamp-1">
                    {stay.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5 line-clamp-1">{stay.location}</p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#F7941D]">
                  <span>Check Availability</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
