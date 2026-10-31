"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiPhoneCall,
  FiSearch,
  FiClock,
  FiCopy,
  FiCheck,
  FiExternalLink,
  FiCheckCircle,
  FiFilter,
  FiUserCheck,
  FiRefreshCw,
  FiTag,
  FiCalendar,
} from "react-icons/fi";

interface SearchQuote {
  searchId: string;
  searchGeneratedAtUk: string;
  searchGeneratedAtIso: string;
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

export default function AdminBookingsPage() {
  const [quotes, setQuotes] = useState<SearchQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  async function loadQuotes() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/config");
      const data = await res.json();
      if (data.success && data.searchRecords) {
        setQuotes(data.searchRecords);
      }
    } catch (err) {
      console.error("Failed to load search quotes:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuotes();
  }, []);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredQuotes = quotes.filter((q) => {
    if (search) {
      const s = search.toLowerCase();
      const matchesId = q.searchId.toLowerCase().includes(s);
      const matchesDest = (q.customerSearch?.destinationName || q.customerSearch?.destination || "").toLowerCase().includes(s);
      const matchesAirport = (q.customerSearch?.departureAirport || "").toLowerCase().includes(s);
      const matchesHotel = (q.selectedOption?.hotelName || "").toLowerCase().includes(s);
      if (!matchesId && !matchesDest && !matchesAirport && !matchesHotel) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Phone Quotes & Enquiries Queue</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
              Stage 1 Phone Booking Model
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Online checkout is disabled per Stage 1 requirements. Customers call UK sales on{" "}
            <strong className="text-brand-900">0330 165 8879</strong> quoting their 8-character Search ID.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/admin/agent"
            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 px-4 py-2.5 rounded-xl transition shadow-xs">
            <span>Agent Tool</span>
            <FiExternalLink className="text-xs" />
          </Link>
          <button
            onClick={loadQuotes}
            disabled={loading}
            className="p-2.5 text-gray-500 hover:text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
            title="Refresh Quotes"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <FiSearch className="absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID (HJ-XXXXXX), destination, hotel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
          <span className="text-gray-400">Total sessions:</span>
          <span className="font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg">
            {quotes.length} quotes stored (30-day retention)
          </span>
        </div>
      </div>

      {/* Quotes Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-gray-400 text-sm">
            <FiRefreshCw className="animate-spin text-2xl mx-auto mb-2 text-brand-500" />
            Loading phone quotes...
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="p-16 text-center text-gray-500 text-sm">
            <FiPhoneCall className="text-3xl text-gray-300 mx-auto mb-2" />
            <p className="font-semibold text-gray-700">No quotes match your search criteria</p>
            <p className="text-xs text-gray-400 mt-1">
              Search sessions created by website visitors are automatically saved here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5">Quote Search ID</th>
                  <th className="px-6 py-3.5">UK Timestamp</th>
                  <th className="px-6 py-3.5">Trip Type & Route</th>
                  <th className="px-6 py-3.5">Travel Dates & Party</th>
                  <th className="px-6 py-3.5">Lead Accommodation</th>
                  <th className="px-6 py-3.5 text-right">Customer Total</th>
                  <th className="px-6 py-3.5 text-right">Consultant Margin</th>
                  <th className="px-6 py-3.5 text-center">Consultant Re-check</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredQuotes.map((q) => {
                  const totalAdults = q.customerSearch?.totalAdults || q.customerSearch?.rooms?.reduce((acc, r) => acc + r.adults, 0) || 2;
                  const totalChildren = q.customerSearch?.totalChildren || q.customerSearch?.rooms?.reduce((acc, r) => acc + r.childrenAges.length, 0) || 0;
                  const totalPrice = q.customerPricing?.totalPrice;
                  const estMargin = q.customerPricing
                    ? Math.max(0, q.customerPricing.totalPrice - (q.customerPricing.flightPrice || 0) - (q.customerPricing.localTax || 0) - (q.internalAudit?.supplierCostGbp || 0))
                    : 0;

                  return (
                    <tr key={q.searchId} className="hover:bg-brand-50/20 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-brand-900 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{q.searchId}</span>
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
                          <span>{q.searchGeneratedAtUk || "Recent"}</span>
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
                      <td className="px-6 py-4 text-gray-700 max-w-[220px] truncate">
                        {q.selectedOption?.hotelName || "Selected Stays"}
                      </td>
                      <td className="px-6 py-4 text-right font-extrabold text-brand-900">
                        {totalPrice ? `£${totalPrice.toFixed(2)}` : "—"}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-600">
                        {estMargin ? `£${estMargin.toFixed(2)}` : "—"}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <Link
                          href={`/admin/agent?searchId=${q.searchId}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition border border-brand-100"
                        >
                          <FiUserCheck className="text-brand-600" />
                          <span>Open in Agent Tool</span>
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
    </div>
  );
}
