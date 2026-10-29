"use client";

import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
  FaUserFriends,
  FaChevronDown,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import { SearchableSelect } from "@/components/SearchableSelect";
import { DatePicker } from "@/components/DatePicker";
import { CallForHiddenPricesBanner } from "@/components/CallForHiddenPricesBanner";
import { getActiveSearchDestinations } from "@/lib/destinations-master";

export interface RoomConfig {
  adults: number;
  childrenAges: number[];
}

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

const STAR_OPTIONS = [5, 4, 3, 2];

const BOARD_OPTIONS = [
  "Room Only",
  "Bed & Breakfast",
  "Half Board",
  "Full Board",
  "All Inclusive",
];

const PROPERTY_TYPE_OPTIONS = ["Hotel", "Resort", "Aparthotel", "Villa"];

const FACILITY_OPTIONS = [
  "Pool",
  "Beachfront",
  "Spa",
  "Gym",
  "Free Wi-Fi",
  "Family Friendly",
  "Adults Only",
];

const HOLIDAY_TYPE_OPTIONS = [
  "Beach",
  "Family",
  "Couples",
  "Luxury",
  "All Inclusive",
];

function HotelsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialDestination = searchParams.get("destination") || "all";
  const initialHotelCode = searchParams.get("hotelCode") || "";
  const initialRating = searchParams.get("rating") ? Number(searchParams.get("rating")) : null;

  // Travellers & Rooms initialization
  const initialRoomsParam = searchParams.get("rooms");
  const initialAdultsParam = searchParams.get("adults");
  let defaultRooms: RoomConfig[] = [{ adults: 2, childrenAges: [] }];
  if (initialRoomsParam) {
    try {
      const parsed = JSON.parse(initialRoomsParam);
      if (Array.isArray(parsed) && parsed.length > 0) defaultRooms = parsed;
    } catch {}
  } else if (initialAdultsParam) {
    defaultRooms = [{ adults: Math.max(1, Number(initialAdultsParam)), childrenAges: [] }];
  }

  const [destination, setDestination] = useState(initialDestination);
  const [checkIn, setCheckIn] = useState(() => {
    const d = new Date(Date.now() + 14 * 86400000);
    return d.toISOString().split("T")[0];
  });
  const [checkOut, setCheckOut] = useState(() => {
    const d = new Date(Date.now() + 21 * 86400000);
    return d.toISOString().split("T")[0];
  });

  // Filter States
  const [selectedStars, setSelectedStars] = useState<number[]>(
    initialRating ? [initialRating] : []
  );
  const [minPrice, setMinPrice] = useState<number>(50);
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedHolidayTypes, setSelectedHolidayTypes] = useState<string[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("recommended");

  // Travellers & Rooms state
  const [rooms, setRooms] = useState<RoomConfig[]>(defaultRooms);
  const [showTravellersPopover, setShowTravellersPopover] = useState(false);
  const travellersRef = useRef<HTMLDivElement>(null);
  const [searchVersion, setSearchVersion] = useState(0);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (travellersRef.current && !travellersRef.current.contains(e.target as Node)) {
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

  const addRoom = () => {
    if (rooms.length < 9) {
      setRooms((prev) => [...prev, { adults: 2, childrenAges: [] }]);
    }
  };

  const removeRoom = (index: number) => {
    if (rooms.length > 1) {
      setRooms((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateAdults = (roomIdx: number, change: number) => {
    setRooms((prev) => {
      const updated = [...prev];
      const newAdults = Math.max(1, Math.min(9, updated[roomIdx].adults + change));
      updated[roomIdx] = { ...updated[roomIdx], adults: newAdults };
      return updated;
    });
  };

  const addChild = (roomIdx: number) => {
    setRooms((prev) => {
      const updated = [...prev];
      if (updated[roomIdx].childrenAges.length < 8) {
        updated[roomIdx] = {
          ...updated[roomIdx],
          childrenAges: [...updated[roomIdx].childrenAges, 7],
        };
      }
      return updated;
    });
  };

  const removeChild = (roomIdx: number, childIdx: number) => {
    setRooms((prev) => {
      const updated = [...prev];
      const newAges = [...updated[roomIdx].childrenAges];
      newAges.splice(childIdx, 1);
      updated[roomIdx] = { ...updated[roomIdx], childrenAges: newAges };
      return updated;
    });
  };

  const updateChildAge = (roomIdx: number, childIdx: number, age: number) => {
    setRooms((prev) => {
      const updated = [...prev];
      const newAges = [...updated[roomIdx].childrenAges];
      newAges[childIdx] = age;
      updated[roomIdx] = { ...updated[roomIdx], childrenAges: newAges };
      return updated;
    });
  };

  const totalAdults = rooms.reduce((acc, r) => acc + r.adults, 0);
  const totalChildren = rooms.reduce((acc, r) => acc + r.childrenAges.length, 0);
  const travellersSummary = `${totalAdults} Adult${totalAdults > 1 ? "s" : ""}${
    totalChildren > 0 ? `, ${totalChildren} Child${totalChildren > 1 ? "ren" : ""}` : ""
  }, ${rooms.length} Room${rooms.length > 1 ? "s" : ""}`;

  const nights = Math.max(
    1,
    Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
  );

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
            adults: totalAdults,
            rooms,
          }),
        });

        const data = await res.json();
        if (!isCancelled && data.success && Array.isArray(data.hotels) && data.hotels.length > 0) {
          const list: HotelResult[] = data.hotels;
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
        } else if (!isCancelled && (!data.success || !data.hotels || data.hotels.length === 0)) {
          // If no data from API response, navigate to homepage
          router.replace("/");
        }
      } catch (err) {
        console.error("Failed to load hotels:", err);
        if (!isCancelled) {
          router.replace("/");
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadHotels();

    return () => {
      isCancelled = true;
    };
  }, [destination, checkIn, checkOut, initialHotelCode, searchVersion]);

  const copySearchId = () => {
    if (!searchId) return;
    navigator.clipboard.writeText(searchId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Toggle Filter Helpers
  const toggleStar = (stars: number) => {
    setSelectedStars((prev) =>
      prev.includes(stars) ? prev.filter((s) => s !== stars) : [...prev, stars]
    );
  };

  const toggleBoard = (board: string) => {
    setSelectedBoards((prev) =>
      prev.includes(board) ? prev.filter((b) => b !== board) : [...prev, board]
    );
  };

  const togglePropertyType = (type: string) => {
    setSelectedPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleFacility = (facility: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility]
    );
  };

  const toggleHolidayType = (ht: string) => {
    setSelectedHolidayTypes((prev) =>
      prev.includes(ht) ? prev.filter((h) => h !== ht) : [...prev, ht]
    );
  };

  const handleClearAll = () => {
    setSelectedStars([]);
    setMinPrice(50);
    setMaxPrice(500);
    setSelectedBoards([]);
    setSelectedPropertyTypes([]);
    setSelectedFacilities([]);
    setSelectedHolidayTypes([]);
    setKeyword("");
    setDestination("all");
  };

  // Filter & Sort hotels
  const filteredHotels = useMemo(() => {
    const list = hotels.filter((h) => {
      // 1. Star Rating (Multi-select)
      if (selectedStars.length > 0 && !selectedStars.includes(h.starRating)) {
        return false;
      }

      // 2. Price per night
      const nightlyPrice = Math.round(
        (h.leadPricing?.hotelPrice || h.leadPricing?.totalPrice || 0) / nights
      );
      if (minPrice > 50 && nightlyPrice < minPrice) return false;
      if (maxPrice < 500 && nightlyPrice > maxPrice) return false;

      // 3. Board Basis (Multi-select)
      if (selectedBoards.length > 0) {
        const matchesBoard = selectedBoards.some((b) => {
          const target = b.toLowerCase();
          return h.availableRates.some((rate) => {
            const basis = (rate.boardBasis || "").toLowerCase();
            if (target === "room only") return basis.includes("room only");
            if (target === "bed & breakfast")
              return basis.includes("breakfast") || basis.includes("b&b");
            if (target === "half board") return basis.includes("half board");
            if (target === "full board") return basis.includes("full board");
            if (target === "all inclusive")
              return (
                basis.includes("all inclusive") ||
                basis.includes("all-inclusive") ||
                basis.includes("ultra all inclusive")
              );
            return basis.includes(target);
          });
        });
        if (!matchesBoard) return false;
      }

      // 4. Property Type (Multi-select)
      if (selectedPropertyTypes.length > 0) {
        const combined = `${h.hotelName} ${h.description || ""}`.toLowerCase();
        const matchesType = selectedPropertyTypes.some((type) => {
          if (type === "Resort") return combined.includes("resort") || combined.includes("palace");
          if (type === "Aparthotel")
            return (
              combined.includes("aparthotel") ||
              combined.includes("apartment") ||
              combined.includes("suites") ||
              combined.includes("suite")
            );
          if (type === "Villa")
            return combined.includes("villa") || combined.includes("chalet") || combined.includes("bungalow");
          if (type === "Hotel") {
            return (
              combined.includes("hotel") ||
              combined.includes("boutique") ||
              (!combined.includes("villa") && !combined.includes("aparthotel"))
            );
          }
          return false;
        });
        if (!matchesType) return false;
      }

      // 5. Facilities (Multi-select)
      if (selectedFacilities.length > 0) {
        const facCombined = `${(h.facilities || []).join(" ")} ${h.description || ""}`.toLowerCase();
        const matchesAllFacilities = selectedFacilities.every((fac) => {
          if (fac === "Pool") return facCombined.includes("pool");
          if (fac === "Beachfront")
            return (
              facCombined.includes("beach") ||
              facCombined.includes("coastal") ||
              facCombined.includes("caldera") ||
              facCombined.includes("sea")
            );
          if (fac === "Spa")
            return (
              facCombined.includes("spa") ||
              facCombined.includes("wellness") ||
              facCombined.includes("hammam") ||
              facCombined.includes("sauna") ||
              facCombined.includes("steam")
            );
          if (fac === "Gym")
            return (
              facCombined.includes("gym") ||
              facCombined.includes("fitness") ||
              facCombined.includes("health club") ||
              facCombined.includes("tennis") ||
              facCombined.includes("sports")
            );
          if (fac === "Free Wi-Fi")
            return facCombined.includes("wi-fi") || facCombined.includes("wifi") || facCombined.includes("internet");
          if (fac === "Family Friendly")
            return (
              facCombined.includes("kid") ||
              facCombined.includes("child") ||
              facCombined.includes("family") ||
              facCombined.includes("water park") ||
              facCombined.includes("waterpark")
            );
          if (fac === "Adults Only")
            return (
              facCombined.includes("adult") ||
              facCombined.includes("couples") ||
              facCombined.includes("honeymoon") ||
              facCombined.includes("cave suites")
            );
          return facCombined.includes(fac.toLowerCase());
        });
        if (!matchesAllFacilities) return false;
      }

      // 6. Holiday Type (Multi-select)
      if (selectedHolidayTypes.length > 0) {
        const text = `${h.hotelName} ${h.description || ""} ${(h.facilities || []).join(" ")}`.toLowerCase();
        const matchesHoliday = selectedHolidayTypes.some((ht) => {
          if (ht === "Beach")
            return (
              text.includes("beach") ||
              text.includes("sea") ||
              text.includes("coast") ||
              text.includes("caldera") ||
              text.includes("riviera")
            );
          if (ht === "Family")
            return (
              text.includes("family") ||
              text.includes("kid") ||
              text.includes("waterpark") ||
              text.includes("slides") ||
              text.includes("park")
            );
          if (ht === "Couples")
            return (
              text.includes("couples") ||
              text.includes("adult") ||
              text.includes("honeymoon") ||
              text.includes("sunset") ||
              text.includes("suites") ||
              text.includes("boutique")
            );
          if (ht === "Luxury")
            return (
              h.starRating >= 5 ||
              text.includes("luxury") ||
              text.includes("palace") ||
              text.includes("grand") ||
              text.includes("gourmet")
            );
          if (ht === "All Inclusive") {
            return (
              h.availableRates.some(
                (r) =>
                  r.boardBasis.toLowerCase().includes("all inclusive") ||
                  r.boardBasis.toLowerCase().includes("all-inclusive")
              ) || text.includes("all inclusive")
            );
          }
          return false;
        });
        if (!matchesHoliday) return false;
      }

      // 7. Search keyword
      if (keyword.trim()) {
        const q = keyword.toLowerCase().trim();
        const matchName = h.hotelName.toLowerCase().includes(q);
        const matchAddress = h.address.toLowerCase().includes(q);
        const matchCity = (h.city || "").toLowerCase().includes(q);
        if (!matchName && !matchAddress && !matchCity) return false;
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
  }, [
    hotels,
    selectedStars,
    minPrice,
    maxPrice,
    selectedBoards,
    selectedPropertyTypes,
    selectedFacilities,
    selectedHolidayTypes,
    keyword,
    sortBy,
    nights,
  ]);

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
              <div className="lg:col-span-3 flex flex-col gap-1.5">
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
              <div className="lg:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-bold text-[#1D1248]">Check-in Date</label>
                <DatePicker value={checkIn} onChange={setCheckIn} placeholder="Select check-in" />
              </div>

              {/* CHECK-OUT */}
              <div className="lg:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-bold text-[#1D1248]">Check-out Date</label>
                <DatePicker value={checkOut} onChange={setCheckOut} placeholder="Select check-out" minDate={checkIn} />
              </div>

              {/* TRAVELLERS & ROOMS */}
              <div ref={travellersRef} className="lg:col-span-3 flex flex-col gap-1.5 relative">
                <label className="text-xs sm:text-sm font-bold text-[#1D1248] flex items-center gap-1.5">
                  <FaUserFriends className="text-[#F7941D]" /> Travellers &amp; Rooms
                </label>
                <button
                  type="button"
                  onClick={() => setShowTravellersPopover(!showTravellersPopover)}
                  className="w-full text-left rounded-xl bg-gray-50 border border-gray-200 px-3.5 py-3 text-xs sm:text-sm text-gray-800 focus:border-[#F7941D] focus:bg-white focus:outline-none transition-all font-semibold flex items-center justify-between cursor-pointer"
                >
                  <span className="truncate">{travellersSummary}</span>
                  <FaChevronDown
                    className={`text-gray-400 text-xs shrink-0 ml-2 transition-transform duration-200 ${
                      showTravellersPopover ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* ROOMS & GUESTS POPOVER */}
                {showTravellersPopover && (
                  <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-white p-4 sm:p-5 shadow-2xl border border-gray-200 z-50 text-[#1D1248] animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div>
                        <span className="font-bold text-sm sm:text-base block">Travellers &amp; Rooms</span>
                        <span className="text-[11px] text-gray-500">Up to 9 rooms, 9 adults per room</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowTravellersPopover(false)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <FaTimes className="text-sm" />
                      </button>
                    </div>

                    <div className="max-h-72 overflow-y-auto py-3 space-y-4">
                      {rooms.map((room, roomIdx) => (
                        <div key={roomIdx} className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 space-y-3">
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
                          className="text-xs font-bold text-[#F7941D] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <FaPlus className="text-[10px]" /> Add Another Room
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setShowTravellersPopover(false);
                          setSearchVersion((v) => v + 1);
                        }}
                        className="ml-auto rounded-lg bg-[#1D1248] text-white px-4 py-2 text-xs font-bold hover:bg-[#2B1B6D] transition-colors cursor-pointer"
                      >
                        Apply &amp; Search
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* SEARCH ACTION */}
              <div className="lg:col-span-2">
                <button
                  type="button"
                  onClick={() => setSearchVersion((v) => v + 1)}
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
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
              {/* HEADER */}
              <div className="flex items-center justify-between pb-3.5 border-b border-gray-200/70">
                <span className="font-extrabold text-xs sm:text-sm tracking-wider text-[#1D1248] uppercase">
                  Filter Hotels
                </span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs font-semibold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              {/* 1. DESTINATION / AREA */}
              <div className="pt-3.5">
                <label className="text-xs font-bold text-[#1D1248] block mb-2">
                  Destination / Area
                </label>
                <div className="relative">
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-gray-700 pr-9 focus:border-[#F7941D] focus:outline-none cursor-pointer shadow-2xs hover:border-gray-300 transition-colors"
                  >
                    <option value="all">All Destinations (Featured)</option>
                    <option value="antalya">Antalya</option>
                    <option value="dubai">Dubai</option>
                    <option value="greece">Santorini (Greece)</option>
                    <option value="spain">Tenerife (Spain)</option>
                    <option value="turkey">Turkey (Riviera)</option>
                    <option value="portugal">Algarve (Portugal)</option>
                    {activeDestinations
                      .filter(
                        (d) =>
                          !["antalya", "dubai", "greece", "spain", "turkey", "portugal", "all"].includes(
                            d.slug
                          )
                      )
                      .map((d) => (
                        <option key={d.slug} value={d.slug}>
                          {d.destination} ({d.country})
                        </option>
                      ))}
                  </select>
                  <FaChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#1D1248]" />
                </div>
              </div>

              <div className="border-b border-gray-200/70 my-3.5" />

              {/* 2. PRICE PER NIGHT */}
              <div>
                <label className="text-xs font-bold text-[#1D1248] block mb-3">
                  Price per night
                </label>
                <div className="relative pt-2 pb-1 px-1">
                  {/* Track base */}
                  <div className="relative w-full h-1 bg-gray-200 rounded-full">
                    {/* Active orange segment */}
                    <div
                      className="absolute h-1 bg-[#F7941D] rounded-full"
                      style={{
                        left: `${((minPrice - 50) / 450) * 100}%`,
                        right: `${100 - ((maxPrice - 50) / 450) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Overlapping inputs */}
                  <input
                    type="range"
                    min={50}
                    max={500}
                    step={10}
                    value={minPrice}
                    onChange={(e) => {
                      const val = Math.min(Number(e.target.value), maxPrice - 10);
                      setMinPrice(val);
                    }}
                    className="absolute inset-x-1 inset-y-0 w-[calc(100%-8px)] opacity-0 cursor-pointer pointer-events-auto"
                    style={{ zIndex: minPrice > 450 ? 5 : 3 }}
                    aria-label="Minimum price per night"
                  />
                  <input
                    type="range"
                    min={50}
                    max={500}
                    step={10}
                    value={maxPrice}
                    onChange={(e) => {
                      const val = Math.max(Number(e.target.value), minPrice + 10);
                      setMaxPrice(val);
                    }}
                    className="absolute inset-x-1 inset-y-0 w-[calc(100%-8px)] opacity-0 cursor-pointer pointer-events-auto"
                    style={{ zIndex: 4 }}
                    aria-label="Maximum price per night"
                  />

                  {/* Left circular handle (hollow with orange ring) */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-[#F7941D] bg-white pointer-events-none shadow-xs transition-[left] duration-75"
                    style={{ left: `calc(${((minPrice - 50) / 450) * 100}% + 4px)` }}
                  />

                  {/* Right circular handle (solid orange) */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#F7941D] border-2 border-[#F7941D] pointer-events-none shadow-xs transition-[left] duration-75"
                    style={{ left: `calc(${((maxPrice - 50) / 450) * 100}% + 4px)` }}
                  />
                </div>

                <div className="flex justify-between items-center text-xs font-semibold text-gray-500 mt-2.5">
                  <span>£{minPrice}</span>
                  <span>{maxPrice >= 500 ? "£500+" : `£${maxPrice}`}</span>
                </div>
              </div>

              <div className="border-b border-gray-200/70 my-3.5" />

              {/* 3. HOTEL RATING */}
              <div>
                <label className="text-xs font-bold text-[#1D1248] block mb-2.5">
                  Hotel Rating
                </label>
                <div className="space-y-2">
                  {STAR_OPTIONS.map((stars) => {
                    const isChecked = selectedStars.includes(stars);
                    return (
                      <label
                        key={stars}
                        className="flex items-center gap-3 cursor-pointer text-xs group select-none py-0.5"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleStar(stars)}
                          className="w-4 h-4 rounded-xs border-gray-300 text-[#F7941D] focus:ring-[#F7941D] cursor-pointer accent-[#F7941D]"
                        />
                        <div className="flex items-center gap-1 text-[#F7941D] text-xs">
                          {Array.from({ length: stars }).map((_, i) => (
                            <FaStar key={i} />
                          ))}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="border-b border-gray-200/70 my-3.5" />

              {/* 4. BOARD BASIS */}
              <div>
                <label className="text-xs font-bold text-[#1D1248] block mb-2.5">
                  Board Basis
                </label>
                <div className="space-y-2">
                  {BOARD_OPTIONS.map((board) => {
                    const isChecked = selectedBoards.includes(board);
                    return (
                      <label
                        key={board}
                        className="flex items-center gap-3 cursor-pointer text-xs text-gray-700 hover:text-gray-900 group select-none py-0.5"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleBoard(board)}
                          className="w-4 h-4 rounded-xs border-gray-300 text-[#F7941D] focus:ring-[#F7941D] cursor-pointer accent-[#F7941D]"
                        />
                        <span className="font-normal text-xs text-gray-700">{board}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="border-b border-gray-200/70 my-3.5" />

              {/* 5. PROPERTY TYPE */}
              <div>
                <label className="text-xs font-bold text-[#1D1248] block mb-2.5">
                  Property Type
                </label>
                <div className="space-y-2">
                  {PROPERTY_TYPE_OPTIONS.map((type) => {
                    const isChecked = selectedPropertyTypes.includes(type);
                    return (
                      <label
                        key={type}
                        className="flex items-center gap-3 cursor-pointer text-xs text-gray-700 hover:text-gray-900 group select-none py-0.5"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePropertyType(type)}
                          className="w-4 h-4 rounded-xs border-gray-300 text-[#F7941D] focus:ring-[#F7941D] cursor-pointer accent-[#F7941D]"
                        />
                        <span className="font-normal text-xs text-gray-700">{type}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="border-b border-gray-200/70 my-3.5" />

              {/* 6. FACILITIES */}
              <div>
                <label className="text-xs font-bold text-[#1D1248] block mb-2.5">
                  Facilities
                </label>
                <div className="space-y-2">
                  {FACILITY_OPTIONS.map((facility) => {
                    const isChecked = selectedFacilities.includes(facility);
                    return (
                      <label
                        key={facility}
                        className="flex items-center gap-3 cursor-pointer text-xs text-gray-700 hover:text-gray-900 group select-none py-0.5"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleFacility(facility)}
                          className="w-4 h-4 rounded-xs border-gray-300 text-[#F7941D] focus:ring-[#F7941D] cursor-pointer accent-[#F7941D]"
                        />
                        <span className="font-normal text-xs text-gray-700">{facility}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="border-b border-gray-200/70 my-3.5" />

              {/* 7. HOLIDAY TYPE */}
              <div>
                <label className="text-xs font-bold text-[#1D1248] block mb-2.5">
                  Holiday Type
                </label>
                <div className="space-y-2">
                  {HOLIDAY_TYPE_OPTIONS.map((ht) => {
                    const isChecked = selectedHolidayTypes.includes(ht);
                    return (
                      <label
                        key={ht}
                        className="flex items-center gap-3 cursor-pointer text-xs text-gray-700 hover:text-gray-900 group select-none py-0.5"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleHolidayType(ht)}
                          className="w-4 h-4 rounded-xs border-gray-300 text-[#F7941D] focus:ring-[#F7941D] cursor-pointer accent-[#F7941D]"
                        />
                        <span className="font-medium text-xs text-gray-700">{ht}</span>
                      </label>
                    );
                  })}
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
                  onClick={handleClearAll}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-[#F7941D] text-white text-xs font-bold hover:bg-[#e08316] transition-colors cursor-pointer"
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
                          £{hotel.leadPricing.pricePerPerson.toFixed(2)} per person ({nights} night{nights > 1 ? "s" : ""}, {rooms.length} {rooms.length === 1 ? "room" : "rooms"})
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

