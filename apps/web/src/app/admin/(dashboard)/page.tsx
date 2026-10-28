"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiZap,
  FiPhoneCall,
  FiHome,
  FiPercent,
  FiCheckCircle,
  FiClock,
  FiExternalLink,
  FiCopy,
  FiCheck,
  FiSearch,
  FiRefreshCw,
  FiLayers,
  FiDatabase,
  FiShield,
  FiMapPin,
} from "react-icons/fi";

interface DashboardTelemetry {
  creditStatus: string;
  totalCreditsAllocated: number;
  creditsUsed: number;
  creditsRemaining: number;
  cachedSearchesCount: number;
  totalCacheHits: number;
  creditsSavedCount: number;
  apiBaseUrl: string;
  lastApiCallAt: string;
  totalIndexedHotels: number;
  staticAssetFeed: string;
  cacheEfficiencyPct: number;
}

interface DashboardMetrics {
  totalSearchQuotes: number;
  todaySearchQuotes: number;
  totalQuoteVolumeGbp: number;
  totalMarginGeneratedGbp: number;
  activeHotDealsCount: number;
  totalHotDealsCount: number;
  masterDestinationsCount: number;
  defaultHotelMarginPct: number;
}

interface RecentQuote {
  searchId: string;
  searchGeneratedAtUk: string;
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
    address?: string;
  };
  customerPricing: {
    hotelPrice: number;
    localTax: number;
    flightPrice: number;
    transfersPrice: number;
    totalPrice: number;
    pricePerPerson: number;
    currency: "GBP";
  };
  internalAudit?: {
    supplierCostInr: number;
    supplierCostGbp: number;
    marginRate: number;
    currencyRate: number;
    priceFetchedAtUk: string;
  };
}

