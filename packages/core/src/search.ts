import { z } from "zod";
import { prisma } from "@holiday-jug/db";

export const searchPackagesSchema = z.object({
  destination: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  nights: z.coerce.number().int().positive().optional(),
  departAfter: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(50).default(20),
});

export type SearchPackagesInput = z.infer<typeof searchPackagesSchema>;

export async function searchPackages(input: SearchPackagesInput) {
  const { destination, minPrice, maxPrice, nights, departAfter, page, pageSize } = input;

  const where = {
    isActive: true,
    ...(destination
      ? {
        destination: {
          OR: [
            { slug: destination },
            { name: { contains: destination, mode: "insensitive" as const } },
          ],
        },
      }
      : {}),
    ...(nights ? { nights } : {}),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? {
        basePriceGbp: {
          ...(minPrice !== undefined ? { gte: minPrice } : {}),
          ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
        },
      }
      : {}),
    ...(departAfter
      ? { departures: { some: { departDate: { gte: departAfter } } } }
      : {}),
  };

  try {
    const [items, total] = await Promise.all([
      prisma.package.findMany({
        where,
        include: { destination: true, hotel: true, departures: { take: 3, orderBy: { departDate: "asc" } } },
        orderBy: { basePriceGbp: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.package.count({ where }),
    ]);

    return { items, total, page, pageSize };
  } catch {
    // Database connection or query failed - return empty result gracefully
    return { items: [], total: 0, page, pageSize };
  }
}

