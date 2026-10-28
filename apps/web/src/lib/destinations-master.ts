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
    featuredHotelCodes: ["AE-AUH-01", "AE-AUH-02"],
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
    featuredHotelCodes: ["AE-RAK-01", "AE-RAK-02"],
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
    featuredHotelCodes: ["ES-TEN-01", "ES-TEN-02"],
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
    featuredHotelCodes: ["ES-LAN-01", "ES-LAN-02"],
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
    featuredHotelCodes: ["ES-FUE-01"],
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
    featuredHotelCodes: ["ES-GRA-01"],
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
    featuredHotelCodes: ["ES-MAJ-01", "ES-MAJ-02"],
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
    featuredHotelCodes: ["ES-CDS-01"],
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
    featuredHotelCodes: ["ES-CBL-01"],
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
    featuredHotelCodes: ["ES-IBZ-01"],
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
    featuredHotelCodes: ["ES-BCN-01"],
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
    featuredHotelCodes: ["TR-ANT-01", "TR-ANT-02"],
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
    featuredHotelCodes: ["TR-SID-01"],
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
    featuredHotelCodes: ["TR-DAL-01"],
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
    featuredHotelCodes: ["TR-BOD-01"],
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
    featuredHotelCodes: ["TR-IST-01"],
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
    featuredHotelCodes: ["GR-SAN-01", "GR-SAN-02"],
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
    featuredHotelCodes: ["GR-CRE-01"],
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
    featuredHotelCodes: ["GR-RHO-01"],
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
    featuredHotelCodes: ["GR-COR-01"],
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
    featuredHotelCodes: ["GR-ZAN-01"],
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
    featuredHotelCodes: ["PT-ALG-01", "PT-ALG-02"],
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
    featuredHotelCodes: ["PT-LIS-01"],
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
    featuredHotelCodes: ["CY-PAP-01"],
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
    featuredHotelCodes: ["CY-AYI-01"],
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
    featuredHotelCodes: ["EG-HRG-01"],
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
    featuredHotelCodes: ["EG-SSH-01"],
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
    featuredHotelCodes: ["1226107", "1226039", "1226091", "1226007", "1226037"],
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
    featuredHotelCodes: ["1926777", "1926791", "1950359", "1891877", "1908979", "1883417"],
    heroImage: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80",
    cardImage: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80",
    leadPriceGbp: 449,
  },

  // --- INDIA (Mapped with 242 Delhi, 154 Jaipur, 178 Mumbai, 193 Bengaluru Sandbox Hotels for UK-India corridor) ---
  {
    slug: "delhi",
    country: "India",
    destination: "Delhi",
    displayGroup: "India",
    aliases: ["Delhi", "New Delhi", "DEL", "NCR", "India", "New Delhi and NCR"],
    isCore: false,
    hasMappedHotels: true,
    grnCityId: "124054",
    featuredHotelCodes: ["1393724", "1393842", "1393836", "1393889", "1393717", "1393765", "1393829", "1393830"],
    heroImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
    cardImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
    leadPriceGbp: 389,
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
    featuredHotelCodes: ["1403523", "1403547", "1403497", "1403510", "1403513", "1403557"],
    heroImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
    cardImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
    leadPriceGbp: 435,
  },
  {
    slug: "mumbai",
    country: "India",
    destination: "Mumbai",
    displayGroup: "India",
    aliases: ["Mumbai", "Bombay", "BOM", "Maharashtra"],
    isCore: false,
    hasMappedHotels: true,
    grnCityId: "103863",
    featuredHotelCodes: ["1385463", "1385481", "1385487", "1385496", "1385500", "1385543"],
    heroImage: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80",
    cardImage: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80",
    leadPriceGbp: 420,
  },
  {
    slug: "bengaluru",
    country: "India",
    destination: "Bengaluru",
    displayGroup: "India",
    aliases: ["Bengaluru", "Bangalore", "BLR", "Karnataka"],
    isCore: false,
    hasMappedHotels: true,
    grnCityId: "121850",
    featuredHotelCodes: ["1381002", "1381018", "1381034", "1381048", "1381061", "1381062"],
    heroImage: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80",
    cardImage: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80",
    leadPriceGbp: 395,
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
    featuredHotelCodes: ["MV-MLE-01"],
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
    featuredHotelCodes: ["MU-MRU-01"],
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
    featuredHotelCodes: ["MX-CUN-01"],
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
        d.aliases.some((alias) => {
          const a = alias.toLowerCase();
          return a === clean || clean.includes(a) || a.includes(clean);
        })
    ) || null
  );
}
