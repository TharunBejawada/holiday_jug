"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaPhoneAlt,
  FaCopy,
  FaCheck,
  FaStar,
  FaMapMarkerAlt,
  FaClock,
  FaPlane,
  FaShieldAlt,
  FaFilter,
  FaHotel,
  FaInfoCircle,
} from "react-icons/fa";
import { CallForHiddenPricesBanner } from "@/components/CallForHiddenPricesBanner";
import { SearchableSelect } from "@/components/SearchableSelect";

interface HotelResult {
  hotelCode: string;
  hotelName: string;
  starRating: number;
  address: string;
  city: string;
  country: string;
  description: string;
  facilities: string[];
  mainImage: string;
  galleryImages: string[];
  availableRates: {
    rateKey: string;
    roomCode: string;
    roomType: string;
    boardBasis: string;
    cancellationPolicy: string;
    isNonRefundable: boolean;
    customerPricing: {
      hotelPrice: number;
      localTax: number;
      flightPrice: number;
      transfersPrice: number;
      totalPrice: number;
      pricePerPerson: number;
      currency: string;
    };
  }[];
  leadPricing: {
    hotelPrice: number;
    localTax: number;
    flightPrice: number;
    transfersPrice: number;
    totalPrice: number;
    pricePerPerson: number;
    currency: string;
  };
}

