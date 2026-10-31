"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  FiSearch,
  FiHeadphones,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiRefreshCw,
  FiUserCheck,
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiArrowRight,
  FiShield,
  FiCopy,
  FiCheck,
} from "react-icons/fi";
import { FaHotel, FaPlane, FaUtensils } from "react-icons/fa";

interface AgentRecord {
  searchId: string;
  customerSearch: {
    destination: string;
    destinationName: string;
    departureAirport: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    rooms: { adults: number; childrenAges: number[] }[];
    totalAdults: number;
    totalChildren: number;
  };
  selectedOption: {
    hotelCode: string;
    hotelName: string;
    roomType: string;
    boardBasis: string;
    starRating?: number;
    address?: string;
    imageUrl?: string;
    flightDetails?: {
      airline?: string;
      flightNumber?: string;
      departureTime?: string;
      returnTime?: string;
      flightPriceGbp?: number;
    };
  };
  customerPricing: {
    hotelPrice: number;
    localTax: number;
    flightPrice: number;
    transfersPrice: number;
    totalPrice: number;
    pricePerPerson: number;
    currency: string;
  };
  timestamps: {
    searchGeneratedAtUk: string;
    priceFetchedAtUk: string;
    currentUkTime: string;
    timeGapFormatted: string;
    gapHours: number;
    gapMinutes: number;
  };
  internalAudit: {
    supplierCostGbp: number;
    supplierCostInr: number;
    marginRateUsed: string;
    currencyRateUsed: number;
  };
}

interface LiveComparison {
  customerOriginalPrice: number;
  livePrice: number;
  difference: number;
  differenceSigned: number;
  isPriceChanged: boolean;
  direction: "INCREASED" | "DECREASED" | "UNCHANGED";
  explanation: string;
}

interface RecentQuote {
  searchId: string;
  searchGeneratedAtUk: string;
  customerSearch?: {
    destinationName?: string;
    destination?: string;
  };
  selectedOption?: {
    hotelName?: string;
  };
  customerPricing?: {
    totalPrice?: number;
  };
}

