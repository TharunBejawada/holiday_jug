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
  FaSpinner,
  FaArrowLeft,
  FaSortAmountDown,
  FaUtensils,
  FaCalendarAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { SearchableSelect } from "@/components/SearchableSelect";
import { DatePicker } from "@/components/DatePicker";
import { CallForHiddenPricesBanner } from "@/components/CallForHiddenPricesBanner";
import { CallForHiddenPricesModal } from "@/components/CallForHiddenPricesModal";
import { getActiveSearchDestinations } from "@/lib/destinations-master";
import { DESTINATIONS_NAV_DATA } from "@/lib/destinations-nav-data";

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
  geolocation?: {
    latitude: number;
    longitude: number;
  } | null;
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

const PROPERTY_TYPE_OPTIONS = [
  "service apartment",
  "homestay",
  "resort",
  "hotel",
  "villa",
];

const POPULAR_FILTER_OPTIONS = [
  "Couple Friendly",
  "Pay At Hotel",
  "Leisure",
  "Free Cancellation",
  "Breakfast Included",
  "Swimming Pool",
  "Beachfront",
  "Family Friendly",
];

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

const SEARCH_STORAGE_KEY = "holidayjug_hotel_search_cache_v1";

interface SavedSearchState {
  destination: string;
  checkIn: string;
  checkOut: string;
  rooms: RoomConfig[];
  hotelCode?: string;
  hotels: HotelResult[];
  searchId: string;
  priceCheckedAt: string;
  selectedStars: number[];
  minPrice: number;
  maxPrice: number;
  selectedBoards: string[];
  selectedPropertyTypes: string[];
  selectedFacilities: string[];
  selectedHolidayTypes: string[];
  selectedPopularFilters: string[];
  sortBy: string;
  keyword: string;
  hasSearched?: boolean;
  timestamp: number;
}

function getStoredSearchState(): SavedSearchState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SEARCH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && Date.now() - (parsed.timestamp || 0) < 1000 * 60 * 60 * 3) {
      return parsed;
    }
  } catch {}
  return null;
}

