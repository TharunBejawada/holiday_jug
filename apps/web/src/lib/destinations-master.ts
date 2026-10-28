/**
 * HolidayJug - Destination & Airport Master Repository (Appendix A & Section 4)
 * 
 * Rules:
 * D1: Master list has two fields only: Country and Customer search destination.
 * D2: Each supplier hotel or resort maps to exactly one customer search destination.
 * A.4: Canary Islands kept in separate display group.
 * A.4: Search aliases: Majorca/Mallorca, Zante/Zakynthos, Sharm/Sharm El Sheikh.
 * A.4: Departure airports: Gatwick, Heathrow, Luton, Stansted, Manchester, Birmingham, Bristol, Edinburgh, Glasgow.
 * G3: Hide any destination with no hotels mapped yet.
 */

export interface DepartureAirport {
  code: string;
  name: string;
  city: string;
}

export const DEPARTURE_AIRPORTS: DepartureAirport[] = [
  { code: "LGW", name: "London Gatwick", city: "London" },
  { code: "LHR", name: "London Heathrow", city: "London" },
  { code: "LTN", name: "London Luton", city: "London" },
  { code: "STN", name: "London Stansted", city: "London" },
  { code: "MAN", name: "Manchester Airport", city: "Manchester" },
  { code: "BHX", name: "Birmingham Airport", city: "Birmingham" },
  { code: "BRS", name: "Bristol Airport", city: "Bristol" },
  { code: "EDI", name: "Edinburgh Airport", city: "Edinburgh" },
  { code: "GLA", name: "Glasgow Airport", city: "Glasgow" },
];

export interface DestinationMasterItem {
  slug: string;
  country: string;
  destination: string;
  displayGroup: string;
  aliases: string[];
  isCore: boolean;
  hasMappedHotels: boolean;
  grnCityId?: string;
  featuredHotelCodes: string[];
  heroImage?: string;
  cardImage?: string;
  leadPriceGbp?: number;
}

