# HolidayJug Stage 1 — Complete Implementation Guide

> **A plain-English explanation of all features, APIs, datasets, formulas, and workflows implemented in HolidayJug.**

---

## 1. What is HolidayJug Stage 1? (The Core Idea)

HolidayJug is a modern, high-end travel website built for UK holidaymakers seeking luxury escapes, sun getaways, and city breaks.

### The Business & Booking Model (Section 1)
* **Phone-Assisted Booking**: In Stage 1, online checkout/credit card payment is **intentionally disabled**.
* Customers search for flights and hotels online, view live pricing, and receive a **unique 8-character Search ID** (for example: `HJ-8B2K9X`).
* The website guides customers with clear callouts:  
  **"Quote this ID when you call us on 0330 165 8879"**.
* A UK-based travel consultant answers the phone, enters the Search ID into the internal **Agent Tool (`/agent`)**, retrieves the exact quote and prices, verifies live availability with the supplier, and completes the booking over the phone.

---

## 2. All Features Implemented (What was done?)

### A. Homepage Experience (Figma Exact & Section 2/3)
1. **"Call for Hidden Prices" Modal (`CallForHiddenPricesModal.tsx`)**:
   * Exactly matches the Figma design with the UK sales number (`0330 165 8879`), opening hours (`Mon-Sun 8am - 10pm`), and exclusive phone-only offline rates badge.
   * Triggers automatically after a **6-second delay** or on **exit-intent** (when a user moves their mouse toward the browser address bar).
   * Remembers dismissal in `sessionStorage` so it never annoys the customer repeatedly.
2. **Top Announcement Bar & Inline Banner (`CallForHiddenPricesBanner.tsx`)**:
   * Prominent telephone banner across the top of every page and embedded within the homepage content.
3. **Hot Deals Scrolling Carousel (`HotDealsBanner.tsx`)**:
   * Replaced the old static deals section with an auto-advancing banner carousel (Section 3: H1, H2, H3).
   * Auto-advances every 5 seconds, pauses when hovered, supports touch swiping on mobile, and links directly to holiday quotes.
4. **Hero Search Engine (`HeroSection.tsx`)**:
   * Supports **"Holidays"** (Flights + Hotel) and **"Hotels Only"** (sets flight cost to £0).
   * 9 official UK departure airports (London Gatwick, Heathrow, Luton, Stansted, Manchester, Birmingham, Bristol, Edinburgh, Glasgow).
   * Comprehensive Travellers modal with individual adult counts and child age pickers (ages 1–17).
   * Filter rule: Only destinations with mapped hotel inventory appear in search options.
5. **Top Destinations Section (`TopDestinationsSection.tsx`)**:
   * Dynamic cards for Spain, Turkey, Greece, Dubai, Egypt, Mexico, USA, and Portugal with real calculated lead prices (`From £145 pp`, `From £516 pp`).
6. **Stays for Every Kind of Holiday (`StaysSection.tsx`)**:
   * Dynamic tabs (Beach, City Breaks, Family, Luxury, Wellness) displaying **real sandbox hotels** (Sheraton Dubai Creek, Grand Hyatt, Millennium Plaza, Radisson Blu, Al Habtoor Grand, etc.).
   * Displays real star ratings, hotel images, and real per-night calculated rates with true margins.
7. **Official Badges & Trust Signals (`Footer.tsx` & `Header.tsx`)**:
   * Official **ATOL Protected** and **IATA** certified badges.
   * Real `@holidayjug` social media links and sticky mobile click-to-call button.

---

### B. Server-Side Pricing Engine (Section 6)
* **True 13% Hotel Margin**:
  * Formula: $\text{Selling Price} = \frac{\text{Net Cost}}{1 - 0.13}$ (rounded UP to the penny).
  * Example: Net hotel cost of £100.00 produces a selling price of £114.95 (not £113.00), guaranteeing an exact 13% profit on total sales.
* **0% Flight Markup**:
  * Flight fares are passed to the customer at exact net cost with zero margin added.
* **Itemized Local Hotel Taxes**:
  * Local tourist taxes and municipality fees are itemized separately for transparency and included in the final customer total.
* **Client Data Sanitization**:
  * The server strips all wholesale net costs (INR/GBP), supplier exchange rates, and internal profit margins before sending data to the browser. Customers only ever see the final transparent retail price.

