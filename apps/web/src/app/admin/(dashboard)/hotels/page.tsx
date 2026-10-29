"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  FiHome,
  FiSearch,
  FiFilter,
  FiCheckCircle,
  FiZap,
  FiAlertCircle,
  FiCopy,
  FiCheck,
  FiMapPin,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiRefreshCw,
  FiShield,
} from "react-icons/fi";
import { SearchableSelect } from "@/components/SearchableSelect";

interface HotelItem {
  hotelCode: string;
  hotelName: string;
  address: string;
  cityId: string;
  cityName: string;
  countryName: string;
  hasCuratedProfile?: boolean;
}

interface CityOption {
  cityId: string;
  cityName: string;
  countryName: string;
  count: number;
}

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState<HotelItem[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cityId, setCityId] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalHotels, setTotalHotels] = useState(1842);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const cityOptions = useMemo(() => [
    { value: "", label: `All Cities (${totalHotels} hotels)` },
    ...cities.map((c) => ({
      value: c.cityId,
      label: c.cityName,
      badge: `${c.count} hotels`,
      searchTerms: [c.cityName, c.cityId, c.countryName],
    })),
  ], [cities, totalHotels]);

  // Rate check modal
  const [selectedHotel, setSelectedHotel] = useState<HotelItem | null>(null);
  const [checkingRate, setCheckingRate] = useState(false);
  const [rateResult, setRateResult] = useState<any>(null);
  const [rateNotice, setRateNotice] = useState<string>("");

  async function fetchHotels(currentPage = 1, currentSearch = search, currentCityId = cityId) {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "25",
        search: currentSearch,
        cityId: currentCityId,
      });

      const res = await fetch(`/api/admin/hotels?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setHotels(data.hotels);
        setTotalPages(data.totalPages);
        setTotalHotels(data.total);
        if (data.cities && cities.length === 0) {
          setCities(data.cities);
        }
      }
    } catch (err) {
      console.error("Failed to load hotels:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHotels(page, search, cityId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, cityId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchHotels(1, search, cityId);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenRateModal = (hotel: HotelItem) => {
    setSelectedHotel(hotel);
    setRateResult(null);
    setRateNotice("");
  };

  const handleCheckLiveRate = async () => {
    if (!selectedHotel) return;
    try {
      setCheckingRate(true);
      const res = await fetch("/api/admin/hotels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hotelCode: selectedHotel.hotelCode }),
      });
      const data = await res.json();
      if (data.success) {
        setRateResult(data.hotelResult);
        setRateNotice(data.notice);
      } else {
        alert(data.error || "Rate check failed");
      }
    } catch (err) {
      console.error("Rate check error:", err);
    } finally {
      setCheckingRate(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Hotel Inventory</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
              1,842 Mapped Hotels
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <FiShield className="text-emerald-500" />
            0 Credits Used for Browsing
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <FiSearch className="absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by hotel name, code (e.g. 1848131), or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-full md:w-72">
              <SearchableSelect
                options={cityOptions}
                value={cityId}
                onChange={(val) => {
                  setCityId(val);
                  setPage(1);
                }}
                placeholder="Select city..."
                searchPlaceholder="Search city..."
                triggerClassName="py-2.5 rounded-xl border-gray-200 bg-white font-medium"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition shrink-0"
            >
              Filter
            </button>

            {(search || cityId) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCityId("");
                  setPage(1);
                  fetchHotels(1, "", "");
                }}
                className="p-2.5 text-gray-400 hover:text-gray-600 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
                title="Reset Filters"
              >
                <FiX />
              </button>
            )}
          </div>
        </form>

        {/* Quick City Filter Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-gray-400 font-semibold shrink-0">Popular clusters:</span>
          {cities.slice(0, 7).map((c) => (
            <button
              key={c.cityId}
              onClick={() => {
                setCityId(c.cityId);
                setPage(1);
              }}
              className={`px-3 py-1 rounded-lg border font-medium shrink-0 transition ${cityId === c.cityId
                ? "bg-brand-600 text-white border-brand-600"
                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-brand-50 hover:text-brand-700"
                }`}
            >
              {c.cityName} ({c.count})
            </button>
          ))}
        </div>
      </div>

      {/* Hotels Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
            Showing {hotels.length} of {totalHotels} matching hotels (Page {page} of {totalPages})
          </span>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="p-2 text-gray-500 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition"
              title="Previous Page"
            >
              <FiChevronLeft />
            </button>
            <span className="text-xs font-semibold text-gray-700 px-2">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="p-2 text-gray-500 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition"
              title="Next Page"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center text-gray-400 text-sm">
            <FiRefreshCw className="animate-spin text-2xl mx-auto mb-2 text-brand-500" />
            Loading hotels...
          </div>
        ) : hotels.length === 0 ? (
          <div className="p-16 text-center text-gray-500 text-sm">
            <FiHome className="text-3xl text-gray-300 mx-auto mb-2" />
            No hotels match your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3.5">Hotel Code</th>
                  <th className="px-5 py-3.5">Hotel Name</th>
                  <th className="px-5 py-3.5">City & Country</th>
                  <th className="px-5 py-3.5">Address</th>
                  <th className="px-5 py-3.5">Source & Mapping</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {hotels.map((h) => (
                  <tr key={h.hotelCode} className="hover:bg-brand-50/20 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-brand-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{h.hotelCode}</span>
                        <button
                          onClick={() => handleCopyCode(h.hotelCode)}
                          title="Copy Hotel Code"
                          className="text-gray-400 hover:text-brand-600 transition"
                        >
                          {copiedCode === h.hotelCode ? (
                            <FiCheck className="text-emerald-500" />
                          ) : (
                            <FiCopy className="text-xs" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-gray-900">
                      <div>{h.hotelName}</div>
                      {h.hasCuratedProfile && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 inline-block mt-0.5">
                          ★ Curated Profile
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-gray-700 whitespace-nowrap">
                      <div className="font-medium">{h.cityName}</div>
                      <div className="text-[11px] text-gray-400">{h.countryName}</div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 max-w-xs truncate" title={h.address}>
                      {h.address || "Standard Address"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        <FiCheckCircle className="text-[10px]" />
                        Static Indexed (0 credits)
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenRateModal(h)}
                        className="px-3 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition border border-brand-100 inline-flex items-center gap-1.5"
                      >
                        <FiZap className="text-amber-500" />
                        <span>Check Rate</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Test Live Rate Modal */}
      {selectedHotel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setSelectedHotel(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <FiX className="text-xl" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-100 font-mono">
                Code: {selectedHotel.hotelCode}
              </span>
              <span className="text-xs text-gray-400">• {selectedHotel.cityName}</span>
            </div>

            <h3 className="text-lg font-bold text-gray-900">{selectedHotel.hotelName}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{selectedHotel.address}</p>

            <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <div className="flex items-start gap-2">
                <FiAlertCircle className="text-amber-600 shrink-0 text-sm mt-0.5" />
                <div>
                  <strong>Live Query Notice:</strong> This action queries the GRN Connect V3 endpoint directly for real-time live rates.
                </div>
              </div>
            </div>

            {!rateResult && (
              <div className="mt-5 text-center">
                <button
                  onClick={handleCheckLiveRate}
                  disabled={checkingRate}
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition shadow flex items-center justify-center gap-2"
                >
                  {checkingRate ? (
                    <>
                      <FiRefreshCw className="animate-spin" />
                      <span>Checking Availability with GRN Connect...</span>
                    </>
                  ) : (
                    <>
                      <FiZap className="text-sun-400" />
                      <span>Check Live Availability (2 Adults)</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {rateResult && (
              <div className="mt-5 space-y-4">
                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 text-xs border border-emerald-200">
                  {rateNotice}
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {rateResult.availableRates?.map((rate: any, idx: number) => (
                    <div
                      key={rate.rateKey || idx}
                      className="p-3 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-gray-900">{rate.roomType}</div>
                        <div className="text-[11px] text-gray-500">{rate.boardBasis}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-brand-900 text-sm">
                          £{rate.customerPricing?.totalPriceGbp?.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          Net: ₹{rate.serverCalculation?.supplierNetCostInr} • 13% Margin: £
                          {rate.customerPricing?.hotelMarginGbp?.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedHotel(null)}
                  className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
