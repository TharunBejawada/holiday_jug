"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FaMapMarkerAlt,
  FaUserFriends,
  FaSearch,
  FaShieldAlt,
  FaPercent,
  FaPlaneDeparture,
  FaPlus,
  FaMinus,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";

import { DatePicker } from "@/components/DatePicker";
import { SearchableSelect } from "@/components/SearchableSelect";
import { DEPARTURE_AIRPORTS, getActiveSearchDestinations } from "@/lib/destinations-master";
import { DESTINATIONS_NAV_DATA } from "@/lib/destinations-nav-data";

interface RoomConfig {
  adults: number;
  childrenAges: number[];
}

interface AdminDestinationItem {
  slug: string;
  name: string;
  region: string;
}

const DEFAULT_ADMIN_DESTINATIONS: AdminDestinationItem[] = [
  { slug: "turkey", name: "Turkey", region: "Europe" },
  { slug: "greece", name: "Greece", region: "Europe" },
  { slug: "dubai", name: "Dubai", region: "Middle East" },
  { slug: "spain", name: "Spain", region: "Europe" },
  { slug: "antalya", name: "Antalya", region: "Mediterranean" },
  { slug: "portugal", name: "Portugal", region: "Europe" },
];

export function HeroSection() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"holidays" | "hotels">("holidays");
  const [departureAirport, setDepartureAirport] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");
  const [adminDestinations, setAdminDestinations] = useState<AdminDestinationItem[]>(DEFAULT_ADMIN_DESTINATIONS);
  const [isNavigating, setIsNavigating] = useState(false);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [formErrors, setFormErrors] = useState<{
    departureAirport?: string;
    destination?: string;
    checkIn?: string;
    checkOut?: string;
  }>({});

  // Comprehensive Travellers & Rooms popover state (D3)
  const [rooms, setRooms] = useState<RoomConfig[]>([
    { adults: 2, childrenAges: [] },
  ]);
  const [showTravellersPopover, setShowTravellersPopover] = useState(false);
  const travellersContainerRef = useRef<HTMLDivElement>(null);
  const [popoverPlacement, setPopoverPlacement] = useState<"down" | "up">("down");

  // Dynamic placement for Travellers & Rooms popover based on scrolling and viewport boundaries
  useEffect(() => {
    if (!showTravellersPopover) return;

    const calculatePlacement = () => {
      if (!travellersContainerRef.current) return;
      const rect = travellersContainerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const navbarHeight = 85; // sticky header is ~80px
      const popoverHeight = 360;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top - navbarHeight;

      // If space below is not enough AND (enough space above OR more space above than below) -> place UP
      if (spaceBelow < popoverHeight && (spaceAbove >= popoverHeight || spaceAbove > spaceBelow)) {
        setPopoverPlacement("up");
      } else {
        setPopoverPlacement("down");
      }
    };

    calculatePlacement();
    window.addEventListener("scroll", calculatePlacement, { passive: true });
    window.addEventListener("resize", calculatePlacement, { passive: true });
    return () => {
      window.removeEventListener("scroll", calculatePlacement);
      window.removeEventListener("resize", calculatePlacement);
    };
  }, [showTravellersPopover]);

  // Click outside to close Travellers & Rooms popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        travellersContainerRef.current &&
        !travellersContainerRef.current.contains(event.target as Node)
      ) {
        setShowTravellersPopover(false);
      }
    }
    if (showTravellersPopover) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTravellersPopover]);

  // Fetch published destinations dynamically from Admin Dashboard
  useEffect(() => {
    fetch("/api/destinations", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.items && Array.isArray(data.items) && data.items.length > 0) {
          setAdminDestinations(
            data.items.map((item: any) => ({
              slug: item.slug,
              name: item.name,
              region: item.region || "Worldwide",
            }))
          );
        }
      })
      .catch((err) => {
        console.error("Error fetching destinations for Hero dropdown:", err);
      });
  }, []);

  const airportOptions = useMemo(() => {
    return DEPARTURE_AIRPORTS.map((apt) => ({
      value: apt.code,
      label: `${apt.city} (${apt.code})`,
      subtitle: `${apt.name}, ${apt.country}`,
      badge: apt.code,
      searchTerms: [
        apt.city,
        apt.code,
        apt.name,
        apt.country,
        // Common city and country abbreviations
        ...(apt.city.toLowerCase() === "london" ? ["lon", "uk", "gb", "england"] : []),
        ...(apt.city.toLowerCase() === "manchester" ? ["man", "uk"] : []),
        ...(apt.city.toLowerCase() === "birmingham" ? ["bhx", "uk"] : []),
        ...(apt.city.toLowerCase() === "edinburgh" ? ["edi", "scotland", "uk"] : []),
        ...(apt.city.toLowerCase() === "glasgow" ? ["gla", "scotland", "uk"] : []),
        ...(apt.city.toLowerCase() === "dublin" ? ["dub", "ireland"] : []),
        ...(apt.city.toLowerCase().includes("new york") ? ["nyc", "us", "usa", "america"] : []),
        ...(apt.city.toLowerCase() === "paris" ? ["par", "france"] : []),
        ...(apt.city.toLowerCase() === "dubai" ? ["uae", "emirates"] : []),
      ],
    }));
  }, []);

  const destinationOptions = useMemo(() => {
    const list: Array<{
      value: string;
      label: string;
      subtitle?: string;
      badge?: string;
      tags?: string[];
      searchTerms?: string[];
    }> = [
      {
        value: "all",
        label: "All Destinations (Featured)",
        subtitle: "Worldwide Handpicked Stays",
        tags: ["all", "featured", "worldwide", "any", "global"],
        searchTerms: ["all", "featured", "worldwide", "any", "global"],
      },
    ];

    // 1. Add all core countries from navbar master data (e.g. Spain, Canary Islands, Turkey, Greece, Portugal, Cyprus, Egypt, UAE)
    DESTINATIONS_NAV_DATA.forEach((group) => {
      const countrySlug = group.slug;
      if (!list.some((existing) => existing.value.toLowerCase() === countrySlug.toLowerCase())) {
        list.push({
          value: countrySlug,
          label: `${group.country} (All Destinations)`,
          subtitle: `Country • ${group.destinations.length} Core Destinations`,
          badge: "Country",
          tags: [group.country, group.slug, ...(group.countryAliases || [])],
          searchTerms: [
            group.country,
            group.slug,
            ...(group.countryAliases || []),
            ...group.destinations.map((d) => d.name),
            ...group.destinations.flatMap((d) => d.aliases || []),
            ...group.destinations.flatMap((d) => d.iata || []),
          ],
        });
      }

      // 2. Add each individual core destination under the country with all aliases & IATA codes
      group.destinations.forEach((dest) => {
        const destSlug = dest.slug;
        const existingIdx = list.findIndex((existing) => existing.value.toLowerCase() === destSlug.toLowerCase());
        const iataBadge = dest.iata && dest.iata[0] ? dest.iata[0] : "Core";
        const item = {
          value: destSlug,
          label: `${dest.name} (${group.country})`,
          subtitle: `Core Destination • ${group.country}${dest.iata && dest.iata.length > 0 ? ` • ${dest.iata.join(", ")}` : ""}`,
          badge: iataBadge,
          tags: [
            dest.name,
            group.country,
            group.slug,
            ...(group.countryAliases || []),
            ...(dest.aliases || []),
            ...(dest.iata || []),
          ],
          searchTerms: [
            dest.name,
            dest.slug,
            group.country,
            group.slug,
            ...(group.countryAliases || []),
            ...(dest.aliases || []),
            ...(dest.iata || []),
          ],
        };

        if (existingIdx >= 0) {
          list[existingIdx] = item;
        } else {
          list.push(item);
        }
      });
    });

    // 3. Admin-published destinations
    adminDestinations.forEach((d) => {
      const match = list.find((existing) => existing.value.toLowerCase() === d.slug.toLowerCase());
      if (!match) {
        list.push({
          value: d.slug,
          label: `${d.name} (${d.region})`,
          subtitle: d.region || "Worldwide",
          tags: [d.name, d.slug, d.region || ""].filter(Boolean),
          searchTerms: [d.name, d.slug, d.region || ""].filter(Boolean),
        });
      }
    });

    // 4. Mapped destinations from DESTINATIONS_MASTER
    const activeDestinations = getActiveSearchDestinations();
    activeDestinations.forEach((d) => {
      const match = list.find((existing) => existing.value.toLowerCase() === d.slug.toLowerCase());
      if (match) {
        match.tags = Array.from(new Set([...(match.tags || []), ...(d.aliases || [])]));
        match.searchTerms = Array.from(new Set([...(match.searchTerms || []), ...(d.aliases || [])]));
      } else {
        list.push({
          value: d.slug,
          label: `${d.destination} (${d.country})`,
          subtitle: d.displayGroup || d.country,
          tags: [d.destination, d.country, ...(d.aliases || [])],
          searchTerms: [d.destination, d.country, ...(d.aliases || [])],
        });
      }
    });

    return list;
  }, [adminDestinations]);

  // Summary labels for Travellers
  const totalAdults = rooms.reduce((acc, r) => acc + r.adults, 0);
  const totalChildren = rooms.reduce((acc, r) => acc + r.childrenAges.filter((a) => a >= 2).length, 0);
  const totalInfants = rooms.reduce((acc, r) => acc + r.childrenAges.filter((a) => a < 2).length, 0);
  const travellersSummary = `${totalAdults} Adult${totalAdults > 1 ? "s" : ""}${
    totalChildren > 0 ? `, ${totalChildren} Child${totalChildren > 1 ? "ren" : ""}` : ""
  }${totalInfants > 0 ? `, ${totalInfants} Infant${totalInfants > 1 ? "s" : ""}` : ""}, ${rooms.length} Room${rooms.length > 1 ? "s" : ""}`;

  // Reset navigation loading state on tab switch or timeout
  useEffect(() => {
    setIsNavigating(false);
  }, [activeTab]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // All filters are strictly mandatory
    const errors: {
      departureAirport?: string;
      destination?: string;
      checkIn?: string;
      checkOut?: string;
    } = {};

    if (activeTab === "holidays" && !departureAirport) {
      errors.departureAirport = "Departure airport is required";
    }

    if (!destination) {
      errors.destination = "Destination is required";
    }

    if (!checkIn) {
      errors.checkIn = "Check-in date is required";
    }

    if (!checkOut) {
      errors.checkOut = "Check-out date is required";
    } else if (checkIn && checkOut <= checkIn) {
      errors.checkOut = "Check-out must be after check-in date";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsNavigating(false);
      return;
    }

    setFormErrors({});
    setIsNavigating(true);

    // Navigate to hotels overview page for both Holidays and Hotels
    const queryParams = new URLSearchParams({
      destination: destination || "all",
      type: activeTab,
      rooms: JSON.stringify(rooms),
      adults: totalAdults.toString(),
      children: totalChildren.toString(),
      checkIn: checkIn,
      checkOut: checkOut,
    });
    if (activeTab === "holidays" && departureAirport) {
      queryParams.set("departureAirport", departureAirport);
    }

    router.push(`/hotels?${queryParams.toString()}`);
  };

  const addRoom = () => {
    if (rooms.length < 9) {
      setRooms([...rooms, { adults: 2, childrenAges: [] }]);
    }
  };

  const removeRoom = (index: number) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter((_, i) => i !== index));
    }
  };

  const updateAdults = (roomIdx: number, change: number) => {
    const updated = [...rooms];
    const newAdults = Math.max(1, Math.min(9, updated[roomIdx].adults + change));
    updated[roomIdx].adults = newAdults;
    setRooms(updated);
  };

  const addChild = (roomIdx: number) => {
    const updated = [...rooms];
    if (updated[roomIdx].childrenAges.length < 8) {
      updated[roomIdx].childrenAges.push(7); // Default age 7
      setRooms(updated);
    }
  };

  const removeChild = (roomIdx: number, childIdx: number) => {
    const updated = [...rooms];
    updated[roomIdx].childrenAges.splice(childIdx, 1);
    setRooms(updated);
  };

  const updateChildAge = (roomIdx: number, childIdx: number, age: number) => {
    const updated = [...rooms];
    updated[roomIdx].childrenAges[childIdx] = age;
    setRooms(updated);
  };

  return (
    <section className="relative w-full bg-white pb-4 sm:pb-6">
      {/* HERO CONTAINER WITH FULL BACKGROUND IMAGE */}
      <div className="relative w-full min-h-[580px] sm:min-h-[640px] lg:h-[700px] flex flex-col justify-end pt-12 sm:pt-16 lg:pt-0 pb-4 sm:pb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/Homepage_Banner.png"
          alt="HolidayJug Beach Paradise"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Subtle Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/15 to-transparent pointer-events-none" />

        {/* SEARCH PANEL POSITIONED INSIDE THE IMAGE AT THE BOTTOM */}
        <div className="relative z-20 mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 mt-auto">
          <div className="w-full max-w-6xl">
            {/* TABS (Holidays / Hotels) */}
            <div className="inline-flex items-center gap-0">
              <button
                type="button"
                onClick={() => setActiveTab("holidays")}
                className="px-5 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-lg font-bold transition-all duration-200 rounded-t-xl sm:rounded-t-2xl shadow-sm bg-[#F7941D] text-white"
              >
                Holidays (Destinations)
              </button>
              {/* "Hotels Only" tab hidden per request */}
            </div>

            {/* MAIN SEARCH CARD */}
            <div className="bg-white rounded-b-2xl rounded-tr-2xl sm:rounded-r-3xl sm:rounded-b-3xl rounded-tl-none p-4 sm:p-7 shadow-2xl border border-gray-100/90">
              <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 sm:gap-4 items-end">
                {/* 1. DEPARTURE AIRPORT (D3 & Appendix A.4) */}
                {activeTab === "holidays" && (
                  <div className="lg:col-span-2 flex flex-col gap-1 sm:gap-1.5">
                    <label className="text-xs sm:text-sm font-bold text-[#1D1248]">
                      Departing From <span className="text-red-500">*</span>
                    </label>
                    <SearchableSelect
                      options={airportOptions}
                      value={departureAirport}
                      onChange={(val) => {
                        setDepartureAirport(val);
                        if (formErrors.departureAirport) {
                          setFormErrors((prev) => ({ ...prev, departureAirport: undefined }));
                        }
                      }}
                      openOnKeywordOnly={true}
                      error={formErrors.departureAirport}
                      required={true}
                      icon={<FaSearch className="text-gray-400 text-xs sm:text-sm" />}
                      trailingIcon={<FaPlaneDeparture className="text-gray-400 text-xs sm:text-sm" />}
                      placeholder="Search airport or city..."
                      searchPlaceholder="Search airport or city..."
                    />
                  </div>
                )}

                {/* 2. WHERE TO? (Destinations from Admin Dashboard & Core Navigation) */}
                <div className={`${activeTab === "holidays" ? "lg:col-span-3" : "lg:col-span-4"} flex flex-col gap-1 sm:gap-1.5`}>
                  <label className="text-xs sm:text-sm font-bold text-[#1D1248]">
                    Where to? <span className="text-red-500">*</span>
                  </label>
                  <SearchableSelect
                    options={destinationOptions}
                    value={destination}
                    onChange={(val) => {
                      setDestination(val);
                      if (formErrors.destination) {
                        setFormErrors((prev) => ({ ...prev, destination: undefined }));
                      }
                      const match = destinationOptions.find((d) => d.value === val);
                      if (match) setDestinationQuery(match.label);
                    }}
                    openOnKeywordOnly={true}
                    error={formErrors.destination}
                    required={true}
                    icon={<FaSearch className="text-gray-400 text-xs sm:text-sm" />}
                    trailingIcon={<FaMapMarkerAlt className="text-gray-400 text-xs sm:text-sm" />}
                    placeholder="Search destination or country..."
                    searchPlaceholder="Search destination, country or abbreviation..."
                  />
                </div>

                {/* 3. CHECK-IN */}
                <div className="lg:col-span-2 flex flex-col gap-1 sm:gap-1.5">
                  <label className="text-xs sm:text-sm font-bold text-[#1D1248]">
                    Check-in <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    value={checkIn}
                    onChange={(val) => {
                      setCheckIn(val);
                      if (formErrors.checkIn) {
                        setFormErrors((prev) => ({ ...prev, checkIn: undefined }));
                      }
                      if (checkOut && val && checkOut <= val) {
                        setCheckOut("");
                      }
                    }}
                    placeholder="Select date"
                    error={formErrors.checkIn}
                    required={true}
                  />
                </div>

                {/* 4. CHECK-OUT */}
                <div className="lg:col-span-2 flex flex-col gap-1 sm:gap-1.5">
                  <label className="text-xs sm:text-sm font-bold text-[#1D1248]">
                    Check-out <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    value={checkOut}
                    onChange={(val) => {
                      setCheckOut(val);
                      if (formErrors.checkOut) {
                        setFormErrors((prev) => ({ ...prev, checkOut: undefined }));
                      }
                    }}
                    placeholder="Select date"
                    minDate={checkIn}
                    error={formErrors.checkOut}
                    required={true}
                  />
                </div>

                {/* 5. TRAVELLERS & ROOMS (D3) */}
                <div
                  ref={travellersContainerRef}
                  className={`relative ${activeTab === "holidays" ? "lg:col-span-3" : "lg:col-span-2"} flex flex-col gap-1 sm:gap-1.5`}
                >
                  <label className="text-xs sm:text-sm font-bold text-[#1D1248]">Travellers &amp; Rooms <span className="text-red-500">*</span></label>
                  <button
                    type="button"
                    onClick={() => {
                      if (!showTravellersPopover && travellersContainerRef.current) {
                        const rect = travellersContainerRef.current.getBoundingClientRect();
                        const spaceBelow = window.innerHeight - rect.bottom;
                        const spaceAbove = rect.top - 85;
                        if (spaceBelow < 360 && (spaceAbove >= 360 || spaceAbove > spaceBelow)) {
                          setPopoverPlacement("up");
                        } else {
                          setPopoverPlacement("down");
                        }
                      }
                      setShowTravellersPopover(!showTravellersPopover);
                    }}
                    className="w-full text-left rounded-xl bg-gray-50/90 px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-800 border border-gray-200 focus:border-[#F7941D] focus:bg-white focus:outline-none transition-all font-semibold flex items-center justify-between cursor-pointer"
                  >
                    <span className="truncate">{travellersSummary}</span>
                    <FaUserFriends className="text-gray-400 text-xs sm:text-sm shrink-0 ml-2" />
                  </button>

                  {/* ROOMS & GUESTS POPOVER MODAL */}
                  {showTravellersPopover && (
                    <div
                      className={`absolute right-0 ${
                        popoverPlacement === "down"
                          ? "top-full mt-2 slide-in-from-top-2"
                          : "bottom-full mb-2 slide-in-from-bottom-2"
                      } w-80 sm:w-96 max-w-[calc(100vw-2rem)] rounded-2xl bg-white p-4 sm:p-5 shadow-2xl border border-gray-200 z-50 text-[#1D1248] animate-in fade-in duration-150 max-h-[min(480px,calc(100vh-100px))] overflow-y-auto`}
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                        <span className="font-bold text-sm sm:text-base">Rooms &amp; Guests</span>
                        <button
                          type="button"
                          onClick={() => setShowTravellersPopover(false)}
                          className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                        >
                          <FaTimes />
                        </button>
                      </div>

                      <div className="max-h-72 overflow-y-auto py-3 space-y-4">
                        {rooms.map((room, roomIdx) => (
                          <div key={roomIdx} className="p-3 rounded-xl bg-gray-50/70 border border-gray-100 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs uppercase tracking-wide text-[#F7941D]">
                                Room {roomIdx + 1}
                              </span>
                              {rooms.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeRoom(roomIdx)}
                                  className="text-red-500 hover:text-red-700 text-xs font-semibold cursor-pointer"
                                >
                                  Remove Room
                                </button>
                              )}
                            </div>

                            {/* Adults */}
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                              <div>
                                <p className="font-semibold text-gray-800">Adults</p>
                                <p className="text-[10px] text-gray-400">Ages 18+</p>
                              </div>
                              <div className="flex items-center gap-2.5">
                                <button
                                  type="button"
                                  onClick={() => updateAdults(roomIdx, -1)}
                                  disabled={room.adults <= 1}
                                  className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                >
                                  <FaMinus className="text-[9px]" />
                                </button>
                                <span className="w-5 text-center font-bold text-xs sm:text-sm">
                                  {room.adults}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateAdults(roomIdx, 1)}
                                  disabled={room.adults >= 9}
                                  className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                >
                                  <FaPlus className="text-[9px]" />
                                </button>
                              </div>
                            </div>

                            {/* Children */}
                            <div className="flex items-center justify-between text-xs sm:text-sm pt-2 border-t border-gray-200/50">
                              <div>
                                <p className="font-semibold text-gray-800">Children</p>
                                <p className="text-[10px] text-gray-400">Ages 0 to 17</p>
                              </div>
                              <div className="flex items-center gap-2.5">
                                <button
                                  type="button"
                                  onClick={() => removeChild(roomIdx, room.childrenAges.length - 1)}
                                  disabled={room.childrenAges.length === 0}
                                  className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                >
                                  <FaMinus className="text-[9px]" />
                                </button>
                                <span className="w-5 text-center font-bold text-xs sm:text-sm">
                                  {room.childrenAges.length}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => addChild(roomIdx)}
                                  disabled={room.childrenAges.length >= 8}
                                  className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                >
                                  <FaPlus className="text-[9px]" />
                                </button>
                              </div>
                            </div>

                            {/* Child Ages inputs */}
                            {room.childrenAges.length > 0 && (
                              <div className="pt-2 border-t border-gray-200/50 space-y-2">
                                <p className="text-[10px] font-semibold text-gray-500">
                                  Ages of children at check-out
                                </p>
                                <div className="grid grid-cols-3 gap-2">
                                  {room.childrenAges.map((age, childIdx) => (
                                    <div key={childIdx} className="flex flex-col gap-0.5">
                                      <label className="text-[9px] text-gray-500">
                                        Child {childIdx + 1}
                                      </label>
                                      <select
                                        value={age}
                                        onChange={(e) =>
                                          updateChildAge(roomIdx, childIdx, parseInt(e.target.value))
                                        }
                                        className="rounded-lg bg-white border border-gray-200 px-2 py-1 text-xs font-semibold focus:border-[#F7941D] focus:outline-none cursor-pointer"
                                      >
                                        <optgroup label="Infant">
                                          <option value={0}>Less than 1</option>
                                          <option value={1}>1</option>
                                        </optgroup>
                                        <optgroup label="Child">
                                          {Array.from({ length: 16 }, (_, i) => i + 2).map((a) => (
                                            <option key={a} value={a}>
                                              {a} yrs
                                            </option>
                                          ))}
                                        </optgroup>
                                      </select>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        {rooms.length < 9 && (
                          <button
                            type="button"
                            onClick={addRoom}
                            className="text-xs font-bold text-[#F7941D] hover:underline flex items-center gap-1"
                          >
                            <FaPlus className="text-[10px]" /> Add Another Room
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setShowTravellersPopover(false)}
                          className="ml-auto rounded-lg bg-[#1D1248] text-white px-4 py-1.5 text-xs font-bold hover:bg-[#2B1B6D]"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. SEARCH BUTTON */}
                <div className={`${activeTab === "holidays" ? "col-span-full mt-2" : "lg:col-span-2"} flex flex-col`}>
                  <button
                    type="submit"
                    disabled={isNavigating}
                    className="w-full rounded-xl bg-[#F7941D] hover:bg-[#e08314] disabled:bg-[#F7941D]/80 disabled:cursor-wait active:scale-[0.98] py-3 sm:py-3.5 px-6 text-sm sm:text-base font-extrabold text-white transition-all shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isNavigating ? (
                      <>
                        <FaSpinner className="animate-spin text-sm" />
                        <span>{activeTab === "holidays" ? "Loading Hotels..." : "Loading..."}</span>
                      </>
                    ) : (
                      <>
                        <FaSearch className="text-xs sm:text-sm" />
                        <span>{activeTab === "holidays" ? "Explore Destination" : "Search"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* BOTTOM BADGES / TRUST PROMISES */}
              <div className="mt-4 sm:mt-6 pt-3.5 sm:pt-5 border-t border-gray-100 flex flex-wrap items-center justify-around gap-4 sm:gap-6 text-[#1D1248] text-xs sm:text-base font-semibold">
                <div className="flex items-center gap-2">
                  <FaPercent className="text-[#F7941D] text-sm sm:text-lg" />
                  <span>Best Price Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-[#F7941D] text-sm sm:text-lg" />
                  <span>Secure Booking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
