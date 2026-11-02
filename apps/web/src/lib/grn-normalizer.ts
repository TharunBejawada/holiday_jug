/**
 * HolidayJug - GRN Connect Response Normalizer
 *
 * Resilient parsers to handle inconsistent keys across GRN Connect endpoints:
 * - Geolocation: { latitude, longitude } vs { lat, lng } vs top-level latitude/longitude strings
 * - Rate Comments: Object ({ remarks, MandatoryTax, pax_comments }) vs array vs string
 * - Boarding Details: Array vs string vs board_type vs meal_plan vs boardBasis
 * - Other Inclusions: Array vs comma-delimited strings vs inclusions
 * - Cancellation Policies: cancel_by_date vs formatted strings vs non_refundable
 */

export interface NormalizedGeolocation {
  latitude: number;
  longitude: number;
}

export interface NormalizedRateComments {
  remarks?: string;
  mandatoryTax?: string;
  paxComments?: string;
  allComments: string[];
}

export interface NormalizedBoarding {
  boardBasis: string;
  boardingDetails: string[];
}

export interface NormalizedCancellation {
  isNonRefundable: boolean;
  cancelByDate?: string;
  formattedPolicy: string;
}

/**
 * Strips HTML tags (e.g. </br>, <br>, <p>, &nbsp;) and cleans whitespace.
 */