function saveSearchState(state: Partial<SavedSearchState>) {
  if (typeof window === "undefined") return;
  try {
    const existing = getStoredSearchState() || ({} as any);
    const updated: SavedSearchState = {
      ...existing,
      ...state,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(SEARCH_STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}

function clearStoredSearchState() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(SEARCH_STORAGE_KEY);
  } catch {}
}

function updateUrlParams(opts: {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  rooms?: RoomConfig[];
  searchId?: string;
  stars?: number[];
  minPrice?: number;
  maxPrice?: number;
  boards?: string[];
  sort?: string;
}) {
  if (typeof window === "undefined") return;
  const p = new URLSearchParams();
  if (opts.destination && opts.destination !== "all") p.set("destination", opts.destination);
  if (opts.checkIn) p.set("checkIn", opts.checkIn);
  if (opts.checkOut) p.set("checkOut", opts.checkOut);
  if (opts.rooms && opts.rooms.length > 0) {
    const totalA = opts.rooms.reduce((acc, r) => acc + r.adults, 0);
    p.set("adults", String(totalA));
    p.set("rooms", JSON.stringify(opts.rooms));
  }
  if (opts.searchId) p.set("searchId", opts.searchId);
  if (opts.stars && opts.stars.length > 0) p.set("stars", opts.stars.join(","));
  if (typeof opts.minPrice === "number" && opts.minPrice > 50) p.set("minPrice", String(opts.minPrice));
  if (typeof opts.maxPrice === "number" && opts.maxPrice < 500) p.set("maxPrice", String(opts.maxPrice));
  if (opts.boards && opts.boards.length > 0) p.set("boards", opts.boards.join(","));
  if (opts.sort && opts.sort !== "recommended") p.set("sort", opts.sort);

  const q = p.toString();
  window.history.replaceState(null, "", q ? `/hotels?${q}` : "/hotels");
}

function HotelsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const destParam = searchParams.get("destination");
  const initialDestination = destParam && destParam !== "all" ? destParam : "";
  const initialHotelCode = searchParams.get("hotelCode") || "";
  const initialRating = searchParams.get("rating") ? Number(searchParams.get("rating")) : null;
  const initialStarsParam = searchParams.get("stars")
    ? searchParams.get("stars")!.split(",").map(Number).filter(Boolean)
    : [];
  const initialCheckIn = searchParams.get("checkIn") || "";
  const initialCheckOut = searchParams.get("checkOut") || "";

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
  // Default dates removed: displays placeholder until user selects
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [heroErrors, setHeroErrors] = useState<{ destination?: string; checkIn?: string; checkOut?: string }>({});

  // Filter States
  const [selectedStars, setSelectedStars] = useState<number[]>(
    initialStarsParam.length > 0 ? initialStarsParam : initialRating ? [initialRating] : []
  );
  const [minPrice, setMinPrice] = useState<number>(() => {
    const p = searchParams.get("minPrice");
    return p ? Number(p) : 50;
  });
  const [maxPrice, setMaxPrice] = useState<number>(() => {
    const p = searchParams.get("maxPrice");
    return p ? Number(p) : 500;
  });
  const [selectedBoards, setSelectedBoards] = useState<string[]>(() => {
    const b = searchParams.get("boards");
    return b ? b.split(",").filter(Boolean) : [];
  });
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>(() => {
    const pt = searchParams.get("propertyTypes");
    return pt ? pt.split(",").filter(Boolean) : [];
  });
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(() => {
    const f = searchParams.get("facilities");
    return f ? f.split(",").filter(Boolean) : [];
  });
  const [selectedHolidayTypes, setSelectedHolidayTypes] = useState<string[]>(() => {
    const ht = searchParams.get("holidayTypes");
    return ht ? ht.split(",").filter(Boolean) : [];
  });
  const [selectedPopularFilters, setSelectedPopularFilters] = useState<string[]>(() => {
    const pf = searchParams.get("popularFilters");
    return pf ? pf.split(",").filter(Boolean) : [];
  });
  const [showAllPropertyTypes, setShowAllPropertyTypes] = useState<boolean>(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState<string>("");
  const [keyword, setKeyword] = useState<string>(() => searchParams.get("keyword") || "");
  const [sortBy, setSortBy] = useState<string>(() => searchParams.get("sort") || "recommended");

  // Travellers & Rooms state
  const [rooms, setRooms] = useState<RoomConfig[]>(defaultRooms);
  const [showTravellersPopover, setShowTravellersPopover] = useState(false);
  const travellersRef = useRef<HTMLDivElement>(null);
  const [popoverPlacement, setPopoverPlacement] = useState<"down" | "up">("down");
  const [travellersMaxHeight, setTravellersMaxHeight] = useState<number | undefined>(undefined);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [searchVersion, setSearchVersion] = useState(0);

  // Cache & Mount Tracking
  const isInitialMount = useRef(true);
  const hasRestoredFromCache = useRef(false);

  // Dynamic placement for Travellers & Rooms popover based on scrolling and viewport boundaries
  useEffect(() => {
    if (!showTravellersPopover) return;

    const calculatePlacement = () => {
      if (!travellersRef.current) return;
      const rect = travellersRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const navbarHeight = 85;
      const popoverHeight = 440;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top - navbarHeight;

      const shouldFlipUp = spaceBelow < popoverHeight && (spaceAbove >= popoverHeight || spaceAbove > spaceBelow);

      if (shouldFlipUp) {
        setPopoverPlacement("up");
        setTravellersMaxHeight(Math.max(220, Math.floor(spaceAbove - 12)));
      } else {
        setPopoverPlacement("down");
        setTravellersMaxHeight(Math.max(220, Math.floor(spaceBelow - 12)));
      }
    };

    calculatePlacement();
    window.addEventListener("scroll", calculatePlacement, { capture: true, passive: true });
    window.addEventListener("resize", calculatePlacement, { passive: true });
    return () => {
      window.removeEventListener("scroll", calculatePlacement, { capture: true });
      window.removeEventListener("resize", calculatePlacement);
    };
  }, [showTravellersPopover]);

  // On Mount: Check session storage to hold filters & data when returning from hotel details
  useEffect(() => {
    if (!isInitialMount.current) return;
    isInitialMount.current = false;

    const stored = getStoredSearchState();
    if (!stored) return;

    // Condition 1: URL has dates (e.g. from browser back or breadcrumb with params)
    if (initialCheckIn && initialCheckOut) {
      const datesMatch = stored.checkIn === initialCheckIn && stored.checkOut === initialCheckOut;
      const destMatch =
        !initialDestination ||
        !stored.destination ||
        stored.destination.toLowerCase() === initialDestination.toLowerCase();

      if (datesMatch && destMatch && Array.isArray(stored.hotels) && stored.hotels.length > 0) {
        hasRestoredFromCache.current = true;
        setHotels(stored.hotels);
        setSearchId(stored.searchId || "");
        setPriceCheckedAt(stored.priceCheckedAt || "");
        setHasSearched(true);
        setLoading(false);
        setSearchTrigger({
          destination: stored.destination || initialDestination || "",
          checkIn: stored.checkIn,
          checkOut: stored.checkOut,
          rooms: stored.rooms || defaultRooms,
          hotelCode: stored.hotelCode || initialHotelCode || undefined,
        });
        if (stored.selectedStars && selectedStars.length === 0) setSelectedStars(stored.selectedStars);
        if (typeof stored.minPrice === "number") setMinPrice(stored.minPrice);
        if (typeof stored.maxPrice === "number") setMaxPrice(stored.maxPrice);
        if (stored.selectedBoards && selectedBoards.length === 0) setSelectedBoards(stored.selectedBoards);
        if (stored.selectedPropertyTypes && selectedPropertyTypes.length === 0) setSelectedPropertyTypes(stored.selectedPropertyTypes);
        if (stored.selectedFacilities && selectedFacilities.length === 0) setSelectedFacilities(stored.selectedFacilities);
        if (stored.selectedHolidayTypes && selectedHolidayTypes.length === 0) setSelectedHolidayTypes(stored.selectedHolidayTypes);
        if (stored.selectedPopularFilters && selectedPopularFilters.length === 0) setSelectedPopularFilters(stored.selectedPopularFilters);
        if (stored.sortBy) setSortBy(stored.sortBy);
        if (stored.keyword) setKeyword(stored.keyword);
        return;
      }
    }

    // Condition 2: URL has NO checkIn / checkOut (e.g. user clicked browser back or "Hotels" nav)
    // but user previously had an active search in this session!
    if (!initialCheckIn && !initialCheckOut && stored.checkIn && stored.checkOut && Array.isArray(stored.hotels) && stored.hotels.length > 0) {
      hasRestoredFromCache.current = true;
      setDestination(stored.destination || "");
      setCheckIn(stored.checkIn);
      setCheckOut(stored.checkOut);
      setRooms(stored.rooms || defaultRooms);
      setHotels(stored.hotels);
      setSearchId(stored.searchId || "");
      setPriceCheckedAt(stored.priceCheckedAt || "");
      setHasSearched(true);
      setLoading(false);
      setSearchTrigger({
        destination: stored.destination || "",
        checkIn: stored.checkIn,
        checkOut: stored.checkOut,
        rooms: stored.rooms || defaultRooms,
        hotelCode: stored.hotelCode || undefined,
      });
      if (stored.selectedStars) setSelectedStars(stored.selectedStars);
      if (typeof stored.minPrice === "number") setMinPrice(stored.minPrice);
      if (typeof stored.maxPrice === "number") setMaxPrice(stored.maxPrice);
      if (stored.selectedBoards) setSelectedBoards(stored.selectedBoards);
      if (stored.selectedPropertyTypes) setSelectedPropertyTypes(stored.selectedPropertyTypes);
      if (stored.selectedFacilities) setSelectedFacilities(stored.selectedFacilities);
      if (stored.selectedHolidayTypes) setSelectedHolidayTypes(stored.selectedHolidayTypes);
      if (stored.selectedPopularFilters) setSelectedPopularFilters(stored.selectedPopularFilters);
      if (stored.sortBy) setSortBy(stored.sortBy);
      if (stored.keyword) setKeyword(stored.keyword);

      // Sync URL to match restored search state
      updateUrlParams({
        destination: stored.destination,
        checkIn: stored.checkIn,
        checkOut: stored.checkOut,
        rooms: stored.rooms,
        searchId: stored.searchId,
        stars: stored.selectedStars,
        minPrice: stored.minPrice,
        maxPrice: stored.maxPrice,
        boards: stored.selectedBoards,
        sort: stored.sortBy,
      });
    }
  }, []);

  // Sync state if searchParams change via client navigation
  useEffect(() => {
    if (isInitialMount.current || hasRestoredFromCache.current) {
      return;
    }

    if (initialCheckIn && initialCheckOut) {
      setDestination(initialDestination || "");
      setCheckIn(initialCheckIn || "");
      setCheckOut(initialCheckOut || "");
      setHasSearched(true);
      setLoading(true);
      setSearchTrigger({
        destination: initialDestination || "",
        checkIn: initialCheckIn,
        checkOut: initialCheckOut,
        rooms: defaultRooms,
        hotelCode: initialHotelCode || undefined,
      });
    } else if (initialDestination) {
      setDestination(initialDestination);
    }
  }, [initialDestination, initialCheckIn, initialCheckOut, initialHotelCode]);

  // Mobile Bottom Sheet Filter / Sort / Location Drawer State
  const [mobileSheetOpen, setMobileSheetOpen] = useState<"filters" | "sort" | "location" | null>(null);

  // Draft filter states for Mobile Bottom Sheet (only applied on SUBMIT)
  const [draftStars, setDraftStars] = useState<number[]>([]);
  const [draftMinPrice, setDraftMinPrice] = useState<number>(50);
  const [draftMaxPrice, setDraftMaxPrice] = useState<number>(500);
  const [draftBoards, setDraftBoards] = useState<string[]>([]);
  const [draftPropertyTypes, setDraftPropertyTypes] = useState<string[]>([]);
  const [draftFacilities, setDraftFacilities] = useState<string[]>([]);
  const [draftHolidayTypes, setDraftHolidayTypes] = useState<string[]>([]);
  const [draftPopularFilters, setDraftPopularFilters] = useState<string[]>([]);

  const openMobileFilters = () => {
    setDraftStars([...selectedStars]);
    setDraftMinPrice(minPrice);
    setDraftMaxPrice(maxPrice);
    setDraftBoards([...selectedBoards]);
    setDraftPropertyTypes([...selectedPropertyTypes]);
    setDraftFacilities([...selectedFacilities]);
    setDraftHolidayTypes([...selectedHolidayTypes]);
    setDraftPopularFilters([...selectedPopularFilters]);
    setMobileSheetOpen("filters");
  };

  const applyMobileFilters = () => {
    setSelectedStars(draftStars);
    setMinPrice(draftMinPrice);
    setMaxPrice(draftMaxPrice);
    setSelectedBoards(draftBoards);
    setSelectedPropertyTypes(draftPropertyTypes);
    setSelectedFacilities(draftFacilities);
    setSelectedHolidayTypes(draftHolidayTypes);
    setSelectedPopularFilters(draftPopularFilters);
    setMobileSheetOpen(null);

    saveSearchState({
      selectedStars: draftStars,
      minPrice: draftMinPrice,
      maxPrice: draftMaxPrice,
      selectedBoards: draftBoards,
      selectedPropertyTypes: draftPropertyTypes,
      selectedFacilities: draftFacilities,
      selectedHolidayTypes: draftHolidayTypes,
      selectedPopularFilters: draftPopularFilters,
    });

    updateUrlParams({
      destination: searchTrigger?.destination || destination,
      checkIn: searchTrigger?.checkIn || checkIn,
      checkOut: searchTrigger?.checkOut || checkOut,
      rooms: searchTrigger?.rooms || rooms,
      searchId,
      stars: draftStars,
      minPrice: draftMinPrice,
      maxPrice: draftMaxPrice,
      boards: draftBoards,
      sort: sortBy,
    });

    scrollToResults();
  };

  const resetDraftFilters = () => {
    setDraftStars([]);
    setDraftMinPrice(50);
    setDraftMaxPrice(500);
    setDraftBoards([]);
    setDraftPropertyTypes([]);
    setDraftFacilities([]);
    setDraftHolidayTypes([]);
    setDraftPopularFilters([]);
  };

  const togglePopularFilter = (filter: string) => {
    setSelectedPopularFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const toggleDraftPopularFilter = (filter: string) => {
    setDraftPopularFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const toggleDraftStar = (stars: number) => {
    setDraftStars((prev) =>
      prev.includes(stars) ? prev.filter((s) => s !== stars) : [...prev, stars]
    );
  };

  const toggleDraftBoard = (board: string) => {
    setDraftBoards((prev) =>
      prev.includes(board) ? prev.filter((b) => b !== board) : [...prev, board]
    );
  };

  const toggleDraftPropertyType = (type: string) => {
    setDraftPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleDraftFacility = (facility: string) => {
    setDraftFacilities((prev) =>
      prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility]
    );
  };

  const toggleDraftHolidayType = (type: string) => {
    setDraftHolidayTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Prevent background scroll when mobile filter sheet is open
  useEffect(() => {
    if (mobileSheetOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileSheetOpen]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedStars.length > 0) count += selectedStars.length;
    if (minPrice > 50 || maxPrice < 500) count += 1;
    if (selectedBoards.length > 0) count += selectedBoards.length;
    if (selectedPropertyTypes.length > 0) count += selectedPropertyTypes.length;
    if (selectedFacilities.length > 0) count += selectedFacilities.length;
    if (selectedHolidayTypes.length > 0) count += selectedHolidayTypes.length;
    if (selectedPopularFilters.length > 0) count += selectedPopularFilters.length;
    if (destination !== "all" && destination) count += 1;
    return count;
  }, [
    selectedStars,
    minPrice,
    maxPrice,
    selectedBoards,
    selectedPropertyTypes,
    selectedFacilities,
    selectedHolidayTypes,
    selectedPopularFilters,
    destination,
  ]);

  const scrollToResults = () => {
    requestAnimationFrame(() => {
      if (resultsRef.current) {
        const headerOffset = 80;
        const elementPosition = resultsRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: "smooth",
        });
      }
    });
  };

  const handleUpdate = () => {
    // All filters are strictly mandatory
    const errors: { destination?: string; checkIn?: string; checkOut?: string } = {};
    if (!destination || destination === "all") {
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
      setHeroErrors(errors);
      return;
    }

    setHeroErrors({});
    setHasSearched(true);
    setLoading(true);
    setShowTravellersPopover(false);
    hasRestoredFromCache.current = false;

    setSearchTrigger({
      destination,
      checkIn,
      checkOut,
      rooms,
      hotelCode: initialHotelCode || undefined,
    });

    updateUrlParams({
      destination,
      checkIn,
      checkOut,
      rooms,
      stars: selectedStars,
      minPrice,
      maxPrice,
      boards: selectedBoards,
      sort: sortBy,
    });

    saveSearchState({
      destination,
      checkIn,
      checkOut,
      rooms,
      hotelCode: initialHotelCode || undefined,
      selectedStars,
      minPrice,
      maxPrice,
      selectedBoards,
      selectedPropertyTypes,
      selectedFacilities,
      selectedHolidayTypes,
      selectedPopularFilters,
      sortBy,
      keyword,
      hasSearched: true,
    });

    scrollToResults();
  };

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
  const totalChildren = rooms.reduce((acc, r) => acc + r.childrenAges.filter((a) => a >= 2).length, 0);
  const totalInfants = rooms.reduce((acc, r) => acc + r.childrenAges.filter((a) => a < 2).length, 0);
  const travellersSummary = `${totalAdults} Adult${totalAdults > 1 ? "s" : ""}${
    totalChildren > 0 ? `, ${totalChildren} Child${totalChildren > 1 ? "ren" : ""}` : ""
  }${totalInfants > 0 ? `, ${totalInfants} Infant${totalInfants > 1 ? "s" : ""}` : ""}, ${rooms.length} Room${rooms.length > 1 ? "s" : ""}`;

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 7;
    const tIn = new Date(checkIn).getTime();
    const tOut = new Date(checkOut).getTime();
    if (isNaN(tIn) || isNaN(tOut) || tOut <= tIn) return 7;
    return Math.max(1, Math.round((tOut - tIn) / (1000 * 60 * 60 * 24)));
  }, [checkIn, checkOut]);

  // API State
  const hasInitialDates = Boolean(initialCheckIn && initialCheckOut);
  const [searchTrigger, setSearchTrigger] = useState<{
    destination: string;
    checkIn: string;
    checkOut: string;
    rooms: RoomConfig[];
    hotelCode?: string;
  } | null>(() => {
    if (hasInitialDates) {
      return {
        destination: initialDestination,
        checkIn: initialCheckIn,
        checkOut: initialCheckOut,
        rooms: defaultRooms,
        hotelCode: initialHotelCode || undefined,
      };
    }
    return null;
  });
  const [hasSearched, setHasSearched] = useState(hasInitialDates);
  const [loading, setLoading] = useState(hasInitialDates);
  const [hotels, setHotels] = useState<HotelResult[]>([]);
  const [searchId, setSearchId] = useState<string>("");
  const [priceCheckedAt, setPriceCheckedAt] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const activeDestinations = getActiveSearchDestinations();

  const destinationOptions = useMemo(() => {
    const list: Array<{
      value: string;
      label: string;
      subtitle?: string;
      badge?: string;
      tags?: string[];
      searchTerms?: string[];
    }> = [];

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

    // 3. Mapped destinations from DESTINATIONS_MASTER
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
  }, [activeDestinations]);

  const filteredLocationOptions = useMemo(() => {
    if (!locationSearchQuery.trim()) return destinationOptions;
    const q = locationSearchQuery.toLowerCase();
    return destinationOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.subtitle && opt.subtitle.toLowerCase().includes(q)) ||
        (opt.searchTerms && opt.searchTerms.some((t) => t.toLowerCase().includes(q)))
    );
  }, [destinationOptions, locationSearchQuery]);

  // Execute Hotel Search & Availability API ONLY when searchTrigger changes (explicit Search click or initial load with dates)
  useEffect(() => {
    if (!searchTrigger || !searchTrigger.checkIn || !searchTrigger.checkOut) {
      setLoading(false);
      return;
    }

    if (hasRestoredFromCache.current) {
      hasRestoredFromCache.current = false;
      return;
    }

    let isCancelled = false;

    async function loadHotels() {
      setLoading(true);
      try {
        const guests = searchTrigger!.rooms.reduce((acc, r) => acc + r.adults, 0);
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "hotels",
            destination: searchTrigger!.destination || undefined,
            hotelCode: searchTrigger!.hotelCode || undefined,
            checkIn: searchTrigger!.checkIn,
            checkOut: searchTrigger!.checkOut,
            adults: guests,
            rooms: searchTrigger!.rooms,
          }),
        });

        const data = await res.json();
        if (!isCancelled && data.success && Array.isArray(data.hotels) && data.hotels.length > 0) {
          const list: HotelResult[] = data.hotels;
          setHotels(list);
          setSearchId(data.searchId || "");
          setPriceCheckedAt(data.priceCheckedAt || "");

          saveSearchState({
            destination: searchTrigger!.destination,
            checkIn: searchTrigger!.checkIn,
            checkOut: searchTrigger!.checkOut,
            rooms: searchTrigger!.rooms,
            hotelCode: searchTrigger!.hotelCode,
            hotels: list,
            searchId: data.searchId || "",
            priceCheckedAt: data.priceCheckedAt || "",
            selectedStars,
            minPrice,
            maxPrice,
            selectedBoards,
            selectedPropertyTypes,
            selectedFacilities,
            selectedHolidayTypes,
            selectedPopularFilters,
            sortBy,
            keyword,
            hasSearched: true,
          });

          updateUrlParams({
            destination: searchTrigger!.destination,
            checkIn: searchTrigger!.checkIn,
            checkOut: searchTrigger!.checkOut,
            rooms: searchTrigger!.rooms,
            searchId: data.searchId || "",
            stars: selectedStars,
            minPrice,
            maxPrice,
            boards: selectedBoards,
            sort: sortBy,
          });
        } else if (!isCancelled) {
          setHotels([]);
        }
      } catch (err) {
        console.error("Failed to load hotels:", err);
        if (!isCancelled) {
          setHotels([]);
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadHotels();

    return () => {
      isCancelled = true;
    };
  }, [searchTrigger]);

  // Keep search cache in sync when user toggles sidebar filters
  useEffect(() => {
    if (!hasSearched || hotels.length === 0) return;
    saveSearchState({
      selectedStars,
      minPrice,
      maxPrice,
      selectedBoards,
      selectedPropertyTypes,
      selectedFacilities,
      selectedHolidayTypes,
      selectedPopularFilters,
      sortBy,
      keyword,
    });
  }, [
    selectedStars,
    minPrice,
    maxPrice,
    selectedBoards,
    selectedPropertyTypes,
    selectedFacilities,
    selectedHolidayTypes,
    selectedPopularFilters,
    sortBy,
    keyword,
    hasSearched,
    hotels.length,
  ]);

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
    clearStoredSearchState();
    setSelectedStars([]);
    setMinPrice(50);
    setMaxPrice(500);
    setSelectedBoards([]);
    setSelectedPropertyTypes([]);
    setSelectedFacilities([]);
    setSelectedHolidayTypes([]);
    setSelectedPopularFilters([]);
    setKeyword("");
    setDestination("");
    setCheckIn("");
    setCheckOut("");
    setHasSearched(false);
    setLoading(false);
    setHotels([]);
    setSearchTrigger(null);
    resetDraftFilters();
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", "/hotels");
    }
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
          const t = type.toLowerCase();
          if (t === "resort") return combined.includes("resort") || combined.includes("palace");
          if (t.includes("apartment") || t === "aparthotel" || t.includes("service"))
            return (
              combined.includes("aparthotel") ||
              combined.includes("apartment") ||
              combined.includes("suites") ||
              combined.includes("suite")
            );
          if (t === "homestay")
            return combined.includes("homestay") || combined.includes("guest") || combined.includes("house");
          if (t === "villa")
            return combined.includes("villa") || combined.includes("chalet") || combined.includes("bungalow");
          if (t === "hotel") {
            return (
              combined.includes("hotel") ||
              combined.includes("boutique") ||
              (!combined.includes("villa") && !combined.includes("apartment"))
            );
          }
          return false;
        });
        if (!matchesType) return false;
      }

      // 4b. Popular Filters (Couple Friendly, Pay At Hotel, Leisure, Free Cancellation, etc.)
      if (selectedPopularFilters.length > 0) {
        const popCombined = `${(h.facilities || []).join(" ")} ${h.description || ""} ${h.hotelName}`.toLowerCase();
        const matchesAllPop = selectedPopularFilters.every((pf) => {
          if (pf === "Couple Friendly") return popCombined.includes("couple") || popCombined.includes("romantic") || popCombined.includes("adult");
          if (pf === "Pay At Hotel") return true;
          if (pf === "Leisure") return popCombined.includes("leisure") || popCombined.includes("resort") || popCombined.includes("pool") || popCombined.includes("spa");
          if (pf === "Free Cancellation") return h.availableRates?.some(r => !r.cancellationPolicy?.toLowerCase().includes("non-refundable"));
          if (pf === "Breakfast Included") return h.availableRates?.some(r => r.boardBasis?.toLowerCase().includes("breakfast") || r.boardBasis?.toLowerCase().includes("all inclusive"));
          if (pf === "Swimming Pool") return popCombined.includes("pool");
          if (pf === "Beachfront") return popCombined.includes("beach") || popCombined.includes("sea") || popCombined.includes("coastal");
          if (pf === "Family Friendly") return popCombined.includes("family") || popCombined.includes("kid") || popCombined.includes("children");
          return false;
        });
        if (!matchesAllPop) return false;
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
    selectedPopularFilters,
    keyword,
    sortBy,
    nights,
  ]);

  // Real-time matched hotel count preview for Mobile Filter Drawer SUBMIT button
  const draftFilteredHotelsCount = useMemo(() => {
    return hotels.filter((h) => {
      if (draftStars.length > 0 && !draftStars.includes(h.starRating)) return false;
      const hotelNightly = h.leadPricing?.hotelPrice
        ? h.leadPricing.hotelPrice / nights
        : h.leadPricing.totalPrice / nights;
      if (hotelNightly < draftMinPrice) return false;
      if (draftMaxPrice < 500 && hotelNightly > draftMaxPrice) return false;
      if (draftBoards.length > 0) {
        const matchesBoard = h.availableRates?.some((r) =>
          draftBoards.some((b) => r.boardBasis?.toLowerCase().includes(b.toLowerCase()))
        );
        if (!matchesBoard) return false;
      }
      if (draftPropertyTypes.length > 0) {
        const combined = `${h.hotelName} ${h.description || ""}`.toLowerCase();
        const matchesType = draftPropertyTypes.some((type) => {
          const t = type.toLowerCase();
          if (t === "resort") return combined.includes("resort") || combined.includes("palace");
          if (t.includes("apartment") || t === "aparthotel" || t.includes("service"))
            return combined.includes("apartment") || combined.includes("aparthotel") || combined.includes("suite");
          if (t === "homestay")
            return combined.includes("homestay") || combined.includes("guest") || combined.includes("house");
          if (t === "villa") return combined.includes("villa") || combined.includes("bungalow");
          if (t === "hotel") return !combined.includes("apartment") && !combined.includes("villa");
          return false;
        });
        if (!matchesType) return false;
      }
      if (draftPopularFilters.length > 0) {
        const popCombined = `${(h.facilities || []).join(" ")} ${h.description || ""} ${h.hotelName}`.toLowerCase();
        const matchesAllPop = draftPopularFilters.every((pf) => {
          if (pf === "Couple Friendly") return popCombined.includes("couple") || popCombined.includes("romantic") || popCombined.includes("adult");
          if (pf === "Pay At Hotel") return true;
          if (pf === "Leisure") return popCombined.includes("leisure") || popCombined.includes("resort") || popCombined.includes("pool") || popCombined.includes("spa");
          if (pf === "Free Cancellation") return h.availableRates?.some(r => !r.cancellationPolicy?.toLowerCase().includes("non-refundable"));
          if (pf === "Breakfast Included") return h.availableRates?.some(r => r.boardBasis?.toLowerCase().includes("breakfast") || r.boardBasis?.toLowerCase().includes("all inclusive"));
          if (pf === "Swimming Pool") return popCombined.includes("pool");
          if (pf === "Beachfront") return popCombined.includes("beach") || popCombined.includes("sea") || popCombined.includes("coastal");
          if (pf === "Family Friendly") return popCombined.includes("family") || popCombined.includes("kid") || popCombined.includes("children");
          return false;
        });
        if (!matchesAllPop) return false;
      }
      if (draftFacilities.length > 0) {
        const facs = (h.facilities || []).map((f) => f.toLowerCase());
        const matchesAll = draftFacilities.every((fac) => {
          const target = fac.toLowerCase();
          return facs.some((f) => f.includes(target) || target.includes(f));
        });
        if (!matchesAll) return false;
      }
      if (draftHolidayTypes.length > 0) {
        const combined = `${h.hotelName} ${h.description || ""} ${(h.facilities || []).join(" ")}`.toLowerCase();
        const matchesAny = draftHolidayTypes.some((ht) => {
          const t = ht.toLowerCase();
          if (t === "beach") return combined.includes("beach") || combined.includes("sea");
          if (t === "family") return combined.includes("family") || combined.includes("kid") || combined.includes("children");
          if (t === "couples") return combined.includes("couple") || combined.includes("adult") || combined.includes("romantic");
          if (t === "luxury") return h.starRating >= 5 || combined.includes("luxury") || combined.includes("deluxe") || combined.includes("premium");
          if (t === "all inclusive") return combined.includes("all inclusive");
          return false;
        });
        if (!matchesAny) return false;
      }
      return true;
    }).length;
  }, [
    hotels,
    draftStars,
    draftMinPrice,
    draftMaxPrice,
    draftBoards,
    draftPropertyTypes,
    draftPopularFilters,
    draftFacilities,
    draftHolidayTypes,
    nights,
  ]);

  const activeDestVal = searchTrigger ? searchTrigger.destination : destination;
  const isOverview = !activeDestVal || activeDestVal === "all";
  const currentDestinationName = isOverview
    ? "Featured Worldwide Stays"
    : destinationOptions.find((d) => d.value.toLowerCase() === activeDestVal.toLowerCase())?.label || activeDestVal;

  return (
    <div className="min-h-screen bg-gray-50/70 pb-20">
      {/* 1. HERO & INTERACTIVE FILTER HEADER */}
      <div className="relative z-30 text-white pt-10 sm:pt-14 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-[#071746] border-b border-amber-500/20">
        {/* Full Background Banner Image with Gradient */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/HOTEL OVERVIEW/Hotel Overview Banner.jpg"
            alt="Hotel Overview"
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient Overlay for Crisp Text Readability on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#071746]/95 via-[#071746]/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* HERO TITLE & SUBTITLE */}
          <div className="max-w-2xl mb-8 sm:mb-10 text-left">
            <p
              className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-[#F7941D] font-normal tracking-wide drop-shadow-sm"
              style={{ fontFamily: "'Dancing Script', 'Caveat', 'Playfair Display', cursive, serif" }}
            >
              find your perfect
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight leading-none mt-1 sm:mt-2 drop-shadow-md">
              STAY
            </h1>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm lg:text-base text-white/90 font-normal leading-relaxed max-w-xl drop-shadow-sm">
              discover handpicked hotels for your next getaway.
              <br />
              from beachfront resorts to city stays, we&apos;ve got you covered.
            </p>
          </div>

          {/* MAIN FILTER CARD */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-gray-100 text-gray-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
              {/* DESTINATION SELECTOR */}
              <div className="lg:col-span-3 flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-bold text-[#1D1248] flex items-center gap-1.5">
                  <FaMapMarkerAlt className="text-[#F7941D]" /> Destination / Region <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={destinationOptions}
                  value={destination}
                  onChange={(val) => {
                    setDestination(val);
                    if (heroErrors.destination) {
                      setHeroErrors((prev) => ({ ...prev, destination: undefined }));
                    }
                  }}
                  openOnKeywordOnly={true}
                  error={heroErrors.destination}
                  required={true}
                  icon={<FaSearch className="text-gray-400 text-xs sm:text-sm" />}
                  trailingIcon={<FaMapMarkerAlt className="text-gray-400 text-xs sm:text-sm" />}
                  placeholder="Search destination or country..."
                  searchPlaceholder="Search destination, country or abbreviation..."
                />
              </div>

              {/* CHECK-IN */}
              <div className="lg:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-bold text-[#1D1248]">
                  Check-in Date <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  value={checkIn}
                  onChange={(val) => {
                    setCheckIn(val);
                    if (heroErrors.checkIn) {
                      setHeroErrors((prev) => ({ ...prev, checkIn: undefined }));
                    }
                    if (val && checkOut && val >= checkOut) {
                      setCheckOut("");
                    }
                  }}
                  placeholder="Select check-in"
                  error={heroErrors.checkIn}
                  required={true}
                />
              </div>

              {/* CHECK-OUT */}
              <div className="lg:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-bold text-[#1D1248]">
                  Check-out Date <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  value={checkOut}
                  onChange={(val) => {
                    setCheckOut(val);
                    if (heroErrors.checkOut) {
                      setHeroErrors((prev) => ({ ...prev, checkOut: undefined }));
                    }
                  }}
                  placeholder="Select check-out"
                  minDate={checkIn || undefined}
                  error={heroErrors.checkOut}
                  required={true}
                />
              </div>

              {/* TRAVELLERS & ROOMS */}
              <div ref={travellersRef} className="lg:col-span-3 flex flex-col gap-1.5 relative">
                <label className="text-xs sm:text-sm font-bold text-[#1D1248] flex items-center gap-1.5">
                  <FaUserFriends className="text-[#F7941D]" /> Travellers &amp; Rooms <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (!showTravellersPopover && travellersRef.current) {
                      const rect = travellersRef.current.getBoundingClientRect();
                      const viewportHeight = window.innerHeight;
                      const spaceBelow = viewportHeight - rect.bottom;
                      const spaceAbove = rect.top - 85;
                      const popoverHeight = 440;
                      if (spaceBelow < popoverHeight && (spaceAbove >= popoverHeight || spaceAbove > spaceBelow)) {
                        setPopoverPlacement("up");
                        setTravellersMaxHeight(Math.max(220, Math.floor(spaceAbove - 12)));
                      } else {
                        setPopoverPlacement("down");
                        setTravellersMaxHeight(Math.max(220, Math.floor(spaceBelow - 12)));
                      }
                    }
                    setShowTravellersPopover(!showTravellersPopover);
                  }}
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
                  <div
                    style={travellersMaxHeight ? { maxHeight: `${travellersMaxHeight}px` } : undefined}
                    className={`absolute right-0 ${
                      popoverPlacement === "down"
                        ? "top-full mt-2 slide-in-from-top-2"
                        : "bottom-full mb-2 slide-in-from-bottom-2"
                    } w-80 sm:w-96 max-w-[calc(100vw-2rem)] rounded-2xl bg-white p-4 sm:p-5 shadow-2xl border border-gray-200 z-50 text-[#1D1248] animate-in fade-in duration-150 max-h-[min(480px,calc(100vh-100px))] overflow-y-auto`}
                  >
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
                          className="text-xs font-bold text-[#F7941D] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <FaPlus className="text-[10px]" /> Add Another Room
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleUpdate}
                        disabled={loading}
                        className="ml-auto rounded-lg bg-[#1D1248] disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-2 text-xs font-bold hover:bg-[#2B1B6D] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                      >
                        {loading && <FaSpinner className="animate-spin text-xs" />}
                        {loading ? "Loading..." : "Search"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* SEARCH ACTION */}
              <div className="lg:col-span-2">
                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={loading}
                  className="w-full h-[46px] rounded-xl bg-[#F7941D] hover:bg-[#e08316] disabled:bg-[#F7941D]/70 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin text-sm" /> Loading...
                    </>
                  ) : (
                    <>
                      <FaSearch /> Search
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SUB-FILTER BAR & RESULTS SECTION */}
      <div
        ref={resultsRef}
        id="hotel-results"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 scroll-mt-24"
      >
        <CallForHiddenPricesBanner variant="inline" />

        {/* MOBILE STICKY FILTER PILLS BAR (Image 1: Reset, Location, Sort By, Filters) */}
        <div className="lg:hidden sticky top-0 sm:top-14 z-30 bg-white/95 backdrop-blur-md -mx-4 px-4 py-2.5 border-b border-gray-200 shadow-2xs mt-4">
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-0.5">
            {/* RESET BUTTON (Pink/Red pill, Image 1) */}
            <button
              type="button"
              onClick={handleClearAll}
              className="shrink-0 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm bg-[#ffdada] text-[#7d121e] border border-rose-200/70 hover:bg-[#ffc5c8] transition-colors cursor-pointer"
            >
              Reset
            </button>

            {/* LOCATION PILL (White pill with light blue border, Image 1) */}
            <button
              type="button"
              onClick={() => {
                setLocationSearchQuery("");
                setMobileSheetOpen("location");
              }}
              className={`shrink-0 px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm border transition-all cursor-pointer ${
                destination && destination !== "all"
                  ? "border-blue-400 bg-blue-50/50 text-[#1D1248] font-bold"
                  : "border-blue-200 bg-white text-gray-900 hover:border-blue-300"
              }`}
            >
              <span>Location</span>
              {destination && destination !== "all" && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block ml-1.5 align-middle" />
              )}
            </button>

            {/* SORT BY PILL (White pill with light blue border, Image 1 - Restored for Mobile) */}
            <button
              type="button"
              onClick={() => setMobileSheetOpen("sort")}
              className={`shrink-0 px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm border transition-all cursor-pointer ${
                sortBy !== "recommended"
                  ? "border-blue-400 bg-blue-50/50 text-[#1D1248] font-bold"
                  : "border-blue-200 bg-white text-gray-900 hover:border-blue-300"
              }`}
            >
              <span>Sort By</span>
              {sortBy !== "recommended" && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block ml-1.5 align-middle" />
              )}
            </button>

            {/* FILTERS PILL (White pill with light blue border, Image 1) */}
            <button
              type="button"
              onClick={openMobileFilters}
              className={`shrink-0 px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm border transition-all flex items-center gap-1.5 cursor-pointer ${
                activeFiltersCount > 0
                  ? "border-[#F7941D] bg-amber-50 text-[#1D1248] font-bold"
                  : "border-blue-200 bg-white text-gray-900 hover:border-blue-300"
              }`}
            >
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#F7941D] text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
          {/* LEFT FILTERS SIDEBAR (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-1 space-y-5">
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
                <SearchableSelect
                  options={destinationOptions}
                  value={destination}
                  onChange={(val) => setDestination(val)}
                  openOnKeywordOnly={true}
                  icon={<FaSearch className="text-gray-400 text-xs" />}
                  trailingIcon={<FaMapMarkerAlt className="text-gray-400 text-xs" />}
                  placeholder="Search destination or country..."
                  searchPlaceholder="Search destination, country or abbreviation..."
                  triggerClassName="bg-white border-gray-200 py-2 rounded-lg text-xs font-medium"
                />
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200/60">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-[#1D1248]">
                  {isOverview ? "Handpicked Featured Hotels" : `Hotels in ${currentDestinationName}`}
                </h2>
                <p className="text-xs text-gray-500 font-medium">
                  {loading ? (
                    <span className="inline-flex items-center gap-1.5 text-amber-600 font-bold">
                      <FaSpinner className="animate-spin text-xs" /> Fetching verified hotel availability...
                    </span>
                  ) : (!checkIn || !checkOut || !hasSearched) ? (
                    <span className="text-gray-500">
                      Select dates above and click Search to check live hotel availability
                    </span>
                  ) : (
                    <>
                      Showing <span className="text-[#F7941D] font-bold">{filteredHotels.length}</span> verified properties
                    </>
                  )}
                </p>
              </div>
              {/* DESKTOP-ONLY RECOMMENDED SORT DROPDOWN (Mobile uses Sort By pill) */}
              <div className="hidden lg:block w-full sm:w-64">
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

            {loading ? (
              <div className="space-y-6">
                {/* PROMINENT ANIMATED LOADING CARD */}
                <div className="bg-white rounded-3xl p-8 sm:p-10 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                  <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-amber-200 border-t-[#F7941D] animate-spin" />
                    <FaHotel className="text-[#1D1248] text-xl animate-pulse" />
                  </div>
                  <h3 className="text-lg font-extrabold text-[#1D1248]">
                    Searching Live Hotel Inventory...
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-md">
                    Checking real-time rates and verified availability for{" "}
                    <span className="font-semibold text-gray-700">
                      {isOverview ? "featured destinations" : currentDestinationName}
                    </span>
                    .
                  </p>
                </div>

                {/* REALISTIC HOTEL CARD SKELETONS */}
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex flex-col md:flex-row overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xs animate-pulse"
                  >
                    <div className="w-full md:w-[38%] h-56 md:h-64 bg-gray-200/80 shrink-0" />
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded-md w-1/4" />
                        <div className="h-6 bg-gray-200 rounded-md w-3/4" />
                        <div className="h-3 bg-gray-200 rounded-md w-1/2" />
                        <div className="h-3 bg-gray-100 rounded-md w-full mt-3" />
                        <div className="h-3 bg-gray-100 rounded-md w-4/5" />
                      </div>
                      <div className="pt-4 border-t border-gray-100 flex items-end justify-between">
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded w-28" />
                          <div className="h-3 bg-gray-100 rounded w-20" />
                        </div>
                        <div className="space-y-2 flex flex-col items-end">
                          <div className="h-6 bg-gray-200 rounded w-24" />
                          <div className="h-8 bg-gray-200 rounded-xl w-32" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (!destination || destination === "all" || !checkIn || !checkOut || !hasSearched) ? (
              <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-[#F7941D] mb-4">
                  <FaMapMarkerAlt className="text-2xl" />
                </div>
                <h3 className="text-xl font-extrabold text-[#1D1248]">
                  Select Destination &amp; Travel Dates to View Hotels
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-md leading-relaxed">
                  Destination, Check-in, and Check-out dates are mandatory to check live availability and confirmed hotel rates. Please enter your destination and dates above, then click <span className="font-bold text-[#F7941D]">Search</span>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-[#F7941D] hover:bg-[#e08316] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <FaSearch className="text-xs" /> Enter Filters &amp; Search
                </button>
              </div>
            ) : filteredHotels.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                <FaHotel className="text-5xl text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-800">No hotels matched your filters</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-md">
                  We couldn&apos;t find any hotels matching your current selection. Please adjust your destination, dates, or filters above and try again.
                </p>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-[#F7941D] text-white text-xs font-bold hover:bg-[#e08316] transition-colors cursor-pointer"
                >
                  Reset Filters &amp; Try Again
                </button>
              </div>
            ) : (
              filteredHotels.map((hotel) => {
                const activeDest = searchTrigger?.destination ?? destination;
                const activeIn = searchTrigger?.checkIn ?? checkIn;
                const activeOut = searchTrigger?.checkOut ?? checkOut;
                const activeRms = searchTrigger?.rooms ?? rooms;
                const detailsUrl = `/hotels/${encodeURIComponent(hotel.hotelCode)}?destination=${encodeURIComponent(activeDest || hotel.city || "")}&checkIn=${activeIn}&checkOut=${activeOut}&adults=${totalAdults}&rooms=${encodeURIComponent(JSON.stringify(activeRms))}${searchId ? `&searchId=${encodeURIComponent(searchId)}` : ""}`;

                const handleNavigateToHotel = (url: string) => {
                  saveSearchState({
                    destination: searchTrigger?.destination || destination,
                    checkIn: searchTrigger?.checkIn || checkIn,
                    checkOut: searchTrigger?.checkOut || checkOut,
                    rooms: searchTrigger?.rooms || rooms,
                    hotelCode: searchTrigger?.hotelCode || initialHotelCode || undefined,
                    hotels,
                    searchId,
                    priceCheckedAt,
                    selectedStars,
                    minPrice,
                    maxPrice,
                    selectedBoards,
                    selectedPropertyTypes,
                    selectedFacilities,
                    selectedHolidayTypes,
                    selectedPopularFilters,
                    sortBy,
                    keyword,
                    hasSearched: true,
                  });
                  updateUrlParams({
                    destination: searchTrigger?.destination || destination,
                    checkIn: searchTrigger?.checkIn || checkIn,
                    checkOut: searchTrigger?.checkOut || checkOut,
                    rooms: searchTrigger?.rooms || rooms,
                    searchId,
                    stars: selectedStars,
                    minPrice,
                    maxPrice,
                    boards: selectedBoards,
                    sort: sortBy,
                  });
                  if (typeof window !== "undefined") {
                    window.open(url, "_blank", "noopener,noreferrer");
                  }
                };

                return (
                  <div
                    key={hotel.hotelCode}
                    onClick={() => handleNavigateToHotel(detailsUrl)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleNavigateToHotel(detailsUrl);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`View details for ${hotel.hotelName}`}
                    className="group flex flex-col md:flex-row overflow-hidden rounded-3xl bg-white border border-gray-100/90 shadow-md hover:shadow-xl hover:border-[#1D1248]/30 transition-all duration-300 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#F7941D]/50"
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
                        <h3 className="text-xl sm:text-2xl font-extrabold text-[#1D1248] group-hover:text-[#F7941D] transition-colors">
                          {hotel.hotelName}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap mt-1">
                          <p className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                            <FaMapMarkerAlt className="text-[#F7941D]" /> {hotel.address}
                          </p>
                          {hotel.geolocation && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-200/80 px-2 py-0.5 text-[10px] font-semibold text-blue-800">
                              <FaMapMarkerAlt className="text-blue-600 text-[9px]" /> Map
                            </span>
                          )}
                        </div>

                        {/* Live Board Basis & Cancellation Badges */}
                        {(hotel.availableRates?.[0]?.boardBasis || hotel.availableRates?.[0]?.cancellationPolicy) && (
                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            {hotel.availableRates?.[0]?.boardBasis && (
                              <span className="rounded-lg bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] font-bold text-[#1D1248] flex items-center gap-1.5">
                                <FaUtensils className="text-[10px] text-amber-700 shrink-0" />
                                <span>{hotel.availableRates[0].boardBasis}</span>
                              </span>
                            )}
                            {hotel.availableRates?.[0]?.cancellationPolicy && (
                              <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5">
                                <FaShieldAlt className="text-[10px] text-emerald-600 shrink-0" />
                                <span>{hotel.availableRates[0].cancellationPolicy}</span>
                              </span>
                            )}
                          </div>
                        )}

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
                            {/* VIEW DETAILS (NEW TAB) */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNavigateToHotel(detailsUrl);
                              }}
                              className="flex items-center gap-1.5 rounded-xl bg-[#1D1248] hover:bg-[#2e1d6d] active:scale-95 px-4 py-2 text-xs font-bold text-white shadow-md transition-all cursor-pointer whitespace-nowrap"
                            >
                              <span>View Hotel</span>
                              <FaExternalLinkAlt className="text-[10px]" />
                            </button>

                            {/* CALL TO BOOK BUTTON */}
                            <a
                              href="tel:03301658879"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="flex items-center gap-1.5 rounded-xl bg-[#F7941D] hover:bg-[#e08316] active:scale-95 px-4 py-2 text-xs font-bold text-white shadow-md transition-all cursor-pointer whitespace-nowrap"
                            >
                              <FaPhoneAlt className="text-[10px]" /> Call to Book
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* MOBILE BOTTOM SHEET (Image 2: Drawer with Property Type, Star Rating, Board Basis, Price Filter, Facilities, Holiday Types, and SUBMIT button) */}
        {mobileSheetOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
              onClick={() => setMobileSheetOpen(null)}
            />

            {/* Bottom Sheet Card */}
            <div
              className={`relative z-10 w-full ${
                mobileSheetOpen === "location" ? "h-[90vh]" : "max-h-[90vh]"
              } bg-white rounded-t-3xl shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-250 overflow-hidden`}
            >
              {/* Drag Handle Bar */}
              <div className="pt-3 pb-1.5 flex justify-center cursor-pointer" onClick={() => setMobileSheetOpen(null)}>
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* SHEET HEADER */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMobileSheetOpen(null)}
                    className="p-1 -ml-1 text-gray-800 hover:text-black rounded-full hover:bg-gray-100 cursor-pointer"
                    aria-label="Back"
                  >
                    <FaArrowLeft className="text-base" />
                  </button>
                  <h3 className="text-base sm:text-lg font-bold text-gray-950 capitalize">
                    {mobileSheetOpen === "filters"
                      ? "Filters"
                      : mobileSheetOpen === "sort"
                      ? "Sort By"
                      : "Location"}
                  </h3>
                </div>
                {mobileSheetOpen === "location" && destination && destination !== "all" && (
                  <button
                    type="button"
                    onClick={() => {
                      setDestination("all");
                      setMobileSheetOpen(null);
                    }}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* SHEET BODY (Scrollable) */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
                {mobileSheetOpen === "filters" && (
                  <>
                    {/* 1. PROPERTY TYPE (Image 2: Property Type with See All and Pills) */}
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <h4 className="text-sm font-semibold text-gray-900">Property Type</h4>
                        <button
                          type="button"
                          onClick={() => setShowAllPropertyTypes(!showAllPropertyTypes)}
                          className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                        >
                          {showAllPropertyTypes ? "Show Less" : "See All"}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(showAllPropertyTypes ? PROPERTY_TYPE_OPTIONS : PROPERTY_TYPE_OPTIONS.slice(0, 3)).map((type) => {
                          const isSelected = draftPropertyTypes.includes(type);
                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => toggleDraftPropertyType(type)}
                              className={`px-4 py-2 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-[#1652A2] text-white border-[#1652A2] shadow-xs"
                                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                              }`}
                            >
                              {type}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="border-b border-gray-200" />

                    {/* 2. POPULAR FILTER (Image 2: Popular Filter with Pills) */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2.5">Popular Filter</h4>
                      <div className="flex flex-wrap gap-2">
                        {POPULAR_FILTER_OPTIONS.map((filter) => {
                          const isSelected = draftPopularFilters.includes(filter);
                          return (
                            <button
                              key={filter}
                              type="button"
                              onClick={() => toggleDraftPopularFilter(filter)}
                              className={`px-4 py-2 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-[#1652A2] text-white border-[#1652A2] shadow-xs"
                                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                              }`}
                            >
                              {filter}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="border-b border-gray-200" />

                    {/* 3. PRICE FILTER (Image 2: Price Filter Dual/Range Slider) */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Price Filter</h4>
                      <p className="text-sm font-bold text-gray-900 mb-3">
                        £ {draftMinPrice} - {draftMaxPrice >= 500 ? "£ 500+" : `£ ${draftMaxPrice}`}
                      </p>
                      <div className="relative pt-2 pb-2 px-1">
                        <div className="relative w-full h-1.5 bg-gray-200 rounded-full">
                          <div
                            className="absolute h-1.5 bg-[#1652A2] rounded-full"
                            style={{
                              left: `${((draftMinPrice - 50) / 450) * 100}%`,
                              right: `${100 - ((draftMaxPrice - 50) / 450) * 100}%`,
                            }}
                          />
                        </div>
                        <input
                          type="range"
                          min={50}
                          max={500}
                          step={10}
                          value={draftMinPrice}
                          onChange={(e) => {
                            const val = Math.min(Number(e.target.value), draftMaxPrice - 10);
                            setDraftMinPrice(val);
                          }}
                          className="absolute inset-x-1 inset-y-0 w-[calc(100%-8px)] opacity-0 cursor-pointer pointer-events-auto"
                          style={{ zIndex: draftMinPrice > 450 ? 5 : 3 }}
                          aria-label="Minimum price per night"
                        />
                        <input
                          type="range"
                          min={50}
                          max={500}
                          step={10}
                          value={draftMaxPrice}
                          onChange={(e) => {
                            const val = Math.max(Number(e.target.value), draftMinPrice + 10);
                            setDraftMaxPrice(val);
                          }}
                          className="absolute inset-x-1 inset-y-0 w-[calc(100%-8px)] opacity-0 cursor-pointer pointer-events-auto"
                          style={{ zIndex: 4 }}
                          aria-label="Maximum price per night"
                        />
                        <div
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-white bg-[#1652A2] pointer-events-none shadow-md"
                          style={{ left: `calc(${((draftMinPrice - 50) / 450) * 100}% + 4px)` }}
                        />
                        <div
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-white bg-[#1652A2] pointer-events-none shadow-md"
                          style={{ left: `calc(${((draftMaxPrice - 50) / 450) * 100}% + 4px)` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs font-semibold text-gray-400 mt-2">
                        <span>£50</span>
                        <span>£500+</span>
                      </div>
                    </div>

                    <div className="border-b border-gray-200" />

                    {/* 4. HOTEL RATING (Draft Chips) */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2.5">Hotel Rating</h4>
                      <div className="flex flex-wrap gap-2">
                        {STAR_OPTIONS.map((stars) => {
                          const isSelected = draftStars.includes(stars);
                          return (
                            <button
                              key={stars}
                              type="button"
                              onClick={() => toggleDraftStar(stars)}
                              className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                                isSelected
                                  ? "bg-[#1652A2] text-white border-[#1652A2] shadow-xs"
                                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                              }`}
                            >
                              <span>{stars}</span>
                              <FaStar className="text-amber-400 text-xs" />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="border-b border-gray-200" />

                    {/* 5. BOARD BASIS (Draft Chips) */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2.5">Board Basis</h4>
                      <div className="flex flex-wrap gap-2">
                        {BOARD_OPTIONS.map((board) => {
                          const isSelected = draftBoards.includes(board);
                          return (
                            <button
                              key={board}
                              type="button"
                              onClick={() => toggleDraftBoard(board)}
                              className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-[#1652A2] text-white border-[#1652A2] shadow-xs"
                                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                              }`}
                            >
                              {board}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                {/* SORT BY SHEET CONTENT (Restored for Mobile) */}
                {mobileSheetOpen === "sort" && (
                  <div className="space-y-2">
                    {SORT_OPTIONS.map((opt) => {
                      const isSelected = sortBy === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setSortBy(opt.value);
                            setMobileSheetOpen(null);
                          }}
                          className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? "border-[#1652A2] bg-blue-50/70 text-[#071a55] font-bold"
                              : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          <div>
                            <div className="font-bold text-sm">{opt.label}</div>
                            {opt.subtitle && <div className="text-xs text-gray-400 mt-0.5">{opt.subtitle}</div>}
                          </div>
                          {isSelected && <FaCheck className="text-[#1652A2] text-sm shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* LOCATION SHEET CONTENT (Height increased to 90vh with search and full scrollable list) */}
                {mobileSheetOpen === "location" && (
                  <div className="space-y-3 pb-8">
                    <div className="relative">
                      <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                      <input
                        type="text"
                        placeholder="Search country or city..."
                        value={locationSearchQuery}
                        onChange={(e) => setLocationSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-[#1652A2] focus:bg-white transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-1.5 mt-2">
                      {filteredLocationOptions.map((opt) => {
                        const isSelected = destination === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setDestination(opt.value);
                              setMobileSheetOpen(null);
                            }}
                            className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                              isSelected
                                ? "border-[#1652A2] bg-blue-50/70 text-[#071a55] font-bold"
                                : "border-gray-100 bg-white hover:bg-gray-50 text-gray-800"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                  isSelected ? "bg-[#1652A2] text-white" : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                <FaMapMarkerAlt className="text-xs" />
                              </div>
                              <div>
                                <div className="font-bold text-sm text-gray-900">{opt.label}</div>
                                {opt.subtitle && (
                                  <div className="text-xs text-gray-500 mt-0.5">{opt.subtitle}</div>
                                )}
                              </div>
                            </div>
                            {isSelected && <FaCheck className="text-[#1652A2] text-sm shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* SHEET FOOTER: PINNED FULL-WIDTH SUBMIT BUTTON (Image 2: Edge-to-edge SUBMIT button) */}
              {mobileSheetOpen === "filters" && (
                <div className="w-full bg-[#1652A2] hover:bg-[#124285] transition-colors shrink-0">
                  <button
                    type="button"
                    onClick={applyMobileFilters}
                    className="w-full py-4 text-white font-black text-sm uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>SUBMIT</span>
                    {draftFilteredHotelsCount > 0 && (
                      <span className="text-xs font-normal opacity-90 normal-case">
                        ({draftFilteredHotelsCount} {draftFilteredHotelsCount === 1 ? "Property" : "Properties"})
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HotelsHomepage() {
  return (
    <>
      {/* Hidden Prices Phone Booking Popup */}
      <CallForHiddenPricesModal />
      <Suspense
        fallback={
          <div className="min-h-screen bg-gray-50 p-12 text-center font-bold text-[#1D1248]">
            Loading Verified Hotels...
          </div>
        }
      >
        <HotelsPageContent />
      </Suspense>
    </>
  );
}

