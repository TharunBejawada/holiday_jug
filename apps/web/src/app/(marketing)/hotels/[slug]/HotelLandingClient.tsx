"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DatePicker } from "@/components/DatePicker";
import { SearchableSelect } from "@/components/SearchableSelect";
import { getActiveSearchDestinations } from "@/lib/destinations-master";
import Link from "next/link";
import {
  FaStar,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaHotel,
  FaCalendarAlt,
  FaMoon,
  FaUserFriends,
  FaPlane,
  FaSuitcase,
  FaCheck,
  FaCopy,
  FaArrowRight,
  FaArrowLeft,
  FaShieldAlt,
  FaTimes,
  FaImages,
  FaUmbrellaBeach,
  FaUtensils,
  FaSwimmingPool,
  FaSpa,
  FaDumbbell,
  FaWifi,
  FaChevronRight,
  FaChevronLeft,
  FaCheckCircle,
  FaInfoCircle,
  FaPlus,
  FaMinus,
  FaSpinner,
  FaBed,
  FaExclamationTriangle,
} from "react-icons/fa";
import { SANDBOX_HOTELS_DATABASE, getKnownHotel } from "@/lib/grn-client";
import { CallForHiddenPricesModal } from "@/components/CallForHiddenPricesModal";

interface HotelData {
  hotelCode: string;
  name: string;
  starRating: number;
  address: string;
  city: string;
  country: string;
  description: string;
  facilities: string[];
  mainImage: string;
  galleryImages: string[];
  baseRateInr: number;
  localTaxGbp: number;
  geolocation?: {
    latitude: number;
    longitude: number;
  } | null;
  reviewScore?: number;
  reviewCount?: number;
  nearbyAttractions?: { name: string; distance: string }[];
}

interface ExtraItem {
  id: string;
  name: string;
  description: string;
  pricePerPerson: number;
  selected: boolean;
}

interface HotelLandingClientProps {
  slug: string;
  initialSearchParams: { [key: string]: string | string[] | undefined };
}

