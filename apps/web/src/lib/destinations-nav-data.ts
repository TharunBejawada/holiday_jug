export interface DestinationNavItem {
  name: string;
  slug: string;
  aliases?: string[];
  iata?: string[];
}

export interface DestinationNavGroup {
  country: string;
  slug: string;
  countryAliases?: string[];
  destinations: DestinationNavItem[];
}

export const DESTINATIONS_NAV_DATA: DestinationNavGroup[] = [
  {
    country: "Spain",
    slug: "spain",
    countryAliases: ["Spain", "ES", "ESP", "Espana", "Spanish"],
    destinations: [
      {
        name: "Majorca",
        slug: "majorca",
        aliases: ["Majorca", "Mallorca", "Palma", "Palma de Mallorca", "Balearic", "Balearics"],
        iata: ["PMI"],
      },
      {
        name: "Menorca",
        slug: "menorca",
        aliases: ["Menorca", "Minorca", "Mahon", "Balearic", "Balearics"],
        iata: ["MAH"],
      },
      {
        name: "Ibiza",
        slug: "ibiza",
        aliases: ["Ibiza", "Eivissa", "San Antonio", "Playa d'en Bossa", "Balearic", "Balearics"],
        iata: ["IBZ"],
      },
      {
        name: "Costa del Sol",
        slug: "costa-del-sol",
        aliases: ["Costa del Sol", "CDS", "Malaga", "Marbella", "Torremolinos", "Benalmadena", "Fuengirola", "Nerja"],
        iata: ["AGP"],
      },
      {
        name: "Costa Blanca",
        slug: "costa-blanca",
        aliases: ["Costa Blanca", "Alicante", "Benidorm", "Torrevieja", "Calpe", "Altea"],
        iata: ["ALC"],
      },
      {
        name: "Costa Brava",
        slug: "costa-brava",
        aliases: ["Costa Brava", "Girona", "Lloret de Mar", "Tossa de Mar", "Blanes"],
        iata: ["GRO"],
      },
      {
        name: "Costa Dorada",
        slug: "costa-dorada",
        aliases: ["Costa Dorada", "Costa Daurada", "Salou", "Reus", "Cambrils", "Tarragona"],
        iata: ["REU"],
      },
      {
        name: "Costa de Almeria",
        slug: "costa-de-almeria",
        aliases: ["Costa de Almeria", "Almeria", "Roquetas de Mar", "Mojacar", "Vera"],
        iata: ["LEI"],
      },
      {
        name: "Barcelona",
        slug: "barcelona",
        aliases: ["Barcelona", "Barca", "Catalonia", "Catalunya"],
        iata: ["BCN"],
      },
      {
        name: "Madrid",
        slug: "madrid",
        aliases: ["Madrid", "Capital"],
        iata: ["MAD"],
      },
      {
        name: "Seville",
        slug: "seville",
        aliases: ["Seville", "Sevilla", "Andalusia", "Andalucia"],
        iata: ["SVQ"],
      },
      {
        name: "Valencia",
        slug: "valencia",
        aliases: ["Valencia", "Comunitat Valenciana"],
        iata: ["VLC"],
      },
    ],
  },
  {
    country: "Canary Islands",
    slug: "canary-islands",
    countryAliases: ["Canary Islands", "Canaries", "Islas Canarias", "ES-CN", "Canary"],
    destinations: [
      {
        name: "Tenerife",
        slug: "tenerife",
        aliases: ["Tenerife", "Playa de las Americas", "Costa Adeje", "Los Cristianos", "Puerto de la Cruz", "Tenerife South", "Tenerife North"],
        iata: ["TFS", "TFN"],
      },
      {
        name: "Lanzarote",
        slug: "lanzarote",
        aliases: ["Lanzarote", "Puerto del Carmen", "Playa Blanca", "Costa Teguise", "Arrecife"],
        iata: ["ACE"],
      },
      {
        name: "Fuerteventura",
        slug: "fuerteventura",
        aliases: ["Fuerteventura", "Corralejo", "Caleta de Fuste", "Jandia", "Puerto del Rosario"],
        iata: ["FUE"],
      },
      {
        name: "Gran Canaria",
        slug: "gran-canaria",
        aliases: ["Gran Canaria", "Las Palmas", "Maspalomas", "Playa del Ingles", "Meloneras", "Puerto Rico"],
        iata: ["LPA"],
      },
      {
        name: "La Palma",
        slug: "la-palma",
        aliases: ["La Palma", "Santa Cruz de la Palma", "Isla Bonita"],
        iata: ["SPC"],
      },
    ],
  },
  {
    country: "Turkey",
    slug: "turkey",
    countryAliases: ["Turkey", "Turkiye", "TR", "TUR", "Turkish"],
    destinations: [
      {
        name: "Antalya",
        slug: "antalya",
        aliases: ["Antalya", "Lara Beach", "Konyaalti", "Turkish Riviera"],
        iata: ["AYT"],
      },
      {
        name: "Side",
        slug: "side",
        aliases: ["Side", "Manavgat", "Kumkoy"],
        iata: ["AYT"],
      },
      {
        name: "Alanya",
        slug: "alanya",
        aliases: ["Alanya", "Cleopatra Beach", "Mahmutlar"],
        iata: ["GZP", "AYT"],
      },
      {
        name: "Belek",
        slug: "belek",
        aliases: ["Belek", "Golf Belek", "Kadriye"],
        iata: ["AYT"],
      },
      {
        name: "Kemer",
        slug: "kemer",
        aliases: ["Kemer", "Beldibi", "Goynuk", "Tekirova"],
        iata: ["AYT"],
      },
      {
        name: "Dalaman",
        slug: "dalaman",
        aliases: ["Dalaman", "Sarigerme", "Gocek", "Dalyan"],
        iata: ["DLM"],
      },
      {
        name: "Marmaris",
        slug: "marmaris",
        aliases: ["Marmaris", "Icmeler", "Turunc", "Armutalan"],
        iata: ["DLM"],
      },
      {
        name: "Fethiye",
        slug: "fethiye",
        aliases: ["Fethiye", "Oludeniz", "Blue Lagoon", "Calis Beach", "Hisaronu", "Ovacik"],
        iata: ["DLM"],
      },
      {
        name: "Bodrum",
        slug: "bodrum",
        aliases: ["Bodrum", "Gumbet", "Turgutreis", "Yalikavak", "Bitez", "Torba"],
        iata: ["BJV"],
      },
      {
        name: "Kusadasi",
        slug: "kusadasi",
        aliases: ["Kusadasi", "Ephesus", "Ladies Beach"],
        iata: ["ADB"],
      },
      {
        name: "Istanbul",
        slug: "istanbul",
        aliases: ["Istanbul", "Constantinople", "Bosphorus", "Sultanahmet", "Taksim"],
        iata: ["IST", "SAW"],
      },
    ],
  },
  {
    country: "Greece",
    slug: "greece",
    countryAliases: ["Greece", "Hellas", "GR", "GRC", "Greek"],
    destinations: [
      {
        name: "Crete",
        slug: "crete",
        aliases: ["Crete", "Heraklion", "Chania", "Rethymno", "Agios Nikolaos", "Hersonissos", "Malia", "Elounda"],
        iata: ["HER", "CHQ"],
      },
      {
        name: "Rhodes",
        slug: "rhodes",
        aliases: ["Rhodes", "Rodos", "Lindos", "Faliraki", "Kolymbia", "Ixia", "Kallithea"],
        iata: ["RHO"],
      },
      {
        name: "Corfu",
        slug: "corfu",
        aliases: ["Corfu", "Kerkyra", "Kavos", "Sidari", "Dassia", "Acharavi", "Gouvia"],
        iata: ["CFU"],
      },
      {
        name: "Kos",
        slug: "kos",
        aliases: ["Kos", "Kardamena", "Tigaki", "Marmari", "Kefalos"],
        iata: ["KGS"],
      },
      {
        name: "Zante",
        slug: "zante",
        aliases: ["Zante", "Zakynthos", "Laganas", "Tsilivi", "Argassi", "Kalamaki", "Navagio"],
        iata: ["ZTH"],
      },
      {
        name: "Kefalonia",
        slug: "kefalonia",
        aliases: ["Kefalonia", "Cephalonia", "Argostoli", "Lassi", "Skala", "Fiscardo"],
        iata: ["EFL"],
      },
      {
        name: "Halkidiki",
        slug: "halkidiki",
        aliases: ["Halkidiki", "Chalkidiki", "Kassandra", "Sithonia", "Ouranoupoli", "Thessaloniki"],
        iata: ["SKG"],
      },
      {
        name: "Santorini",
        slug: "santorini",
        aliases: ["Santorini", "Thira", "Oia", "Fira", "Kamari", "Perissa", "Imerovigli", "Cyclades"],
        iata: ["JTR"],
      },
      {
        name: "Mykonos",
        slug: "mykonos",
        aliases: ["Mykonos", "Platis Gialos", "Ornos", "Paradise Beach", "Cyclades"],
        iata: ["JMK"],
      },
      {
        name: "Skiathos",
        slug: "skiathos",
        aliases: ["Skiathos", "Koukounaries", "Troulos", "Megali Ammos", "Sporades"],
        iata: ["JSI"],
      },
      {
        name: "Athens",
        slug: "athens",
        aliases: ["Athens", "Acropolis", "Piraeus", "Attica"],
        iata: ["ATH"],
      },
    ],
  },
  {
    country: "Portugal",
    slug: "portugal",
    countryAliases: ["Portugal", "PT", "PRT", "Portuguese"],
    destinations: [
      {
        name: "Algarve",
        slug: "algarve",
        aliases: ["Algarve", "Faro", "Albufeira", "Lagos", "Vilamoura", "Portimao", "Praia da Rocha", "Carvoeiro", "Tavira"],
        iata: ["FAO"],
      },
      {
        name: "Madeira",
        slug: "madeira",
        aliases: ["Madeira", "Funchal", "Canico", "Porto Santo"],
        iata: ["FNC"],
      },
      {
        name: "Lisbon",
        slug: "lisbon",
        aliases: ["Lisbon", "Lisboa", "Cascais", "Sintra", "Estoril"],
        iata: ["LIS"],
      },
      {
        name: "Porto",
        slug: "porto",
        aliases: ["Porto", "Oporto", "Gaia", "Douro"],
        iata: ["OPO"],
      },
    ],
  },
  {
    country: "Cyprus",
    slug: "cyprus",
    countryAliases: ["Cyprus", "CY", "CYP", "Cypriot"],
    destinations: [
      {
        name: "Paphos",
        slug: "paphos",
        aliases: ["Paphos", "Pafos", "Coral Bay", "Kato Paphos", "Polis"],
        iata: ["PFO"],
      },
      {
        name: "Ayia Napa",
        slug: "ayia-napa",
        aliases: ["Ayia Napa", "Agia Napa", "Nissi Beach", "Makronissos"],
        iata: ["LCA"],
      },
      {
        name: "Protaras",
        slug: "protaras",
        aliases: ["Protaras", "Fig Tree Bay", "Pernera", "Cape Greco"],
        iata: ["LCA"],
      },
      {
        name: "Larnaca",
        slug: "larnaca",
        aliases: ["Larnaca", "Larnaka", "Finikoudes"],
        iata: ["LCA"],
      },
      {
        name: "Limassol",
        slug: "limassol",
        aliases: ["Limassol", "Lemesos", "Marina"],
        iata: ["LCA", "PFO"],
      },
    ],
  },
  {
    country: "Egypt",
    slug: "egypt",
    countryAliases: ["Egypt", "EG", "EGY", "Egyptian"],
    destinations: [
      {
        name: "Hurghada",
        slug: "hurghada",
        aliases: ["Hurghada", "El Gouna", "Makadi Bay", "Soma Bay", "Sahl Hasheesh", "Red Sea"],
        iata: ["HRG"],
      },
      {
        name: "Sharm El Sheikh",
        slug: "sharm-el-sheikh",
        aliases: ["Sharm El Sheikh", "Sharm", "Naama Bay", "Nabq Bay", "Ras Um Sid", "Sharks Bay", "Red Sea", "Sinai"],
        iata: ["SSH"],
      },
      {
        name: "Marsa Alam",
        slug: "marsa-alam",
        aliases: ["Marsa Alam", "Port Ghalib", "El Quseir", "Red Sea"],
        iata: ["RMF"],
      },
      {
        name: "Cairo",
        slug: "cairo",
        aliases: ["Cairo", "Giza", "Pyramids", "Nile"],
        iata: ["CAI"],
      },
    ],
  },
  {
    country: "United Arab Emirates",
    slug: "united-arab-emirates",
    countryAliases: ["United Arab Emirates", "UAE", "U.A.E.", "Emirates", "AE", "ARE", "Emirati"],
    destinations: [
      {
        name: "Dubai",
        slug: "dubai",
        aliases: ["Dubai", "JBR", "Dubai Marina", "Downtown Dubai", "Palm Jumeirah", "Deira", "Bur Dubai"],
        iata: ["DXB", "DWC"],
      },
      {
        name: "Abu Dhabi",
        slug: "abu-dhabi",
        aliases: ["Abu Dhabi", "Yas Island", "Saadiyat Island", "Corniche"],
        iata: ["AUH"],
      },
      {
        name: "Ras Al Khaimah",
        slug: "ras-al-khaimah",
        aliases: ["Ras Al Khaimah", "RAK", "Al Marjan Island", "Al Hamra"],
        iata: ["RMF"],
      },
    ],
  },
];
