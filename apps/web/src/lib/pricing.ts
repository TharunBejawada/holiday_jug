/**
 * HolidayJug - Stage 1 Pricing Engine (Section 6)
 * 
 * Rules:
 * P1: True margin on selling price, NOT mark-up:
 *     selling price = cost / (1 - margin)
 *     Example: hotel cost 100.00 at 13% gives 100.00 / (1 - 0.13) = 114.9425 -> 114.95 (rounded up to the penny).
 * P2: Default margin is 13% and applies to the hotel price only. Admin-configurable.
 * P3: Flights, transfers and other add-ons carry NO default margin on the website.
 *     Bundle total = hotel price (including margin) + flight price + add-on prices.
 * P4: Local taxes must be displayed as a separate line AND included in the total price,
 *     so the customer is never asked to pay anything at the hotel.
 * P5: Calculate prices on the SERVER ONLY. The supplier's net price must NEVER be sent to the browser!
 *     Use one function for every page: search results, hotel and flight pages, "from" prices, deals banner.
 *     Round UP to the penny (Math.ceil(val * 100) / 100).
 * P6: Store supplier cost, margin rate, selling price, currency rate used, and times fetched.
 */

export interface PricingConfig {
  defaultHotelMargin: number; // e.g. 0.13 for 13%
  inrToGbpRate: number;       // e.g. 0.0093 (1 GBP ≈ 107.5 INR)
  recordRetentionDays: number; // 30 days default (S4)
}

// In-memory runtime configuration with defaults, configurable via admin settings
let currentConfig: PricingConfig = {
  defaultHotelMargin: 0.13, // 13% true margin
  inrToGbpRate: 0.0093,     // 1 INR = 0.0093 GBP (~107.5 INR per GBP)
  recordRetentionDays: 30,
};

export function getPricingConfig(): PricingConfig {
  return { ...currentConfig };
}

export function updatePricingConfig(newConfig: Partial<PricingConfig>): PricingConfig {
  currentConfig = { ...currentConfig, ...newConfig };
  return { ...currentConfig };
}

/**
 * Rounds UP to the nearest penny (e.g. 114.9425 -> 114.95).
 */
export function roundUpPenny(amount: number): number {
  if (isNaN(amount) || !isFinite(amount)) return 0;
  return Math.ceil(amount * 100) / 100;
}

/**
 * Calculates selling price using true margin:
 * selling price = cost / (1 - margin)
 */
export function calculateSellingPriceWithMargin(cost: number, marginRate = currentConfig.defaultHotelMargin): number {
  if (cost <= 0) return 0;
  if (marginRate >= 1) throw new Error("Margin rate cannot be 100% or greater");
  const rawSellingPrice = cost / (1 - marginRate);
  return roundUpPenny(rawSellingPrice);
}

/**
 * Converts INR to GBP using current exchange rate and rounds up.
 */
export function convertInrToGbp(amountInInr: number, rate = currentConfig.inrToGbpRate): number {
  if (amountInInr <= 0) return 0;
  return roundUpPenny(amountInInr * rate);
}

export interface CalculateHotelQuoteInput {
  supplierNetCostInr?: number;
  supplierNetCostGbp?: number;
  localTaxGbp?: number;
  flightFareGbp?: number;
  transfersFareGbp?: number;
  marginRate?: number;
}

export interface ServerPricingCalculation {
  // SERVER-SIDE AUDIT FIELDS (Never send to customer browser!)
  supplierCostInr: number;
  supplierCostGbp: number;
  currencyRateUsed: number;
  currencyRateFetchedAt: string;
  marginRateUsed: number;
  hotelCostGbp: number;

  // CUSTOMER-FACING BREAKDOWN
  hotelSellingPriceGbp: number;  // Hotel price with 13% true margin
  localTaxGbp: number;           // Displayed as separate line, included in total (P4)
  flightPriceGbp: number;        // Zero margin (P3)
  transfersPriceGbp: number;     // Zero margin (P3)
  totalSellingPriceGbp: number;  // Sum of hotel + taxes + flights + transfers
  pricePerPersonGbp: number;     // For per-person display
}

/**
 * Single server-only calculation function used across all pages (P5).
 */
export function calculateQuoteOnServer(
  input: CalculateHotelQuoteInput,
  numAdults = 2
): ServerPricingCalculation {
  const marginRate = input.marginRate !== undefined ? input.marginRate : currentConfig.defaultHotelMargin;
  const inrRate = currentConfig.inrToGbpRate;
  const nowIso = new Date().toISOString();

  let supplierCostGbp = 0;
  let supplierCostInr = 0;

  if (input.supplierNetCostGbp !== undefined) {
    supplierCostGbp = input.supplierNetCostGbp;
    supplierCostInr = roundUpPenny(supplierCostGbp / inrRate);
  } else if (input.supplierNetCostInr !== undefined) {
    supplierCostInr = input.supplierNetCostInr;
    supplierCostGbp = convertInrToGbp(supplierCostInr, inrRate);
  }

  // Calculate Hotel selling price using true margin (P1 & P2)
  const hotelSellingPriceGbp = calculateSellingPriceWithMargin(supplierCostGbp, marginRate);

  // Local tax is separate line item, included in total (P4)
  const localTaxGbp = roundUpPenny(input.localTaxGbp || 0);

  // Flights & transfers have 0 margin on site (P3)
  const flightPriceGbp = roundUpPenny(input.flightFareGbp || 0);
  const transfersPriceGbp = roundUpPenny(input.transfersFareGbp || 0);

  // Total bundle
  const totalSellingPriceGbp = roundUpPenny(
    hotelSellingPriceGbp + localTaxGbp + flightPriceGbp + transfersPriceGbp
  );

  const totalPeople = Math.max(1, numAdults);
  const pricePerPersonGbp = roundUpPenny(totalSellingPriceGbp / totalPeople);

  return {
    supplierCostInr,
    supplierCostGbp,
    currencyRateUsed: inrRate,
    currencyRateFetchedAt: nowIso,
    marginRateUsed: marginRate,
    hotelCostGbp: supplierCostGbp,
    hotelSellingPriceGbp,
    localTaxGbp,
    flightPriceGbp,
    transfersPriceGbp,
    totalSellingPriceGbp,
    pricePerPersonGbp,
  };
}

export interface ClientPricing {
  hotelPrice: number;
  localTax: number;
  flightPrice: number;
  transfersPrice: number;
  totalPrice: number;
  pricePerPerson: number;
  currency: "GBP";
}

/**
 * Sanitizes pricing object before returning to client.
 * Strictly guarantees supplier net cost is NEVER exposed (P5).
 */
export function sanitizePricingForClient(calc: ServerPricingCalculation): ClientPricing {
  return {
    hotelPrice: calc.hotelSellingPriceGbp,
    localTax: calc.localTaxGbp,
    flightPrice: calc.flightPriceGbp,
    transfersPrice: calc.transfersPriceGbp,
    totalPrice: calc.totalSellingPriceGbp,
    pricePerPerson: calc.pricePerPersonGbp,
    currency: "GBP",
  };
}
