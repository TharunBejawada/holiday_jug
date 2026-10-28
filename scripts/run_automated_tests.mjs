// Comprehensive Automated Test Suite for HolidayJug Search & Availability
const BASE_URL = "http://localhost:3000";

async function postJson(endpoint, data) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return { status: res.status, json: await res.json() };
}

async function getJson(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  return { status: res.status, json: await res.json() };
}

const results = [];

function assert(description, condition, details = "") {
  if (condition) {
    results.push({ description, status: "PASS", details });
    console.log(`[PASS] ${description}`);
  } else {
    results.push({ description, status: "FAIL", details });
    console.error(`[FAIL] ${description} - ${details}`);
  }
}

async function runAllTests() {
  console.log("=================================================");
  console.log("  RUNNING HOLIDAYJUG STAGE 1 VERIFICATION TESTS  ");
  console.log("=================================================\n");

  let generatedSearchId = "";

  // -----------------------------------------------------------------
  // TEST 1: Travel from London to Delhi (Holidays Flight + Hotel)
  // -----------------------------------------------------------------
  console.log("--- TEST 1: Travel from London to Delhi (Flight + Hotel) ---");
  try {
    const res = await postJson("/api/search", {
      destination: "delhi",
      departureAirport: "LGW",
      type: "holidays",
      checkIn: "2026-11-15",
      checkOut: "2026-11-22",
      adults: 2,
    });

    assert("HTTP Status is 200", res.status === 200, `Got ${res.status}`);
    assert("Response success is true", res.json.success === true);
    assert("Destination is Delhi", res.json.searchDetails.destination === "Delhi");
    assert("Country is India", res.json.searchDetails.country === "India");
    assert("Departure Airport is LGW", res.json.searchDetails.departureAirport === "LGW");
    assert("isHotelsOnly is false", res.json.searchDetails.isHotelsOnly === false);
    assert("Hotels array returned", Array.isArray(res.json.hotels) && res.json.hotels.length > 0);

    const hotels = res.json.hotels || [];
    generatedSearchId = res.json.searchId;
    assert("Search ID generated (8-char format)", typeof generatedSearchId === "string" && generatedSearchId.length === 8);

    // Verify all hotels are in Delhi, India and NOT Dubai
    const hasDubaiHotel = hotels.some(h => 
      h.hotelName.toLowerCase().includes("dubai") || 
      h.city.toLowerCase().includes("dubai") || 
      h.country.toLowerCase().includes("united arab emirates")
    );
    assert("NO Dubai hotels returned for Delhi search", !hasDubaiHotel, "Found Dubai hotel in Delhi results");

    const delhiHotels = hotels.filter(h => h.city.includes("Delhi") && h.country === "India");
    assert(`All ${hotels.length} hotels are in New Delhi and NCR, India`, delhiHotels.length === hotels.length);

    // Verify flight price included
    const leadHotel = hotels[0];
    assert("Flight price included (£120)", leadHotel.leadPricing.flightPrice === 120);
    assert("Total price includes flight + hotel + tax", leadHotel.leadPricing.totalPrice > leadHotel.leadPricing.hotelPrice);

    console.log(`  Sample Delhi Hotel: "${leadHotel.hotelName}"`);
    console.log(`  Location: "${leadHotel.address}, ${leadHotel.city}, ${leadHotel.country}"`);
    console.log(`  Quote: £${leadHotel.leadPricing.totalPrice.toFixed(2)} (Flight: £${leadHotel.leadPricing.flightPrice}, Hotel: £${leadHotel.leadPricing.hotelPrice.toFixed(2)}, Tax: £${leadHotel.leadPricing.localTax.toFixed(2)})`);
  } catch (err) {
    assert("Test 1 executed without exception", false, err.message);
  }

  // -----------------------------------------------------------------
  // TEST 2: Travel to Delhi (Hotels Only)
  // -----------------------------------------------------------------
  console.log("\n--- TEST 2: Delhi Search (Hotels Only) ---");
  try {
    const res = await postJson("/api/search", {
      destination: "delhi",
      departureAirport: "",
      type: "hotels",
      checkIn: "2026-11-15",
      checkOut: "2026-11-22",
      adults: 2,
    });

    assert("HTTP Status is 200", res.status === 200, `Got ${res.status}`);
    assert("isHotelsOnly is true", res.json.searchDetails.isHotelsOnly === true);
    assert("Departure Airport is empty string", res.json.searchDetails.departureAirport === "");
    
    const hotels = res.json.hotels || [];
    assert("Hotels returned", hotels.length > 0);
    
    const leadHotel = hotels[0];
    assert("Flight price is £0.00 for Hotels Only", leadHotel.leadPricing.flightPrice === 0);
    const expectedTotal = Number((leadHotel.leadPricing.hotelPrice + leadHotel.leadPricing.localTax).toFixed(2));
    assert("Total price is exactly Hotel + Local Tax (£0 flight markup)", Math.abs(leadHotel.leadPricing.totalPrice - expectedTotal) < 0.05);

    const hasDubaiHotel = hotels.some(h => h.hotelName.toLowerCase().includes("dubai") || h.city.toLowerCase().includes("dubai"));
    assert("NO Dubai hotels returned for Hotels Only Delhi search", !hasDubaiHotel);

    console.log(`  Hotels Only Sample: "${leadHotel.hotelName}"`);
    console.log(`  Quote: £${leadHotel.leadPricing.totalPrice.toFixed(2)} (Hotel: £${leadHotel.leadPricing.hotelPrice.toFixed(2)}, Tax: £${leadHotel.leadPricing.localTax.toFixed(2)}, Flight: £${leadHotel.leadPricing.flightPrice})`);
  } catch (err) {
    assert("Test 2 executed without exception", false, err.message);
  }

  // -----------------------------------------------------------------
  // TEST 3: Search Jaipur (India)
  // -----------------------------------------------------------------
  console.log("\n--- TEST 3: Jaipur Search (India) ---");
  try {
    const res = await postJson("/api/search", {
      destination: "jaipur",
      departureAirport: "LGW",
      type: "holidays",
      checkIn: "2026-11-15",
      checkOut: "2026-11-22",
      adults: 2,
    });

    assert("Destination is Jaipur", res.json.searchDetails.destination === "Jaipur");
    assert("Country is India", res.json.searchDetails.country === "India");
    const hotels = res.json.hotels || [];
    assert("Hotels in Jaipur returned", hotels.length > 0 && hotels.every(h => h.city === "Jaipur" && h.country === "India"));
    const hasDubai = hotels.some(h => h.city.toLowerCase().includes("dubai"));
    assert("NO Dubai hotels in Jaipur search", !hasDubai);
    console.log(`  Sample Jaipur Hotel: "${hotels[0]?.hotelName}" (${hotels[0]?.address})`);
  } catch (err) {
    assert("Test 3 executed without exception", false, err.message);
  }

  // -----------------------------------------------------------------
  // TEST 4: Search Los Angeles (United States)
  // -----------------------------------------------------------------
  console.log("\n--- TEST 4: Los Angeles Search (United States) ---");
  try {
    const res = await postJson("/api/search", {
      destination: "los-angeles",
      departureAirport: "LHR",
      type: "holidays",
      checkIn: "2026-11-15",
      checkOut: "2026-11-22",
      adults: 2,
    });

    assert("Destination is Los Angeles", res.json.searchDetails.destination === "Los Angeles");
    assert("Country is United States", res.json.searchDetails.country === "United States");
    const hotels = res.json.hotels || [];
    assert("Hotels in Los Angeles returned", hotels.length > 0 && hotels.every(h => h.city.includes("Los Angeles") && h.country === "United States"));
    const hasDubai = hotels.some(h => h.city.toLowerCase().includes("dubai"));
    assert("NO Dubai hotels in Los Angeles search", !hasDubai);
    console.log(`  Sample LA Hotel: "${hotels[0]?.hotelName}" (${hotels[0]?.address})`);
  } catch (err) {
    assert("Test 4 executed without exception", false, err.message);
  }

  // -----------------------------------------------------------------
  // TEST 5: Search Luxor (Egypt)
  // -----------------------------------------------------------------
  console.log("\n--- TEST 5: Luxor Search (Egypt) ---");
  try {
    const res = await postJson("/api/search", {
      destination: "luxor",
      departureAirport: "LGW",
      type: "holidays",
      checkIn: "2026-11-15",
      checkOut: "2026-11-22",
      adults: 2,
    });

    assert("Destination is Luxor", res.json.searchDetails.destination === "Luxor");
    assert("Country is Egypt", res.json.searchDetails.country === "Egypt");
    const hotels = res.json.hotels || [];
    assert("Hotels in Luxor returned", hotels.length > 0 && hotels.every(h => h.city === "Luxor" && h.country === "Egypt"));
    console.log(`  Sample Luxor Hotel: "${hotels[0]?.hotelName}" (${hotels[0]?.address})`);
  } catch (err) {
    assert("Test 5 executed without exception", false, err.message);
  }

  // -----------------------------------------------------------------
  // TEST 6: Search Dubai (United Arab Emirates)
  // -----------------------------------------------------------------
  console.log("\n--- TEST 6: Dubai Search (UAE) ---");
  try {
    const res = await postJson("/api/search", {
      destination: "dubai",
      departureAirport: "LGW",
      type: "holidays",
      checkIn: "2026-11-15",
      checkOut: "2026-11-22",
      adults: 2,
    });

    assert("Destination is Dubai", res.json.searchDetails.destination === "Dubai");
    assert("Country is United Arab Emirates", res.json.searchDetails.country === "United Arab Emirates");
    const hotels = res.json.hotels || [];
    assert("Legitimate Dubai hotels returned", hotels.length > 0 && hotels.every(h => h.city === "Dubai" && h.country === "United Arab Emirates"));
    console.log(`  Sample Dubai Hotel: "${hotels[0]?.hotelName}" (${hotels[0]?.address})`);
  } catch (err) {
    assert("Test 6 executed without exception", false, err.message);
  }

  // -----------------------------------------------------------------
  // TEST 7: Search Tenerife (Canary Islands / Spain)
  // -----------------------------------------------------------------
  console.log("\n--- TEST 7: Tenerife Search (Canary Islands) ---");
  try {
    const res = await postJson("/api/search", {
      destination: "tenerife",
      departureAirport: "LGW",
      type: "holidays",
      checkIn: "2026-11-15",
      checkOut: "2026-11-22",
      adults: 2,
    });

    assert("Destination is Tenerife", res.json.searchDetails.destination === "Tenerife");
    assert("Country is Canary Islands", res.json.searchDetails.country === "Canary Islands");
    const hotels = res.json.hotels || [];
    assert("Tenerife hotels returned", hotels.length > 0 && hotels.every(h => h.city === "Tenerife" && h.country === "Canary Islands"));
    const hasDubai = hotels.some(h => h.city.toLowerCase().includes("dubai"));
    assert("NO Dubai hotels in Tenerife search", !hasDubai);
    console.log(`  Sample Tenerife Hotel: "${hotels[0]?.hotelName}" (${hotels[0]?.address})`);
  } catch (err) {
    assert("Test 7 executed without exception", false, err.message);
  }

  // -----------------------------------------------------------------
  // TEST 8: Agent Tool Search ID Lookup & Audit Retrieval
  // -----------------------------------------------------------------
  console.log("\n--- TEST 8: Agent Tool Search ID Lookup (/api/agent/lookup) ---");
  try {
    if (!generatedSearchId) {
      assert("Search ID was generated in Test 1", false, "No Search ID available");
    } else {
      const res = await getJson(`/api/agent/lookup?searchId=${generatedSearchId}`);
      assert("HTTP Status is 200", res.status === 200, `Got ${res.status}`);
      assert("Lookup success is true", res.json.success === true);
      assert("Search ID matches", res.json.record?.searchId === generatedSearchId);
      assert("Audit has customerSearch for Delhi", res.json.record?.customerSearch?.destination === "delhi");
      assert("Internal pricing audit includes marginRateUsed", typeof res.json.record?.internalAudit?.marginRateUsed === "string");
      assert("UK formatted timestamp present in record.timestamps", typeof res.json.record?.timestamps?.searchGeneratedAtUk === "string");
      console.log(`  Lookup verified: Search ID ${generatedSearchId} -> Destination: ${res.json.record?.customerSearch?.destinationName}, Quote Total: £${res.json.record?.customerPricing?.totalPrice}`);
    }
  } catch (err) {
    assert("Test 8 executed without exception", false, err.message);
  }

  // -----------------------------------------------------------------
  // SUMMARY
  // -----------------------------------------------------------------
  const passCount = results.filter(r => r.status === "PASS").length;
  const failCount = results.filter(r => r.status === "FAIL").length;
  console.log("\n=================================================");
  console.log(`  TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED  `);
  console.log("=================================================");

  // Write results JSON for reporting
  const fs = await import("fs");
  fs.writeFileSync("test_results.json", JSON.stringify({ passCount, failCount, results }, null, 2));
}

runAllTests().catch(err => {
  console.error("FATAL ERROR IN TEST SUITE:", err);
  process.exit(1);
});
