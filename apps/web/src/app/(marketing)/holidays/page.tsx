import type { Metadata } from "next";
import Link from "next/link";
import {
  FaPlane,
  FaShieldAlt,
  FaPhoneAlt,
  FaHotel,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaHeadset,
} from "react-icons/fa";
import { CallForHiddenPricesModal } from "@/components/CallForHiddenPricesModal";

export const metadata: Metadata = {
  title: "Holiday Packages — Coming Soon | HolidayJug",
  description:
    "We are currently integrating live scheduled airline flights with our holiday packages. Book custom flight + hotel deals over the phone with 100% ATOL protection.",
};

export default function HolidaysComingSoonPage() {
  return (
    <div className="min-h-screen bg-gray-50/70 pb-20">
      {/* Hidden Prices Phone Booking Popup */}
      <CallForHiddenPricesModal />

      {/* HERO SECTION */}
      <div className="bg-[#1D1248] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-bold text-amber-300">
            <FaPlane className="rotate-[-20deg]" />
            <span>Flight + Hotel Package Deals In Development</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Holiday Packages Are Coming Soon!
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-gray-300 max-w-2xl mx-auto font-normal leading-relaxed">
            We are actively integrating live airline inventories, scheduled flight schedules, and package tour operators directly into HolidayJug. Online flight + hotel checkout will be available soon.
          </p>
        </div>
      </div>

      {/* MAIN CALL TO ACTION & DETAILS */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-100 text-center">
          {/* PHONE BOOKING CARD */}
          <div className="bg-gradient-to-br from-[#071746] via-[#10245E] to-[#1D1248] rounded-2xl p-6 sm:p-10 text-white shadow-lg text-center max-w-2xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-[#F7941D] text-white text-[11px] font-extrabold uppercase tracking-wider mb-3">
              Book Today Over The Phone
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
              Want a custom flight + hotel deal right now?
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto leading-relaxed mb-6">
              Our UK-based travel advisors can build your bespoke holiday package over the phone today, matching live airline flights with our verified luxury hotels.
            </p>

            <a
              href="tel:03301658879"
              className="inline-flex items-center gap-3 rounded-2xl bg-[#F7941D] hover:bg-[#e08316] text-white px-8 py-4 text-lg font-black shadow-xl shadow-amber-500/25 transition-all transform hover:scale-105 cursor-pointer"
            >
              <FaPhoneAlt className="text-base" />
              <span>0330 165 8879</span>
            </a>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-gray-300 font-medium">
              <span className="flex items-center gap-1.5">
                <FaShieldAlt className="text-[#F7941D]" /> 100% ATOL Protected
              </span>
              <span className="flex items-center gap-1.5">
                <FaHeadset className="text-[#F7941D]" /> UK Travel Specialists
              </span>
              <span className="flex items-center gap-1.5">
                <FaClock className="text-[#F7941D]" /> Mon–Sun: 8am – 10pm
              </span>
            </div>
          </div>

          {/* QUICK LINKS SECTION */}
          <div className="mt-12 pt-10 border-t border-gray-100">
            <h3 className="text-lg sm:text-xl font-bold text-[#1D1248] mb-2">
              In the meantime, explore what is currently available:
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-8 max-w-lg mx-auto">
              Our verified Hotel Search and curated Destination Guides are fully live and available for instant browsing.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
              {/* HOTELS CARD */}
              <Link
                href="/hotels"
                className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-50 hover:bg-amber-50/60 border border-gray-200 hover:border-[#F7941D] transition-all duration-200 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-[#F7941D] flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                  <FaHotel />
                </div>
                <h4 className="font-extrabold text-[#1D1248] text-base mb-1">
                  Search Hotels Only
                </h4>
                <p className="text-xs text-gray-500">
                  Browse verified hotels in Dubai, Europe, and worldwide with live room availability.
                </p>
                <span className="mt-3 text-xs font-bold text-[#F7941D] group-hover:underline">
                  Go to Hotels &rarr;
                </span>
              </Link>

              {/* DESTINATIONS CARD */}
              <Link
                href="/destinations"
                className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-50 hover:bg-amber-50/60 border border-gray-200 hover:border-[#F7941D] transition-all duration-200 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-[#F7941D] flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                  <FaMapMarkerAlt />
                </div>
                <h4 className="font-extrabold text-[#1D1248] text-base mb-1">
                  Explore Destinations
                </h4>
                <p className="text-xs text-gray-500">
                  Read complete travel guides, best time to visit, and popular places worldwide.
                </p>
                <span className="mt-3 text-xs font-bold text-[#F7941D] group-hover:underline">
                  Browse Destinations &rarr;
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