export function cleanHtmlText(input?: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/br>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extracts and validates geolocation across all known GRN key variations.
 * Returns null if coordinates are invalid, missing, or (0, 0).
 */
export function normalizeGeolocation(raw: any): NormalizedGeolocation | null {
  if (!raw || typeof raw !== "object") return null;

  let latRaw: any = undefined;
  let lngRaw: any = undefined;

  // 1. Nested objects (geolocation, geo_location, geo, location, coords)
  const nested = raw.geolocation || raw.geo_location || raw.geo || raw.location || raw.coords;
  if (nested && typeof nested === "object") {
    latRaw = nested.latitude ?? nested.lat ?? nested.Latitude ?? nested.LAT;
    lngRaw = nested.longitude ?? nested.long ?? nested.lng ?? nested.lon ?? nested.Longitude ?? nested.LNG;
  }

  // 2. Top-level keys
  if (latRaw === undefined) {
    latRaw = raw.latitude ?? raw.lat ?? raw.Latitude;
  }
  if (lngRaw === undefined) {
    lngRaw = raw.longitude ?? raw.long ?? raw.lng ?? raw.lon ?? raw.Longitude;
  }

  // 3. Array coordinates [lat, lng] or [lng, lat]
  if ((latRaw === undefined || lngRaw === undefined) && Array.isArray(raw.coordinates) && raw.coordinates.length >= 2) {
    const c0 = parseFloat(raw.coordinates[0]);
    const c1 = parseFloat(raw.coordinates[1]);
    if (!isNaN(c0) && !isNaN(c1)) {
      // Determine which is lat (-90 to 90) vs lng (-180 to 180)
      if (Math.abs(c0) <= 90 && Math.abs(c1) <= 180) {
        latRaw = c0;
        lngRaw = c1;
      } else {
        latRaw = c1;
        lngRaw = c0;
      }
    }
  }

  if (latRaw === undefined || lngRaw === undefined || latRaw === null || lngRaw === null) {
    return null;
  }

  const lat = typeof latRaw === "number" ? latRaw : parseFloat(String(latRaw).trim());
  const lng = typeof lngRaw === "number" ? lngRaw : parseFloat(String(lngRaw).trim());

  if (isNaN(lat) || isNaN(lng)) return null;
  // Ignore 0,0 default / invalid coordinates
  if (lat === 0 && lng === 0) return null;
  // Latitude valid range -90 to 90, Longitude valid range -180 to 180
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

  return {
    latitude: Number(lat.toFixed(6)),
    longitude: Number(lng.toFixed(6)),
  };
}

/**
 * Normalizes rate comments, mandatory hotel taxes, and remarks into clean, user-safe strings.
 */
export function normalizeRateComments(raw: any): NormalizedRateComments {
  const result: NormalizedRateComments = {
    allComments: [],
  };

  if (!raw) return result;

  // Case A: String
  if (typeof raw === "string") {
    const clean = cleanHtmlText(raw);
    if (clean) {
      result.remarks = clean;
      result.allComments.push(clean);
    }
    return result;
  }

  // Case B: Array of strings or objects
  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (typeof item === "string") {
        const clean = cleanHtmlText(item);
        if (clean) result.allComments.push(clean);
      } else if (item && typeof item === "object") {
        const sub = normalizeRateComments(item);
        result.allComments.push(...sub.allComments);
        if (!result.remarks && sub.remarks) result.remarks = sub.remarks;
        if (!result.mandatoryTax && sub.mandatoryTax) result.mandatoryTax = sub.mandatoryTax;
      }
    }
    return result;
  }

  // Case C: Object (e.g. GRN { MandatoryTax: "60.0 AED", pax_comments: "...", remarks: "..." })
  if (typeof raw === "object") {
    // Remarks
    const remarksRaw = raw.remarks || raw.Remarks || raw.comments || raw.Comments || raw.description;
    if (typeof remarksRaw === "string") {
      result.remarks = cleanHtmlText(remarksRaw);
      if (result.remarks) result.allComments.push(result.remarks);
    } else if (Array.isArray(remarksRaw)) {
      const joined = remarksRaw.map(cleanHtmlText).filter(Boolean).join(". ");
      if (joined) {
        result.remarks = joined;
        result.allComments.push(joined);
      }
    }

    // Mandatory Tax / Hotel Charges
    const taxRaw =
      raw.MandatoryTax ||
      raw.mandatoryTax ||
      raw.mandatory_tax ||
      raw.hotel_charges ||
      raw.hotelCharges ||
      raw.city_tax;
    if (typeof taxRaw === "string") {
      result.mandatoryTax = cleanHtmlText(taxRaw);
      result.allComments.push(`Mandatory Local Hotel Charge: ${result.mandatoryTax}`);
    } else if (Array.isArray(taxRaw) && taxRaw.length > 0) {
      const taxItem = taxRaw[0];
      const amt = taxItem.amount ? `${taxItem.amount} ${taxItem.currency || ""}` : cleanHtmlText(String(taxItem));
      result.mandatoryTax = amt.trim();
      result.allComments.push(`Mandatory Local Hotel Charge: ${result.mandatoryTax}`);
    }

    // Pax comments (e.g. infant room occupancy)
    const paxRaw = raw.pax_comments || raw.paxComments || raw.occupancy_notes;
    if (typeof paxRaw === "string") {
      result.paxComments = cleanHtmlText(paxRaw);
      if (result.paxComments) result.allComments.push(result.paxComments);
    }

    // Collect any other string values not yet captured
    for (const [k, v] of Object.entries(raw)) {
      if (
        !["remarks", "Remarks", "comments", "Comments", "MandatoryTax", "mandatoryTax", "mandatory_tax", "pax_comments", "paxComments", "hotel_charges"].includes(k) &&
        typeof v === "string"
      ) {
        const clean = cleanHtmlText(v);
        if (clean && !result.allComments.includes(clean)) {
          result.allComments.push(clean);
        }
      }
    }
  }

  return result;
}

/**
 * Normalizes boarding details / meal plan into unified boardBasis label and details list.
 */
