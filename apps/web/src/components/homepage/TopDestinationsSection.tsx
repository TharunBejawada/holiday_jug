"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

interface DisplayDestination {
  id: string;
  name: string;
  price: string;
  image: string;
  href: string;
}

// Fallback initial list based on Admin Dashboard data (Turkey, Greece, Dubai, Spain, Antalya, Portugal)
const ADMIN_FALLBACK_DESTINATIONS: DisplayDestination[] = [
  {
    id: "turkey",
    name: "Turkey",
    price: "£95",
    image: "https://holidayjug-assets-prod.s3.eu-west-2.amazonaws.com/uploads/2026-09-25/91990881-834d-441b-a63b-a9eea46858a2.jpg",
    href: "/destinations/turkey",
  },
  {
    id: "greece",
    name: "Greece",
    price: "£285",
    image: "https://holidayjug-assets-prod.s3.eu-west-2.amazonaws.com/uploads/2026-09-25/afb03492-79f0-4308-9312-47506b6aed0b.jpg",
    href: "/destinations/greece",
  },
  {
    id: "dubai",
    name: "Dubai",
    price: "£548",
    image: "https://holidayjug-assets-prod.s3.eu-west-2.amazonaws.com/uploads/2026-09-25/e1536319-3c0d-456f-b8c7-973285f148a9.jpg",
    href: "/destinations/dubai",
  },
  {
    id: "spain",
    name: "Spain",
    price: "£325",
    image: "https://holidayjug-assets-prod.s3.eu-west-2.amazonaws.com/uploads/2026-09-25/4005cca2-cffa-4e17-9be6-74f88ca53780.jpg",
    href: "/destinations/spain",
  },
  {
    id: "antalya",
    name: "Antalya",
    price: "£878",
    image: "https://holidayjug-assets-prod.s3.eu-west-2.amazonaws.com/uploads/2026-09-25/7a33396e-ed2d-4fcd-a632-54837c254b4c.jpg",
    href: "/destinations/antalya",
  },
  {
    id: "portugal",
    name: "Portugal",
    price: "£450",
    image: "https://holidayjug-assets-prod.s3.eu-west-2.amazonaws.com/uploads/2026-09-25/5f77e945-62ab-465e-b55c-96a21fc82975.jpg",
    href: "/destinations/portugal",
  },
];

export function TopDestinationsSection() {
  const [destinations, setDestinations] = useState<DisplayDestination[]>(ADMIN_FALLBACK_DESTINATIONS);

  useEffect(() => {
    // Fetch live destinations dynamically from the Admin Dashboard / database API
    fetch("/api/destinations", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.items && Array.isArray(data.items) && data.items.length > 0) {
          const mapped: DisplayDestination[] = data.items.map((c: any) => ({
            id: c.id || c.slug,
            name: c.name,
            price: c.priceFrom ? `£${c.priceFrom}` : "£95",
            image: c.cardImageUrl || c.heroImageUrl || "/assets/Dubai.jpg",
            href: `/destinations/${c.slug}`,
          }));
          setDestinations(mapped);
        }
      })
      .catch((err) => {
        console.error("Error loading admin dashboard destinations:", err);
      });
  }, []);

  return (
    <section className="bg-gray-50/50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#1D1248] uppercase">
            EXPLORE THE WORLD
          </span>
          <h2 className="mt-1.5 text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#F7941D]">
            Top Destinations
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-500 font-medium">
            choose from thousands of worldwide holidays
          </p>
        </div>

        {/* DESTINATIONS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {destinations.map((dest) => (
            <Link
              key={dest.id}
              href={dest.href}
              className="group relative overflow-hidden rounded-3xl h-60 sm:h-64 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer block"
            >
              {/* BACKGROUND IMAGE */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* GRADIENT OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

              {/* BOTTOM CONTENT */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 flex items-end justify-between gap-2">
                {/* DESTINATION NAME */}
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                    Destination
                  </span>
                  <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight drop-shadow-md">
                    {dest.name}
                  </span>
                </div>

                {/* PRICE BADGE BOX */}
                <div className="bg-white/95 backdrop-blur-xs rounded-2xl px-3.5 py-2 flex items-center gap-2.5 shadow-lg border border-white/50">
                  <div className="flex flex-col text-left leading-none">
                    <span className="text-[10px] text-gray-500 font-medium mb-0.5">from</span>
                    <span className="text-base sm:text-lg font-bold text-[#1D1248]">
                      {dest.price}
                    </span>
                    <span className="text-[9px] text-gray-400 font-medium mt-0.5">per person</span>
                  </div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F7941D] text-white flex items-center justify-center text-xs group-hover:translate-x-1 transition-transform shadow-xs">
                    <FaArrowRight />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* BOTTOM ACTION BUTTON */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            href="/destinations"
            className="inline-block rounded-full bg-[#F7941D] hover:bg-[#e08314] active:scale-[0.98] px-8 py-3.5 text-sm sm:text-base font-semibold text-white transition-all shadow-md hover:shadow-lg"
          >
            view all destinations
          </Link>
        </div>
      </div>
    </section>
  );
}