---

### C. 8-Character Search ID & UK Audit Store (Section 7)
* **Unguessable 8-Character IDs**:
  * Cryptographically generated using a 29-character unambiguous alphabet that **excludes confusing letters** (`0, O, 1, I, L`) so customers can easily read it over the phone without mistakes (e.g. `HJ-8B2K9X`).
* **UK Europe/London Timestamps**:
  * All search quotes store timestamps in British Time (`Europe/London`, e.g., `28 Oct 2026, 14:15 GMT/BST`).
* **30-Day Retention**:
  * Search sessions are securely stored for 30 days with full itinerary details, room selections, net costs, and calculated prices.

---

### D. Internal Consultant Agent Tool (`/agent`) (Section 8)
* Accessible at `http://localhost:3000/agent`.
* **PIN Authentication**: Secure login with PIN `2026`.
* **Search ID Lookup**:
  * Enter any customer Search ID to retrieve the entire quotation.
  * Shows creation timestamp and human-friendly time elapsed (e.g., `"Quoted 4 minutes ago"`).
  * Displays itemized breakdown: Flight cost, Net Hotel cost in INR and GBP, 13% Margin, Local Hotel Taxes, and Customer Total.
* **"Check Live Price" Supplier Re-check**:
  * One-click button that queries the supplier in real-time, displays live rate vs. customer quoted rate, highlights the difference, and provides agent advisory instructions.

---

### E. Dynamic Admin Dashboard & Hotels Explorer (`/admin`)
1. **Control Centre Dashboard (`/admin`)**:
   * **Real-time API Credit Gauge**: Shows allocated credits (50,000), credits remaining, credits used, and credits saved.
   * **Customer Quotes Queue Table**: Live view of every generated Search ID, UK timestamp, destination, quote total (£), and 13% margin (£).
   * **Sandbox Hotel Clusters**: Instant breakdown of mapped hotels across Dubai, Los Angeles, New Delhi, Jaipur, Bengaluru, Mumbai, Chennai, Kolkata, and Luxor.
2. **Sandbox Hotels Explorer (`/admin/hotels`)**:
   * Interactive directory of all **1,842 hotels** extracted from `supported hotels on sandbox.xlsx`.
   * Search by hotel name, GRN code, address, or city filter with **0 API credits consumed**.
   * One-click copy for hotel codes and controlled live rate checking.
3. **Quotes & Bookings Management (`/admin/bookings`)**:
   * Full desk showing customer phone inquiries with direct links to inspect them in `/agent`.
4. **Settings Panel (`/admin/settings`)**:
   * Live adjustment of the default hotel margin (13%), INR to GBP exchange rate, 30-day retention, and Hot Deals carousel slides.

---

## 3. What Was Used? (APIs, Datasets, and Documentation)

