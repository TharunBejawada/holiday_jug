/**
 * HolidayJug - Hot Deals Slides Central Store (Section 3 H2 & H3)
 * 
 * Rules:
 * H2: Auto-advance, swipe on mobile, pause on touch/hover, genuinely available price.
 * H3: Managed from one place in the admin area so a change appears everywhere at once.
 * Max 6 slides.
 */

export interface HotDealSlide {
  id: string;
  badge: string;
  destination: string;
  subtitle: string;
  fromPriceGbp: number;
  image: string;
  perks: string[];
  searchLink: string;
  isActive: boolean;
  sortOrder: number;
}

// Central managed slides (Admin editable)
let hotDealsSlides: HotDealSlide[] = [
  {
    id: "deal-maldives",
    badge: "HOT DEALS",
    destination: "Maldives",
    subtitle: "Crystal clear waters. Unforgettable escapes.",
    fromPriceGbp: 699,
    image: "/assets/Homepage_Banner.png",
    perks: ["Return Flights", "Luxury Hotels", "Daily Breakfast", "Stunning Beaches"],
    searchLink: "/search?destination=maldives&departureAirport=LGW",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "deal-dubai",
    badge: "HOT DEALS",
    destination: "Dubai",
    subtitle: "Iconic luxury, desert adventures & five-star glamour.",
    fromPriceGbp: 516,
    image: "/assets/Dubai.jpg",
    perks: ["Direct Flights", "5★ Creek Resort", "Infinity Pool", "Private Balcony"],
    searchLink: "/search?destination=dubai&departureAirport=LGW",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "deal-antalya",
    badge: "HOT DEALS",
    destination: "Antalya",
    subtitle: "All-inclusive sunshine along the sparkling Turkish Riviera.",
    fromPriceGbp: 95,
    image: "/assets/Antalya.jpg",
    perks: ["All Inclusive", "Private Beach", "Spa & Wellness", "Kids Club Included"],
    searchLink: "/search?destination=antalya&departureAirport=MAN",
    isActive: true,
    sortOrder: 3,
  },
  {
    id: "deal-tenerife",
    badge: "HOT DEALS",
    destination: "Tenerife",
    subtitle: "Year-round island warmth, volcanic views & ocean sunsets.",
    fromPriceGbp: 289,
    image: "/assets/Tenerife.jpg",
    perks: ["Return Flights", "Beachfront Stay", "Daily Breakfast", "Free Transfers"],
    searchLink: "/search?destination=tenerife&departureAirport=LGW",
    isActive: true,
    sortOrder: 4,
  },
  {
    id: "deal-santorini",
    badge: "HOT DEALS",
    destination: "Santorini",
    subtitle: "Breathtaking Caldera vistas and whitewashed Aegean sunsets.",
    fromPriceGbp: 382,
    image: "/assets/Santorini.jpg",
    perks: ["Caldera Views", "Boutique Suite", "Daily Breakfast", "Sunset Sailing"],
    searchLink: "/search?destination=santorini&departureAirport=LGW",
    isActive: true,
    sortOrder: 5,
  },
  {
    id: "deal-majorca",
    badge: "HOT DEALS",
    destination: "Majorca",
    subtitle: "Turquoise coves, pine-fringed bays and Spanish charm.",
    fromPriceGbp: 145,
    image: "/assets/Tenerife.jpg",
    perks: ["Return Flights", "4★ Beach Hotel", "Pool & Solarium", "Family Friendly"],
    searchLink: "/search?destination=majorca&departureAirport=LGW",
    isActive: true,
    sortOrder: 6,
  },
];

export function getHotDealsSlides(): HotDealSlide[] {
  return hotDealsSlides.filter((s) => s.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getAllHotDealsSlidesForAdmin(): HotDealSlide[] {
  return [...hotDealsSlides].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function updateHotDealSlide(id: string, updates: Partial<HotDealSlide>): HotDealSlide | null {
  const index = hotDealsSlides.findIndex((s) => s.id === id);
  if (index === -1) return null;
  hotDealsSlides[index] = { ...hotDealsSlides[index], ...updates };
  return hotDealsSlides[index];
}

export function addHotDealSlide(slide: Omit<HotDealSlide, "id">): HotDealSlide {
  const newSlide: HotDealSlide = {
    ...slide,
    id: `deal-${Date.now()}`,
  };
  hotDealsSlides.push(newSlide);
  return newSlide;
}

export function deleteHotDealSlide(id: string): boolean {
  const initialLength = hotDealsSlides.length;
  hotDealsSlides = hotDealsSlides.filter((s) => s.id !== id);
  return hotDealsSlides.length < initialLength;
}
