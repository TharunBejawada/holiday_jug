/**
 * HolidayJug - Hot Deals Slides Central Store (Section 3 H2 & H3)
 * 
 * Rules:
 * H2: Auto-advance, swipe on mobile, pause on touch/hover, genuinely available price.
 * H3: Managed from one place in the admin area so a change appears everywhere at once.
 * Max 6 slides.
 * All destinations point to Admin Dashboard published destinations (/destinations/[slug]).
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

// Central managed slides (Admin editable, mapped directly to Admin Dashboard countries)
let hotDealsSlides: HotDealSlide[] = [
  {
    id: "deal-turkey",
    badge: "HOT DEALS",
    destination: "Turkey",
    subtitle: "Stunning coastlines, ancient history & vibrant warm hospitality.",
    fromPriceGbp: 95,
    image: "https://holidayjug-assets-prod.s3.eu-west-2.amazonaws.com/uploads/2026-09-25/91990881-834d-441b-a63b-a9eea46858a2.jpg",
    perks: ["All Inclusive", "Private Beach", "Spa & Wellness", "Kids Club Included"],
    searchLink: "/destinations/turkey",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "deal-dubai",
    badge: "HOT DEALS",
    destination: "Dubai",
    subtitle: "Futuristic architecture, desert safaris & world-class luxury glamour.",
    fromPriceGbp: 548,
    image: "https://holidayjug-assets-prod.s3.eu-west-2.amazonaws.com/uploads/2026-09-25/e1536319-3c0d-456f-b8c7-973285f148a9.jpg",
    perks: ["Direct Flights", "5★ Creek Resort", "Infinity Pool", "Private Balcony"],
    searchLink: "/destinations/dubai",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "deal-greece",
    badge: "HOT DEALS",
    destination: "Greece",
    subtitle: "Crystal-clear waters, ancient mythology & sun-drenched islands.",
    fromPriceGbp: 285,
    image: "https://holidayjug-assets-prod.s3.eu-west-2.amazonaws.com/uploads/2026-09-25/afb03492-79f0-4308-9312-47506b6aed0b.jpg",
    perks: ["Caldera Views", "Boutique Suite", "Daily Breakfast", "Sunset Sailing"],
    searchLink: "/destinations/greece",
    isActive: true,
    sortOrder: 3,
  },
  {
    id: "deal-spain",
    badge: "HOT DEALS",
    destination: "Spain",
    subtitle: "Golden Mediterranean beaches, rich culture & vibrant gastronomy.",
    fromPriceGbp: 325,
    image: "https://holidayjug-assets-prod.s3.eu-west-2.amazonaws.com/uploads/2026-09-25/4005cca2-cffa-4e17-9be6-74f88ca53780.jpg",
    perks: ["Return Flights", "Beachfront Stay", "Daily Breakfast", "Free Transfers"],
    searchLink: "/destinations/spain",
    isActive: true,
    sortOrder: 4,
  },
  {
    id: "deal-antalya",
    badge: "HOT DEALS",
    destination: "Antalya",
    subtitle: "The heart of the Turkish Riviera, palm-lined boulevards & luxury resorts.",
    fromPriceGbp: 878,
    image: "https://holidayjug-assets-prod.s3.eu-west-2.amazonaws.com/uploads/2026-09-25/7a33396e-ed2d-4fcd-a632-54837c254b4c.jpg",
    perks: ["All Inclusive", "Riviera Views", "Private Beach", "Luxury Suites"],
    searchLink: "/destinations/antalya",
    isActive: true,
    sortOrder: 5,
  },
  {
    id: "deal-portugal",
    badge: "HOT DEALS",
    destination: "Portugal",
    subtitle: "Dramatic Atlantic cliffs, historic coastal towns & golden sandy shores.",
    fromPriceGbp: 450,
    image: "https://holidayjug-assets-prod.s3.eu-west-2.amazonaws.com/uploads/2026-09-25/5f77e945-62ab-465e-b55c-96a21fc82975.jpg",
    perks: ["Return Flights", "4★ Ocean View", "Pool & Solarium", "Breakfast Included"],
    searchLink: "/destinations/portugal",
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