| Component | Source / Resource Used | How It Was Used |
| :--- | :--- | :--- |
| **Hotel Inventory API** | GRN Connect V3 Sandbox API (`api-sandbox.grnconnect.com/api/v3`) | Live availability queries, hotel rates, and room options. |
| **API Authentication** | API Key `653e6ee232c8d1bc58a91d1d252b5e78` | Authenticates requests using `api-key`, `Content-Type: application/json`, and `Accept: application/json` headers. |
| **Sandbox Hotels File** | `supported hotels on sandbox.xlsx` | 1,842 verified sandbox hotels extracted and indexed locally (`sandbox-hotels-index.json`). |
| **Static Data CDN** | `cdn.grnconnect.com/static-assets/static-data/new-codes/` | Reference codes for cities, hotels, and facility structures. |
| **API Documentation** | `cdn.grnconnect.com/static-assets/documentation/latest/` | Endpoint specifications for `/credit-limit`, `/cities`, `/hotels`, and `/hotels/availability`. |
| **Postman Collection** | `GRN Connect.postman_collection.json` | Sample payloads, headers, parameters, and response structures. |
| **Design Specifications** | `Holiday Jug Home page with Pop Up.pdf` | Figma layout, typography, colors (#1D1248, #F7941D), banner layouts, and modal designs. |
| **Requirement Rules** | `HolidayJug_Stage1_Developer_Requirements.pdf` | Enforces the 13% margin formula, unguessable IDs, UK timezone audit, zero flight markup, and phone booking flow. |

---

## 4. How Data & Caching Work (Simple Summary)

To make the platform fast while respecting API limits:
1. **Search Availability**:
   * Runs **LIVE in real-time** on every customer search and agent re-check. No cached stale rates.
2. **Hotel Browsing & Local Search**:
   * All **1,842 sandbox hotels** are stored in a local JSON index. Admins and customers can browse, filter, and search hotels instantly using **0 API credits**.
3. **Static Reference Feeds (Cities & Hotel Lists)**:
   * City and country master data are cached for **24 hours** to prevent redundant calls.
4. **Admin Telemetry**:
   * Dashboard statistics are cached on the server for **15 seconds** so frequent page reloads do not burn credits.

---

## 5. File & Code Map (Where is everything?)

### Core Business Logic (`apps/web/src/lib/`)
* `pricing.ts`: Server pricing engine enforcing 13% true margin, zero flight margin, local tax separation, and data sanitization.
* `search-id.ts`: 8-character unguessable Search ID generator, UK time formatters, and 30-day quote audit store.
* `destinations-master.ts`: Master destination repository (Appendix A: core + long haul, aliases, 9 UK airports).
* `grn-client.ts`: GRN Connect V3 client, live search availability engine, and credit telemetry.
* `hot-deals-store.ts`: Central hot deals slide storage for the homepage carousel.
* `data/sandbox-hotels-index.json`: Extracted index of 1,842 sandbox hotels across 9 global clusters.

### User Interface Components (`apps/web/src/components/`)
* `homepage/HeroSection.tsx`: Homepage search bar with Holidays/Hotels toggle, UK departure airports, and room/child age selector.
* `homepage/HotDealsBanner.tsx`: 5-second auto-advancing Hot Deals carousel banner.
* `homepage/TopDestinationsSection.tsx`: Dynamic destination cards with calculated lead prices.
* `homepage/StaysSection.tsx`: Dynamic stays across 5 categories featuring real sandbox hotels and calculated rates.
* `CallForHiddenPricesModal.tsx`: Exit-intent & 6s timed modal with 1-visit dismissal.
* `CallForHiddenPricesBanner.tsx`: Top header announcement bar and inline banners.

### Public Pages & Consultant Tool (`apps/web/src/app/`)
* `(marketing)/page.tsx`: The unified homepage assembling all components.
* `(marketing)/search/page.tsx`: Search results displaying copyable Search IDs, UK timestamp badges, hotel cards, and room modal.
* `(marketing)/agent/page.tsx`: Internal travel consultant tool with PIN `2026`, Search ID lookup, and live supplier re-check.

### Admin Dashboard (`apps/web/src/app/admin/`)
* `(dashboard)/page.tsx`: Dynamic dashboard displaying real-time API credit telemetry, quote volume, margin, and recent quote queue.
* `(dashboard)/hotels/page.tsx`: Sandbox Hotels Explorer for browsing and searching all 1,842 hotels.
* `(dashboard)/bookings/page.tsx`: Phone booking inquiries desk.
* `(dashboard)/settings/page.tsx`: Settings panel for adjusting margin rates, exchange rates, and Hot Deals slides.

---

## 6. How to Test Everything (Quick Step-by-Step)

1. **Homepage Search**:
   * Visit `http://localhost:3000`.
   * Try searching with **"Holidays"** (e.g., London Gatwick to Dubai) or **"Hotels Only"**.
   * Wait 6 seconds or move your cursor toward the top of the browser to see the **"Call for Hidden Prices"** modal.
2. **Search Results & Search ID**:
   * Submit the search to land on `http://localhost:3000/search`.
   * Observe the 8-character **Search ID badge** (e.g. `HJ-8B2K9X`) and copy it.
   * Notice the UK timestamp: `"Price checked at ... UK, subject to availability"`.
3. **Internal Agent Tool**:
   * Open `http://localhost:3000/agent` in a new tab.
   * Enter PIN `2026` and paste your copied Search ID.
   * View the customer search breakdown, profit margin, net supplier cost, and click **"Check Live Price"** to test live supplier re-checks.
4. **Admin Dashboard & Hotels**:
   * Visit `http://localhost:3000/admin` to see live API credit telemetry, quote inquiries, and hotel cluster cards.
   * Open `http://localhost:3000/admin/hotels` to browse and search the 1,842 sandbox hotels.
