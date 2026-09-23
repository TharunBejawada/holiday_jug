import { z } from "zod";

export const packageSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(150)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers and hyphens."),
  title: z.string().min(1).max(200),
  destinationId: z.string().min(1, "Choose a place."),
  boardType: z.enum(["SELF_CATERING", "BED_AND_BREAKFAST", "HALF_BOARD", "FULL_BOARD", "ALL_INCLUSIVE"]),
  nights: z.number().int().positive(),
  basePriceGbp: z.number().positive(),
  originalPriceGbp: z.number().positive().nullable().optional(),
  departureAirport: z.string().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
  ratingOverride: z.number().min(0).max(5).nullable().optional(),
  reviewCountOverride: z.number().int().nonnegative().nullable().optional(),
});