function AgentToolContent() {
  const searchParams = useSearchParams();
  const initialSearchId = searchParams.get("searchId") || "";

  const [searchIdInput, setSearchIdInput] = useState(initialSearchId);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [record, setRecord] = useState<AgentRecord | null>(null);

  // Live supplier rate re-check
  const [recheckLoading, setRecheckLoading] = useState(false);
  const [liveComparison, setLiveComparison] = useState<LiveComparison | null>(null);
  const [recheckMessage, setRecheckMessage] = useState("");

  // Recent quotes for fast clicking
  const [recentQuotes, setRecentQuotes] = useState<RecentQuote[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function fetchRecord(idToSearch: string) {
    const cleanId = idToSearch.trim().toUpperCase();
    if (!cleanId) return;

    setLoading(true);
    setErrorMsg("");
    setRecord(null);
    setLiveComparison(null);
    setRecheckMessage("");

    try {
      const res = await fetch(`/api/agent/lookup?searchId=${encodeURIComponent(cleanId)}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || `Search ID "${cleanId}" not found or expired.`);
      } else {
        setRecord(data.record);
      }
    } catch {
      setErrorMsg("Failed to connect to agent lookup service.");
    } finally {
      setLoading(false);
    }
  }

  // Load recent quotes on mount
  useEffect(() => {
    async function loadRecent() {
      try {
        const res = await fetch("/api/admin/config");
        const data = await res.json();
        if (data.success && Array.isArray(data.searchRecords)) {
          setRecentQuotes(data.searchRecords.slice(0, 6));
        }
      } catch (err) {
        console.error("Could not fetch recent quotes", err);
      }
    }
    loadRecent();
  }, []);

  // If query param provided on mount, auto-search
  useEffect(() => {
    if (initialSearchId) {
      setSearchIdInput(initialSearchId);
      fetchRecord(initialSearchId);
    }
  }, [initialSearchId]);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecord(searchIdInput);
  };

  const handleLivePriceCheck = async () => {
    if (!record) return;

    setRecheckLoading(true);
    setLiveComparison(null);
    setRecheckMessage("");

    try {
      const res = await fetch("/api/agent/recheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchId: record.searchId }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setRecheckMessage(data.error || "Unable to re-check live supplier price.");
      } else if (!data.isAvailable) {
        setRecheckMessage(data.message);
      } else {
        setLiveComparison(data.comparison);
      }
    } catch {
      setRecheckMessage("Connection error while re-running supplier search.");
    } finally {
      setRecheckLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-14">
      {/* 1. TOP HEADER BANNER */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center text-lg font-bold shadow-xs">
              <FiHeadphones />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Agent Tool: Search ID Lookup &amp; Audit
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Live customer phone quote lookup, time gap verification, and real-time supplier rate re-check.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-3 py-1 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Admin Authenticated
          </span>
        </div>
      </div>

      {/* 2. SEARCH ID LOOKUP BOX */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
        <label className="text-xs font-semibold text-gray-700 block mb-2 uppercase tracking-wider">
          Enter Customer Search / Quote ID (e.g. K9X4M7P2 or HJ-K9X4M7P2):
        </label>
        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
            <input
              type="text"
              value={searchIdInput}
              onChange={(e) => setSearchIdInput(e.target.value.toUpperCase())}
              placeholder="e.g. K9X4M7P2"
              maxLength={15}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 text-base font-mono font-bold tracking-wider text-gray-900 uppercase border border-gray-200 focus:border-brand-600 focus:bg-white focus:outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchIdInput.trim()}
            className="rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-95 px-7 py-3 font-semibold text-sm text-white shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? <FiRefreshCw className="animate-spin text-sm" /> : <FiSearch className="text-sm" />}
            <span>Find Search Details</span>
          </button>
        </form>

        {/* Error notification */}
        {errorMsg && (
          <div className="mt-4 rounded-xl bg-red-50 border border-red-200/80 p-4 flex items-start gap-3 text-red-700 animate-in fade-in">
            <FiAlertTriangle className="text-red-500 text-base shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-xs">Search ID Not Found</p>
              <p className="text-xs text-red-600 mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Fast Select Recent Quotes */}
        {recentQuotes.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mr-1">
              Recent Quotes:
            </span>
            {recentQuotes.map((q) => (
              <button
                key={q.searchId}
                type="button"
                onClick={() => {
                  setSearchIdInput(q.searchId);
                  fetchRecord(q.searchId);
                }}
                className={`text-xs font-mono font-medium px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  record?.searchId === q.searchId
                    ? "bg-brand-600 text-white border-brand-600 shadow-2xs"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200"
                }`}
              >
                {q.searchId}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. RECORD DETAILS */}
      {record && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* A: TIMESTAMPS & GAP ANALYSIS */}
          <div className="rounded-2xl bg-gradient-to-r from-brand-900 to-[#12286e] text-white p-5 shadow-sm border border-white/10">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider">
                <FiClock className="text-sm" /> Time Audit &amp; Gap Analysis (UK London Time)
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs text-white/80">
                <span>Search ID:</span>
                <span className="font-bold text-amber-300">{record.searchId}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(record.searchId)}
                  className="p-1 hover:text-white transition"
                  title="Copy Search ID"
                >
                  {copiedId === record.searchId ? (
                    <FiCheck className="text-emerald-400 text-xs" />
                  ) : (
                    <FiCopy className="text-xs" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <span className="text-gray-300 block text-[11px] font-medium">Search Generated:</span>
                <span className="font-mono font-semibold text-white text-sm mt-0.5 block">
                  {record.timestamps.searchGeneratedAtUk}
                </span>
              </div>
              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <span className="text-gray-300 block text-[11px] font-medium">Price Fetched From DB:</span>
                <span className="font-mono font-semibold text-white text-sm mt-0.5 block">
                  {record.timestamps.priceFetchedAtUk}
                </span>
              </div>
              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <span className="text-gray-300 block text-[11px] font-medium">Current London Time:</span>
                <span className="font-mono font-semibold text-white text-sm mt-0.5 block">
                  {record.timestamps.currentUkTime}
                </span>
              </div>
              <div
                className={`rounded-xl p-3 flex flex-col justify-center border ${
                  record.timestamps.gapHours >= 2
                    ? "bg-rose-500/20 text-rose-200 border-rose-500/40"
                    : record.timestamps.gapHours >= 1
                    ? "bg-amber-500/20 text-amber-200 border-amber-500/40"
                    : "bg-emerald-500/20 text-emerald-200 border-emerald-500/40"
                }`}
              >
                <span className="text-[11px] font-medium block">Gap Since Search:</span>
                <span className="text-sm font-bold mt-0.5">
                  {record.timestamps.timeGapFormatted} ago
                </span>
              </div>
            </div>
          </div>

          {/* B: TWO COLUMN SPLIT (CUSTOMER SEARCH vs SELECTED OPTION) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Search Requirements */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
                  <FiMapPin className="text-brand-600" /> What Customer Searched
                </h2>
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between py-1.5 border-b border-gray-50">
                    <span className="text-gray-500 font-medium">Destination:</span>
                    <span className="font-semibold text-gray-900">{record.customerSearch.destinationName}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-50">
                    <span className="text-gray-500 font-medium">Departure Airport:</span>
                    <span className="font-semibold text-gray-900">{record.customerSearch.departureAirport || "None (Hotel Only)"}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-50">
                    <span className="text-gray-500 font-medium">Check-In / Out:</span>
                    <span className="font-semibold text-gray-900">
                      {record.customerSearch.checkIn} &rarr; {record.customerSearch.checkOut}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-50">
                    <span className="text-gray-500 font-medium">Duration:</span>
                    <span className="font-semibold text-gray-900">{record.customerSearch.nights} Nights</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-50">
                    <span className="text-gray-500 font-medium">Party Size:</span>
                    <span className="font-semibold text-gray-900">
                      {record.customerSearch.totalAdults} Adults, {record.customerSearch.totalChildren} Children
                    </span>
                  </div>

                  {/* Room Breakdown */}
                  <div className="mt-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <span className="font-semibold text-[11px] text-gray-500 uppercase tracking-wide block mb-1.5">
                      Rooms &amp; Children Ages:
                    </span>
                    {record.customerSearch.rooms.map((r, i) => (
                      <div key={i} className="text-xs text-gray-700 py-0.5 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
                        <span>
                          <strong>Room {i + 1}:</strong> {r.adults} Adults
                          {r.childrenAges.length > 0 && (
                            <span className="text-amber-700 font-medium ml-1">
                              (Child ages: {r.childrenAges.join(", ")})
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Option & Pricing */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
                  <FaHotel className="text-brand-600" /> Selected Hotel &amp; Package
                </h2>
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between py-1.5 border-b border-gray-50">
                    <span className="text-gray-500 font-medium">Hotel Name:</span>
                    <span className="font-semibold text-gray-900 text-right">{record.selectedOption.hotelName}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-50">
                    <span className="text-gray-500 font-medium">Room Type:</span>
                    <span className="font-semibold text-gray-900 text-right">{record.selectedOption.roomType}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-50">
                    <span className="text-gray-500 font-medium">Board Basis:</span>
                    <span className="font-semibold text-brand-700">{record.selectedOption.boardBasis}</span>
                  </div>

                  {record.selectedOption.flightDetails && (
                    <div className="flex justify-between py-1.5 border-b border-gray-50">
                      <span className="text-gray-500 font-medium">Flights:</span>
                      <span className="font-semibold text-gray-900">
                        {record.selectedOption.flightDetails.airline} ({record.selectedOption.flightDetails.flightNumber})
                      </span>
                    </div>
                  )}

                  {/* Customer Line-by-Line Pricing */}
                  <div className="mt-4 pt-3 border-t border-dashed border-gray-200 space-y-1.5 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Hotel Price:</span>
                      <span className="font-medium text-gray-800">£{record.customerPricing.hotelPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Local Taxes (Separate Line):</span>
                      <span className="font-medium text-blue-700">£{record.customerPricing.localTax.toFixed(2)}</span>
                    </div>
                    {record.customerPricing.flightPrice > 0 && (
                      <div className="flex justify-between text-gray-600">
                        <span>Flights Fare (Net Passthrough):</span>
                        <span className="font-medium text-gray-800">£{record.customerPricing.flightPrice.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-baseline text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
                      <span>Total Displayed to Customer:</span>
                      <span className="text-lg font-black text-amber-600">
                        £{record.customerPricing.totalPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400 text-right">
                      (Approx. £{record.customerPricing.pricePerPerson.toFixed(2)} per person)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* C: INTERNAL AUDIT & MARGIN BREAKDOWN (ADMIN VISIBILITY) */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FiShield className="text-brand-600" /> Back-Office Internal Margin &amp; Supplier Audit
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <span className="text-gray-500 block text-[11px]">Supplier Cost (GBP):</span>
                <span className="font-semibold text-gray-900 text-sm mt-0.5 block">
                  £{record.internalAudit.supplierCostGbp.toFixed(2)}
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <span className="text-gray-500 block text-[11px]">Supplier Cost (INR):</span>
                <span className="font-semibold text-gray-900 text-sm mt-0.5 block">
                  ₹{record.internalAudit.supplierCostInr.toLocaleString()}
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <span className="text-gray-500 block text-[11px]">Target Margin Rate:</span>
                <span className="font-semibold text-emerald-700 text-sm mt-0.5 block">
                  {record.internalAudit.marginRateUsed}
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <span className="text-gray-500 block text-[11px]">FX Rate Used:</span>
                <span className="font-semibold text-gray-900 text-sm mt-0.5 block">
                  1 GBP = ₹{record.internalAudit.currencyRateUsed}
                </span>
              </div>
            </div>
          </div>

          {/* D: VERIFY LIVE SUPPLIER RATE (A6 RECHECK) */}
          <div className="bg-white rounded-2xl border-2 border-amber-500/30 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <FiRefreshCw className="text-amber-600" /> Verify Live Supplier Rate With GRN
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xl">
                  Connect live to supplier inventory right now to confirm room availability and check if prices have fluctuated since the customer generated this quote.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLivePriceCheck}
                disabled={recheckLoading}
                className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 px-6 py-3 font-semibold text-xs text-white shadow-xs flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50 shrink-0"
              >
                <FiRefreshCw className={`text-xs ${recheckLoading ? "animate-spin" : ""}`} />
                <span>{recheckLoading ? "Checking Supplier..." : "Verify Live Price Now"}</span>
              </button>
            </div>

            {/* LIVE COMPARISON RESULTS */}
            {liveComparison && (
              <div className="mt-6 rounded-xl bg-gray-50 p-5 border border-gray-200 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-2xs">
                    <span className="text-xs text-gray-500 font-medium block mb-1">Customer Quote:</span>
                    <span className="text-xl sm:text-2xl font-bold text-gray-800">
                      £{liveComparison.customerOriginalPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-2xs">
                    <span className="text-xs text-gray-500 font-medium block mb-1">Live Supplier Price:</span>
                    <span className="text-xl sm:text-2xl font-bold text-brand-900">
                      £{liveComparison.livePrice.toFixed(2)}
                    </span>
                  </div>

                  <div
                    className={`p-4 rounded-xl border shadow-2xs ${
                      liveComparison.direction === "INCREASED"
                        ? "bg-rose-50 border-rose-200 text-rose-700"
                        : liveComparison.direction === "DECREASED"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-blue-50 border-blue-200 text-blue-700"
                    }`}
                  >
                    <span className="text-xs font-semibold block mb-1">Price Difference:</span>
                    <span className="text-xl sm:text-2xl font-bold">
                      {liveComparison.differenceSigned > 0
                        ? `+£${liveComparison.difference.toFixed(2)}`
                        : liveComparison.differenceSigned < 0
                        ? `-£${liveComparison.difference.toFixed(2)}`
                        : "£0.00"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-3.5 rounded-xl bg-white border border-gray-200 text-xs sm:text-sm font-medium text-gray-800 flex items-center gap-2.5">
                  <FiCheckCircle className="text-emerald-600 text-base shrink-0" />
                  <span>{liveComparison.explanation}</span>
                </div>
              </div>
            )}

            {recheckMessage && (
              <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-900">
                {recheckMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminAgentPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
          <FiRefreshCw className="animate-spin text-brand-600" />
          <span>Loading Agent Tool...</span>
        </div>
      }
    >
      <AgentToolContent />
    </Suspense>
  );
}