export function normalizeBoardingDetails(raw: any, fallbackBasis = "Room Only"): NormalizedBoarding {
  let boardBasis = fallbackBasis;
  const boardingDetails: string[] = [];

  if (!raw) return { boardBasis, boardingDetails };

  // Case A: Array (e.g. GRN rates[].boarding_details = ["Room Only"])
  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (typeof item === "string") {
        const clean = cleanHtmlText(item);
        if (clean) boardingDetails.push(clean);
      } else if (item && typeof item === "object") {
        const name = item.description || item.name || item.type || item.board;
        if (typeof name === "string") {
          const clean = cleanHtmlText(name);
          if (clean) boardingDetails.push(clean);
        }
      }
    }
    if (boardingDetails.length > 0) {
      boardBasis = boardingDetails[0];
    }
    return { boardBasis, boardingDetails };
  }

  // Case B: String
  if (typeof raw === "string") {
    const clean = cleanHtmlText(raw);
    if (clean) {
      boardBasis = clean;
      boardingDetails.push(clean);
    }
    return { boardBasis, boardingDetails };
  }

  // Case C: Object
  if (typeof raw === "object") {
    const rawVal =
      raw.boarding_details ||
      raw.boardingDetails ||
      raw.board_type ||
      raw.boardType ||
      raw.meal_plan ||
      raw.mealPlan ||
      raw.board_basis ||
      raw.boardBasis ||
      raw.description;

    return normalizeBoardingDetails(rawVal, fallbackBasis);
  }

  return { boardBasis, boardingDetails };
}

/**
 * Normalizes other inclusions (e.g. Free valet parking, Free WiFi).
 */
export function normalizeInclusions(raw: any): string[] {
  if (!raw) return [];

  const list: string[] = [];

  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (typeof item === "string") {
        const clean = cleanHtmlText(item);
        if (clean && !list.includes(clean)) list.push(clean);
      } else if (item && typeof item === "object") {
        const title = item.name || item.title || item.description;
        if (typeof title === "string") {
          const clean = cleanHtmlText(title);
          if (clean && !list.includes(clean)) list.push(clean);
        }
      }
    }
  } else if (typeof raw === "string") {
    // May be semicolon or comma-separated
    const parts = raw.split(/[,;]/);
    for (const part of parts) {
      const clean = cleanHtmlText(part);
      if (clean && !list.includes(clean)) list.push(clean);
    }
  } else if (typeof raw === "object") {
    const sub = raw.other_inclusions || raw.otherInclusions || raw.inclusions || raw.inclusion;
    return normalizeInclusions(sub);
  }

  return list;
}

/**
 * Normalizes cancellation policy with user-friendly formatting.
 */
export function normalizeCancellationPolicy(raw: any, fallbackPolicy?: string): NormalizedCancellation {
  let isNonRefundable = false;
  let cancelByDate: string | undefined = undefined;
  let formattedPolicy = fallbackPolicy || "Free cancellation up to 48 hours before check-in";

  if (!raw) {
    return { isNonRefundable, cancelByDate, formattedPolicy };
  }

  // String policy
  if (typeof raw === "string") {
    const clean = cleanHtmlText(raw);
    if (clean.toLowerCase().includes("non-refundable") || clean.toLowerCase().includes("non refundable")) {
      isNonRefundable = true;
      formattedPolicy = "Non-refundable promotional rate";
    } else {
      formattedPolicy = clean;
    }
    return { isNonRefundable, cancelByDate, formattedPolicy };
  }

  // Object policy (e.g. GRN rates[].cancellation_policy)
  if (typeof raw === "object") {
    if (raw.non_refundable === true || raw.is_non_refundable === true) {
      isNonRefundable = true;
      formattedPolicy = "Non-refundable promotional rate";
      return { isNonRefundable, cancelByDate, formattedPolicy };
    }

    const cancelDate = raw.cancel_by_date || raw.cancelByDate || raw.details?.[0]?.from;
    if (typeof cancelDate === "string" && cancelDate.trim() !== "") {
      cancelByDate = cancelDate;
      try {
        const parsed = new Date(cancelDate);
        if (!isNaN(parsed.getTime())) {
          const formatted = parsed.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
          formattedPolicy = `Free cancellation until ${formatted}`;
          return { isNonRefundable: false, cancelByDate, formattedPolicy };
        }
      } catch {
        // Fall back to text if date parsing fails
      }
    }

    if (raw.details && Array.isArray(raw.details) && raw.details.length > 0) {
      formattedPolicy = "Flexible cancellation available";
    }
  }

  return { isNonRefundable, cancelByDate, formattedPolicy };
}

