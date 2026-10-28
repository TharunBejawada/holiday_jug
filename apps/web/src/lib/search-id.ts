import crypto from "crypto";

/**
 * HolidayJug - Search ID & Audit Store (Section 7)
 * 
 * Rules:
 * S1: Short, 8-character code easy to read over the phone.
 *     No ambiguous characters: NO 'O', '0', 'I', '1', 'L'.
 *     Cryptographically unguessable.
 * S2: "Quote this ID when you call us" next to sales number 0330 165 8879.
 * S3: Store complete search details + supplier cost + margins + timestamps.
 * S4: All timestamps in UK time (Europe/London). Retain 30 days.
 */

// Safe alphabet without 0, O, 1, I, L (29 unambiguous characters)
const SAFE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/**
 * Generates an 8-character unguessable Search ID.
 */
export function generateSearchId(): string {
  const bytes = crypto.randomBytes(8);
  let id = "";
  for (let i = 0; i < 8; i++) {
    const index = bytes[i] % SAFE_ALPHABET.length;
    id += SAFE_ALPHABET[index];
  }
  return id;
}

/**
 * Format a Date or ISO string into UK Time (London) string.
 * Format example: "28 Oct 2026, 11:45 BST" or "28 Oct 2026, 11:45 GMT"
 */
export function formatUkTime(dateInput: Date | string | number = new Date()): string {
  const date = typeof dateInput === "string" || typeof dateInput === "number" ? new Date(dateInput) : dateInput;
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "short",
  }).format(date);
}

/**
 * Format short UK time for live price badges: e.g. "11:45"
 */
export function formatUkTimeShort(dateInput: Date | string | number = new Date()): string {
  const date = typeof dateInput === "string" || typeof dateInput === "number" ? new Date(dateInput) : dateInput;
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "short",
  }).format(date);
}

export interface RoomRequest {
  adults: number;
  childrenAges: number[];
}

export interface CustomerSearchState {
  destination: string;
  destinationName: string;
  departureAirport: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  rooms: RoomRequest[];
  totalAdults: number;
  totalChildren: number;
}

export interface SelectedOptionState {
  hotelCode: string;
  hotelName: string;
  roomType: string;
  boardBasis: string;
  starRating?: number;
  address?: string;
  imageUrl?: string;
  flightDetails?: {
    airline?: string;
    flightNumber?: string;
    departureTime?: string;
    returnTime?: string;
    flightPriceGbp?: number;
  };
  transfersIncluded?: boolean;
}

export interface StoredSearchRecord {
  searchId: string;
  customerSearch: CustomerSearchState;
  selectedOption: SelectedOptionState;
  
  // Displayed to customer
  customerPricing: {
    hotelPrice: number;
    localTax: number;
    flightPrice: number;
    transfersPrice: number;
    totalPrice: number;
    pricePerPerson: number;
    currency: "GBP";
  };

  // Internal Audit & Agent verification (Never sent to customer client!)
  internalAudit: {
    supplierCostInr: number;
    supplierCostGbp: number;
    marginRate: number;
    currencyRate: number;
    priceFetchedAtIso: string;
    priceFetchedAtUk: string;
    supplierRawPayload?: any;
  };

  searchGeneratedAtIso: string;
  searchGeneratedAtUk: string;
  expiresAtIso: string;
}

// In-memory persistent search store for search records with 30-day TTL (S4)
const searchRecordsStore = new Map<string, StoredSearchRecord>();

/**
 * Saves a Search Record to the store.
 */
export function saveSearchRecord(record: StoredSearchRecord): StoredSearchRecord {
  searchRecordsStore.set(record.searchId.toUpperCase().trim(), record);
  return record;
}

/**
 * Retrieves a Search Record by Search ID.
 */
export function getSearchRecord(searchId: string): StoredSearchRecord | null {
  if (!searchId) return null;
  const cleanId = searchId.toUpperCase().trim();
  const record = searchRecordsStore.get(cleanId);
  if (!record) return null;

  // Check expiration (30 days default)
  const now = new Date();
  const expiresAt = new Date(record.expiresAtIso);
  if (now > expiresAt) {
    searchRecordsStore.delete(cleanId);
    return null;
  }

  return record;
}

/**
 * Lists all active search records (for admin view).
 */
export function listAllSearchRecords(limit = 50): StoredSearchRecord[] {
  const all = Array.from(searchRecordsStore.values());
  all.sort((a, b) => new Date(b.searchGeneratedAtIso).getTime() - new Date(a.searchGeneratedAtIso).getTime());
  return all.slice(0, limit);
}

/**
 * Calculates time difference in hours and minutes between two ISO strings.
 */
export function calculateTimeGap(earlierIso: string, laterIso: string): { hours: number; minutes: number; formatted: string } {
  const earlier = new Date(earlierIso).getTime();
  const later = new Date(laterIso).getTime();
  const diffMs = Math.max(0, later - earlier);
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  let formatted = "";
  if (hours > 0) {
    formatted += `${hours} hr${hours > 1 ? "s" : ""} `;
  }
  formatted += `${minutes} min${minutes === 1 ? "" : "s"}`;

  return { hours, minutes, formatted };
}
