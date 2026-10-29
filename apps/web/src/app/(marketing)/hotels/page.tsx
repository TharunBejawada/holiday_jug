"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FaHotel,
  FaSearch,
  FaStar,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaClock,
  FaShieldAlt,
  FaCheck,
  FaCopy,
  FaTimes,
  FaSlidersH,
  FaInfoCircle,
} from "react-icons/fa";
import { SearchableSelect } from "@/components/SearchableSelect";
import { DatePicker } from "@/components/DatePicker";
import { CallForHiddenPricesBanner } from "@/components/CallForHiddenPricesBanner";
import { getActiveSearchDestinations } from "@/lib/destinations-master";

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

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended", subtitle: "Our top picks" },
  { value: "price-asc", label: "Price: Low to High", subtitle: "Best budget deals first" },
  { value: "price-desc", label: "Price: High to Low", subtitle: "Luxury & premium first" },
  { value: "stars-desc", label: "Star Rating: 5 to 3", subtitle: "Highest star rated first" },
  { value: "name-asc", label: "Hotel Name: A to Z", subtitle: "Alphabetical order" },
];

function HotelsPageContent() {
  const searchParams = useSearchParams();
  const initialDestination = searchParams.get("destination") || "all";
  const initialHotelCode = searchParams.get("hotelCode") || "";
  const initialRating = searchParams.get("rating") ? Number(searchParams.get("rating")) : null;

  const [destination, setDestination] = useState(initialDestination);
  const [checkIn, setCheckIn] = useState(() => {
    const d = new Date(Date.now() + 14 * 86400000);
    return d.toISOString().split("T")[0];
  });
  const [checkOut, setCheckOut] = useState(() => {
    const d = new Date(Date.now() + 21 * 86400000);
    return d.toISOString().split("T")[0];
  });
  const [starFilter, setStarFilter] = useState<number | null>(initialRating);
  const [boardFilter, setBoardFilter] = useState<string>("ALL");
  const [keyword, setKeyword] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("recommended");

  // API State
  const [loading, setLoading] = useState(true);
  const [hotels, setHotels] = useState<HotelResult[]>([]);
  const [searchId, setSearchId] = useState<string>("");
  const [priceCheckedAt, setPriceCheckedAt] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<HotelResult | null>(null);

  const activeDestinations = getActiveSearchDestinations();

  const destinationOptions = useMemo(() => {
    const list = [
      {
        value: "all",
        label: "All Destinations (Featured)",
        subtitle: "Worldwide Handpicked Stays",
        searchTerms: ["all", "featured", "worldwide", "top", "recommend"],
      },
      {
        value: "turkey",
        label: "Turkey (Antalya & Riviera)",
        subtitle: "Turkish Mediterranean",
        searchTerms: ["turkey", "antalya", "lara"],
      },
      {
        value: "greece",
        label: "Greece (Santorini & Islands)",
        subtitle: "Aegean Paradise",
        searchTerms: ["greece", "santorini", "oia"],
      },
      {
        value: "dubai",
        label: "Dubai (United Arab Emirates)",
        subtitle: "Luxury Skyline & Beach",
        searchTerms: ["dubai", "uae", "emirates", "jbr"],
      },
      {
        value: "spain",
        label: "Spain (Canary Islands & Balearics)",
        subtitle: "Mediterranean Sunshine",
        searchTerms: ["spain", "tenerife", "majorca", "palma"],
      },
      {
        value: "antalya",
        label: "Antalya (Turkish Riviera)",
        subtitle: "All-Inclusive Resorts",
        searchTerms: ["antalya", "turkey"],
      },
      {
        value: "portugal",
        label: "Portugal (Algarve & Coast)",
        subtitle: "Atlantic Clifftops",
        searchTerms: ["portugal", "algarve", "albufeira"],
      },
    ];

    activeDestinations.forEach((d) => {
      if (!list.some((existing) => existing.value === d.slug)) {
        list.push({
          value: d.slug,
          label: `${d.destination} (${d.country})`,
          subtitle: d.displayGroup || d.country,
          searchTerms: [d.destination, d.country, ...(d.aliases || [])],
        });
      }
    });

    return list;
  }, [activeDestinations]);

  // Execute Hotel Search & Availability API (Hotels Only)
  useEffect(() => {
    let isCancelled = false;

    async function loadHotels() {
      setLoading(true);
      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "hotels",
            destination,
            hotelCode: initialHotelCode || undefined,
            checkIn,
            checkOut,
            adults: 2,
            rooms: [{ adults: 2, childrenAges: [] }],
          }),
        });

        const data = await res.json();
        if (!isCancelled && data.success) {
          const list: HotelResult[] = data.hotels || [];
          setHotels(list);
          setSearchId(data.searchId || "");
          setPriceCheckedAt(data.priceCheckedAt || "");

          // If a specific hotel was targeted in the URL, open its availability directly
          if (initialHotelCode) {
            const targeted = list.find((h) => h.hotelCode === initialHotelCode);
            if (targeted) {
              setSelectedHotel(targeted);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load hotels:", err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadHotels();

    return () => {
      isCancelled = true;
    };
  }, [destination, checkIn, checkOut, initialHotelCode]);

  const copySearchId = () => {
    if (!searchId) return;
    navigator.clipboard.writeText(searchId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Filter & Sort hotels
  const filteredHotels = useMemo(() => {
    const list = hotels.filter((h) => {
      if (starFilter && h.starRating < starFilter) return false;
      if (boardFilter !== "ALL") {
        const hasBoard = h.availableRates.some((r) =>
          r.boardBasis.toLowerCase().includes(boardFilter.toLowerCase())
        );
        if (!hasBoard) return false;
      }
      if (keyword.trim()) {
        const q = keyword.toLowerCase().trim();
        const matchName = h.hotelName.toLowerCase().includes(q);
        const matchAddress = h.address.toLowerCase().includes(q);
        if (!matchName && !matchAddress) return false;
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
  }, [hotels, starFilter, boardFilter, keyword, sortBy]);

  const isOverview = destination === "all" || !destination;
  const currentDestinationName = isOverview
    ? "Featured Worldwide Stays"
    : destinationOptions.find((d) => d.value === destination)?.label || destination;

  return (
    <div className="min-h-screen bg-gray-50/70 pb-20">
      {/* 1. HERO & INTERACTIVE FILTER HEADER */}
      <div className="bg-[#1D1248] text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-amber-300 mb-2">
                <FaHotel className="text-xs" /> Verified Direct Hotel Inventory
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                {isOverview ? "Verified Luxury Hotels & Resorts" : `Hotels in ${currentDestinationName}`}
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-gray-300 max-w-2xl">
                {isOverview
                  ? "Explore our handpicked collection of verified luxury hotels and resorts worldwide. Select any destination or filter below to check real-time availability."
                  : `Showing verified direct hotel inventory for ${currentDestinationName}. Change destination or filters below to update.`}
              </p>
            </div>

            {/* QUOTE ID BANNER */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center gap-4 shrink-0">
              <div>
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                  Quote for Phone Deals
                </span>
                <span className="font-mono text-xl sm:text-2xl font-black text-white tracking-wider">
                  {searchId || "HOTEL-CHECK"}
                </span>
              </div>
              <button
                type="button"
                onClick={copySearchId}
                className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all"
                title="Copy Quote ID"
              >
                {copied ? <FaCheck className="text-green-400" /> : <FaCopy />}
              </button>
            </div>
          </div>

          {/* MAIN FILTER CARD */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-gray-100 text-gray-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
              {/* DESTINATION SELECTOR */}
              <div className="lg:col-span-4 flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-bold text-[#1D1248] flex items-center gap-1.5">
                  <FaMapMarkerAlt className="text-[#F7941D]" /> Destination / Region
                </label>
                <SearchableSelect
                  options={destinationOptions}
                  value={destination}
                  onChange={(val) => setDestination(val)}
                  placeholder="Select destination..."
                  searchPlaceholder="Search country or city..."
                  triggerClassName="bg-gray-50 border-gray-200 py-3"
                />
              </div>

              {/* CHECK-IN */}
              <div className="lg:col-span-3 flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-bold text-[#1D1248]">Check-in Date</label>
                <DatePicker value={checkIn} onChange={setCheckIn} placeholder="Select check-in" />
              </div>

              {/* CHECK-OUT */}
              <div className="lg:col-span-3 flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-bold text-[#1D1248]">Check-out Date</label>
                <DatePicker value={checkOut} onChange={setCheckOut} placeholder="Select check-out" minDate={checkIn} />
              </div>

              {/* SEARCH ACTION */}
              <div className="lg:col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    // Refreshes search with current destination
                    setDestination((d) => d);
                  }}
                  className="w-full h-[46px] rounded-xl bg-[#F7941D] hover:bg-[#e08316] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FaSearch /> Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SUB-FILTER BAR & RESULTS SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <CallForHiddenPricesBanner variant="inline" />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
          {/* LEFT FILTERS SIDEBAR */}
          <div className="lg:col-span-1 space-y-5">
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="font-extrabold text-sm text-[#1D1248] flex items-center gap-2">
                  <FaSlidersH className="text-[#F7941D]" /> Hotel Filters
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setStarFilter(null);
                    setBoardFilter("ALL");
                    setKeyword("");
                  }}
                  className="text-xs text-[#F7941D] font-bold hover:underline"
                >
                  Reset
                </button>
              </div>

              {/* Keyword Search */}
              <div>
                <label className="text-xs font-bold text-gray-700 block uppercase tracking-wide mb-1.5">
                  Search by Hotel Name
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="e.g. Sheraton, Grand..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#F7941D] transition-colors"
                  />
                  {keyword && (
                    <button
                      type="button"
                      onClick={() => setKeyword("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  )}
                </div>
              </div>

              {/* Star Rating Filter */}
              <div>
                <label className="text-xs font-bold text-gray-700 block uppercase tracking-wide mb-2">
                  Star Rating
                </label>
                <div className="space-y-1.5">
                  {[5, 4, 3].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setStarFilter(starFilter === stars ? null : stars)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        starFilter === stars
                          ? "bg-[#1D1248] text-white shadow-xs"
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

              {/* Board Basis Filter */}
              <div>
                <label className="text-xs font-bold text-gray-700 block uppercase tracking-wide mb-2">
                  Board Basis
                </label>
                <div className="space-y-1.5">
                  {[
                    { key: "ALL", label: "All Board Types" },
                    { key: "All Inclusive", label: "All Inclusive" },
                    { key: "Breakfast", label: "Bed & Breakfast" },
                    { key: "Half Board", label: "Half Board" },
                    { key: "Room Only", label: "Room Only" },
                  ].map((board) => (
                    <button
                      key={board.key}
                      type="button"
                      onClick={() => setBoardFilter(board.key)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        boardFilter === board.key
                          ? "bg-[#F7941D] text-white shadow-xs"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {board.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* PROTECTION PROMISE */}
            <div className="bg-amber-50/70 rounded-3xl p-5 border border-amber-200/60 text-[#1D1248]">
              <div className="flex items-center gap-2 font-extrabold text-sm mb-1.5">
                <FaShieldAlt className="text-[#F7941D] text-lg shrink-0" />
                <span>Verified Direct Rates</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                All room rates include local municipality taxes with no hidden resort fees at check-in.
              </p>
            </div>
          </div>

          {/* RIGHT HOTEL CARDS LIST */}
          <div className="lg:col-span-3 space-y-6">
            {/* TOP BAR: SHOWING COUNT & SORT */}
            {!loading && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200/60">
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#1D1248]">
                    {isOverview ? "Handpicked Featured Hotels" : `Hotels in ${currentDestinationName}`}
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
                    placeholder="Sort hotels..."
                    searchPlaceholder="Filter sorting..."
                    triggerClassName="py-2 rounded-xl text-xs sm:text-sm bg-white"
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
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                <FaHotel className="text-5xl text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-800">No hotels matched your filters</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Try clearing your search query or choosing another destination.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStarFilter(null);
                    setBoardFilter("ALL");
                    setKeyword("");
                    setDestination("all");
                  }}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-[#F7941D] text-white text-xs font-bold"
                >
                  Reset Filters &amp; View All Featured Hotels
                </button>
              </div>
            ) : (
              filteredHotels.map((hotel) => (
                <div
                  key={hotel.hotelCode}
                  className="group flex flex-col md:flex-row overflow-hidden rounded-3xl bg-white border border-gray-100/90 shadow-md hover:shadow-xl transition-all duration-300"
                >
                  {/* HOTEL IMAGE */}
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
                      <h3 className="text-xl sm:text-2xl font-extrabold text-[#1D1248]">
                        {hotel.hotelName}
                      </h3>
                      <p className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 font-medium">
                        <FaMapMarkerAlt className="text-[#F7941D]" /> {hotel.address}
                      </p>

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

                    {/* BOTTOM ROW: PRICE CHECK & ACTIONS */}
                    <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 mb-1">
                          <FaClock className="text-gray-400" />
                          <span>Price checked at {priceCheckedAt || "12:00"} UK</span>
                        </div>
                        <div className="text-xs text-gray-600 font-medium">
                          <span>Local taxes included: </span>
                          <strong className="text-gray-800">
                            £{hotel.leadPricing.localTax.toFixed(2)}
                          </strong>
                        </div>
                      </div>

                      <div className="text-left sm:text-right w-full sm:w-auto flex flex-col items-start sm:items-end">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs text-gray-400 font-medium">From</span>
                          <span className="text-2xl sm:text-3xl font-black text-[#F7941D]">
                            £{hotel.leadPricing.totalPrice.toFixed(2)}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-500 font-medium">
                          £{hotel.leadPricing.pricePerPerson.toFixed(2)} per person (7 nights)
                        </span>

                        <div className="mt-3 flex items-center gap-2">
                          {/* CHECK AVAILABILITY BUTTON */}
                          <button
                            type="button"
                            onClick={() => setSelectedHotel(hotel)}
                            className="rounded-xl border border-[#1D1248] text-[#1D1248] hover:bg-[#1D1248] hover:text-white px-4 py-2 text-xs font-bold transition-all cursor-pointer"
                          >
                            Check Availability ({hotel.availableRates.length} Rates)
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

      {/* 3. INTERACTIVE ROOM RATES & AVAILABILITY MODAL */}
      {selectedHotel && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setSelectedHotel(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-gray-100 text-[#1D1248]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold">{selectedHotel.hotelName}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Live verified room availability and rates
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHotel(null)}
                className="text-gray-400 hover:text-gray-700 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* QUOTE ID BANNER INSIDE MODAL */}
            <div className="my-4 rounded-xl bg-amber-50 p-3.5 border border-amber-200 flex items-center justify-between text-xs font-semibold">
              <span className="text-[#071746]">
                Quote Search ID:{" "}
                <strong className="font-mono text-sm text-[#F7941D]">{searchId}</strong>
              </span>
              <a
                href="tel:03301658879"
                className="text-[#F7941D] hover:underline flex items-center gap-1 font-bold"
              >
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
                    <h4 className="font-bold text-sm sm:text-base text-[#1D1248]">
                      {rate.roomType}
                    </h4>
                    <p className="text-xs text-green-600 font-semibold mt-0.5">
                      {rate.cancellationPolicy}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Includes £{rate.customerPricing.localTax.toFixed(2)} taxes
                    </p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-xl font-extrabold text-[#F7941D] block">
                      £{rate.customerPricing.totalPrice.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">Total stay price</span>
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

export default function HotelsHomepage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 p-12 text-center font-bold text-[#1D1248]">
          Loading Verified Hotels...
        </div>
      }
    >
      <HotelsPageContent />
    </Suspense>
  );
}