export const DESTINATIONS_MASTER: DestinationMasterItem[] = [
  // --- UNITED ARAB EMIRATES (Mapped with 327 Sandbox Hotels) ---
  {
    slug: "dubai",
    country: "United Arab Emirates",
    destination: "Dubai",
    displayGroup: "United Arab Emirates",
    aliases: ["Dubai", "DXB", "United Arab Emirates", "UAE", "Dubai & Ras Al Khaimah"],
    isCore: true,
    hasMappedHotels: true,
    grnCityId: "121449",
    featuredHotelCodes: ["1848131", "1847445", "1847631", "1848002", "1847658", "1848134", "1847874", "1848044"],
    heroImage: "/assets/Dubai.jpg",
    cardImage: "/assets/Dubai.jpg",
    leadPriceGbp: 516,
  },
  {
    slug: "abu-dhabi",
    country: "United Arab Emirates",
    destination: "Abu Dhabi",
    displayGroup: "United Arab Emirates",
    aliases: ["Abu Dhabi", "AUH"],
    isCore: true,
    hasMappedHotels: true,
    featuredHotelCodes: ["1848131", "1847631"],
    heroImage: "/assets/Dubai.jpg",
    cardImage: "/assets/Dubai.jpg",
    leadPriceGbp: 549,
  },
  {
    slug: "ras-al-khaimah",
    country: "United Arab Emirates",
    destination: "Ras Al Khaimah",
    displayGroup: "United Arab Emirates",
    aliases: ["Ras Al Khaimah", "RAK"],
    isCore: true,
    hasMappedHotels: true,
    featuredHotelCodes: ["1848134", "1847658"],
    heroImage: "/assets/Dubai.jpg",
    cardImage: "/assets/Dubai.jpg",
    leadPriceGbp: 489,
  },

  // --- CANARY ISLANDS (Shown as separate group per A.4) ---
  {
    slug: "tenerife",
    country: "Canary Islands",
    destination: "Tenerife",
    displayGroup: "Canary Islands",
    aliases: ["Tenerife", "Canaries", "Playa de las Americas", "Costa Adeje"],
    isCore: true,
    hasMappedHotels: true,
    featuredHotelCodes: ["1847631", "1848002"],
    heroImage: "/assets/Tenerife.jpg",
    cardImage: "/assets/Tenerife.jpg",
    leadPriceGbp: 289,
  },
  {
    slug: "lanzarote",
    country: "Canary Islands",
    destination: "Lanzarote",
    displayGroup: "Canary Islands",
    aliases: ["Lanzarote", "Puerto del Carmen", "Playa Blanca"],
    isCore: true,
    hasMappedHotels: true,
    featuredHotelCodes: ["1848002"],
    heroImage: "/assets/Tenerife.jpg",
    cardImage: "/assets/Tenerife.jpg",
    leadPriceGbp: 310,
  },
  {
    slug: "fuerteventura",
    country: "Canary Islands",
    destination: "Fuerteventura",
    displayGroup: "Canary Islands",
    aliases: ["Fuerteventura", "Corralejo"],
    isCore: true,
    hasMappedHotels: true,
    featuredHotelCodes: ["1848131"],
    heroImage: "/assets/Tenerife.jpg",
    cardImage: "/assets/Tenerife.jpg",
    leadPriceGbp: 325,
  },
  {
    slug: "gran-canaria",
    country: "Canary Islands",
    destination: "Gran Canaria",
    displayGroup: "Canary Islands",
    aliases: ["Gran Canaria", "Maspalomas"],
    isCore: true,
    hasMappedHotels: true,
    featuredHotelCodes: ["1848134"],
    heroImage: "/assets/Tenerife.jpg",
    cardImage: "/assets/Tenerife.jpg",
    leadPriceGbp: 340,
  },

  // --- SPAIN ---
  {
    slug: "majorca",
    country: "Spain",
    destination: "Majorca",
    displayGroup: "Spain",
    aliases: ["Majorca", "Mallorca", "Palma", "Alcudia", "Magaluf"],
    isCore: true,
    hasMappedHotels: true,
    featuredHotelCodes: ["1847445", "1848002"],
    heroImage: "/assets/Tenerife.jpg",
    cardImage: "/assets/Tenerife.jpg",
    leadPriceGbp: 145,
  },
  {
    slug: "costa-del-sol",
    country: "Spain",
    destination: "Costa del Sol",
    displayGroup: "Spain",
    aliases: ["Costa del Sol", "Malaga", "Marbella", "Torremolinos", "Benalmadena"],
    isCore: true,
    hasMappedHotels: true,
    featuredHotelCodes: ["1847658"],
    heroImage: "/assets/Tenerife.jpg",
    cardImage: "/assets/Tenerife.jpg",
    leadPriceGbp: 189,
  },
  {
    slug: "costa-blanca",
    country: "Spain",
    destination: "Costa Blanca",
    displayGroup: "Spain",
    aliases: ["Costa Blanca", "Alicante", "Benidorm"],
    isCore: true,
    hasMappedHotels: true,
    featuredHotelCodes: ["1847631"],
    heroImage: "/assets/Tenerife.jpg",
    cardImage: "/assets/Tenerife.jpg",
    leadPriceGbp: 175,
  },
  {
    slug: "ibiza",
    country: "Spain",
    destination: "Ibiza",
    displayGroup: "Spain",
    aliases: ["Ibiza", "San Antonio", "Playa d'en Bossa"],
    isCore: true,
    hasMappedHotels: true,
    featuredHotelCodes: ["1848131"],
    heroImage: "/assets/Tenerife.jpg",
    cardImage: "/assets/Tenerife.jpg",
    leadPriceGbp: 260,
  },
  {
    slug: "barcelona",
    country: "Spain",
    destination: "Barcelona",
    displayGroup: "Spain",
    aliases: ["Barcelona", "Catalonia"],
    isCore: true,
    hasMappedHotels: true,
    featuredHotelCodes: ["1847445"],
    heroImage: "/assets/Tenerife.jpg",
    cardImage: "/assets/Tenerife.jpg",
    leadPriceGbp: 199,
  },

  // --- TURKEY ---
  {
    slug: "antalya",
    country: "Turkey",
    destination: "Antalya",
    displayGroup: "Turkey",
    aliases: ["Antalya", "Turkish Riviera", "Lara Beach"],
    isCore: true,
    hasMappedHotels: true,
    featuredHotelCodes: ["1848131", "1847631"],
    heroImage: "/assets/Antalya.jpg",
    cardImage: "/assets/Antalya.jpg",
    leadPriceGbp: 95,
  },
  {
    slug: "side",
    country: "Turkey",
    destination: "Side",
    displayGroup: "Turkey",
    aliases: ["Side", "Manavgat"],
    isCore: true,
    hasMappedHotels: true,
    featuredHotelCodes: ["1848002"],
    heroImage: "/assets/Antalya.jpg",
    cardImage: "/assets/Antalya.jpg",
    leadPriceGbp: 120,
  },
  {
    slug: "dalaman",
    country: "Turkey",
    destination: "Dalaman",
    displayGroup: "Turkey",
    aliases: ["Dalaman", "Marmaris", "Fethiye", "Oludeniz"],
    isCore: true,
    hasMappedHotels: true,
    featuredHotelCodes: ["1847874"],
    heroImage: "/assets/Antalya.jpg",
    cardImage: "/assets/Antalya.jpg",
    leadPriceGbp: 140,
  },
  {
    slug: "bodrum",
    country: "Turkey",
    destination: "Bodrum",
    displayGroup: "Turkey",
    aliases: ["Bodrum", "Aegean Riviera"],
    isCore: true,
    hasMappedHotels: true,
    featuredHotelCodes: ["1848044"],
    heroImage: "/assets/Antalya.jpg",
    cardImage: "/assets/Antalya.jpg",
    leadPriceGbp: 165,
  },
  {
    slug: "istanbul",
    country: "Turkey",
    destination: "Istanbul",
    displayGroup: "Turkey",
    aliases: ["Istanbul", "Constantinople", "Marmara"],
    isCore: true,
    hasMappedHotels: true,
    featuredHotelCodes: ["1847742"],
    heroImage: "/assets/Antalya.jpg",
    cardImage: "/assets/Antalya.jpg",
    leadPriceGbp: 180,
  },

  // --- GREECE ---
  {
    slug: "santorini",
    country: "Greece",
    destination: "Santorini",
    displayGroup: "Greece",
    aliases: ["Santorini", "Thira", "Oia", "Cyclades"],
    isCore: true,
    hasMappedHotels: true,
    featuredHotelCodes: ["1847631", "1848134"],
    heroImage: "/assets/Santorini.jpg",
    cardImage: "/assets/Santorini.jpg",
    leadPriceGbp: 382,
  },
  {
    slug: "crete",
    country: "Greece",
    destination: "Crete",
    displayGroup: "Greece",
    aliases: ["Crete", "Heraklion", "Chania", "Greek Islands"],
    isCore: true,
    hasMappedHotels: true,
    featuredHotelCodes: ["1848002"],
    heroImage: "/assets/Santorini.jpg",
    cardImage: "/assets/Santorini.jpg",
    leadPriceGbp: 220,
  },
  {
    slug: "rhodes",
    country: "Greece",
    destination: "Rhodes",
    displayGroup: "Greece",
    aliases: ["Rhodes", "Faliraki", "Lindos"],
    isCore: true,
    hasMappedHotels: true,
    featuredHotelCodes: ["1847658"],
    heroImage: "/assets/Santorini.jpg",
    cardImage: "/assets/Santorini.jpg",
    leadPriceGbp: 245,
  },
  {
    slug: "corfu",
    country: "Greece",
    destination: "Corfu",
    displayGroup: "Greece",
    aliases: ["Corfu", "Kerkyra"],
    isCore: true,
    hasMappedHotels: true,
    featuredHotelCodes: ["1847874"],
    heroImage: "/assets/Santorini.jpg",
    cardImage: "/assets/Santorini.jpg",
    leadPriceGbp: 230,
  },
  {
    slug: "zante",
    country: "Greece",
    destination: "Zante",
    displayGroup: "Greece",
    aliases: ["Zante", "Zakynthos", "Laganas"],
    isCore: true,
    hasMappedHotels: true,
    featuredHotelCodes: ["1848044"],
    heroImage: "/assets/Santorini.jpg",
    cardImage: "/assets/Santorini.jpg",
    leadPriceGbp: 215,
  },

  // --- PORTUGAL ---
  {
    slug: "algarve",
    country: "Portugal",
    destination: "Algarve",
    displayGroup: "Portugal",
    aliases: ["Algarve", "Albufeira", "Faro", "Vilamoura"],
    isCore: true,
    hasMappedHotels: true,
    featuredHotelCodes: ["1847631", "1847445"],
    heroImage: "/assets/Tenerife.jpg",
    cardImage: "/assets/Tenerife.jpg",
    leadPriceGbp: 179,
  },
  {
    slug: "lisbon",
    country: "Portugal",
    destination: "Lisbon",
    displayGroup: "Portugal",
    aliases: ["Lisbon", "Lisboa", "Cascais"],
    isCore: true,
    hasMappedHotels: true,
    featuredHotelCodes: ["1848002"],
    heroImage: "/assets/Tenerife.jpg",
    cardImage: "/assets/Tenerife.jpg",
    leadPriceGbp: 195,
  },

  // --- CYPRUS ---
  {
    slug: "paphos",
    country: "Cyprus",
    destination: "Paphos",
    displayGroup: "Cyprus",
    aliases: ["Paphos", "Pafos"],
    isCore: true,
    hasMappedHotels: true,
    featuredHotelCodes: ["1847874"],
    heroImage: "/assets/Santorini.jpg",
    cardImage: "/assets/Santorini.jpg",
    leadPriceGbp: 255,
  },
  {
    slug: "ayia-napa",
    country: "Cyprus",
    destination: "Ayia Napa",
    displayGroup: "Cyprus",
    aliases: ["Ayia Napa", "Napa"],
    isCore: true,
    hasMappedHotels: true,
    featuredHotelCodes: ["1847658"],
    heroImage: "/assets/Santorini.jpg",
    cardImage: "/assets/Santorini.jpg",
    leadPriceGbp: 270,
  },

  // --- EGYPT ---
  {
    slug: "hurghada",
    country: "Egypt",
    destination: "Hurghada",
    displayGroup: "Egypt",
    aliases: ["Hurghada", "Red Sea"],
    isCore: true,
    hasMappedHotels: true,
    featuredHotelCodes: ["1848131"],
    heroImage: "/assets/Antalya.jpg",
    cardImage: "/assets/Antalya.jpg",
    leadPriceGbp: 268,
  },
  {
    slug: "sharm-el-sheikh",
    country: "Egypt",
    destination: "Sharm El Sheikh",
    displayGroup: "Egypt",
    aliases: ["Sharm El Sheikh", "Sharm", "Naama Bay"],
    isCore: true,
    hasMappedHotels: true,
    featuredHotelCodes: ["1847631"],
    heroImage: "/assets/Antalya.jpg",
    cardImage: "/assets/Antalya.jpg",
    leadPriceGbp: 285,
  },
  {
    slug: "luxor",
    country: "Egypt",
    destination: "Luxor",
    displayGroup: "Egypt",
    aliases: ["Luxor", "Nile Valley"],
    isCore: true,
    hasMappedHotels: true,
    grnCityId: "123144",
    featuredHotelCodes: ["1848002"],
    heroImage: "/assets/Antalya.jpg",
    cardImage: "/assets/Antalya.jpg",
    leadPriceGbp: 299,
  },

  // --- UNITED STATES (Mapped with 567 Sandbox Hotels in Los Angeles) ---
  {
    slug: "los-angeles",
    country: "United States",
    destination: "Los Angeles",
    displayGroup: "United States",
    aliases: ["Los Angeles", "LA", "Hollywood", "California", "USA"],
    isCore: false,
    hasMappedHotels: true,
    grnCityId: "123656",
    featuredHotelCodes: ["1847631", "1847445"],
    heroImage: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80",
    cardImage: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80",
    leadPriceGbp: 449,
  },

  // --- INDIA (Mapped with 242 Delhi, 154 Jaipur Hotels for UK-India corridor) ---
  {
    slug: "delhi",
    country: "India",
    destination: "Delhi",
    displayGroup: "India",
    aliases: ["Delhi", "New Delhi", "NCR"],
    isCore: false,
    hasMappedHotels: true,
    grnCityId: "124054",
    featuredHotelCodes: ["1848131", "1847874"],
    heroImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
    cardImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
    leadPriceGbp: 460,
  },
  {
    slug: "jaipur",
    country: "India",
    destination: "Jaipur",
    displayGroup: "India",
    aliases: ["Jaipur", "Pink City", "Rajasthan"],
    isCore: false,
    hasMappedHotels: true,
    grnCityId: "122730",
    featuredHotelCodes: ["1847445"],
    heroImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
    cardImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
    leadPriceGbp: 435,
  },

  // --- LONG-HAUL SPECIALS ---
  {
    slug: "maldives",
    country: "Maldives",
    destination: "Maldives",
    displayGroup: "Indian Ocean",
    aliases: ["Maldives", "Male", "Atoll"],
    isCore: false,
    hasMappedHotels: true,
    featuredHotelCodes: ["1847658"],
    heroImage: "/assets/Homepage_Banner.png",
    cardImage: "/assets/Homepage_Banner.png",
    leadPriceGbp: 699,
  },
  {
    slug: "mauritius",
    country: "Mauritius",
    destination: "Mauritius",
    displayGroup: "Indian Ocean",
    aliases: ["Mauritius", "Port Louis"],
    isCore: false,
    hasMappedHotels: true,
    featuredHotelCodes: ["1848134"],
    heroImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    cardImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    leadPriceGbp: 791,
  },
  {
    slug: "mexico",
    country: "Mexico",
    destination: "Mexico",
    displayGroup: "Americas",
    aliases: ["Mexico", "Cancun", "Riviera Maya", "Playa del Carmen"],
    isCore: false,
    hasMappedHotels: true,
    featuredHotelCodes: ["1848044"],
    heroImage: "https://images.unsplash.com/photo-1512813195386-6cf811ad3542?auto=format&fit=crop&w=800&q=80",
    cardImage: "https://images.unsplash.com/photo-1512813195386-6cf811ad3542?auto=format&fit=crop&w=800&q=80",
    leadPriceGbp: 778,
  },
];

/**
 * Returns all active destinations with mapped hotels (G3: hide unmapped destinations).
 */
export function getActiveSearchDestinations(): DestinationMasterItem[] {
  return DESTINATIONS_MASTER.filter((d) => d.hasMappedHotels);
}

/**
 * Finds a destination by slug, name or alias.
 */
export function findDestination(term: string): DestinationMasterItem | null {
  if (!term) return null;
  const clean = term.trim().toLowerCase();

  return (
    DESTINATIONS_MASTER.find(
      (d) =>
        d.slug.toLowerCase() === clean ||
        d.destination.toLowerCase() === clean ||
        d.country.toLowerCase() === clean ||
        d.aliases.some((alias) => alias.toLowerCase() === clean || clean.includes(alias.toLowerCase()))
    ) || null
  );
}
