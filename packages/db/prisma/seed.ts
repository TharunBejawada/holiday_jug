import { hash } from "bcryptjs";
import { prisma } from "../src/index";

async function main() {
  const adminPasswordHash = await hash("HolidayJug2026!", 12);

  await prisma.user.upsert({
    where: { email: "superadmin@holidayjug.com" },
    update: {},
    create: {
      email: "superadmin@holidayjug.com",
      name: "Super Admin",
      role: "ADMIN",
      status: "ACTIVE",
      passwordHash: adminPasswordHash,
      emailVerified: new Date(),
    },
  });

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

  const holidayTypesData = [
    {
      slug: "beach-escapes",
      name: "Beach Escapes",
      description: "Sun, sea and sand. Sun...",
      iconUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      sortOrder: 1,
      isPublished: true,
    },
    {
      slug: "all-inclusive",
      name: "All-Inclusive",
      description: "Relax with everything taken care of.",
      iconUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      sortOrder: 2,
      isPublished: true,
    },
    {
      slug: "family-holidays",
      name: "Family Holidays",
      description: "Fun-filled breaks for everyone.",
      iconUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80",
      sortOrder: 3,
      isPublished: true,
    },
    {
      slug: "luxury-getaways",
      name: "Luxury Getaways",
      description: "Beautiful stays and exceptional experiences.",
      iconUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      sortOrder: 4,
      isPublished: true,
    },
    {
      slug: "couple-getaways",
      name: "Couple Getaways",
      description: "Make memories together.",
      iconUrl: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80",
      sortOrder: 5,
      isPublished: true,
    },
    {
      slug: "last-minute-escapes",
      name: "Last-Minute Escapes",
      description: "Spontaneous holidays at great prices.",
      iconUrl: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=800&q=80",
      sortOrder: 6,
      isPublished: true,
    },
  ];

  for (const item of holidayTypesData) {
    await prisma.holidayType.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });
  }

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
