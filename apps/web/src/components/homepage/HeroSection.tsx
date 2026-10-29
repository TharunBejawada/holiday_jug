"use client";

import { useState, useMemo, useEffect } from "react";
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
} from "react-icons/fa";

import { DatePicker } from "@/components/DatePicker";
import { SearchableSelect } from "@/components/SearchableSelect";
import { DEPARTURE_AIRPORTS } from "@/lib/destinations-master";

interface RoomConfig {
  adults: number;
  childrenAges: number[];
}

interface AdminDestinationItem {
  slug: string;
  name: string;
  region: string;
  priceFrom?: number | null;
}

const DEFAULT_ADMIN_DESTINATIONS: AdminDestinationItem[] = [
  { slug: "turkey", name: "Turkey", region: "Europe", priceFrom: 95 },
  { slug: "greece", name: "Greece", region: "Europe", priceFrom: 285 },
  { slug: "dubai", name: "Dubai", region: "Middle East", priceFrom: 548 },
  { slug: "spain", name: "Spain", region: "Europe", priceFrom: 325 },
  { slug: "antalya", name: "Antalya", region: "Mediterranean", priceFrom: 878 },
  { slug: "portugal", name: "Portugal", region: "Europe", priceFrom: 450 },
];

export function HeroSection() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"holidays" | "hotels">("holidays");
  const [departureAirport, setDepartureAirport] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");
  const [adminDestinations, setAdminDestinations] = useState<AdminDestinationItem[]>(DEFAULT_ADMIN_DESTINATIONS);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  // Comprehensive Travellers & Rooms popover state (D3)
  const [rooms, setRooms] = useState<RoomConfig[]>([
    { adults: 2, childrenAges: [] },
  ]);
  const [showTravellersPopover, setShowTravellersPopover] = useState(false);

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
              priceFrom: item.priceFrom,
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
      subtitle: apt.name,
      searchTerms: [apt.city, apt.code, apt.name],
    }));
  }, []);

  const destinationOptions = useMemo(() => {
    return adminDestinations.map((d) => ({
      value: d.slug,
      label: `${d.name} (${d.region})`,
      subtitle: d.priceFrom ? `From £${d.priceFrom} pp` : undefined,
      searchTerms: [d.name, d.slug, d.region],
    }));
  }, [adminDestinations]);

  // Summary labels for Travellers
  const totalAdults = rooms.reduce((acc, r) => acc + r.adults, 0);
  const totalChildren = rooms.reduce((acc, r) => acc + r.childrenAges.length, 0);
  const travellersSummary = `${totalAdults} Adult${totalAdults > 1 ? "s" : ""}${totalChildren > 0 ? `, ${totalChildren} Child${totalChildren > 1 ? "ren" : ""}` : ""
    }, ${rooms.length} Room${rooms.length > 1 ? "s" : ""}`;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "hotels") {
      const queryParams = new URLSearchParams({
        destination: destination || "all",
        type: "hotels",
        rooms: JSON.stringify(rooms),
        adults: totalAdults.toString(),
        children: totalChildren.toString(),
      });
      if (checkIn) queryParams.set("checkIn", checkIn);
      if (checkOut) queryParams.set("checkOut", checkOut);
      router.push(`/hotels?${queryParams.toString()}`);
    } else {
      // For Holidays / Destination search: navigate directly to destination details page based on Admin Dashboard data
      if (destination) {
        router.push(`/destinations/${destination}`);
      } else {
        router.push(`/destinations`);
      }
    }
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
                className={`px-5 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-lg font-bold transition-all duration-200 rounded-t-xl sm:rounded-t-2xl shadow-sm cursor-pointer ${activeTab === "holidays"
                    ? "bg-[#F7941D] text-white"
                    : "bg-white text-[#1D1248] hover:bg-gray-100"
                  }`}
              >
                Holidays (Destinations)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("hotels")}
                className={`px-5 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-lg font-bold transition-all duration-200 rounded-t-xl sm:rounded-t-2xl shadow-sm cursor-pointer ${activeTab === "hotels"
                    ? "bg-[#F7941D] text-white"
                    : "bg-white text-[#1D1248] hover:bg-gray-100"
                  }`}
              >
                Hotels Only
              </button>
            </div>

            {/* MAIN SEARCH CARD */}
            <div className="bg-white rounded-b-2xl rounded-tr-2xl sm:rounded-r-3xl sm:rounded-b-3xl rounded-tl-none p-4 sm:p-7 shadow-2xl border border-gray-100/90">
              <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 sm:gap-4 items-end">
                {/* 1. DEPARTURE AIRPORT (D3 & Appendix A.4) */}
                {activeTab === "holidays" && (
                  <div className="lg:col-span-2 flex flex-col gap-1 sm:gap-1.5">
                    <label className="text-xs sm:text-sm font-bold text-[#1D1248]">Departing From</label>
                    <SearchableSelect
                      options={airportOptions}
                      value={departureAirport}
                      onChange={(val) => setDepartureAirport(val)}
                      placeholder="Select airport"
                      searchPlaceholder="Search airport or city..."
                      trailingIcon={<FaPlaneDeparture className="text-gray-400 text-xs sm:text-sm" />}
                    />
                  </div>
                )}

                {/* 2. WHERE TO? (Destinations from Admin Dashboard) */}
                <div className={`${activeTab === "holidays" ? "lg:col-span-3" : "lg:col-span-4"} flex flex-col gap-1 sm:gap-1.5`}>
                  <label className="text-xs sm:text-sm font-bold text-[#1D1248]">Where to?</label>
                  <SearchableSelect
                    options={destinationOptions}
                    value={destination}
                    onChange={(val) => {
                      setDestination(val);
                      const match = adminDestinations.find((d) => d.slug === val);
                      if (match) setDestinationQuery(`${match.name}, ${match.region}`);
                    }}
                    placeholder="Select destination"
                    searchPlaceholder="Search country or city..."
                    trailingIcon={<FaMapMarkerAlt className="text-gray-400 text-xs sm:text-sm" />}
                  />
                </div>

                {/* 3. CHECK-IN */}
                <div className="lg:col-span-2 flex flex-col gap-1 sm:gap-1.5">
                  <label className="text-xs sm:text-sm font-bold text-[#1D1248]">Check-in</label>
                  <DatePicker value={checkIn} onChange={setCheckIn} placeholder="Select date" />
                </div>

                {/* 4. CHECK-OUT */}
                <div className="lg:col-span-2 flex flex-col gap-1 sm:gap-1.5">
                  <label className="text-xs sm:text-sm font-bold text-[#1D1248]">Check-out</label>
                  <DatePicker value={checkOut} onChange={setCheckOut} placeholder="Select date" minDate={checkIn} />
                </div>

                {/* 5. TRAVELLERS & ROOMS (D3) */}
                <div className={`relative ${activeTab === "holidays" ? "lg:col-span-3" : "lg:col-span-2"} flex flex-col gap-1 sm:gap-1.5`}>
                  <label className="text-xs sm:text-sm font-bold text-[#1D1248]">Travellers &amp; Rooms</label>
                  <button
                    type="button"
                    onClick={() => setShowTravellersPopover(!showTravellersPopover)}
                    className="w-full text-left rounded-xl bg-gray-50/90 px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-800 border border-gray-200 focus:border-[#F7941D] focus:bg-white focus:outline-none transition-all font-semibold flex items-center justify-between cursor-pointer"
                  >
                    <span className="truncate">{travellersSummary}</span>
                    <FaUserFriends className="text-gray-400 text-xs sm:text-sm shrink-0 ml-2" />
                  </button>

                  {/* ROOMS & GUESTS POPOVER MODAL */}
                  {showTravellersPopover && (
                    <div className="absolute right-0 bottom-full mb-2 w-80 sm:w-96 rounded-2xl bg-white p-4 sm:p-5 shadow-2xl border border-gray-200 z-50 text-[#1D1248] animate-in fade-in zoom-in-95">
                      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                        <span className="font-bold text-sm sm:text-base">Rooms &amp; Guests</span>
                        <button
                          type="button"
                          onClick={() => setShowTravellersPopover(false)}
                          className="text-gray-400 hover:text-gray-600 p-1"
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
                                  className="text-red-500 hover:text-red-700 text-xs font-semibold"
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
                                  className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
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
                                  className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
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
                                  className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
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
                                  className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
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
                                        className="rounded-lg bg-white border border-gray-200 px-2 py-1 text-xs font-semibold focus:border-[#F7941D] focus:outline-none"
                                      >
                                        {Array.from({ length: 18 }, (_, a) => (
                                          <option key={a} value={a}>
                                            {a === 0 ? "Under 1" : `${a} yr${a > 1 ? "s" : ""}`}
                                          </option>
                                        ))}
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
                    className="w-full rounded-xl bg-[#F7941D] hover:bg-[#e08314] active:scale-[0.98] py-3 sm:py-3.5 px-6 text-sm sm:text-base font-extrabold text-white transition-all shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FaSearch className="text-xs sm:text-sm" />
                    <span>{activeTab === "holidays" ? "Explore Destination" : "Search"}</span>
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