export default function HotelLandingClient({
  slug,
  initialSearchParams,
}: HotelLandingClientProps) {
  const router = useRouter();

  // 1. Resolve Hotel Data
  const hotel: HotelData = useMemo(() => {
    const rawSlug = decodeURIComponent(slug).trim().toLowerCase();

    // Direct code lookup
    if (SANDBOX_HOTELS_DATABASE[rawSlug]) {
      return SANDBOX_HOTELS_DATABASE[rawSlug];
    }

    // Lookup by code or slugified name
    const found = Object.values(SANDBOX_HOTELS_DATABASE).find((h: any) => {
      const codeMatch = h.hotelCode.toLowerCase() === rawSlug;
      const nameSlug = h.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return codeMatch || nameSlug.includes(rawSlug) || rawSlug.includes(nameSlug);
    });

    if (found) {
      return found;
    }

    const known = getKnownHotel(slug);
    if (known) {
      return known;
    }

    // Default to Rixos Downtown Antalya if matching or fallback
    return (
      SANDBOX_HOTELS_DATABASE["rixos-downtown-antalya"] ||
      SANDBOX_HOTELS_DATABASE["TR-ANT-01"] ||
      SANDBOX_HOTELS_DATABASE["1848131"]
    );
  }, [slug]);

  // Query Params & Initialization from Overview Page
  const initialDestinationParam = typeof initialSearchParams.destination === "string" ? initialSearchParams.destination : "";
  const [destination, setDestination] = useState<string>(() => {
    if (initialDestinationParam && initialDestinationParam !== "all") {
      return initialDestinationParam;
    }
    return hotel.city?.toLowerCase() || "antalya";
  });

  const activeDestinations = useMemo(() => {
    return getActiveSearchDestinations();
  }, []);

  const destinationOptions = useMemo(() => {
    const list = [
      {
        value: "all",
        label: "All Destinations (Featured)",
        subtitle: "Top handpicked worldwide hotels",
        searchTerms: ["all", "featured", "worldwide", "top"],
      },
    ];

    activeDestinations.forEach((d) => {
      if ((d as any).published !== false) {
        list.push({
          value: d.slug,
          label: `${d.destination} (${d.country})`,
          subtitle: d.displayGroup || d.country,
          searchTerms: [d.destination, d.country, ...((d as any).aliases || [])],
        });
      }
    });

    return list;
  }, [activeDestinations]);

  const destinationDisplayName = useMemo(() => {
    if (!destination || destination === "all") {
      return `${hotel.city}, ${hotel.country}`;
    }
    const found = destinationOptions.find(
      (d) =>
        d.value.toLowerCase() === destination.toLowerCase() ||
        d.label.toLowerCase().includes(destination.toLowerCase())
    );
    if (found && found.value !== "all") {
      return found.label;
    }
    return `${hotel.city}, ${hotel.country}`;
  }, [destination, destinationOptions, hotel]);

  const checkInParam = typeof initialSearchParams.checkIn === "string" ? initialSearchParams.checkIn : "";
  const checkOutParam = typeof initialSearchParams.checkOut === "string" ? initialSearchParams.checkOut : "";
  const adultsParam = typeof initialSearchParams.adults === "string" ? parseInt(initialSearchParams.adults, 10) : 2;

  // Parse rooms list from overview navigation if present
  const initialRooms: { adults: number; childrenAges: number[] }[] = useMemo(() => {
    if (typeof initialSearchParams.rooms === "string") {
      try {
        const parsed = JSON.parse(initialSearchParams.rooms);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((r: any) => ({
            adults: Math.max(1, Math.min(9, Number(r.adults) || 2)),
            childrenAges: Array.isArray(r.childrenAges) ? r.childrenAges.map(Number) : [],
          }));
        }
      } catch { }
    }
    return [{ adults: adultsParam > 0 ? adultsParam : 2, childrenAges: [] }];
  }, [initialSearchParams.rooms, adultsParam]);

  // Active Date & Room States (Editable directly in Details)
  const [checkIn, setCheckIn] = useState<string>(() => {
    if (checkInParam && !isNaN(new Date(checkInParam).getTime())) {
      return checkInParam;
    }
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  });

  const [checkOut, setCheckOut] = useState<string>(() => {
    if (checkOutParam && !isNaN(new Date(checkOutParam).getTime())) {
      return checkOutParam;
    }
    const base = checkInParam && !isNaN(new Date(checkInParam).getTime()) ? new Date(checkInParam) : new Date();
    if (!checkInParam) base.setDate(base.getDate() + 30);
    base.setDate(base.getDate() + 7);
    return base.toISOString().split("T")[0];
  });

  const [roomsConfig, setRoomsConfig] = useState<{ adults: number; childrenAges: number[] }[]>(initialRooms);

  // Derived date objects and guests count
  const checkInDate = useMemo(() => {
    const d = new Date(checkIn);
    return isNaN(d.getTime()) ? new Date() : d;
  }, [checkIn]);

  const checkOutDate = useMemo(() => {
    const d = new Date(checkOut);
    return isNaN(d.getTime()) ? new Date() : d;
  }, [checkOut]);

  const nights = useMemo(() => {
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 7;
  }, [checkInDate, checkOutDate]);

  const totalAdults = useMemo(() => {
    return roomsConfig.reduce((acc, r) => acc + (Number(r.adults) || 0), 0) || 2;
  }, [roomsConfig]);

  const totalChildren = useMemo(() => {
    return roomsConfig.reduce((acc, r) => acc + (r.childrenAges?.length || 0), 0);
  }, [roomsConfig]);

  const adults = totalAdults;

  const formattedCheckIn = useMemo(() => {
    return checkInDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, [checkInDate]);

  const guestsSummary = useMemo(() => {
    if (totalChildren > 0) {
      return `${totalAdults} Adult${totalAdults > 1 ? "s" : ""}, ${totalChildren} Child${totalChildren > 1 ? "ren" : ""}`;
    }
    return `${totalAdults} Adult${totalAdults > 1 ? "s" : ""}`;
  }, [totalAdults, totalChildren]);

  const roomsSummary = useMemo(() => {
    return `${roomsConfig.length} Room${roomsConfig.length > 1 ? "s" : ""}`;
  }, [roomsConfig]);

  // Live Availability & Search State
  const [liveRates, setLiveRates] = useState<any[] | null>(null);
  const [liveGeolocation, setLiveGeolocation] = useState<{ latitude: number; longitude: number } | null>(
    hotel.geolocation || null
  );
  const [isSearchingAvailability, setIsSearchingAvailability] = useState(false);
  const [searchFeedback, setSearchFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Inline Edit Mode States
  const [isEditing, setIsEditing] = useState(false);
  const [editDestination, setEditDestination] = useState(destination);
  const [editCheckIn, setEditCheckIn] = useState(checkIn);
  const [editCheckOut, setEditCheckOut] = useState(checkOut);
  const [editRooms, setEditRooms] = useState<{ adults: number; childrenAges: number[] }[]>(roomsConfig);

  const handleToggleEdit = () => {
    if (!isEditing) {
      setEditDestination(destination);
      setEditCheckIn(checkIn);
      setEditCheckOut(checkOut);
      setEditRooms(JSON.parse(JSON.stringify(roomsConfig)));
      setSearchFeedback(null);
    }
    setIsEditing(!isEditing);
  };

  const addEditRoom = () => {
    if (editRooms.length < 9) {
      setEditRooms((prev) => [...prev, { adults: 2, childrenAges: [] }]);
    }
  };

  const removeEditRoom = (idx: number) => {
    if (editRooms.length > 1) {
      setEditRooms((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const updateEditAdults = (roomIdx: number, delta: number) => {
    setEditRooms((prev) =>
      prev.map((r, i) => {
        if (i !== roomIdx) return r;
        const newCount = Math.max(1, Math.min(9, r.adults + delta));
        return { ...r, adults: newCount };
      })
    );
  };

  const addEditChild = (roomIdx: number) => {
    setEditRooms((prev) =>
      prev.map((r, i) => {
        if (i !== roomIdx) return r;
        if (r.childrenAges.length >= 4) return r;
        return { ...r, childrenAges: [...r.childrenAges, 5] };
      })
    );
  };

  const removeEditChild = (roomIdx: number, childIdx: number) => {
    setEditRooms((prev) =>
      prev.map((r, i) => {
        if (i !== roomIdx) return r;
        return {
          ...r,
          childrenAges: r.childrenAges.filter((_, cI) => cI !== childIdx),
        };
      })
    );
  };

  const updateEditChildAge = (roomIdx: number, childIdx: number, age: number) => {
    setEditRooms((prev) =>
      prev.map((r, i) => {
        if (i !== roomIdx) return r;
        const updated = [...r.childrenAges];
        updated[childIdx] = age;
        return { ...r, childrenAges: updated };
      })
    );
  };

  const handleSearchAvailability = async () => {
    if (!editCheckIn || !editCheckOut) {
      setSearchFeedback({ type: "error", message: "Please select both check-in and check-out dates." });
      return;
    }
    if (new Date(editCheckOut).getTime() <= new Date(editCheckIn).getTime()) {
      setSearchFeedback({ type: "error", message: "Check-out date must be after check-in date." });
      return;
    }

    const editTotalAdults = editRooms.reduce((acc, r) => acc + (Number(r.adults) || 0), 0) || 2;

    // Check if the user selected a different destination
    const hotelCitySlug = hotel.city.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const isDifferentDestination =
      editDestination !== "all" &&
      editDestination !== "" &&
      !editDestination.toLowerCase().includes(hotelCitySlug) &&
      !hotelCitySlug.includes(editDestination.toLowerCase()) &&
      editDestination.toLowerCase() !== destination.toLowerCase();

    if (isDifferentDestination) {
      // Navigate to the hotels overview page with this new destination and parameters
      const params = new URLSearchParams();
      params.set("destination", editDestination);
      params.set("checkIn", editCheckIn);
      params.set("checkOut", editCheckOut);
      params.set("adults", String(editTotalAdults));
      params.set("rooms", JSON.stringify(editRooms));
      router.push(`/hotels?${params.toString()}`);
      return;
    }

    setIsSearchingAvailability(true);
    setSearchFeedback(null);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "hotels",
          destination: editDestination || hotel.city,
          hotelCode: hotel.hotelCode,
          checkIn: editCheckIn,
          checkOut: editCheckOut,
          adults: editTotalAdults,
          rooms: editRooms,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.hotels) && data.hotels.length > 0) {
        const found = data.hotels.find((h: any) => h.hotelCode === hotel.hotelCode) || data.hotels[0];
        if (found && Array.isArray(found.availableRates) && found.availableRates.length > 0) {
          setLiveRates(found.availableRates);
        }
        if (found && found.geolocation) {
          setLiveGeolocation(found.geolocation);
        }
        if (data.searchId) {
          setSearchId(data.searchId);
        }

        setDestination(editDestination);
        setCheckIn(editCheckIn);
        setCheckOut(editCheckOut);
        setRoomsConfig(editRooms);
        setSelectedRoomIndex(0);
        setIsEditing(false);
        setSearchFeedback({
          type: "success",
          message: `Live rates and availability updated successfully for ${editCheckIn} to ${editCheckOut}!`,
        });
      } else {
        setSearchFeedback({
          type: "error",
          message: data.message || "No live rates returned for selected dates. Please call 0330 165 8879 for phone exclusive rates.",
        });
      }
    } catch (err: any) {
      console.error("Availability search error:", err);
      setSearchFeedback({
        type: "error",
        message: "Failed to connect to the availability service. Please try again or call us.",
      });
    } finally {
      setIsSearchingAvailability(false);
    }
  };

  // Background fetch live rates for current checkIn / checkOut dates
  useEffect(() => {
    const activeCheckIn = checkInParam || checkIn;
    const activeCheckOut = checkOutParam || checkOut;
    if (activeCheckIn && activeCheckOut && hotel.hotelCode) {
      fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "hotels",
          destination: hotel.city,
          hotelCode: hotel.hotelCode,
          checkIn: activeCheckIn,
          checkOut: activeCheckOut,
          adults: totalAdults,
          rooms: roomsConfig,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success && Array.isArray(data.hotels) && data.hotels.length > 0) {
            const found =
              data.hotels.find((h: any) => h.hotelCode === hotel.hotelCode) ||
              data.hotels[0];
            if (found && Array.isArray(found.availableRates) && found.availableRates.length > 0) {
              setLiveRates(found.availableRates);
            }
            if (found && found.geolocation) {
              setLiveGeolocation(found.geolocation);
            }
            if (data.searchId) {
              setSearchId(data.searchId);
            }
          }
        })
        .catch(() => { });
    }
  }, [hotel.hotelCode, checkInParam, checkOutParam, checkIn, checkOut, totalAdults, roomsConfig]);

  // Interactive States
  const [selectedAirport, setSelectedAirport] = useState<string>("LGW");
  const [selectedRoomIndex, setSelectedRoomIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [galleryModalOpen, setGalleryModalOpen] = useState<boolean>(false);
  const [extrasModalOpen, setExtrasModalOpen] = useState<boolean>(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [bookingSuccessModal, setBookingSuccessModal] = useState<boolean>(false);

  // Search ID quote state for phone bookings
  const searchIdParam = typeof initialSearchParams.searchId === "string" ? initialSearchParams.searchId : "";
  const [searchId, setSearchId] = useState<string>(() => {
    if (searchIdParam) return searchIdParam;
    const cleanCode = (slug || "HOTEL").replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 4);
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `HJ-${cleanCode}-${rand}`;
  });
  const [copied, setCopied] = useState(false);

  const copySearchId = () => {
    if (!searchId) return;
    navigator.clipboard.writeText(searchId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Back URLs preserving active search filters
  const backToHotelsUrl = useMemo(() => {
    const p = new URLSearchParams();
    if (destination && destination !== "all") p.set("destination", destination);
    if (checkIn) p.set("checkIn", checkIn);
    if (checkOut) p.set("checkOut", checkOut);
    if (totalAdults) p.set("adults", String(totalAdults));
    if (roomsConfig && roomsConfig.length > 0) p.set("rooms", JSON.stringify(roomsConfig));
    if (searchId) p.set("searchId", searchId);
    const q = p.toString();
    return q ? `/hotels?${q}` : "/hotels";
  }, [destination, checkIn, checkOut, totalAdults, roomsConfig, searchId]);

  const backToCityUrl = useMemo(() => {
    const p = new URLSearchParams();
    p.set("destination", hotel.city.toLowerCase());
    if (checkIn) p.set("checkIn", checkIn);
    if (checkOut) p.set("checkOut", checkOut);
    if (totalAdults) p.set("adults", String(totalAdults));
    if (roomsConfig && roomsConfig.length > 0) p.set("rooms", JSON.stringify(roomsConfig));
    if (searchId) p.set("searchId", searchId);
    return `/hotels?${p.toString()}`;
  }, [hotel.city, checkIn, checkOut, totalAdults, roomsConfig, searchId]);

  // Extras state
  const [extras, setExtras] = useState<ExtraItem[]>([
    {
      id: "luggage-20kg",
      name: "20kg Checked Bag",
      description: "Standard checked suitcase per traveller",
      pricePerPerson: 35,
      selected: false,
    },
    {
      id: "luggage-25kg",
      name: "25kg Heavy Allowance Bag",
      description: "Extra luggage capacity for long holidays",
      pricePerPerson: 48,
      selected: false,
    },
    {
      id: "transfer-return",
      name: "Return Airport Shuttle Transfer",
      description: "Direct comfortable return transfer to resort",
      pricePerPerson: 22,
      selected: false,
    },
    {
      id: "travel-insurance",
      name: "Comprehensive Gold Travel Insurance",
      description: "Full medical, cancellation, and baggage protection",
      pricePerPerson: 28,
      selected: false,
    },
  ]);

  const toggleExtra = (id: string) => {
    setExtras((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  // Rooms Data (Incorporates Live Search Rates when available)
  const rooms = useMemo(() => {
    if (liveRates && liveRates.length > 0) {
      return liveRates.map((rate, idx) => ({
        id: rate.rateKey || `live-rate-${idx}`,
        name: rate.roomType || "Standard Room",
        capacity: `Up to ${adults} guests`,
        pricePp: Math.round(rate.customerPricing?.pricePerPerson || 599),
        totalPrice: Math.round(rate.customerPricing?.totalPrice || 599 * adults),
        boardBasis: rate.boardBasis || "All Inclusive",
        boardingDetails: rate.boardingDetails || [rate.boardBasis || "All Inclusive"],
        otherInclusions: rate.otherInclusions || ["Free High-speed Wi-Fi", "Air Conditioning"],
        cancellationPolicy: rate.cancellationPolicy || "Free cancellation available",
        cancelByDate: rate.cancelByDate,
        isNonRefundable: rate.isNonRefundable ?? false,
        rateComments: rate.rateComments,
        features: [
          rate.cancellationPolicy || "Free cancellation available",
          rate.isNonRefundable ? "Non-refundable" : "Flexible booking",
          ...(rate.otherInclusions && rate.otherInclusions.length > 0
            ? rate.otherInclusions.slice(0, 2)
            : ["Free High-speed Wi-Fi", "Air Conditioning"]),
        ],
        image: hotel.galleryImages[idx % hotel.galleryImages.length] || hotel.mainImage,
      }));
    }

    const basePp = 549;
    return [
      {
        id: "room-deluxe-ro",
        name: "Deluxe King Room",
        capacity: "Up to 2 guests • King bed",
        pricePp: basePp,
        totalPrice: basePp * adults,
        boardBasis: "Room Only",
        boardingDetails: ["Room Only"],
        otherInclusions: ["Free High-speed Wi-Fi", "Walk-in Rain Shower", "Air Conditioning"],
        cancellationPolicy: "Free cancellation up to 48 hours prior to check-in.",
        cancelByDate: null,
        isNonRefundable: false,
        rateComments: null,
        features: ["King size bed", "Free High-speed Wi-Fi", "Walk-in rain shower", "Complimentary mineral water"],
        image: hotel.galleryImages[0] || hotel.mainImage,
      },
      {
        id: "room-deluxe-bb",
        name: "Deluxe Garden View Room",
        capacity: "Up to 2 guests • Double bed",
        pricePp: basePp + 50,
        totalPrice: (basePp + 50) * adults,
        boardBasis: "Bed & Breakfast",
        boardingDetails: ["Bed & Breakfast"],
        otherInclusions: ["Breakfast Buffet", "Balcony with Garden View", "Free High-speed Wi-Fi"],
        cancellationPolicy: "Free cancellation up to 48 hours prior to check-in.",
        cancelByDate: null,
        isNonRefundable: false,
        rateComments: null,
        features: ["Balcony with garden view", "Breakfast included", "Free High-speed Wi-Fi", "Complimentary minibar"],
        image: hotel.galleryImages[1] || hotel.mainImage,
      },
      {
        id: "room-superior-hb",
        name: "Superior Sea View Room",
        capacity: "Up to 2 guests • King bed",
        pricePp: basePp + 110,
        totalPrice: (basePp + 110) * adults,
        boardBasis: "Half Board",
        boardingDetails: ["Half Board (Breakfast & Dinner)"],
        otherInclusions: ["Breakfast & Dinner", "Panoramic Sea View", "Espresso Coffee Machine"],
        cancellationPolicy: "Free cancellation up to 72 hours prior to check-in.",
        cancelByDate: null,
        isNonRefundable: false,
        rateComments: null,
        features: ["Panoramic sea view", "Breakfast & dinner included", "Espresso coffee machine", "Late checkout (subject to availability)"],
        image: hotel.galleryImages[2] || hotel.mainImage,
      },
      {
        id: "room-premium-ai",
        name: "Premium Oceanfront Balcony Room",
        capacity: "Up to 2 guests • King bed",
        pricePp: basePp + 180,
        totalPrice: (basePp + 180) * adults,
        boardBasis: "All Inclusive",
        boardingDetails: ["All Inclusive"],
        otherInclusions: ["All Meals & Unlimited Drinks", "Oceanfront Balcony", "Beach Towel Service"],
        cancellationPolicy: "Free cancellation up to 72 hours prior to check-in.",
        cancelByDate: null,
        isNonRefundable: false,
        rateComments: null,
        features: ["Direct oceanfront balcony", "All meals & drinks included", "Bathrobes & luxury slippers", "Complimentary mini-bar refilled daily"],
        image: hotel.galleryImages[3] || hotel.mainImage,
      },
      {
        id: "room-junior-suite",
        name: "Executive Junior Suite",
        capacity: "Up to 3 guests • Sea View Balcony",
        pricePp: basePp + 290,
        totalPrice: (basePp + 290) * adults,
        boardBasis: "All Inclusive",
        boardingDetails: ["All Inclusive Plus"],
        otherInclusions: ["All Meals & Selected Premium Spirits", "Direct Mediterranean View", "Jacuzzi Bath"],
        cancellationPolicy: "Free cancellation up to 48 hours prior to check-in.",
        cancelByDate: null,
        isNonRefundable: false,
        rateComments: null,
        features: ["Direct Mediterranean panoramic view", "Separate lounge seating area", "Jacuzzi bath & luxury toiletries", "VIP airport arrival greeting"],
        image: hotel.galleryImages[4] || hotel.mainImage,
      },
      {
        id: "room-family-suite",
        name: "Family Connecting Suite (2 Bedrooms)",
        capacity: "Up to 4 guests • 2 King beds",
        pricePp: basePp + 380,
        totalPrice: (basePp + 380) * adults,
        boardBasis: "All Inclusive",
        boardingDetails: ["All Inclusive Family"],
        otherInclusions: ["2 Connecting Bedrooms", "Kids Club Access Included", "All Meals & Snacks"],
        cancellationPolicy: "Free cancellation up to 7 days prior to check-in.",
        cancelByDate: null,
        isNonRefundable: false,
        rateComments: null,
        features: ["2 separate interconnecting bedrooms", "2 private en-suite bathrooms", "Kids welcome gifts & amenities", "All meals, ice cream & drinks included"],
        image: hotel.galleryImages[5] || hotel.mainImage,
      },
      {
        id: "room-panoramic-suite",
        name: "Signature Panoramic Terrace Suite",
        capacity: "Up to 3 guests • Private Rooftop Terrace",
        pricePp: basePp + 520,
        totalPrice: (basePp + 520) * adults,
        boardBasis: "All Inclusive",
        boardingDetails: ["Ultra All Inclusive"],
        otherInclusions: ["Private Rooftop Terrace & Daybeds", "Butler Service", "A La Carte Dining"],
        cancellationPolicy: "Non-refundable promotional rate",
        cancelByDate: null,
        isNonRefundable: true,
        rateComments: null,
        features: ["Private 40m² rooftop sun terrace", "Dedicated concierge service", "Priority reservations for all a la carte restaurants", "Complimentary airport limousine transfer"],
        image: hotel.galleryImages[1] || hotel.mainImage,
      },
      {
        id: "room-presidential-villa",
        name: "Royal Presidential Villa with Private Pool",
        capacity: "Up to 6 guests • 3 Bedrooms & Private Pool",
        pricePp: basePp + 890,
        totalPrice: (basePp + 890) * adults,
        boardBasis: "Ultra All Inclusive",
        boardingDetails: ["Ultra All Inclusive VIP"],
        otherInclusions: ["Private Infinity Pool & Cabana", "Private Chef on Request", "24hr Butler Service"],
        cancellationPolicy: "Free cancellation up to 14 days prior to check-in.",
        cancelByDate: null,
        isNonRefundable: false,
        rateComments: null,
        features: ["Private heated infinity swimming pool", "3 master bedrooms with direct pool access", "Private beach pavilion cabana", "Personal chef & private bar service"],
        image: hotel.galleryImages[2] || hotel.mainImage,
      },
    ];
  }, [hotel, liveRates, adults]);

  // Pricing calculations
  const selectedRoom = rooms[selectedRoomIndex] || rooms[0];
  const extrasCostPerPerson = extras
    .filter((e) => e.selected)
    .reduce((sum, e) => sum + e.pricePerPerson, 0);

  const pricePerPerson = selectedRoom.pricePp + extrasCostPerPerson;
  const totalPrice = pricePerPerson * adults;

  // Facilities list
  const facilitiesList = useMemo(() => {
    if (hotel.facilities && hotel.facilities.length > 0) {
      return hotel.facilities;
    }
    return [
      "Outdoor swimming pool",
      "24-hour front desk",
      "Room service",
      "Private beach",
      "Kids club",
      "Luxury sun terrace",
      "Spa & wellness centre",
      "Wi-Fi (free)",
      "Sea views",
      "Concierge service",
      "Air conditioning",
      "Fitness centre",
    ];
  }, [hotel.facilities]);

  // Nearby attractions
  const nearbyAttractions = useMemo(() => {
    if (hotel.nearbyAttractions && hotel.nearbyAttractions.length > 0) {
      return hotel.nearbyAttractions;
    }
    return [
      { name: "Antalya Old Town (Kaleici)", distance: "3.5 km" },
      { name: "Konyaalti Beach", distance: "0.1 km" },
      { name: "Lara Beach", distance: "15 km" },
      { name: "Düden Waterfalls", distance: "12 km" },
      { name: "Perge Ancient City", distance: "18 km" },
    ];
  }, [hotel]);

  // Gallery images array
  const allImages = useMemo(() => {
    const list = [hotel.mainImage, ...(hotel.galleryImages || [])];
    return Array.from(new Set(list.filter(Boolean)));
  }, [hotel]);

  // 4 thumbnails to display in the strip
  const displayThumbnails = useMemo(() => allImages.slice(0, 4), [allImages]);
  // Remaining images count for the 5th block
  const remainingCount = Math.max(0, allImages.length - 4);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (diff > 40) {
      handlePrevImage();
    } else if (diff < -40) {
      handleNextImage();
    }
    setTouchStartX(null);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  // Scroll to section
  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pb-20">
      {/* 1. Delayed Hidden Prices Phone Modal (2.5s popup) */}
      <CallForHiddenPricesModal key={hotel.hotelCode} />

      {/* 2. HERO PANORAMA SECTION */}
      <div className="relative min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] text-white bg-[#071746]">
        {/* Full Hero Background Image - Static Banner */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/HOTEL LANDING PAGE/Hotel Landing Banner.jpg"
            alt="Hotel Landing Banner"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle gradient: Soft darkening on top/left so white text is crisp, natural image elsewhere */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#041d3d]/70 via-[#041d3d]/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/20" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-20 sm:pb-22 lg:pb-20">
          {/* Top-Left: Breadcrumb directly inside hero with Back button */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-white/90 font-medium mb-2.5 drop-shadow-sm flex-wrap">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined" && window.history.length > 1) {
                  router.back();
                } else {
                  router.push(backToHotelsUrl);
                }
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs font-semibold backdrop-blur-xs transition-all cursor-pointer mr-1"
              title="Return to hotels search results"
            >
              <FaArrowLeft className="text-[10px]" />
              <span>Back</span>
            </button>
            <Link href={backToHotelsUrl} className="hover:text-amber-300 transition-colors">
              Hotels
            </Link>
            <span className="text-white/60 text-xs">&gt;</span>
            <Link
              href={backToCityUrl}
              className="hover:text-amber-300 transition-colors"
            >
              {hotel.city}
            </Link>
            <span className="text-white/60 text-xs">&gt;</span>
            <span className="text-white font-semibold">{hotel.name}</span>
          </div>

          {/* Hotel Name */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight drop-shadow-md max-w-3xl">
            {hotel.name}
          </h1>

          {/* Star Rating & Reviews with number always beside stars */}
          {hotel.starRating > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400 text-sm drop-shadow-xs">
                  {Array.from({ length: Math.min(5, Math.max(1, Math.round(hotel.starRating))) }).map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-white drop-shadow-sm">
                  {hotel.reviewScore ? hotel.reviewScore : hotel.starRating.toFixed(1)}
                </span>
              </div>
              {Boolean(hotel.reviewCount && hotel.reviewCount > 0) && (
                <span className="text-xs sm:text-sm font-normal text-white/85 drop-shadow-sm">
                  ({hotel.reviewCount?.toLocaleString()} reviews)
                </span>
              )}
            </div>
          )}

          {/* Location Pin */}
          <p className="flex items-center gap-1.5 text-xs sm:text-sm text-white/95 mt-2 font-medium drop-shadow-sm">
            <FaMapMarkerAlt className="text-white text-xs shrink-0" />
            <span>{hotel.address || `${hotel.city}, ${hotel.country}`}</span>
          </p>
        </div>

        {/* OVERLAPPING GALLERY THUMBNAIL CARD: Exactly 50% inside hero and 50% outside hero */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="translate-y-1/2 w-full max-w-md sm:max-w-none sm:w-auto inline-flex p-1.5 sm:p-2 bg-white rounded-xl shadow-xl border border-gray-100 max-w-full pointer-events-auto overflow-hidden">
              {allImages.length <= 1 ? (
                /* 1 IMAGE ONLY */
                <div className="flex items-center gap-2 sm:gap-2.5 w-full">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveImageIndex(0);
                      setGalleryModalOpen(true);
                    }}
                    className="relative w-full sm:w-48 h-20 sm:h-24 md:h-28 rounded-lg overflow-hidden group cursor-pointer focus:outline-none"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={allImages[0]}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-2 right-2 rounded-md bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[10px] text-white font-medium flex items-center gap-1">
                      <FaImages className="text-[9px]" /> 1 Photo
                    </span>
                  </button>
                </div>
              ) : allImages.length === 2 ? (
                /* 2 IMAGES: SIDE-BY-SIDE WITHOUT DUPLICATES */
                <div className="flex items-center gap-2 sm:gap-2.5 w-full">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setActiveImageIndex(idx);
                        setGalleryModalOpen(true);
                      }}
                      className="relative flex-1 min-w-0 sm:flex-none sm:w-36 md:w-44 lg:w-48 h-20 sm:h-24 md:h-28 rounded-lg overflow-hidden group cursor-pointer focus:outline-none"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`${hotel.name} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                      {idx === 1 && (
                        <span className="absolute bottom-2 right-2 rounded-md bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[10px] text-white font-medium flex items-center gap-1">
                          <FaImages className="text-[9px]" /> 2 Photos
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                /* 3+ IMAGES: RESPONSIVE STRIP (3 items on mobile, 5 on desktop) */
                <div className="flex items-center gap-2 sm:gap-2.5 w-full">
                  {/* Thumbnail 1 (Always Visible) */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveImageIndex(0);
                      setGalleryModalOpen(true);
                    }}
                    className="relative flex-1 min-w-0 sm:flex-none sm:w-28 md:w-36 lg:w-40 h-20 sm:h-22 md:h-26 lg:h-28 rounded-lg overflow-hidden group cursor-pointer focus:outline-none"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={allImages[0]}
                      alt={`${hotel.name} thumbnail 1`}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  </button>

                  {/* Thumbnail 2 (Always Visible) */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveImageIndex(1);
                      setGalleryModalOpen(true);
                    }}
                    className="relative flex-1 min-w-0 sm:flex-none sm:w-28 md:w-36 lg:w-40 h-20 sm:h-22 md:h-26 lg:h-28 rounded-lg overflow-hidden group cursor-pointer focus:outline-none"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={allImages[1]}
                      alt={`${hotel.name} thumbnail 2`}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  </button>

                  {/* Thumbnail 3 (Hidden on mobile, Visible on sm+ desktop) */}
                  {allImages[2] && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveImageIndex(2);
                        setGalleryModalOpen(true);
                      }}
                      className="relative hidden sm:block sm:w-28 md:w-36 lg:w-40 h-20 sm:h-22 md:h-26 lg:h-28 rounded-lg overflow-hidden group cursor-pointer shrink-0 focus:outline-none"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={allImages[2]}
                        alt={`${hotel.name} thumbnail 3`}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                    </button>
                  )}

                  {/* Thumbnail 4 (Hidden on mobile, Visible on sm+ desktop if >= 4 images) */}
                  {allImages[3] && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveImageIndex(3);
                        setGalleryModalOpen(true);
                      }}
                      className="relative hidden sm:block sm:w-28 md:w-36 lg:w-40 h-20 sm:h-22 md:h-26 lg:h-28 rounded-lg overflow-hidden group cursor-pointer shrink-0 focus:outline-none"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={allImages[3]}
                        alt={`${hotel.name} thumbnail 4`}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                    </button>
                  )}

                  {/* "More Photos" Tile: 3rd tile on mobile, 5th tile on desktop */}
                  <button
                    type="button"
                    onClick={() => {
                      // Open modal at 3rd photo on mobile, or 5th on desktop
                      const targetIdx = allImages.length > 4 ? 4 : allImages.length > 2 ? 2 : 0;
                      setActiveImageIndex(targetIdx);
                      setGalleryModalOpen(true);
                    }}
                    className="relative flex-1 min-w-0 sm:flex-none sm:w-28 md:w-36 lg:w-40 h-20 sm:h-22 md:h-26 lg:h-28 rounded-lg overflow-hidden group cursor-pointer focus:outline-none"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={allImages[4] || allImages[2] || allImages[0]}
                      alt="More photos"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                    />
                    {/* Translucent Blue Overlay with "More Photos" text matching reference image */}
                    <div className="absolute inset-0 bg-[#2573a7]/85 group-hover:bg-[#1f6390]/90 transition-colors flex flex-col items-center justify-center text-center p-1 text-white">
                      <span className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight drop-shadow-sm">
                        More
                      </span>
                      <span className="text-xs sm:text-sm font-semibold tracking-wide mt-0.5 drop-shadow-sm">
                        Photos
                      </span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ACTION & QUOTE ROW (On White Background Below 50% Overlapping Gallery Strip) */}
      <div className="bg-white pt-16 sm:pt-20 lg:pt-24 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {/* CALL TO BOOK BUTTON */}
            <a
              href="tel:03301658879"
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#0b1b4f] hover:bg-[#12286e] text-white font-semibold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <FaPhoneAlt className="text-xs text-amber-300" /> Call Us : 0330 165 8879
            </a>

            {/* QUOTE SEARCH ID CARD (Replaces Book Now button so user can quote when calling) */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-amber-50/90 border border-amber-200/90 shadow-2xs">
              <div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-amber-800 uppercase tracking-wider block leading-tight">
                  Quote for Phone Deals
                </span>
                <span className="font-mono text-sm sm:text-base font-bold text-[#1D1248] tracking-wider block">
                  {searchId}
                </span>
              </div>

              <button
                type="button"
                onClick={copySearchId}
                className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-[#1D1248] text-xs font-semibold transition-all cursor-pointer"
                title="Copy Quote ID"
              >
                {copied ? <FaCheck className="text-emerald-600 text-xs" /> : <FaCopy className="text-gray-600 text-xs" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. KEY FEATURE / AMENITIES BAR */}
      <div className="bg-white pb-6 pt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#f1f9ff] rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 border border-[#d8ebfa]">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
              {[
                { name: 'Beachfront', icon: '/assets/HOTEL LANDING PAGE/Beachfront.png' },
                { name: 'All Inclusive', icon: '/assets/HOTEL LANDING PAGE/All Inclusive.png' },
                { name: 'Swimming Pool', icon: '/assets/HOTEL LANDING PAGE/Swimming Pool.png' },
                { name: 'Spa', icon: '/assets/HOTEL LANDING PAGE/Spa.png' },
                { name: 'Fitness Centre', icon: '/assets/HOTEL LANDING PAGE/Fitness Center.png' },
                { name: 'Free Wi-Fi', icon: '/assets/HOTEL LANDING PAGE/Free Wifi.png' },
              ].map((item) => (
                <div
                  key={item.name}
                  className="bg-white rounded-xl sm:rounded-2xl py-2.5 px-3 sm:py-3 sm:px-4 flex items-center justify-center gap-2.5 shadow-xs border border-white"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.icon}
                    alt={item.name}
                    className="w-5 h-5 sm:w-6 sm:h-6 object-contain shrink-0"
                  />
                  <span className="font-medium text-xs sm:text-sm text-[#0e2059] whitespace-nowrap">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. HOLIDAY DETAILS FILTER & BOOKING CARD (SIDE BY SIDE) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT: YOUR HOLIDAY DETAILS CARD */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
            {/* CARD A: YOUR HOLIDAY DETAILS */}
            <div className="bg-[#f1f9ff] rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-[#d8ebfa]">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg sm:text-xl font-semibold text-[#0e2059]">
                  Your holiday details
                </h2>
                <button
                  type="button"
                  onClick={handleToggleEdit}
                  className="text-xs sm:text-sm font-medium text-[#0e2059] hover:underline cursor-pointer"
                >
                  {isEditing ? "Close" : "Edit details"}
                </button>
              </div>

              {/* 3 Summary Info Boxes matching design */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-4.5 border border-white shadow-xs flex items-center gap-3.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/HOTEL LANDING PAGE/Calendar.png"
                    alt="Check-in"
                    className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0"
                  />
                  <div>
                    <span className="font-semibold text-sm sm:text-base text-[#0e2059] block leading-tight">
                      {formattedCheckIn}
                    </span>
                    <span className="text-xs text-slate-400 font-medium block mt-0.5">
                      Check-in
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-4.5 border border-white shadow-xs flex items-center gap-3.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/HOTEL LANDING PAGE/Nights.png"
                    alt="Duration"
                    className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0"
                  />
                  <div>
                    <span className="font-semibold text-sm sm:text-base text-[#0e2059] block leading-tight">
                      {nights} {nights === 1 ? "night" : "nights"}
                    </span>
                    <span className="text-xs text-slate-400 font-medium block mt-0.5">
                      Duration
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-4.5 border border-white shadow-xs flex items-center gap-3.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/HOTEL LANDING PAGE/2 Adults.png"
                    alt="Travellers"
                    className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0"
                  />
                  <div>
                    <span className="font-semibold text-sm sm:text-base text-[#0e2059] block leading-tight">
                      {guestsSummary}
                    </span>
                    <span className="text-xs text-slate-400 font-medium block mt-0.5">
                      {roomsSummary}
                    </span>
                  </div>
                </div>
              </div>

              {/* SEARCH FEEDBACK NOTIFICATION */}
              {searchFeedback && (
                <div
                  className={`mb-6 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold ${searchFeedback.type === "success"
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                    : "bg-red-50 border border-red-200 text-red-800"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    {searchFeedback.type === "success" ? (
                      <FaCheckCircle className="text-emerald-600 text-base shrink-0" />
                    ) : (
                      <FaInfoCircle className="text-red-600 text-base shrink-0" />
                    )}
                    <span>{searchFeedback.message}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSearchFeedback(null)}
                    className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </div>
              )}

              {/* INLINE EDIT DETAILS FORM */}
              {isEditing && (
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#cbe3f7] shadow-sm mb-6 space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base text-[#0e2059]">
                        Edit Dates &amp; Travellers
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Update your holiday parameters to check real-time availability and live pricing
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <FaTimes className="text-sm" />
                    </button>
                  </div>

                  {/* Destination Field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[#0e2059] flex items-center gap-1.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/assets/HOTEL LANDING PAGE/Location Pin.png"
                        alt="Destination"
                        className="w-4 h-4 object-contain"
                      />
                      Destination / Region
                    </label>
                    <SearchableSelect
                      options={destinationOptions}
                      value={editDestination}
                      onChange={(val) => setEditDestination(val)}
                      placeholder="Select destination..."
                      searchPlaceholder="Search country or city..."
                      triggerClassName="bg-slate-50 border-slate-200 py-2.5 text-xs sm:text-sm font-semibold text-slate-800"
                    />
                  </div>

                  {/* Dates Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-[#0e2059] flex items-center gap-1.5">
                        <FaCalendarAlt className="text-blue-500" /> Check-in Date
                      </label>
                      <DatePicker
                        value={editCheckIn}
                        onChange={(d) => {
                          setEditCheckIn(d);
                          if (editCheckOut && new Date(editCheckOut).getTime() <= new Date(d).getTime()) {
                            const next = new Date(d);
                            next.setDate(next.getDate() + 7);
                            setEditCheckOut(next.toISOString().split("T")[0]);
                          }
                        }}
                        placeholder="Select check-in"
                        minDate={new Date().toISOString().split("T")[0]}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-[#0e2059] flex items-center gap-1.5">
                        <FaMoon className="text-amber-500" /> Check-out Date
                      </label>
                      <DatePicker
                        value={editCheckOut}
                        onChange={(d) => setEditCheckOut(d)}
                        placeholder="Select check-out"
                        minDate={editCheckIn || new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>

                  {/* Rooms & Travellers Config */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#0e2059]">
                        Travellers &amp; Rooms ({editRooms.length} {editRooms.length === 1 ? "Room" : "Rooms"})
                      </span>
                      {editRooms.length < 9 && (
                        <button
                          type="button"
                          onClick={addEditRoom}
                          className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <FaPlus className="text-[10px]" /> Add Room
                        </button>
                      )}
                    </div>

                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                      {editRooms.map((room, rIdx) => (
                        <div key={rIdx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs uppercase tracking-wide text-blue-600">
                              Room {rIdx + 1}
                            </span>
                            {editRooms.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeEditRoom(rIdx)}
                                className="text-red-500 hover:text-red-700 text-xs font-semibold cursor-pointer"
                              >
                                Remove Room
                              </button>
                            )}
                          </div>

                          {/* Adults */}
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <div>
                              <p className="font-medium text-[#0e2059]">Adults</p>
                              <p className="text-[10px] text-slate-400">Ages 18+</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => updateEditAdults(rIdx, -1)}
                                disabled={room.adults <= 1}
                                className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              >
                                <FaMinus className="text-[9px]" />
                              </button>
                              <span className="w-5 text-center font-semibold text-xs sm:text-sm text-[#0e2059]">
                                {room.adults}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateEditAdults(rIdx, 1)}
                                disabled={room.adults >= 9}
                                className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              >
                                <FaPlus className="text-[9px]" />
                              </button>
                            </div>
                          </div>

                          {/* Children */}
                          <div className="pt-2 border-t border-slate-200/60 space-y-2">
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                              <div>
                                <p className="font-medium text-[#0e2059]">Children</p>
                                <p className="text-[10px] text-slate-400">Ages 0 to 17</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => removeEditChild(rIdx, room.childrenAges.length - 1)}
                                  disabled={room.childrenAges.length <= 0}
                                  className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                >
                                  <FaMinus className="text-[9px]" />
                                </button>
                                <span className="w-5 text-center font-semibold text-xs sm:text-sm text-[#0e2059]">
                                  {room.childrenAges.length}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => addEditChild(rIdx)}
                                  disabled={room.childrenAges.length >= 4}
                                  className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                >
                                  <FaPlus className="text-[9px]" />
                                </button>
                              </div>
                            </div>

                            {/* Children age dropdowns */}
                            {room.childrenAges.length > 0 && (
                              <div className="flex flex-wrap gap-2 pt-1">
                                {room.childrenAges.map((age, cIdx) => (
                                  <div key={cIdx} className="flex items-center gap-1.5 text-xs">
                                    <span className="text-[10px] font-semibold text-slate-500">Child {cIdx + 1} age:</span>
                                    <select
                                      value={age}
                                      onChange={(e) => updateEditChildAge(rIdx, cIdx, Number(e.target.value))}
                                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 focus:outline-none"
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
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium text-xs hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSearchAvailability}
                      disabled={isSearchingAvailability}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0b1b4f] hover:bg-[#12286e] text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSearchingAvailability ? (
                        <>
                          <FaSpinner className="animate-spin text-amber-300 text-xs" />
                          <span>Checking Availability...</span>
                        </>
                      ) : (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/assets/HOTEL LANDING PAGE/Search.png"
                            alt="Search"
                            className="w-3.5 h-3.5 object-contain invert brightness-0"
                          />
                          <span>Check Availability</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Destination / Region Section (Replaces Departure Airport as requested) */}
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-[#0e2059] mb-3">
                  Destination / Region
                </h3>
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-4.5 border border-white shadow-xs flex items-center justify-between gap-3.5">
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/HOTEL LANDING PAGE/Location Pin.png"
                      alt="Destination"
                      className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="font-semibold text-sm sm:text-base text-[#0e2059] block leading-tight truncate">
                        {destinationDisplayName}
                      </span>
                      <span className="text-xs text-slate-400 font-medium block mt-0.5 truncate">
                        {hotel.city}, {hotel.country} • {hotel.name}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleEdit}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline px-3.5 py-1.5 rounded-xl bg-blue-50/80 border border-blue-200/60 cursor-pointer shrink-0 transition-colors"
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: BOOK THIS HOTEL SIDEBAR CARD (NON-STICKY, SIDE BY SIDE) */}
          <div id="book-sidebar" className="lg:col-span-5 xl:col-span-4 flex flex-col">
            <div className="bg-[#fef8f0] rounded-3xl p-6 sm:p-7 border border-[#fae8d4] shadow-md flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#071a55] mb-5">
                  Book this hotel
                </h2>

                {/* Hotel, Location, Nights & Travellers List */}
                <div className="space-y-3.5 pb-5 text-xs sm:text-sm text-[#071a55] font-semibold border-b border-[#f0deca]">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/HOTEL LANDING PAGE/Hotel.png"
                      alt="Hotel"
                      className="w-5 h-5 object-contain shrink-0"
                    />
                    <span className="font-semibold text-[#071a55] truncate">{hotel.name}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/HOTEL LANDING PAGE/Location Pin.png"
                      alt="Location"
                      className="w-5 h-5 object-contain shrink-0"
                    />
                    <span className="font-semibold text-slate-700">{hotel.city}, {hotel.country}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/HOTEL LANDING PAGE/Nights.png"
                      alt="Duration"
                      className="w-5 h-5 object-contain shrink-0"
                    />
                    <span className="font-semibold text-slate-700">
                      {nights} nights · {adults} {adults === 1 ? "Adult" : "Adults"} · {roomsConfig.length} {roomsConfig.length === 1 ? "Room" : "Rooms"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Call to Book & Search Quote ID */}
              <div className="pt-4 space-y-3.5">
                <a
                  href="tel:03301658879"
                  className="p-4 rounded-2xl bg-[#0b1b4f] hover:bg-[#12286e] text-white flex items-center gap-3.5 shadow-md transition-all group cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <FaPhoneAlt className="text-amber-300 text-sm group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <span className="text-[10px] font-medium text-amber-300 uppercase tracking-wider block">
                      Call to Book &amp; Exclusive Deals
                    </span>
                    <span className="text-lg sm:text-xl font-semibold text-white block leading-tight">
                      0330 165 8879
                    </span>
                  </div>
                </a>

                {/* Search Quote ID Card */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#f0deca] shadow-2xs flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block leading-tight">
                      Quote for Phone Deals
                    </span>
                    <span className="font-mono text-sm font-semibold text-[#071a55] block">
                      {searchId}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={copySearchId}
                    className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#071a55] text-xs font-semibold transition-all cursor-pointer border border-amber-200/60"
                    title="Copy Quote ID"
                  >
                    {copied ? (
                      <FaCheck className="text-emerald-600 text-xs" />
                    ) : (
                      <FaCopy className="text-slate-600 text-xs" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. FULL-WIDTH HOTEL CONTENT SECTIONS (ENTIRE WIDTH) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-8">
        {/* SUB-NAVIGATION TABS (CLEAN UNDERLINE STYLE) */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar whitespace-nowrap text-sm">
            {[
              { id: "overview", label: "Overview" },
              { id: "rooms", label: "Rooms & Rates" },
              { id: "facilities", label: "Facilities" },
              { id: "location", label: "Location & Map" },
              { id: "policies", label: "Policies & Remarks" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  scrollToSection(tab.id);
                }}
                className={`pb-3.5 transition-all cursor-pointer relative font-semibold ${activeTab === tab.id
                  ? "text-[#071a55] font-semibold border-b-2 border-[#071a55] -mb-px"
                  : "text-slate-600 hover:text-[#071a55]"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 1: ABOUT THE HOTEL */}
        <div id="overview" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs scroll-mt-24 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#071a55] flex items-center gap-2">
              <FaHotel className="text-[#F7941D] text-lg" /> About the Hotel
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              {hotel.name} • {hotel.city}, {hotel.country}
            </span>
          </div>
          <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-5xl">
            <p>
              {hotel.description || `${hotel.name} offers the perfect combination of luxury, modern comfort and warm hospitality.`}
            </p>
            <p>
              Located in {hotel.city}, {hotel.country}, the property features spacious designer rooms, multiple dining options, swimming pool areas, and a comprehensive range of leisure facilities.
            </p>
            <p>
              Whether you&apos;re looking to relax and unwind, explore the vibrant local culture, or enjoy bespoke resort amenities, {hotel.name} provides an exceptional setting for couples, families, and solo travellers alike.
            </p>
          </div>
        </div>

        {/* SECTION 2: ROOMS & SUITES (BELOW ABOUT, FULL WIDTH) */}
        <div id="rooms" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs scroll-mt-24 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[#071a55] flex items-center gap-2.5">
                <FaBed className="text-[#F7941D]" /> Rooms &amp; Suites
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Showing all {rooms.length} available room types &amp; rates for your stay ({nights} nights · {adults} {adults === 1 ? "Guest" : "Guests"})
              </p>
            </div>
            <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-blue-50 text-[#071a55] border border-blue-200/80 shrink-0 w-fit">
              {rooms.length} {rooms.length === 1 ? "Room Option" : "Room Options"} Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {rooms.map((room, idx) => (
              <div
                key={room.id}
                onClick={() => setSelectedRoomIndex(idx)}
                className="group bg-white hover:bg-[#f8fbff] border border-slate-200/90 hover:border-[#071a55]/40 rounded-2xl p-3.5 flex flex-col justify-between shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div>
                  {/* Room Image - Common image for all rooms */}
                  <div className="relative h-32 sm:h-36 rounded-xl overflow-hidden mb-3 bg-slate-100">
                    <img
                      src="/assets/HOTEL LANDING PAGE/room-img.jpg"
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Room Details Centered */}
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold text-sm sm:text-base text-[#071a55] group-hover:text-blue-950 transition-colors leading-tight line-clamp-2">
                      {room.name}
                    </h3>

                    {/* Boarding Badge */}
                    <div className="pt-0.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                        <FaUtensils className="text-[10px] text-amber-700 shrink-0" />
                        <span>{room.boardBasis}</span>
                      </span>
                    </div>

                    {/* Cancellation Badge */}
                    <div>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          room.isNonRefundable
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        <FaShieldAlt className="text-[9px] shrink-0" />
                        <span>{room.cancellationPolicy}</span>
                      </span>
                    </div>

                    {/* Other Inclusions Chips */}
                    {room.otherInclusions && room.otherInclusions.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-1 pt-0.5">
                        {room.otherInclusions.slice(0, 2).map((inc: string, i: number) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200"
                          >
                            <FaCheck className="text-[8px] text-emerald-600 shrink-0" />
                            <span>{inc}</span>
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="pt-2.5 mt-2 border-t border-slate-100">
                      <span className="font-bold text-sm sm:text-base text-[#071a55] block">
                        From £{room.pricePp} pp
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {nights} nights • Total £{room.totalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION: WHAT'S INCLUDED */}
        {/* <div id="included" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#1D1248] mb-6">
                What&apos;s Included
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col items-start">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                    <FaHotel className="text-base" />
                  </div>
                  <h3 className="font-semibold text-sm text-[#1D1248]">
                    Hotel Stay
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Luxury hotel room for {nights} nights with 5-star service and daily housekeeping.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col items-start">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
                    <FaUtensils className="text-base" />
                  </div>
                  <h3 className="font-semibold text-sm text-[#1D1248]">
                    All Inclusive
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    All gourmet meals, drinks, cocktails, and daily fresh poolside snacks.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col items-start">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
                    <FaPlane className="text-base" />
                  </div>
                  <h3 className="font-semibold text-sm text-[#1D1248]">
                    Transfers
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Airport hotel return shared transfer included with air conditioning.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col items-start">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                    <FaShieldAlt className="text-base" />
                  </div>
                  <h3 className="font-semibold text-sm text-[#1D1248]">
                    ATOL Protection
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    100% financial security and official UK ATOL certification.
                  </p>
                </div>
              </div>
            </div> */}

        {/* SECTION: FACILITIES & LOCATION MAP SIDE-BY-SIDE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {/* LEFT: HOTEL FACILITIES */}
          <div
            id="facilities"
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs scroll-mt-24 flex flex-col justify-between space-y-6"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-[#071a55] flex items-center gap-2">
                    <FaCheckCircle className="text-[#F7941D] text-lg" /> Hotel Facilities
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                    Popular amenities &amp; services provided for your comfort
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#071a55] border border-blue-200/80 shrink-0">
                  {facilitiesList.length} Highlights
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                {facilitiesList.map((facility, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50/80 hover:bg-slate-100/80 p-2.5 rounded-xl border border-slate-200/60 transition-colors"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <FaCheck className="text-[10px]" />
                    </div>
                    <span className="truncate">{facility}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: LOCATION & INTERACTIVE MAP */}
          <div
            id="location"
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs scroll-mt-24 flex flex-col justify-between space-y-5"
          >
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-[#071a55] flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#F7941D] text-lg" /> Location &amp; Map
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                    {hotel.address || `${hotel.city}, ${hotel.country}`}
                  </p>
                </div>
                {liveGeolocation && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${liveGeolocation.latitude},${liveGeolocation.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-[#071a55] hover:bg-[#0c246f] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 w-fit cursor-pointer"
                  >
                    <span>Open Maps</span>
                    <FaChevronRight className="text-[10px]" />
                  </a>
                )}
              </div>

              <div className="mt-4">
                {liveGeolocation ? (
                  <div className="relative w-full h-[320px] sm:h-[350px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                    <iframe
                      title={`Interactive Map for ${hotel.name}`}
                      width="100%"
                      height="100%"
                      className="w-full h-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://maps.google.com/maps?q=${liveGeolocation.latitude},${liveGeolocation.longitude}&hl=en&z=15&output=embed`}
                    />
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-sm h-[320px] sm:h-[350px] flex flex-col items-center justify-center">
                    <FaMapMarkerAlt className="text-3xl text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-700">{hotel.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{hotel.address || `${hotel.city}, ${hotel.country}`}</p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name} ${hotel.address || hotel.city}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-blue-600 hover:underline"
                    >
                      Search on Google Maps &rarr;
                    </a>
                  </div>
                )}
              </div>
            </div>

            {liveGeolocation && (
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="font-mono text-[11px] text-slate-600">
                  {liveGeolocation.latitude.toFixed(4)}° N, {liveGeolocation.longitude.toFixed(4)}° E
                </span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <FaCheck className="text-[9px]" /> Verified Coordinates
                </span>
              </div>
            )}
          </div>
        </div>

        {/* SECTION: POLICIES & RATE REMARKS */}
        <div id="policies" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm scroll-mt-24 space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#071a55] flex items-center gap-2">
              <FaInfoCircle className="text-[#071a55]" /> Policies &amp; Important Remarks
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Verified rate conditions, cancellation rules, and supplier remarks for {hotel.name}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
              <h3 className="font-semibold text-sm text-[#071a55] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F7941D]" /> Rate Comments &amp; Taxes
              </h3>
              <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                {rooms[selectedRoomIndex]?.rateComments?.remarks ? (
                  <p>{rooms[selectedRoomIndex].rateComments.remarks}</p>
                ) : (
                  <p>All standard resort taxes, VAT and municipality fees are calculated in the quote. Discretionary hotel amenities are confirmed upon arrival.</p>
                )}
                {rooms[selectedRoomIndex]?.rateComments?.mandatoryTax && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 font-medium flex items-center gap-2">
                    <FaExclamationTriangle className="text-xs text-amber-700 shrink-0" />
                    <span>Mandatory Local Charge: {rooms[selectedRoomIndex].rateComments.mandatoryTax}</span>
                  </div>
                )}
                {rooms[selectedRoomIndex]?.rateComments?.paxComments && (
                  <p className="text-[11px] text-slate-500 italic flex items-center gap-1.5">
                    <FaInfoCircle className="text-xs text-slate-400 shrink-0" />
                    <span>Occupancy Note: {rooms[selectedRoomIndex].rateComments.paxComments}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
              <h3 className="font-semibold text-sm text-[#071a55] flex items-center gap-2">
                <FaShieldAlt className="text-emerald-600" /> Cancellation &amp; Booking Conditions
              </h3>
              <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                <p><strong>Cancellation:</strong> {rooms[selectedRoomIndex]?.cancellationPolicy || "Free cancellation up to 48 hours prior to check-in."}</p>
                <p><strong>Board Basis:</strong> {rooms[selectedRoomIndex]?.boardBasis || "Room Only"}. Meals and beverages outside the stated plan may incur extra hotel charges.</p>
                <p><strong>Telephone Booking Protection:</strong> Quote Search ID <span className="font-mono font-bold text-[#071a55]">{searchId}</span> when calling <strong>0330 165 8879</strong>.</p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: GUEST REVIEWS */}
        {/* <div id="reviews" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[#1D1248]">
                Guest Reviews
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-3xl font-bold text-[#1D1248]">
                  {hotel.reviewScore || 4.6}
                </span>
                <div>
                  <div className="flex text-amber-400 text-xs">
                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    Based on {hotel.reviewCount?.toLocaleString() || "1,248"} verified reviews
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="text-xs font-bold text-[#F7941D] hover:underline cursor-pointer flex items-center gap-1"
            >
              View all reviews <FaArrowRight className="text-[10px]" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#1D1248] text-amber-300 font-bold text-xs flex items-center justify-center">
                    S
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#1D1248] block">
                      Sarah M.
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      United Kingdom
                    </span>
                  </div>
                </div>
                <div className="flex text-amber-400 text-[10px] mb-2">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  &ldquo;Exceptional resort! Everything from the food to the staff was first class. Will definitely be returning.&rdquo;
                </p>
              </div>
              <span className="text-[10px] text-slate-400 mt-3 block">
                12 Oct 2026
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-900 text-cyan-300 font-bold text-xs flex items-center justify-center">
                    E
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#1D1248] block">
                      Emily R.
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      United Kingdom
                    </span>
                  </div>
                </div>
                <div className="flex text-amber-400 text-[10px] mb-2">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  &ldquo;The private beach is incredible. The pool area is always clean and relaxed. Great for families.&rdquo;
                </p>
              </div>
              <span className="text-[10px] text-slate-400 mt-3 block">
                28 Sep 2026
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-emerald-300 font-bold text-xs flex items-center justify-center">
                    J
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#1D1248] block">
                      James T.
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      United Kingdom
                    </span>
                  </div>
                </div>
                <div className="flex text-amber-400 text-[10px] mb-2">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  &ldquo;Great value for luxury. Food selection was amazing. Rooms cleaned every day. Highly recommended.&rdquo;
                </p>
              </div>
              <span className="text-[10px] text-slate-400 mt-3 block">
                15 Aug 2026
              </span>
            </div>
          </div>
        </div> */}
      </div>

      {/* 6. BOTTOM BANNER */}
      <div className="relative w-full mt-14 overflow-hidden">
        {/* Background Image: Bottom Banner.jpg */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/HOTEL LANDING PAGE/Bottom Banner.jpg"
            alt="Holiday Beach Banner"
            className="w-full h-full object-cover object-center"
          />
          {/* Soft contrast overlay on the left to ensure crisp text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#071a55]/80 via-[#071a55]/35 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight drop-shadow-sm">
              Ready to make this holiday yours?
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-white/90 mt-2 max-w-xl font-medium drop-shadow-sm">
              Book now and get closer to your next adventure.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3.5">
            <button
              type="button"
              onClick={() => scrollToSection("book-sidebar")}
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#F7941D] to-[#f58402] hover:from-[#e08314] hover:to-[#df7200] active:scale-95 text-white font-semibold text-sm sm:text-base shadow-lg shadow-orange-500/25 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Book This Holiday</span>
              <FaArrowRight className="text-xs" />
            </button>
            <a
              href="tel:03301658879"
              className="px-5 py-3.5 rounded-xl bg-[#071a55]/40 hover:bg-[#071a55]/60 backdrop-blur-md active:scale-95 text-white font-semibold text-sm border border-white/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <FaPhoneAlt className="text-xs text-amber-300" /> 0330 165 8879
            </a>
          </div>
        </div>
      </div>

      {/* 7. LIGHTBOX GALLERY MODAL */}
      {galleryModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-5 select-none"
        >
          {/* Header Bar */}
          <div className="w-full max-w-5xl flex items-center justify-between pb-2 text-white">
            <span className="text-xs sm:text-sm font-semibold truncate mr-2 max-w-[75vw]">
              {hotel.name} — Photo {activeImageIndex + 1} of {allImages.length}
            </span>
            <button
              type="button"
              onClick={() => setGalleryModalOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer shrink-0"
              aria-label="Close gallery"
            >
              <FaTimes className="text-sm sm:text-base" />
            </button>
          </div>

          {/* Main Photo with Touch Swipe Support */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative w-full max-w-5xl flex-1 min-h-0 sm:min-h-[58vh] sm:max-h-[70vh] rounded-2xl overflow-hidden bg-black flex items-center justify-center my-1 sm:my-2"
          >
            {/* Prev arrow */}
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-2 sm:left-4 z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center cursor-pointer transition-colors border border-white/20 active:scale-95"
              title="Previous photo"
            >
              <FaChevronLeft className="text-xs sm:text-sm" />
            </button>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={allImages[activeImageIndex]}
              alt={`Gallery photo ${activeImageIndex + 1}`}
              className="w-full h-full object-contain pointer-events-none"
            />

            {/* Next arrow */}
            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-2 sm:right-4 z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center cursor-pointer transition-colors border border-white/20 active:scale-95"
              title="Next photo"
            >
              <FaChevronRight className="text-xs sm:text-sm" />
            </button>
          </div>

          {/* Thumbnails strip in modal */}
          <div className="max-w-5xl w-full flex items-center gap-1.5 sm:gap-2 overflow-x-auto overflow-y-hidden py-1.5 sm:py-2.5 scrollbar-thin-dark shrink-0">
            {allImages.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImageIndex(i)}
                className={`relative h-12 w-16 sm:h-16 sm:w-24 rounded-lg overflow-hidden shrink-0 border-2 cursor-pointer transition-all ${
                  activeImageIndex === i ? "border-amber-400 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 8. LUGGAGE & EXTRAS MODAL */}
      {extrasModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <FaSuitcase className="text-base" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-[#1D1248]">
                    Luggage &amp; Extras
                  </h3>
                  <p className="text-xs text-slate-500">
                    Customise your stay with optional add-ons
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setExtrasModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {extras.map((extra) => (
                <div
                  key={extra.id}
                  onClick={() => toggleExtra(extra.id)}
                  className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between gap-3 transition-all ${extra.selected
                    ? "bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${extra.selected
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-slate-300 bg-white"
                        }`}
                    >
                      {extra.selected && <FaCheck className="text-[10px]" />}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-[#1D1248] block">
                        {extra.name}
                      </span>
                      <span className="text-xs text-slate-500 block">
                        {extra.description}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#F7941D] shrink-0">
                    +£{extra.pricePerPerson} pp
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Extras total</span>
                <span className="text-base font-semibold text-[#1D1248]">
                  +£{extrasCostPerPerson * adults} ({extrasCostPerPerson} pp)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setExtrasModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-[#1D1248] hover:bg-[#281a60] text-white text-xs font-semibold shadow-md cursor-pointer"
              >
                Save &amp; Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. BOOKING SUBMISSION SUCCESS MODAL */}
      {bookingSuccessModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[130] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-[#1D1248]">
              Reservation Request Initiated
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Your inquiry for <strong>{hotel.name}</strong> ({selectedRoom.name}) has been registered.
            </p>
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Duration:</span>
                <strong className="text-slate-800">{nights} nights</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Board Basis:</span>
                <strong className="text-slate-800">{selectedRoom.boardBasis}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Price:</span>
                <strong className="text-[#F7941D] font-bold">£{totalPrice.toLocaleString()}</strong>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <a
                href="tel:03301658879"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F7941D] to-[#f58402] text-white text-xs font-semibold shadow-md flex items-center justify-center gap-2"
              >
                <FaPhoneAlt className="text-xs" /> Call Now to Confirm: 0330 165 8879
              </a>
              <button
                type="button"
                onClick={() => setBookingSuccessModal(false)}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

