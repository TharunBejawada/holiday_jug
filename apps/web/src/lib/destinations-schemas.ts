import { z } from "zod";

export const countrySchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers and hyphens."),
  name: z.string().min(1).max(120),
  region: z.enum(["EUROPE", "MEDITERRANEAN", "MIDDLE_EAST", "INDIAN_OCEAN", "ASIA", "CARIBBEAN", "AMERICAS"]),
  flightTimeBand: z.enum(["UNDER_4H", "FOUR_TO_SIX_H", "SIX_TO_TEN_H", "TEN_PLUS_H"]),
  bestFor: z.array(z.enum(["FAMILIES", "COUPLES", "ADULTS_ONLY", "LUXURY", "ADVENTURE", "RELAXATION"])).default([]),
  priceFrom: z.number().min(0).nullable().optional(),
  cardImageUrl: z.string().url().optional().or(z.literal("")),
  heroImageUrl: z.string().url().optional().or(z.literal("")),
  heroDescription: z.string().default(""),
  whyVisitIntro: z.string().default(""),
  whyVisitHighlights: z.array(z.string().min(1)).default([]),
  thingsToDoContent: z.string().default(""),
  whenToGoContent: z.string().default(""),
  travelGuideContent: z.string().default(""),
  featuredOnOverview: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  seoTitle: z.string().max(70).optional().or(z.literal("")),
  seoDescription: z.string().max(170).optional().or(z.literal("")),
  seoKeywords: z.array(z.string()).default([]),
  holidayTypes: z
    .array(
      z.object({
        holidayTypeId: z.string(),
        description: z.string().optional().or(z.literal("")),
        sortOrder: z.number().int().default(0),
      })
    )
    .default([]),
});

export const placeSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers and hyphens."),
  name: z.string().min(1).max(120),
  country: z.string().min(1).max(120),
  region: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  priceFrom: z.number().min(0).nullable().optional(),
  heroImageUrl: z.string().url().optional().or(z.literal("")),
  sortOrder: z.number().int().default(0),
  countryId: z.string().nullable().optional(),
  seoTitle: z.string().max(70).optional().or(z.literal("")),
  seoDescription: z.string().max(170).optional().or(z.literal("")),
  seoKeywords: z.array(z.string()).default([]),
});

export const holidayTypeSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers and hyphens."),
  name: z.string().min(1).max(120),
  iconUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
});

export const faqSchema = z.object({
  category: z.string().min(1).max(60),
  countryId: z.string().nullable().optional(),
  question: z.string().min(1).max(300),
  answer: z.string().min(1),
  sortOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});
