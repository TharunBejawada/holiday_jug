"use client";

import { useState } from "react";
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
import { DEPARTURE_AIRPORTS, getActiveSearchDestinations } from "@/lib/destinations-master";

interface RoomConfig {
  adults: number;
  childrenAges: number[];
}

export function HeroSection() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"holidays" | "hotels">("holidays");
  const [departureAirport, setDepartureAirport] = useState("LGW");
  const [destination, setDestination] = useState("dubai");
  const [destinationQuery, setDestinationQuery] = useState("Dubai, United Arab Emirates");
  const [checkIn, setCheckIn] = useState(() => {
    const d = new Date(Date.now() + 14 * 86400000);
    return d.toISOString().split("T")[0];
  });
  const [checkOut, setCheckOut] = useState(() => {
    const d = new Date(Date.now() + 21 * 86400000);
    return d.toISOString().split("T")[0];
  });

  // Comprehensive Travellers & Rooms popover state (D3)
  const [rooms, setRooms] = useState<RoomConfig[]>([
    { adults: 2, childrenAges: [] },
  ]);
  const [showTravellersPopover, setShowTravellersPopover] = useState(false);

  const activeDestinations = getActiveSearchDestinations();

  // Summary labels for Travellers
  const totalAdults = rooms.reduce((acc, r) => acc + r.adults, 0);
  const totalChildren = rooms.reduce((acc, r) => acc + r.childrenAges.length, 0);
  const travellersSummary = `${totalAdults} Adult${totalAdults > 1 ? "s" : ""}${
    totalChildren > 0 ? `, ${totalChildren} Child${totalChildren > 1 ? "ren" : ""}` : ""
  }, ${rooms.length} Room${rooms.length > 1 ? "s" : ""}`;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const queryParams = new URLSearchParams({
      destination,
      departureAirport: activeTab === "holidays" ? departureAirport : "",
      checkIn,
      checkOut,
      type: activeTab,
      rooms: JSON.stringify(rooms),
      adults: totalAdults.toString(),
      children: totalChildren.toString(),
    });

    router.push(`/search?${queryParams.toString()}`);
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
                className={`px-5 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-lg font-bold transition-all duration-200 rounded-t-xl sm:rounded-t-2xl shadow-sm cursor-pointer ${
                  activeTab === "holidays"
                    ? "bg-white text-[#1D1248]"
                    : "bg-[#F7941D] text-white hover:bg-[#e08314]"
                }`}
              >
                Holidays (Flight + Hotel)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("hotels")}
                className={`px-5 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-lg font-bold transition-all duration-200 rounded-t-xl sm:rounded-t-2xl shadow-sm cursor-pointer ${
                  activeTab === "hotels"
                    ? "bg-white text-[#1D1248]"
                    : "bg-[#F7941D] text-white hover:bg-[#e08314]"
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
                    <div className="relative flex items-center">
                      <select
                        value={departureAirport}
                        onChange={(e) => setDepartureAirport(e.target.value)}
                        className="w-full rounded-xl bg-gray-50/90 px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-800 border border-gray-200 focus:border-[#F7941D] focus:bg-white focus:outline-none transition-all font-semibold appearance-none cursor-pointer"
                      >
                        {DEPARTURE_AIRPORTS.map((apt) => (
                          <option key={apt.code} value={apt.code}>
                            {apt.city} ({apt.code})
                          </option>
                        ))}
                      </select>
                      <FaPlaneDeparture className="absolute right-3.5 text-gray-400 pointer-events-none text-xs sm:text-sm" />
                    </div>
                  </div>
                )}

                {/* 2. WHERE TO? (D1, D3 & Appendix A) */}
                <div className={`${activeTab === "holidays" ? "lg:col-span-3" : "lg:col-span-4"} flex flex-col gap-1 sm:gap-1.5`}>
                  <label className="text-xs sm:text-sm font-bold text-[#1D1248]">Where to?</label>
                  <div className="relative flex items-center">
                    <select
                      value={destination}
                      onChange={(e) => {
                        setDestination(e.target.value);
                        const match = activeDestinations.find((d) => d.slug === e.target.value);
                        if (match) setDestinationQuery(`${match.destination}, ${match.country}`);
                      }}
                      className="w-full rounded-xl bg-gray-50/90 px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-800 border border-gray-200 focus:border-[#F7941D] focus:bg-white focus:outline-none transition-all font-semibold appearance-none cursor-pointer"
                    >
                      {activeDestinations.map((d) => (
                        <option key={d.slug} value={d.slug}>
                          {d.destination} ({d.country})
                        </option>
                      ))}
                    </select>
                    <FaMapMarkerAlt className="absolute right-3.5 text-gray-400 pointer-events-none text-xs sm:text-sm" />
                  </div>
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
                          <div key={roomIdx} className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#F7941D] uppercase tracking-wide">
                                Room {roomIdx + 1}
                              </span>
                              {rooms.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeRoom(roomIdx)}
                                  className="text-xs text-red-500 hover:underline font-semibold"
                                >
                                  Remove Room
                                </button>
                              )}
                            </div>

                            {/* Adults in room */}
                            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                              <div>
                                <p>Adults</p>
                                <span className="text-[11px] text-gray-500 font-normal">Ages 18+</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => updateAdults(roomIdx, -1)}
                                  disabled={room.adults <= 1}
                                  className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs hover:bg-gray-100 disabled:opacity-40"
                                >
                                  <FaMinus />
                                </button>
                                <span className="w-5 text-center font-bold">{room.adults}</span>
                                <button
                                  type="button"
                                  onClick={() => updateAdults(roomIdx, 1)}
                                  disabled={room.adults >= 9}
                                  className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs hover:bg-gray-100 disabled:opacity-40"
                                >
                                  <FaPlus />
                                </button>
                              </div>
                            </div>

                            {/* Children in room */}
                            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                              <div>
                                <p>Children</p>
                                <span className="text-[11px] text-gray-500 font-normal">Ages 1 to 17</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => room.childrenAges.length > 0 && removeChild(roomIdx, room.childrenAges.length - 1)}
                                  disabled={room.childrenAges.length <= 0}
                                  className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs hover:bg-gray-100 disabled:opacity-40"
                                >
                                  <FaMinus />
                                </button>
                                <span className="w-5 text-center font-bold">{room.childrenAges.length}</span>
                                <button
                                  type="button"
                                  onClick={() => addChild(roomIdx)}
                                  disabled={room.childrenAges.length >= 8}
                                  className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs hover:bg-gray-100 disabled:opacity-40"
                                >
                                  <FaPlus />
                                </button>
                              </div>
                            </div>

                            {/* Child ages selection (Exact age required D3) */}
                            {room.childrenAges.length > 0 && (
                              <div className="pt-2 border-t border-gray-200/60 space-y-2">
                                <span className="text-[11px] font-bold text-gray-600 block">
                                  Children&apos;s Ages at check-in (Required):
                                </span>
                                <div className="grid grid-cols-2 gap-2">
                                  {room.childrenAges.map((age, childIdx) => (
                                    <div key={childIdx} className="flex items-center justify-between bg-white px-2 py-1.5 rounded-lg border border-gray-200 text-xs font-medium">
                                      <span>Child {childIdx + 1}:</span>
                                      <select
                                        value={age}
                                        onChange={(e) => updateChildAge(roomIdx, childIdx, Number(e.target.value))}
                                        className="bg-transparent font-bold text-[#F7941D] cursor-pointer outline-none"
                                      >
                                        {Array.from({ length: 17 }, (_, i) => i + 1).map((a) => (
                                          <option key={a} value={a}>
                                            {a} yr{a > 1 ? "s" : ""}
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
                    <span>Search {activeTab === "holidays" ? "Holidays" : "Hotels"}</span>
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
