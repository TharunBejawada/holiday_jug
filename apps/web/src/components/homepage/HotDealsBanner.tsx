"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaPlane, FaChevronLeft, FaChevronRight, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import { getHotDealsSlides, HotDealSlide } from "@/lib/hot-deals-store";

export function HotDealsBanner() {
  const [slides, setSlides] = useState<HotDealSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    // Load slides from central store
    setSlides(getHotDealsSlides());
  }, []);

  // Auto-advance every 5 seconds unless hovered/touched (H2)
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  // Touch swipe handling for mobile (H2)
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      handleNext(); // Swiped left -> next slide
    } else if (diff < -50) {
      handlePrev(); // Swiped right -> prev slide
    }
    touchStartX.current = null;
  };

  if (slides.length === 0) return null;

  const currentSlide = slides[currentIndex];

  return (
    <section className="bg-white py-6 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#071746] via-[#10245E] to-[#1D1248] shadow-2xl border border-gray-100/10 min-h-[380px] sm:min-h-[420px] flex flex-col justify-between"
        >
          {/* SLIDE BACKGROUND IMAGE WITH OVERLAY */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentSlide.image}
            alt={currentSlide.destination}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-overlay transition-all duration-700 transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071746] via-[#071746]/90 to-transparent" />

          {/* MAIN CONTENT AREA */}
          <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex-1 flex flex-col justify-center max-w-2xl">
            {/* FIGMA HOT DEALS BADGE WITH AIRPLANE */}
            <div className="inline-flex items-center gap-2 rounded-full bg-[#F7941D] px-4 py-1.5 text-xs sm:text-sm font-black text-white uppercase tracking-wider w-fit shadow-md mb-4 animate-in fade-in">
              <FaPlane className="text-white text-xs rotate-[-15deg]" />
              <span>{currentSlide.badge}</span>
            </div>

            {/* DESTINATION TITLE */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-sm">
              {currentSlide.destination}
            </h2>

            {/* SUBTITLE */}
            <p className="mt-2 text-sm sm:text-base lg:text-lg text-gray-200 font-medium leading-relaxed max-w-xl">
              {currentSlide.subtitle}
            </p>

            {/* PERK PILLS (Return Flights, Luxury Hotels, Daily Breakfast, Beaches) */}
            <div className="mt-5 flex flex-wrap gap-2 sm:gap-3">
              {currentSlide.perks.map((perk, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 rounded-xl bg-white/10 backdrop-blur-xs px-3 py-1.5 text-xs sm:text-sm font-semibold text-white border border-white/15"
                >
                  <FaCheckCircle className="text-[#F7941D] text-xs shrink-0" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>

            {/* PRICE & CALL TO ACTION */}
            <div className="mt-8 flex flex-wrap items-baseline gap-4 sm:gap-6">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs sm:text-sm text-gray-300 font-medium uppercase tracking-wide">
                  from
                </span>
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F7941D]">
                  £{currentSlide.fromPriceGbp}
                </span>
                <span className="text-xs sm:text-sm text-gray-300 font-medium">
                  per person
                </span>
              </div>

              <Link
                href={currentSlide.searchLink}
                className="inline-flex items-center gap-2 rounded-xl bg-[#F7941D] hover:bg-[#e08314] active:scale-95 px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-white shadow-xl shadow-amber-500/30 transition-all cursor-pointer"
              >
                <span>Explore Deal</span>
                <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </div>

          {/* SLIDE INDICATORS & CONTROLS */}
          <div className="relative z-10 px-6 sm:px-10 pb-6 flex items-center justify-between">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx ? "w-8 bg-[#F7941D]" : "w-2.5 bg-white/30 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous deal"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <FaChevronLeft className="text-xs" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next deal"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <FaChevronRight className="text-xs" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
