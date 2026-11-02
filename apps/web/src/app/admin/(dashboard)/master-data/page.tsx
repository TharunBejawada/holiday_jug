"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FiGlobe,
  FiMapPin,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiHome,
  FiStar,
} from "react-icons/fi";

interface CountryRecord {
  code2: string;
  code3: string | null;
  name: string;
  cityCount: number;
  hotelCount: number;
}

interface CityRecord {
  code: string;
  name: string;
  countryCode: string;
  countryName: string;
}

interface HotelRecord {
  code: string;
  name: string;
  cityCode: string;
  cityName: string;
  countryCode: string;
  countryName: string;
  starCategory: string | null;
  address: string | null;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  accommodationTypeSubName: string | null;
  chainName: string | null;
}

export default function MasterDataPage() {
  const [activeTab, setActiveTab] = useState<"countries" | "cities" | "hotels">("countries");

  // Summary counts
  const [summary, setSummary] = useState<{
    countriesCount: number;
    citiesCount: number;
    hotelsCount: number;
  }>({
    countriesCount: 254,
    citiesCount: 81790,
    hotelsCount: 0,
  });

  // Countries Tab state
  const [countries, setCountries] = useState<CountryRecord[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  // Cities Tab state
  const [cities, setCities] = useState<CityRecord[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [selectedCountryFilter, setSelectedCountryFilter] = useState("");
  const [cityPage, setCityPage] = useState(1);
  const [cityTotalPages, setCityTotalPages] = useState(1);
  const [totalCities, setTotalCities] = useState(0);

  // Hotels Tab state
  const [hotels, setHotels] = useState<HotelRecord[]>([]);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  const [hotelSearch, setHotelSearch] = useState("");
  const [hotelCountryFilter, setHotelCountryFilter] = useState("");
  const [hotelStarFilter, setHotelStarFilter] = useState("");
  const [hotelPage, setHotelPage] = useState(1);
  const [hotelTotalPages, setHotelTotalPages] = useState(1);
  const [totalHotels, setTotalHotels] = useState(0);

  // Fetch summary
  const fetchSummary = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/master-data?type=summary");
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
      }
    } catch (e) {
      console.error("Failed to load summary", e);
    }
  }, []);

  // Fetch countries
  const fetchCountries = useCallback(async (query = "") => {
    setCountriesLoading(true);
    try {
      const params = new URLSearchParams({ type: "countries" });
      if (query) params.set("q", query);
      const res = await fetch(`/api/admin/master-data?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCountries(data.countries || []);
      }
    } catch (e) {
      console.error("Failed to load countries", e);
    } finally {
      setCountriesLoading(false);
    }
  }, []);

  // Fetch cities
  const fetchCities = useCallback(
    async (page = 1, query = "", country = "") => {
      setCitiesLoading(true);
      try {
        const params = new URLSearchParams({
          type: "cities",
          page: String(page),
          limit: "50",
        });
        if (query) params.set("q", query);
        if (country) params.set("country", country);

        const res = await fetch(`/api/admin/master-data?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setCities(data.cities || []);
          setTotalCities(data.total || 0);
          setCityTotalPages(data.totalPages || 1);
          setCityPage(data.page || 1);
        }
      } catch (e) {
        console.error("Failed to load cities", e);
      } finally {
        setCitiesLoading(false);
      }
    },
    []
  );

  // Fetch hotels
  const fetchHotels = useCallback(
    async (page = 1, query = "", country = "", star = "") => {
      setHotelsLoading(true);
      try {
        const params = new URLSearchParams({
          type: "hotels",
          page: String(page),
          limit: "50",
        });
        if (query) params.set("q", query);
        if (country) params.set("country", country);
        if (star) params.set("star", star);

        const res = await fetch(`/api/admin/master-data?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setHotels(data.hotels || []);
          setTotalHotels(data.total || 0);
          setHotelTotalPages(data.totalPages || 1);
          setHotelPage(data.page || 1);
        }
      } catch (e) {
        console.error("Failed to load hotels", e);
      } finally {
        setHotelsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchSummary();
    fetchCountries();
  }, [fetchSummary, fetchCountries]);

  useEffect(() => {
    if (activeTab === "cities") {
      fetchCities(cityPage, citySearch, selectedCountryFilter);
    } else if (activeTab === "hotels") {
      fetchHotels(hotelPage, hotelSearch, hotelCountryFilter, hotelStarFilter);
    }
  }, [
    activeTab,
    cityPage,
    selectedCountryFilter,
    hotelPage,
    hotelCountryFilter,
    hotelStarFilter,
    fetchCities,
    fetchHotels,
  ]);

  // Debounced country search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCountries(countrySearch);
    }, 250);
    return () => clearTimeout(timer);
  }, [countrySearch, fetchCountries]);

  const handleCitySearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCityPage(1);
    fetchCities(1, citySearch, selectedCountryFilter);
  };

  const handleHotelSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHotelPage(1);
    fetchHotels(1, hotelSearch, hotelCountryFilter, hotelStarFilter);
  };

  const handleViewCitiesForCountry = (countryCode: string) => {
    setSelectedCountryFilter(countryCode);
    setCitySearch("");
    setCityPage(1);
    setActiveTab("cities");
    fetchCities(1, "", countryCode);
  };

  const handleViewHotelsForCountry = (countryCode: string) => {
    setHotelCountryFilter(countryCode);
    setHotelSearch("");
    setHotelStarFilter("");
    setHotelPage(1);
    setActiveTab("hotels");
    fetchHotels(1, "", countryCode, "");
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-gray-900">Master Data Catalog</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live DB
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            Supplier master dataset reference for Countries, Cities, and Hotels Inventory.
          </p>
        </div>

        <button
          onClick={() => {
            fetchSummary();
            if (activeTab === "countries") fetchCountries(countrySearch);
            else if (activeTab === "cities") fetchCities(cityPage, citySearch, selectedCountryFilter);
            else fetchHotels(hotelPage, hotelSearch, hotelCountryFilter, hotelStarFilter);
          }}
          className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <FiRefreshCw className="text-xs" />
          <span>Refresh</span>
        </button>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Countries Card */}
        <div
          onClick={() => setActiveTab("countries")}
          className={`p-5 rounded-2xl bg-white border transition-all cursor-pointer shadow-xs ${
            activeTab === "countries"
              ? "border-[#F7941D] ring-2 ring-[#F7941D]/20 shadow-md"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Country Master
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#F7941D] flex items-center justify-center">
              <FiGlobe className="text-lg" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold text-gray-900">
            {summary.countriesCount.toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Global ISO 2-letter &amp; 3-letter country codes
          </p>
        </div>

        {/* Cities Card */}
        <div
          onClick={() => setActiveTab("cities")}
          className={`p-5 rounded-2xl bg-white border transition-all cursor-pointer shadow-xs ${
            activeTab === "cities"
              ? "border-[#F7941D] ring-2 ring-[#F7941D]/20 shadow-md"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              City Master
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FiMapPin className="text-lg" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold text-gray-900">
            {summary.citiesCount.toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Supplier destination cities linked to countries
          </p>
        </div>

        {/* Hotels Card */}
        <div
          onClick={() => setActiveTab("hotels")}
          className={`p-5 rounded-2xl bg-white border transition-all cursor-pointer shadow-xs ${
            activeTab === "hotels"
              ? "border-[#F7941D] ring-2 ring-[#F7941D]/20 shadow-md"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Hotels Master
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FiHome className="text-lg" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold text-gray-900">
            {summary.hotelsCount.toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Global hotel properties with star ratings &amp; addresses
          </p>
        </div>
      </div>

      {/* TABS CONTAINER */}
      <div className="bg-white rounded-2xl border border-gray-200 p-2 shadow-xs">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
          <button
            onClick={() => setActiveTab("countries")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === "countries"
                ? "bg-[#1D1248] text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <FiGlobe />
            <span>Countries</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                activeTab === "countries"
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {summary.countriesCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("cities")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === "cities"
                ? "bg-[#1D1248] text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <FiMapPin />
            <span>Cities</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                activeTab === "cities"
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {summary.citiesCount.toLocaleString()}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("hotels")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === "hotels"
                ? "bg-[#1D1248] text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <FiHome />
            <span>Hotels</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                activeTab === "hotels"
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {summary.hotelsCount.toLocaleString()}
            </span>
          </button>
        </div>

        {/* TAB 1: COUNTRIES VIEW */}
        {activeTab === "countries" && (
          <div className="p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search country name, code (e.g. ES, Spain, ESP)..."
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F7941D]/30 focus:border-[#F7941D]"
                />
              </div>
              <div className="text-xs text-gray-500 font-medium">
                Showing {countries.length} countries
              </div>
            </div>

            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/80 text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Country Code (2L)</th>
                    <th className="py-3 px-4">Country Code (3L)</th>
                    <th className="py-3 px-4">Country Name</th>
                    <th className="py-3 px-4">Linked Cities</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                  {countriesLoading ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-400">
                        <FiRefreshCw className="animate-spin text-xl mx-auto mb-2 text-[#F7941D]" />
                        Loading countries...
                      </td>
                    </tr>
                  ) : countries.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-400">
                        No countries found matching &ldquo;{countrySearch}&rdquo;
                      </td>
                    </tr>
                  ) : (
                    countries.map((c) => (
                      <tr key={c.code2} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-xs px-2 py-1 bg-amber-50 text-[#F7941D] border border-amber-200 rounded-lg">
                            {c.code2}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {c.code3 ? (
                            <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                              {c.code3}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-300">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-900">{c.name}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                            {c.cityCount.toLocaleString()} cities
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-3">
                          <button
                            type="button"
                            onClick={() => handleViewCitiesForCountry(c.code2)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#F7941D] hover:underline cursor-pointer"
                          >
                            <span>Cities &rarr;</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleViewHotelsForCountry(c.code2)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:underline cursor-pointer"
                          >
                            <span>Hotels &rarr;</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CITIES VIEW */}
        {activeTab === "cities" && (
          <div className="p-4 space-y-4">
            <form onSubmit={handleCitySearchSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search city name (e.g. Barcelona) or city code..."
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F7941D]/30 focus:border-[#F7941D]"
                />
              </div>

              <div className="w-full sm:w-64">
                <select
                  value={selectedCountryFilter}
                  onChange={(e) => {
                    setSelectedCountryFilter(e.target.value);
                    setCityPage(1);
                  }}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F7941D]/30 focus:border-[#F7941D] cursor-pointer"
                >
                  <option value="">All Countries ({countries.length})</option>
                  {countries.map((c) => (
                    <option key={c.code2} value={c.code2}>
                      {c.name} ({c.code2}) - {c.cityCount}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-[#1D1248] hover:bg-[#2B1B6D] text-white text-sm font-bold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Search
              </button>

              {(citySearch || selectedCountryFilter) && (
                <button
                  type="button"
                  onClick={() => {
                    setCitySearch("");
                    setSelectedCountryFilter("");
                    setCityPage(1);
                    fetchCities(1, "", "");
                  }}
                  className="px-3 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 bg-gray-100 rounded-xl hover:bg-gray-200 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </form>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 font-medium border-t border-b border-gray-100 py-2.5">
              <span>
                Showing {cities.length > 0 ? (cityPage - 1) * 50 + 1 : 0} -{" "}
                {Math.min(cityPage * 50, totalCities)} of {totalCities.toLocaleString()} cities
                {selectedCountryFilter ? ` in ${selectedCountryFilter}` : ""}
              </span>

              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <button
                  type="button"
                  disabled={cityPage <= 1 || citiesLoading}
                  onClick={() => setCityPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 cursor-pointer"
                  aria-label="Previous Page"
                >
                  <FiChevronLeft />
                </button>
                <span>
                  Page {cityPage} of {cityTotalPages}
                </span>
                <button
                  type="button"
                  disabled={cityPage >= cityTotalPages || citiesLoading}
                  onClick={() => setCityPage((p) => Math.min(cityTotalPages, p + 1))}
                  className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 cursor-pointer"
                  aria-label="Next Page"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/80 text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4">City Code</th>
                    <th className="py-3 px-4">City Name</th>
                    <th className="py-3 px-4">Country Code</th>
                    <th className="py-3 px-4">Country Name</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                  {citiesLoading ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-400">
                        <FiRefreshCw className="animate-spin text-xl mx-auto mb-2 text-[#F7941D]" />
                        Loading cities...
                      </td>
                    </tr>
                  ) : cities.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-400">
                        No cities found matching your search.
                      </td>
                    </tr>
                  ) : (
                    cities.map((city) => (
                      <tr key={city.code} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-xs px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg border border-slate-200">
                            {city.code}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-gray-900">{city.name}</td>
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-xs px-2 py-0.5 bg-amber-50 text-[#F7941D] rounded border border-amber-200">
                            {city.countryCode}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{city.countryName}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setHotelCountryFilter(city.countryCode);
                              setHotelSearch(city.name);
                              setHotelStarFilter("");
                              setHotelPage(1);
                              setActiveTab("hotels");
                              fetchHotels(1, city.name, city.countryCode, "");
                            }}
                            className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:underline cursor-pointer"
                          >
                            <span>Hotels &rarr;</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {cityTotalPages > 1 && (
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                <div>
                  Page {cityPage} of {cityTotalPages} ({totalCities.toLocaleString()} total)
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={cityPage <= 1 || citiesLoading}
                    onClick={() => setCityPage(1)}
                    className="px-2.5 py-1.5 rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 font-semibold cursor-pointer"
                  >
                    First
                  </button>
                  <button
                    type="button"
                    disabled={cityPage <= 1 || citiesLoading}
                    onClick={() => setCityPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 cursor-pointer"
                    aria-label="Previous Page"
                  >
                    <FiChevronLeft />
                  </button>
                  <span className="px-2 font-bold text-gray-800">{cityPage}</span>
                  <button
                    type="button"
                    disabled={cityPage >= cityTotalPages || citiesLoading}
                    onClick={() => setCityPage((p) => Math.min(cityTotalPages, p + 1))}
                    className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 cursor-pointer"
                    aria-label="Next Page"
                  >
                    <FiChevronRight />
                  </button>
                  <button
                    type="button"
                    disabled={cityPage >= cityTotalPages || citiesLoading}
                    onClick={() => setCityPage(cityTotalPages)}
                    className="px-2.5 py-1.5 rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 font-semibold cursor-pointer"
                  >
                    Last
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: HOTELS VIEW */}
        {activeTab === "hotels" && (
          <div className="p-4 space-y-4">
            <form onSubmit={handleHotelSearchSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search hotel name (e.g. Hilton, Marriott) or code..."
                  value={hotelSearch}
                  onChange={(e) => setHotelSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F7941D]/30 focus:border-[#F7941D]"
                />
              </div>

              <div className="w-full sm:w-56">
                <select
                  value={hotelCountryFilter}
                  onChange={(e) => {
                    setHotelCountryFilter(e.target.value);
                    setHotelPage(1);
                  }}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F7941D]/30 focus:border-[#F7941D] cursor-pointer"
                >
                  <option value="">All Countries</option>
                  {countries.map((c) => (
                    <option key={c.code2} value={c.code2}>
                      {c.name} ({c.code2})
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full sm:w-36">
                <select
                  value={hotelStarFilter}
                  onChange={(e) => {
                    setHotelStarFilter(e.target.value);
                    setHotelPage(1);
                  }}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F7941D]/30 focus:border-[#F7941D] cursor-pointer"
                >
                  <option value="">All Stars</option>
                  <option value="5">5 Star ★★★★★</option>
                  <option value="4">4 Star ★★★★</option>
                  <option value="3">3 Star ★★★</option>
                  <option value="2">2 Star ★★</option>
                  <option value="1">1 Star ★</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-[#1D1248] hover:bg-[#2B1B6D] text-white text-sm font-bold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Search
              </button>

              {(hotelSearch || hotelCountryFilter || hotelStarFilter) && (
                <button
                  type="button"
                  onClick={() => {
                    setHotelSearch("");
                    setHotelCountryFilter("");
                    setHotelStarFilter("");
                    setHotelPage(1);
                    fetchHotels(1, "", "", "");
                  }}
                  className="px-3 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 bg-gray-100 rounded-xl hover:bg-gray-200 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </form>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 font-medium border-t border-b border-gray-100 py-2.5">
              <span>
                Showing {hotels.length > 0 ? (hotelPage - 1) * 50 + 1 : 0} -{" "}
                {Math.min(hotelPage * 50, totalHotels)} of {totalHotels.toLocaleString()} hotels
                {hotelCountryFilter ? ` in ${hotelCountryFilter}` : ""}
              </span>

              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <button
                  type="button"
                  disabled={hotelPage <= 1 || hotelsLoading}
                  onClick={() => setHotelPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 cursor-pointer"
                  aria-label="Previous Page"
                >
                  <FiChevronLeft />
                </button>
                <span>
                  Page {hotelPage} of {hotelTotalPages}
                </span>
                <button
                  type="button"
                  disabled={hotelPage >= hotelTotalPages || hotelsLoading}
                  onClick={() => setHotelPage((p) => Math.min(hotelTotalPages, p + 1))}
                  className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 cursor-pointer"
                  aria-label="Next Page"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/80 text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Hotel Code</th>
                    <th className="py-3 px-4">Hotel Name</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                  {hotelsLoading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-400">
                        <FiRefreshCw className="animate-spin text-xl mx-auto mb-2 text-[#F7941D]" />
                        Loading hotels...
                      </td>
                    </tr>
                  ) : hotels.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-400">
                        No hotels found matching your search.
                      </td>
                    </tr>
                  ) : (
                    hotels.map((h) => (
                      <tr key={h.code} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-xs px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg border border-slate-200">
                            {h.code}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-gray-900 max-w-xs truncate">
                          {h.name}
                        </td>
                        <td className="py-3 px-4">
                          {h.starCategory && h.starCategory !== "0" ? (
                            <span className="inline-flex items-center gap-1 font-bold text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              <FiStar className="fill-amber-500 text-amber-500 text-[10px]" />
                              <span>{h.starCategory} Star</span>
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">Unrated</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-gray-800 text-xs">{h.cityName}</div>
                          <span className="font-mono text-[11px] text-gray-500">{h.countryName} ({h.countryCode})</span>
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-600">
                          {h.accommodationTypeSubName || "Hotel"}
                          {h.chainName && h.chainName !== "Independent" && (
                            <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{h.chainName}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-500 max-w-xs truncate">
                          {h.address || "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {hotelTotalPages > 1 && (
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                <div>
                  Page {hotelPage} of {hotelTotalPages} ({totalHotels.toLocaleString()} total)
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={hotelPage <= 1 || hotelsLoading}
                    onClick={() => setHotelPage(1)}
                    className="px-2.5 py-1.5 rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 font-semibold cursor-pointer"
                  >
                    First
                  </button>
                  <button
                    type="button"
                    disabled={hotelPage <= 1 || hotelsLoading}
                    onClick={() => setHotelPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 cursor-pointer"
                    aria-label="Previous Page"
                  >
                    <FiChevronLeft />
                  </button>
                  <span className="px-2 font-bold text-gray-800">{hotelPage}</span>
                  <button
                    type="button"
                    disabled={hotelPage >= hotelTotalPages || hotelsLoading}
                    onClick={() => setHotelPage((p) => Math.min(hotelTotalPages, p + 1))}
                    className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 cursor-pointer"
                    aria-label="Next Page"
                  >
                    <FiChevronRight />
                  </button>
                  <button
                    type="button"
                    disabled={hotelPage >= hotelTotalPages || hotelsLoading}
                    onClick={() => setHotelPage(hotelTotalPages)}
                    className="px-2.5 py-1.5 rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 font-semibold cursor-pointer"
                  >
                    Last
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
