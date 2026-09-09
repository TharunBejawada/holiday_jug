import { prisma } from "../src/index";

async function main() {
  const destination = await prisma.destination.upsert({
    where: { slug: "benidorm-spain" },
    update: {},
    create: {
      slug: "benidorm-spain",
      name: "Benidorm",
      country: "Spain",
      region: "Costa Blanca",
      description: "Beaches, sun and nightlife on the Costa Blanca.",
    },
  });

  const hotel = await prisma.hotel.upsert({
    where: { id: "seed-hotel-levante" },
    update: {},
    create: {
      id: "seed-hotel-levante",
      name: "Levante Beach Hotel",
      starRating: 4,
      amenities: ["Pool", "Wifi", "Sea view"],
    },
  });

  const pkg = await prisma.package.upsert({
    where: { slug: "benidorm-levante-7nights" },
    update: {},
    create: {
      slug: "benidorm-levante-7nights",
      title: "7 Nights in Benidorm — Levante Beach Hotel",
      destinationId: destination.id,
      hotelId: hotel.id,
      nights: 7,
      basePriceGbp: 429.0,
      boardType: "ALL_INCLUSIVE",
      departureAirport: "LGW",
    },
  });

  await prisma.departure.upsert({
    where: { id: "seed-departure-1" },
    update: {},
    create: {
      id: "seed-departure-1",
      packageId: pkg.id,
      departDate: new Date("2026-06-10"),
      returnDate: new Date("2026-06-17"),
      priceGbp: 429.0,
      seatsTotal: 40,
    },
  });

  console.log("Seed complete");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
