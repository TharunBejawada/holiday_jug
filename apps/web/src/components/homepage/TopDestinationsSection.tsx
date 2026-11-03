"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

interface DisplayDestination {
  id: string;
  name: string;
  image: string;
  href: string;
}

// Fallback initial list based on Admin Dashboard data (Turkey, Greece, Dubai, Spain, Antalya, Portugal)
const ADMIN_FALLBACK_DESTINATIONS: DisplayDestination[] = [
  {
    id: "turkey",
    name: "Turkey",
    image: "https://holidayjug-assets-prod.s3.eu-west-2.amazonaws.com/uploads/2026-09-25/91990881-834d-441b-a63b-a9eea46858a2.jpg",
    href: "/hotels?destination=turkey",
  },
  {
    id: "greece",
    name: "Greece",
    image: "https://holidayjug-assets-prod.s3.eu-west-2.amazonaws.com/uploads/2026-09-25/afb03492-79f0-4308-9312-47506b6aed0b.jpg",
    href: "/hotels?destination=greece",
  },
  {
    id: "dubai",
    name: "Dubai",
    image: "https://holidayjug-assets-prod.s3.eu-west-2.amazonaws.com/uploads/2026-09-25/e1536319-3c0d-456f-b8c7-973285f148a9.jpg",
    href: "/hotels?destination=dubai",
  },
  {
    id: "spain",
    name: "Spain",
    image: "https://holidayjug-assets-prod.s3.eu-west-2.amazonaws.com/uploads/2026-09-25/4005cca2-cffa-4e17-9be6-74f88ca53780.jpg",
    href: "/hotels?destination=spain",
  },
  {
    id: "antalya",
    name: "Antalya",
    image: "https://holidayjug-assets-prod.s3.eu-west-2.amazonaws.com/uploads/2026-09-25/7a33396e-ed2d-4fcd-a632-54837c254b4c.jpg",
    href: "/hotels?destination=antalya",
  },
  {
    id: "portugal",
    name: "Portugal",
    image: "https://holidayjug-assets-prod.s3.eu-west-2.amazonaws.com/uploads/2026-09-25/5f77e945-62ab-465e-b55c-96a21fc82975.jpg",
    href: "/hotels?destination=portugal",
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
            image: c.cardImageUrl || c.heroImageUrl || "/assets/Dubai.jpg",
            href: `/hotels?destination=${encodeURIComponent(c.slug || c.id)}`,
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
            choose from thousands of worldwide hotels
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
                  <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight drop-shadow-md">
                    {dest.name}
                  </span>
                </div>

                {/* EXPLORE ACTION ICON */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 backdrop-blur-xs text-[#1D1248] group-hover:bg-[#F7941D] group-hover:text-white flex items-center justify-center text-xs sm:text-sm shadow-lg border border-white/50 transition-all duration-300">
                  <FaArrowRight className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* BOTTOM ACTION BUTTON */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            href="/hotels"
            className="inline-block rounded-full bg-[#F7941D] hover:bg-[#e08314] active:scale-[0.98] px-8 py-3.5 text-sm sm:text-base font-semibold text-white transition-all shadow-md hover:shadow-lg"
          >
            view all destinations
          </Link>
        </div>
      </div>
    </section>
  );
}
