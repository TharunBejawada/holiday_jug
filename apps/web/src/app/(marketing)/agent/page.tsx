"use client";

import { useState } from "react";
import {
  FaSearch,
  FaHeadset,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSyncAlt,
  FaLock,
  FaUser,
  FaPlane,
  FaHotel,
  FaCalendarAlt,
  FaUsers,
  FaMoneyBillWave,
} from "react-icons/fa";

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

export default function AgentLookupPage() {
  // A1: Simple login for agents
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [agentPin, setAgentPin] = useState("");
  const [loginError, setLoginError] = useState("");

  // Search ID input (A2)
  const [searchIdInput, setSearchIdInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [record, setRecord] = useState<AgentRecord | null>(null);

  // Live Price Check (A6)
  const [recheckLoading, setRecheckLoading] = useState(false);
  const [liveComparison, setLiveComparison] = useState<LiveComparison | null>(null);
  const [recheckMessage, setRecheckMessage] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple agent pin verification (Default PIN: 2026 or holidayjug)
    if (agentPin.trim() === "2026" || agentPin.trim().toLowerCase() === "holidayjug") {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Invalid Agent Access PIN. (Default PIN: 2026)");
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchIdInput.trim()) return;

    setLoading(true);
    setErrorMsg("");
    setRecord(null);
    setLiveComparison(null);
    setRecheckMessage("");

    try {
      const res = await fetch(`/api/agent/lookup?searchId=${encodeURIComponent(searchIdInput.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Search ID not found or expired.");
      } else {
        setRecord(data.record);
      }
    } catch (err: any) {
      setErrorMsg("Failed to connect to agent lookup service.");
    } finally {
      setLoading(false);
    }
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
    } catch (err: any) {
      setRecheckMessage("Connection error while re-running search.");
    } finally {
      setRecheckLoading(false);
    }
  };

  // A1: Agent Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl border border-gray-100 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1D1248] to-[#2B1B6D] text-white flex items-center justify-center mx-auto mb-4 shadow-md">
            <FaHeadset className="text-2xl text-[#F7941D]" />
          </div>

          <h1 className="text-2xl font-extrabold text-[#1D1248]">HolidayJug Internal Agent Tool</h1>
          <p className="mt-1 text-xs text-gray-500 font-medium">
            Enter your agent credentials to look up caller Search IDs.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div className="text-left">
              <label className="text-xs font-bold text-gray-700 block mb-1">Agent Access PIN</label>
              <div className="relative flex items-center">
                <input
                  type="password"
                  value={agentPin}
                  onChange={(e) => setAgentPin(e.target.value)}
                  placeholder="Enter PIN (e.g. 2026)"
                  className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm border border-gray-200 focus:border-[#F7941D] focus:bg-white focus:outline-none font-mono tracking-widest font-bold"
                />
                <FaLock className="absolute right-3.5 text-gray-400 text-xs" />
              </div>
            </div>

            {loginError && (
              <p className="text-xs text-red-500 font-semibold text-left">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-[#F7941D] hover:bg-[#e08314] active:scale-95 py-3 text-sm font-bold text-white shadow-md transition-all cursor-pointer"
            >
              Log In to Agent Console
            </button>
          </form>

          <p className="mt-4 text-[11px] text-gray-400">
            For authorised HolidayJug travel consultants only.
          </p>
        </div>
      </div>
    );
  }

  // A2 - A6: Agent Console
  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      {/* HEADER */}
      <div className="bg-[#071746] text-white py-6 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F7941D] flex items-center justify-center text-white text-lg font-bold">
              <FaHeadset />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">Agent Console: Search ID Lookup</h1>
              <span className="text-xs text-gray-300">Live Customer Assistance &amp; Rate Verification</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/20 text-green-300 px-3 py-1 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Agent Online
            </span>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-xs text-gray-300 hover:text-white underline cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* A2: SEARCH ID INPUT BOX */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-gray-100">
          <label className="text-sm font-extrabold text-[#1D1248] block mb-2">
            Enter Customer Quote / Search ID (8 Characters):
          </label>
          <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={searchIdInput}
              onChange={(e) => setSearchIdInput(e.target.value.toUpperCase())}
              placeholder="e.g. K9X4M7P2"
              maxLength={12}
              className="flex-1 rounded-2xl bg-gray-50 px-5 py-3.5 text-lg font-mono font-black tracking-widest text-[#1D1248] uppercase border-2 border-gray-200 focus:border-[#F7941D] focus:bg-white focus:outline-none transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-[#1D1248] hover:bg-[#2B1B6D] active:scale-95 px-8 py-3.5 font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? <FaSyncAlt className="animate-spin text-sm" /> : <FaSearch className="text-sm" />}
              <span>Find Search Details</span>
            </button>
          </form>

          {/* A2: ERROR MESSAGE ON INVALID OR EXPIRED ID */}
          {errorMsg && (
            <div className="mt-4 rounded-2xl bg-red-50 border border-red-200 p-4 flex items-start gap-3 text-red-700 animate-in fade-in">
              <FaExclamationTriangle className="text-red-500 text-lg shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Search ID Not Found</p>
                <p className="text-xs text-red-600 mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}
        </div>

        {/* RESULTS CARD */}
        {record && (
          <div className="mt-8 space-y-6 animate-in fade-in duration-300">
            {/* A5: TIMESTAMPS & GAP CARD */}
            <div className="rounded-2xl bg-gradient-to-r from-blue-900 to-[#1D1248] text-white p-5 shadow-lg border border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wide mb-3">
                <FaClock className="text-sm" /> Time Audit &amp; Gap Analysis (UK London Time)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div className="bg-white/10 rounded-xl p-3">
                  <span className="text-gray-300 block">Search Generated:</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {record.timestamps.searchGeneratedAtUk}
                  </span>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <span className="text-gray-300 block">Price Fetched From DB:</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {record.timestamps.priceFetchedAtUk}
                  </span>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <span className="text-gray-300 block">Current London Time:</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {record.timestamps.currentUkTime}
                  </span>
                </div>
                <div className="bg-amber-400 text-[#071746] rounded-xl p-3 font-extrabold flex flex-col justify-center">
                  <span>Gap Since Search:</span>
                  <span className="text-base">{record.timestamps.timeGapFormatted} ago</span>
                </div>
              </div>
            </div>

            {/* A3 & A4: SEARCH DETAILS & SELECTED OPTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* A3: What the Customer Searched */}
              <div className="rounded-3xl bg-white p-6 shadow-md border border-gray-100">
                <h2 className="text-base font-extrabold text-[#1D1248] flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
                  <FaSearch className="text-[#F7941D]" /> What Customer Searched (A3)
                </h2>
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500 font-medium">Destination:</span>
                    <span className="font-bold text-[#1D1248]">{record.customerSearch.destinationName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500 font-medium">Departure Airport:</span>
                    <span className="font-bold text-[#1D1248]">{record.customerSearch.departureAirport}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500 font-medium">Check-In / Out:</span>
                    <span className="font-bold text-[#1D1248]">
                      {record.customerSearch.checkIn} to {record.customerSearch.checkOut}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500 font-medium">Duration:</span>
                    <span className="font-bold text-[#1D1248]">{record.customerSearch.nights} Nights</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500 font-medium">Party Size:</span>
                    <span className="font-bold text-[#1D1248]">
                      {record.customerSearch.totalAdults} Adults, {record.customerSearch.totalChildren} Children
                    </span>
                  </div>

                  {/* Room breakdown */}
                  <div className="mt-3 pt-2 bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <span className="font-bold text-[11px] text-gray-500 uppercase tracking-wide block mb-1.5">
                      Rooms &amp; Children Ages:
                    </span>
                    {record.customerSearch.rooms.map((r, i) => (
                      <div key={i} className="text-xs text-gray-700 py-0.5">
                        • <strong>Room {i + 1}:</strong> {r.adults} Adults
                        {r.childrenAges.length > 0 && (
                          <span className="text-[#F7941D] font-semibold">
                            , Ages: {r.childrenAges.join(", ")} yrs
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* A4: What Customer Selected & Price Shown */}
              <div className="rounded-3xl bg-white p-6 shadow-md border border-gray-100">
                <h2 className="text-base font-extrabold text-[#1D1248] flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
                  <FaHotel className="text-[#F7941D]" /> What Customer Selected (A4)
                </h2>
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500 font-medium">Hotel Name:</span>
                    <span className="font-bold text-[#1D1248] text-right">{record.selectedOption.hotelName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500 font-medium">Room Type:</span>
                    <span className="font-bold text-[#1D1248] text-right">{record.selectedOption.roomType}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500 font-medium">Board Basis:</span>
                    <span className="font-bold text-[#F7941D]">{record.selectedOption.boardBasis}</span>
                  </div>
                  {record.selectedOption.flightDetails && (
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-gray-500 font-medium">Flights:</span>
                      <span className="font-bold text-[#1D1248]">
                        {record.selectedOption.flightDetails.airline} ({record.selectedOption.flightDetails.flightNumber})
                      </span>
                    </div>
                  )}

                  {/* Pricing Breakdown (P4) */}
                  <div className="mt-4 pt-3 border-t-2 border-dashed border-gray-200 space-y-1.5">
                    <div className="flex justify-between text-gray-700">
                      <span>Hotel Price:</span>
                      <span className="font-semibold">£{record.customerPricing.hotelPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Local Taxes (Separate Line):</span>
                      <span className="font-semibold text-blue-700">£{record.customerPricing.localTax.toFixed(2)}</span>
                    </div>
                    {record.customerPricing.flightPrice > 0 && (
                      <div className="flex justify-between text-gray-700">
                        <span>Flights Fare (Zero Margin):</span>
                        <span className="font-semibold">£{record.customerPricing.flightPrice.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-extrabold text-[#1D1248] pt-2 border-t border-gray-200">
                      <span>Total Displayed to Customer:</span>
                      <span className="text-xl text-[#F7941D]">£{record.customerPricing.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* A6: CHECK LIVE PRICE ACTION BUTTON & COMPARISON */}
            <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border-2 border-amber-500/40">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-[#1D1248]">
                    Verify Live Supplier Rate (A6)
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Re-run search with supplier now to confirm availability and compare live pricing.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLivePriceCheck}
                  disabled={recheckLoading}
                  className="rounded-2xl bg-[#F7941D] hover:bg-[#e08314] active:scale-95 px-6 py-3 font-extrabold text-white shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  <FaSyncAlt className={`text-xs ${recheckLoading ? "animate-spin" : ""}`} />
                  <span>{recheckLoading ? "Checking Supplier..." : "Check Live Price"}</span>
                </button>
              </div>

              {/* LIVE COMPARISON RESULTS */}
              {liveComparison && (
                <div className="mt-6 rounded-2xl bg-gray-50 p-5 border border-gray-200 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
                      <span className="text-xs text-gray-500 font-semibold block mb-1">Customer Saw:</span>
                      <span className="text-2xl font-black text-gray-700">
                        £{liveComparison.customerOriginalPrice.toFixed(2)}
                      </span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
                      <span className="text-xs text-gray-500 font-semibold block mb-1">Live Supplier Price:</span>
                      <span className="text-2xl font-black text-[#1D1248]">
                        £{liveComparison.livePrice.toFixed(2)}
                      </span>
                    </div>

                    <div className={`p-4 rounded-xl border shadow-xs ${
                      liveComparison.direction === "INCREASED"
                        ? "bg-red-50 border-red-200 text-red-700"
                        : liveComparison.direction === "DECREASED"
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-blue-50 border-blue-200 text-blue-700"
                    }`}>
                      <span className="text-xs font-bold block mb-1">Price Difference:</span>
                      <span className="text-2xl font-black">
                        {liveComparison.differenceSigned > 0 ? `+£${liveComparison.difference.toFixed(2)}` : liveComparison.differenceSigned < 0 ? `-£${liveComparison.difference.toFixed(2)}` : "£0.00"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 p-3.5 rounded-xl bg-white border border-gray-200 text-xs sm:text-sm font-semibold text-[#1D1248] flex items-center gap-2">
                    <FaCheckCircle className="text-[#F7941D] text-base shrink-0" />
                    <span>{liveComparison.explanation}</span>
                  </div>
                </div>
              )}

              {recheckMessage && (
                <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-[#071746]">
                  {recheckMessage}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