interface CityCluster {
  cityName: string;
  countryName: string;
  cityId: string;
  count: number;
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [telemetry, setTelemetry] = useState<DashboardTelemetry | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentQuotes, setRecentQuotes] = useState<RecentQuote[]>([]);
  const [cityClusters, setCityClusters] = useState<CityCluster[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>("");

  async function fetchDashboardStats() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setTelemetry(data.telemetry);
        setMetrics(data.metrics);
        setRecentQuotes(data.recentQuotes || []);
        setCityClusters(data.cityClusters || []);
        setLastRefreshedAt(new Date().toLocaleTimeString("en-GB"));
      }
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">HolidayJug Control Centre</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Dynamic Data
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Real-time telemetry, 1,842 mapped sandbox hotels, phone quote queue, and credit-conservation monitor.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden md:block">
            <div className="text-xs text-gray-400 font-medium">UK System Time (Europe/London)</div>
            <div className="text-sm font-bold text-gray-800">
              {new Date().toLocaleTimeString("en-GB", { timeZone: "Europe/London", hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
          <button
            onClick={fetchDashboardStats}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-xl transition border border-brand-100"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            <span>Refresh Stats</span>
          </button>
        </div>
      </div>

      {/* Credit Conservation Active Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-950 to-brand-900 text-white rounded-2xl p-5 shadow-sm border border-brand-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-sun-400/20 text-sun-300 flex items-center justify-center shrink-0 border border-sun-400/30">
            <FiShield className="text-xl" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white">Smart Credit Conservation Mode Active</h3>
              <span className="text-[11px] font-semibold bg-sun-400/20 text-sun-300 px-2 py-0.5 rounded-full border border-sun-400/30">
                Strict TTL Caching
              </span>
            </div>
            <p className="text-xs text-white/75 mt-0.5 max-w-2xl leading-relaxed">
              API credits are strictly preserved: Local sandbox index (1,842 hotels) serves instant zero-credit browsing.
              Availability queries execute live in real-time. Cities and static master feeds are cached for 24 hours.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 shrink-0 bg-white/10 px-4 py-2.5 rounded-xl border border-white/10">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-white/60 font-semibold">Cache Efficiency</div>
            <div className="text-xl font-extrabold text-sun-400">
              {telemetry ? `${telemetry.cacheEfficiencyPct}%` : "100%"}
            </div>
          </div>
          <div className="w-px h-8 bg-white/15" />
          <div>
            <div className="text-[11px] uppercase tracking-wider text-white/60 font-semibold">Credits Saved</div>
            <div className="text-xl font-extrabold text-emerald-400">
              {telemetry ? `+${telemetry.creditsSavedCount}` : "+0"}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: GRN Connect Sandbox Credits */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:border-brand-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">GRN API Credits</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <FiZap className="text-lg" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-gray-900">
                {telemetry ? telemetry.creditsRemaining.toLocaleString() : "50,000"}
              </span>
              <span className="text-xs font-semibold text-gray-400">/ 50,000 allocated</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-100 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-brand-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${telemetry ? Math.min(100, Math.max(5, (telemetry.creditsRemaining / telemetry.totalCreditsAllocated) * 100)) : 100}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between mt-2.5 text-xs text-gray-500">
              <span>{telemetry ? `${telemetry.totalCacheHits} cache hits` : "0 hits"}</span>
              <span className="text-emerald-600 font-semibold">Status: Active V3</span>
            </div>
          </div>
        </div>

        {/* Card 2: Generated Phone Quotes */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:border-brand-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Phone Quotes Queue</span>
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100">
              <FiPhoneCall className="text-lg" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-gray-900">
                {metrics ? metrics.totalSearchQuotes : 0}
              </span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                +{metrics?.todaySearchQuotes || 0} today
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Vol: <strong className="text-gray-800">£{metrics ? metrics.totalQuoteVolumeGbp.toLocaleString() : "0"}</strong> • Est. Margin: <strong className="text-brand-600">£{metrics ? metrics.totalMarginGeneratedGbp.toLocaleString() : "0"}</strong>
            </p>
            <div className="mt-2.5">
              <Link
                href="/admin/bookings"
                className="text-xs font-semibold text-brand-600 hover:text-brand-800 inline-flex items-center gap-1"
              >
                View quote enquiries &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Card 3: Mapped Sandbox Hotels */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:border-brand-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Mapped Hotels</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <FiHome className="text-lg" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-gray-900">
                {telemetry ? telemetry.totalIndexedHotels.toLocaleString() : "1,842"}
              </span>
              <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                Sandbox Excel
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Indexed from <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">supported hotels on sandbox.xlsx</code>
            </p>
            <div className="mt-2.5">
              <Link
                href="/admin/hotels"
                className="text-xs font-semibold text-purple-600 hover:text-purple-800 inline-flex items-center gap-1"
              >
                Browse 1,842 hotels (0 credits) &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Card 4: Engine Margin & Deals */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:border-brand-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Engine Margin</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <FiPercent className="text-lg" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-gray-900">
                {metrics ? `${metrics.defaultHotelMarginPct}%` : "13%"}
              </span>
              <span className="text-xs font-semibold text-gray-400">True Margin</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Formula: <code className="text-xs bg-gray-100 px-1 py-0.5 rounded text-gray-700">Cost / (1 - 0.13)</code>
            </p>
            <div className="flex items-center justify-between mt-2.5 text-xs text-gray-500">
              <span>{metrics ? `${metrics.activeHotDealsCount} active hot deals` : "3 deals"}</span>
              <Link href="/admin/settings" className="text-xs font-semibold text-rose-600 hover:text-rose-800">
                Configure &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hotel Sandbox Clusters (Dubai, LA, Delhi, Jaipur, Luxor, etc.) */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Sandbox Hotel Clusters</h2>
            <p className="text-xs text-gray-500">
              Statically indexed from official GRN Connect sandbox data. Ready for zero-credit local search & testing.
            </p>
          </div>
          <Link
            href="/admin/hotels"
            className="text-xs font-semibold text-brand-600 hover:text-brand-800 inline-flex items-center gap-1"
          >
            Open Hotels Explorer &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {cityClusters.slice(0, 6).map((c) => (
            <Link
              key={c.cityId}
              href={`/admin/hotels?cityId=${c.cityId}`}
              className="group p-3.5 rounded-xl border border-gray-100 hover:border-brand-300 hover:shadow-sm bg-gray-50/50 hover:bg-brand-50/30 transition text-left"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900 group-hover:text-brand-700 transition">
                  {c.cityName}
                </span>
                <FiMapPin className="text-xs text-gray-400 group-hover:text-brand-500 transition" />
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5 truncate">{c.countryName}</p>
              <div className="mt-2 text-xs font-extrabold text-brand-600">
                {c.count} hotels
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Customer Phone Quotes Queue Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">Recent Customer Search Quotes</h2>
              <span className="text-xs font-semibold bg-brand-50 text-brand-700 px-2.5 py-0.5 rounded-full border border-brand-100">
                {recentQuotes.length} active sessions
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Live quotes generated on the site. Customers quote these 8-character IDs when calling UK Sales on 0330 165 8879.
            </p>
          </div>

          <Link
            href="/agent"
            target="_blank"
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 px-4 py-2.5 rounded-xl transition shadow-sm"
          >
            <span>Open Agent Lookup Tool</span>
            <FiExternalLink className="text-xs" />
          </Link>
        </div>

        {recentQuotes.length === 0 ? (
          <div className="p-12 text-center">
            <FiSearch className="text-3xl text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-600">No search quotes generated yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Perform a search on the homepage or search page to generate live quote sessions.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5">Search ID</th>
                  <th className="px-6 py-3.5">UK Timestamp</th>
                  <th className="px-6 py-3.5">Type & Route</th>
                  <th className="px-6 py-3.5">Dates & Guests</th>
                  <th className="px-6 py-3.5">Lead Hotel</th>
                  <th className="px-6 py-3.5 text-right">Customer Price</th>
                  <th className="px-6 py-3.5 text-right">13% Margin</th>
                  <th className="px-6 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentQuotes.map((q) => {
                  const totalAdults = q.customerSearch?.totalAdults || q.customerSearch?.rooms?.reduce((acc, r) => acc + r.adults, 0) || 2;
                  const totalChildren = q.customerSearch?.totalChildren || q.customerSearch?.rooms?.reduce((acc, r) => acc + r.childrenAges.length, 0) || 0;
                  const totalPrice = q.customerPricing?.totalPrice;
                  const estMargin = q.customerPricing
                    ? Math.max(0, q.customerPricing.totalPrice - (q.customerPricing.flightPrice || 0) - (q.customerPricing.localTax || 0) - (q.internalAudit?.supplierCostGbp || 0))
                    : 0;

                  return (
                    <tr key={q.searchId} className="hover:bg-brand-50/20 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-brand-900">
                        <div className="flex items-center gap-2">
                          <span>{q.searchId}</span>
                          <button
                            onClick={() => handleCopyId(q.searchId)}
                            title="Copy Search ID"
                            className="text-gray-400 hover:text-brand-600 transition"
                          >
                            {copiedId === q.searchId ? (
                              <FiCheck className="text-emerald-500" />
                            ) : (
                              <FiCopy className="text-xs" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <FiClock className="text-gray-400 text-xs shrink-0" />
                          <span>{q.searchGeneratedAtUk || "Just now"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-800">
                          {q.customerSearch?.departureAirport
                            ? `${q.customerSearch.departureAirport} → ${q.customerSearch.destinationName || q.customerSearch.destination}`
                            : `Hotel Only (${q.customerSearch?.destinationName || q.customerSearch?.destination || "Dubai"})`}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                        <div>
                          {q.customerSearch?.checkIn} → {q.customerSearch?.checkOut}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {totalAdults} adult{totalAdults > 1 ? "s" : ""}
                          {totalChildren > 0 ? `, ${totalChildren} child` : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 max-w-[200px] truncate">
                        {q.selectedOption?.hotelName || "Selected Stays"}
                      </td>
                      <td className="px-6 py-4 text-right font-extrabold text-brand-900">
                        {totalPrice ? `£${totalPrice.toFixed(2)}` : "—"}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-600">
                        {estMargin ? `£${estMargin.toFixed(2)}` : "—"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          href={`/agent?searchId=${q.searchId}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition border border-brand-100"
                        >
                          <span>Inspect</span>
                          <FiExternalLink className="text-[10px]" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Credit & Cache Telemetry Specs Footer */}
      <div className="bg-gray-50 rounded-2xl border border-gray-200/80 p-5 text-xs text-gray-500 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FiDatabase className="text-brand-500" />
          <span>
            API Endpoint: <code className="bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-700">{telemetry?.apiBaseUrl || "https://api-sandbox.grnconnect.com/api/v3"}</code>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>Last API Hit: <strong>{telemetry?.lastApiCallAt || "None"}</strong></span>
          <span>Last UI Sync: <strong>{lastRefreshedAt || "Just now"}</strong></span>
        </div>
      </div>
    </div>
  );
}