function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawType = searchParams.get("type");
  const rawDeparture = searchParams.get("departureAirport");
  const isHotelsOnly = rawType === "hotels" || rawDeparture === "" || rawDeparture === "null" || !rawDeparture;
  const departureAirport = isHotelsOnly ? "" : (rawDeparture || "LGW");
  const destination = searchParams.get("destination") || "dubai";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const adults = searchParams.get("adults") || "2";

  // Parse rooms if present in query params
  const rawRooms = searchParams.get("rooms");
  let parsedRooms: any[] | undefined = undefined;
  if (rawRooms) {
    try {
      parsedRooms = JSON.parse(rawRooms);
    } catch (e) {
      parsedRooms = undefined;
    }
  }

  const [loading, setLoading] = useState(true);
  const [hotels, setHotels] = useState<HotelResult[]>([]);
  const [searchId, setSearchId] = useState<string>("");
  const [priceCheckedAt, setPriceCheckedAt] = useState<string>("");
  const [priceCheckedAtFull, setPriceCheckedAtFull] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<HotelResult | null>(null);

  // Filters
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [boardFilter, setBoardFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("recommended");

  const SORT_OPTIONS = [
    { value: "recommended", label: "Recommended", subtitle: "Our top picks" },
    { value: "price-asc", label: "Price: Low to High", subtitle: "Best budget deals first" },
    { value: "price-desc", label: "Price: High to Low", subtitle: "Luxury & premium options" },
    { value: "stars-desc", label: "Star Rating: 5 to 3", subtitle: "Highest star rated first" },
    { value: "name-asc", label: "Hotel Name: A to Z", subtitle: "Alphabetical order" },
  ];

  useEffect(() => {
    async function fetchSearch() {
      // RULE: The availability and search API is strictly for HOTELS ONLY.
      // If user came looking for holidays or non-hotel searches with no data, navigate to homepage
      if (!isHotelsOnly) {
        setLoading(false);
        router.replace("/");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "hotels",
            destination,
            checkIn,
            checkOut,
            adults: Number(adults),
            rooms: parsedRooms,
          }),
        });

        const data = await res.json();
        if (data.success && Array.isArray(data.hotels) && data.hotels.length > 0) {
          setHotels(data.hotels);
          setSearchId(data.searchId || "");
          setPriceCheckedAt(data.priceCheckedAt || "");
          setPriceCheckedAtFull(data.priceCheckedAtFullUk || "");
        } else {
          // No data from API response: navigate to homepage
          router.replace("/");
        }
      } catch (err) {
        console.error("Failed to load search results:", err);
        router.replace("/");
      } finally {
        setLoading(false);
      }
    }

    fetchSearch();
  }, [destination, departureAirport, checkIn, checkOut, adults, isHotelsOnly, rawRooms]);

  const copySearchId = () => {
    if (!searchId) return;
    navigator.clipboard.writeText(searchId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const filteredHotels = useMemo(() => {
    const list = hotels.filter((h) => {
      if (starFilter && h.starRating < starFilter) return false;
      if (boardFilter !== "ALL") {
        const hasBoard = h.availableRates.some((r) =>
          r.boardBasis.toLowerCase().includes(boardFilter.toLowerCase())
        );
        if (!hasBoard) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === "price-asc") {
        return (a.leadPricing?.pricePerPerson || 0) - (b.leadPricing?.pricePerPerson || 0);
      }
      if (sortBy === "price-desc") {
        return (b.leadPricing?.pricePerPerson || 0) - (a.leadPricing?.pricePerPerson || 0);
      }
      if (sortBy === "stars-desc") {
        return b.starRating - a.starRating;
      }
      if (sortBy === "name-asc") {
        return a.hotelName.localeCompare(b.hotelName);
      }
      return 0;
    });
  }, [hotels, starFilter, boardFilter, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      {/* SEARCH HEADER & SEARCH ID HERO BAR (S1 & S2) */}
      <div className="bg-[#1D1248] text-white border-b border-amber-500/30 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-amber-300 mb-2">
              {isHotelsOnly ? (
                <>
                  <FaHotel className="text-xs" /> Verified Hotels Only (Direct check-in)
                </>
              ) : (
                <>
                  <FaPlane className="text-xs" /> Holiday Packages (Coming Soon)
                </>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold capitalize text-white">
              {isHotelsOnly ? "Hotels" : "Holidays"} in {destination.replace(/-/g, " ")}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-300">
              {isHotelsOnly
                ? "Hotel Stays • Best Direct Price Guarantee"
                : `Custom Flight + Hotel Quote • ATOL Protected`}
            </p>
          </div>

          {/* SEARCH ID QUOTE BOX (S1, S2, G1) */}
          <div className="w-full lg:w-auto bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-xl">
            <div className="text-center sm:text-left">
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                Quote this ID when you call us
              </span>
              <div className="flex items-center gap-2 mt-1 justify-center sm:justify-start">
                <span className="font-mono text-2xl sm:text-3xl font-black text-white tracking-widest bg-black/30 px-3 py-1 rounded-xl border border-white/10">
                  {searchId || "LOADING..."}
                </span>
                <button
                  type="button"
                  onClick={copySearchId}
                  className="flex items-center gap-1.5 rounded-xl bg-white/20 hover:bg-white/30 px-3 py-2 text-xs font-bold text-white transition-all cursor-pointer"
                  title="Copy Search ID"
                >
                  {copied ? <FaCheck className="text-green-400" /> : <FaCopy />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>
            </div>

            <div className="border-t sm:border-t-0 sm:border-l border-white/20 pt-3 sm:pt-0 sm:pl-6 text-center sm:text-left">
              <span className="text-[11px] text-gray-300 font-medium block">UK Sales Line (Tap to call)</span>
              <a
                href="tel:03301658879"
                className="text-xl sm:text-2xl font-black text-[#F7941D] hover:underline flex items-center justify-center sm:justify-start gap-2"
              >
                <FaPhoneAlt className="text-sm" />
                <span>0330 165 8879</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {!isHotelsOnly ? (
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#F7941D] flex items-center justify-center text-3xl mx-auto mb-5">
              <FaPlane className="rotate-[-20deg]" />
            </div>
            <span className="inline-block px-3.5 py-1 rounded-full bg-amber-100/70 text-[#F7941D] text-xs font-bold uppercase tracking-wider mb-3">
              Data Coming Soon
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1248]">
              Holiday Flight + Hotel Packages Coming Soon
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
              We are actively integrating live scheduled airline systems and holiday package operators into HolidayJug. Online flight + hotel packages to <span className="font-bold text-[#1D1248] capitalize">{destination.replace(/-/g, " ")}</span> will be launched soon!
            </p>

            <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#071746] to-[#1D1248] text-white max-w-lg mx-auto shadow-md">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wide block mb-1">
                Book Over The Phone Today With 100% ATOL Protection
              </span>
              <p className="text-xs text-gray-300 mb-5">
                Our UK holiday specialists can tailor and confirm your flights, luxury hotel, and transfers right now.
              </p>
              <a
                href="tel:03301658879"
                className="inline-flex items-center gap-2 rounded-xl bg-[#F7941D] hover:bg-[#e08314] px-6 py-3 text-sm font-bold text-white transition-all transform hover:scale-105"
              >
                <FaPhoneAlt className="text-xs" />
                <span>Call 0330 165 8879</span>
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={`/hotels?destination=${destination}`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1D1248] hover:bg-[#071746] text-white px-5 py-2.5 text-xs sm:text-sm font-bold transition-colors"
              >
                <FaHotel className="text-[#F7941D]" /> Search Hotels Only in {destination.replace(/-/g, " ")}
              </Link>
              <Link
                href={`/destinations/${destination}`}
                className="inline-flex items-center gap-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 text-xs sm:text-sm font-bold transition-colors"
              >
                <FaMapMarkerAlt className="text-[#F7941D]" /> View {destination.replace(/-/g, " ")} Destination Guide
              </Link>
            </div>
          </div>
        </div>
      ) : (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* INLINE BANNER (G2) */}
        <CallForHiddenPricesBanner variant="inline" />

        {/* MAIN RESULTS LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
          {/* LEFT FILTERS */}
          <div className="lg:col-span-1 space-y-5">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <span className="font-bold text-sm text-[#1D1248] flex items-center gap-2">
                  <FaFilter className="text-[#F7941D]" /> Filter Stays
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setStarFilter(null);
                    setBoardFilter("ALL");
                  }}
                  className="text-xs text-[#F7941D] font-bold hover:underline"
                >
                  Reset
                </button>
              </div>

              {/* Star Rating */}
              <div className="space-y-2 mb-5">
                <label className="text-xs font-bold text-gray-700 block uppercase tracking-wide">
                  Minimum Star Rating
                </label>
                <div className="space-y-1.5">
                  {[5, 4, 3].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setStarFilter(starFilter === stars ? null : stars)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        starFilter === stars
                          ? "bg-[#1D1248] text-white"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-1 text-[#F7941D]">
                        {Array.from({ length: stars }).map((_, i) => (
                          <FaStar key={i} />
                        ))}
                      </div>
                      <span>{stars} Stars &amp; above</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Board Basis */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block uppercase tracking-wide">
                  Board Basis
                </label>
                <div className="space-y-1.5">
                  {[
                    { key: "ALL", label: "All Board Types" },
                    { key: "All Inclusive", label: "All Inclusive" },
                    { key: "Breakfast", label: "Bed & Breakfast" },
                    { key: "Room Only", label: "Room Only" },
                  ].map((board) => (
                    <button
                      key={board.key}
                      type="button"
                      onClick={() => setBoardFilter(board.key)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        boardFilter === board.key
                          ? "bg-[#F7941D] text-white"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {board.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ATOL & UK PROTECTION PROMISE */}
            <div className="bg-amber-50/80 rounded-2xl p-5 border border-amber-200/60 text-[#1D1248]">
              <div className="flex items-center gap-2 font-extrabold text-sm mb-2 text-[#071746]">
                <FaShieldAlt className="text-[#F7941D] text-lg shrink-0" />
                <span>100% ATOL Protected</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                Every holiday booked over the phone is fully insured and ATOL protected. No hidden hotel fees.
              </p>
            </div>
          </div>

          {/* RIGHT HOTEL CARDS (D4: Comprehensive set of hotels) */}
          <div className="lg:col-span-3 space-y-6">
            {!loading && hotels.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-200/60">
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#1D1248]">
                    Available Stays
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">
                    Showing <span className="text-[#F7941D] font-bold">{filteredHotels.length}</span> verified properties
                  </p>
                </div>
                <div className="w-full sm:w-64">
                  <SearchableSelect
                    options={SORT_OPTIONS}
                    value={sortBy}
                    onChange={setSortBy}
                    placeholder="Sort results..."
                    searchPlaceholder="Filter sort options..."
                    triggerClassName="py-2 rounded-xl text-xs sm:text-sm bg-white font-medium"
                  />
                </div>
              </div>
            )}

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 rounded-3xl bg-white animate-pulse border border-gray-100" />
                ))}
              </div>
            ) : filteredHotels.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                <FaHotel className="text-4xl text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-800">No properties match your exact filters</h3>
                <p className="text-sm text-gray-500 mt-1">Try resetting the star rating or board basis.</p>
              </div>
            ) : (
              filteredHotels.map((hotel) => (
                <div
                  key={hotel.hotelCode}
                  className="group flex flex-col md:flex-row overflow-hidden rounded-3xl bg-white border border-gray-100/90 shadow-md hover:shadow-xl transition-all duration-300"
                >
                  {/* IMAGE */}
                  <div className="relative w-full md:w-[38%] h-56 md:h-auto overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={hotel.mainImage || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"}
                      alt={hotel.hotelName}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-xs px-2.5 py-1 text-xs font-bold text-amber-300">
                      {Array.from({ length: hotel.starRating }).map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                  </div>

                  {/* DETAILS & PRICING */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1D1248]">
                            {hotel.hotelName}
                          </h2>
                          <p className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 font-medium">
                            <FaMapMarkerAlt className="text-[#F7941D]" /> {hotel.address}
                          </p>
                        </div>
                      </div>

                      <p className="mt-3 text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {hotel.description}
                      </p>

                      {/* FACILITIES */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {hotel.facilities.slice(0, 4).map((f, i) => (
                          <span
                            key={i}
                            className="rounded-lg bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-700"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* PRICING BREAKDOWN (P1-P5 & S5) */}
                    <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                      <div>
                        {/* S5: Price checked at timestamp */}
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 mb-1">
                          <FaClock className="text-gray-400" />
                          <span>Price checked at {priceCheckedAt || "11:45"} UK, subject to availability</span>
                        </div>

                        {/* P4: Local tax as separate line item */}
                        <div className="text-xs text-gray-600 font-medium space-y-0.5">
                          <p>
                            Hotel price: <span className="font-bold text-gray-800">£{hotel.leadPricing.hotelPrice.toFixed(2)}</span>
                          </p>
                          <p>
                            Local taxes included: <span className="font-bold text-gray-800">£{hotel.leadPricing.localTax.toFixed(2)}</span> (No resort fees at hotel)
                          </p>
                        </div>
                      </div>

                      {/* TOTAL PRICE & CALL TO BOOK BUTTON */}
                      <div className="text-right sm:text-right w-full sm:w-auto flex flex-col items-end">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs text-gray-400 font-medium">Total</span>
                          <span className="text-2xl sm:text-3xl font-black text-[#F7941D]">
                            £{hotel.leadPricing.totalPrice.toFixed(2)}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-500 font-medium">
                          £{hotel.leadPricing.pricePerPerson.toFixed(2)} per person {isHotelsOnly ? "(Hotel Only)" : "(Flight + Hotel)"}
                        </span>

                        <div className="mt-2.5 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedHotel(hotel)}
                            className="rounded-xl border border-gray-200 hover:border-gray-300 bg-white px-3.5 py-2 text-xs font-bold text-[#1D1248] transition-colors cursor-pointer"
                          >
                            View {hotel.availableRates.length} Rates
                          </button>
                          <a
                            href="tel:03301658879"
                            className="flex items-center gap-1.5 rounded-xl bg-[#F7941D] hover:bg-[#e08314] active:scale-95 px-4 py-2 text-xs font-bold text-white shadow-md transition-all"
                          >
                            <FaPhoneAlt className="text-[10px]" /> Call to Book
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      )}

      {/* ROOMS & RATES MODAL (D4: Comprehensive set of room types and board options) */}
      {selectedHotel && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setSelectedHotel(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 text-[#1D1248]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-extrabold">{selectedHotel.hotelName}</h3>
                <p className="text-xs text-gray-500 mt-0.5">Select your room type &amp; board basis</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHotel(null)}
                className="text-gray-400 hover:text-gray-700 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* QUOTE ID BANNER INSIDE MODAL (S2) */}
            <div className="my-4 rounded-xl bg-amber-50 p-3 border border-amber-200 flex items-center justify-between text-xs font-semibold">
              <span className="text-[#071746]">Quote Search ID: <strong className="font-mono text-sm text-[#F7941D]">{searchId}</strong></span>
              <a href="tel:03301658879" className="text-[#F7941D] hover:underline flex items-center gap-1 font-bold">
                <FaPhoneAlt /> 0330 165 8879
              </a>
            </div>

            {/* RATES LIST */}
            <div className="space-y-3.5 my-4">
              {selectedHotel.availableRates.map((rate) => (
                <div
                  key={rate.rateKey}
                  className="rounded-2xl border border-gray-200 p-4 hover:border-[#F7941D] transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gray-50/50"
                >
                  <div>
                    <span className="inline-block rounded-md bg-[#1D1248] px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider mb-1">
                      {rate.boardBasis}
                    </span>
                    <h4 className="font-bold text-sm sm:text-base text-[#1D1248]">{rate.roomType}</h4>
                    <p className="text-xs text-green-600 font-semibold mt-0.5">{rate.cancellationPolicy}</p>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Taxes: £{rate.customerPricing.localTax.toFixed(2)} included
                    </p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-xl font-extrabold text-[#F7941D] block">
                      £{rate.customerPricing.totalPrice.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">Total for stay</span>
                    <a
                      href="tel:03301658879"
                      className="mt-2 inline-flex items-center gap-1 rounded-lg bg-[#F7941D] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs"
                    >
                      <FaPhoneAlt className="text-[10px]" /> Call to Book
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 p-12 text-center font-bold">Loading holiday results...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
