"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { DESTINATIONS_MASTER, DestinationMasterItem } from "@/lib/destinations-master";

interface DisplayDestination {
  id: string;
  name: string;
  price: string;
  image: string;
  href: string;
}

export function TopDestinationsSection() {
  const [destinations, setDestinations] = useState<DisplayDestination[]>([]);

  useEffect(() => {
    // Dynamically derive top destinations from DESTINATIONS_MASTER (Appendix A)
    const items: DisplayDestination[] = DESTINATIONS_MASTER.slice(0, 8).map((d) => ({
      id: d.slug,
      name: d.destination,
      price: `£${d.leadPriceGbp || 299}`,
      image: d.cardImage || d.heroImage || "/assets/Dubai.jpg",
      href: `/search?destination=${d.slug}`,
    }));
    setDestinations(items);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {destinations.map((dest) => (
            <Link
              key={dest.id}
              href={dest.href}
              className="group relative overflow-hidden rounded-3xl h-56 sm:h-60 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer block"
            >
              {/* BACKGROUND IMAGE */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* GRADIENT OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* BOTTOM CONTENT */}
              <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-4 flex items-end justify-between gap-2">
                {/* DESTINATION NAME */}
                <span className="text-base sm:text-lg lg:text-xl font-semibold text-white leading-tight drop-shadow-md max-w-[50%]">
                  {dest.name}
                </span>

                {/* PRICE BADGE BOX */}
                <div className="bg-white/95 backdrop-blur-xs rounded-2xl px-3 py-2 flex items-center gap-2.5 shadow-lg border border-white/50">
                  <div className="flex flex-col text-left leading-none">
                    <span className="text-[10px] text-gray-500 font-medium mb-0.5">from</span>
                    <span className="text-base sm:text-lg font-semibold text-[#1D1248]">
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
            href="/search"
            className="inline-block rounded-full bg-[#F7941D] hover:bg-[#e08314] active:scale-[0.98] px-8 py-3.5 text-sm sm:text-base font-semibold text-white transition-all shadow-md hover:shadow-lg"
          >
            view all destinations
          </Link>
        </div>
      </div>
    </section>
  );
}
