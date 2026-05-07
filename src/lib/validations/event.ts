import { z } from "zod";

function normalizeHumanName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

const humanNameSchema = z
  .string()
  .trim()
  .transform(normalizeHumanName)
  .refine((value) => value.length >= 2, "Name must be at least 2 characters")
  .refine((value) => value.length <= 60, "Name must be 60 characters or less")
  .refine(
    (value) => /^[\p{L}\s'.-]+$/u.test(value),
    "Use letters, spaces, apostrophes, hyphens, or periods only.",
  );

export const createEventSchema = z.object({
  bride_name: humanNameSchema,
  groom_name: humanNameSchema,
  wedding_date: z.string().min(1, "Wedding date is required"),
  venue: z.string().trim().min(3, "Venue must be at least 3 characters"),
  message: z
    .string()
    .trim()
    .max(500, "Message must be 500 characters or less")
    .optional()
    .or(z.literal("")),
});

export const eventSchema = z.object({
  couple_names: z
    .string()
    .trim()
    .min(3, "Couple names must be at least 3 characters"),
  wedding_date: z.string().min(1, "Wedding date is required"),
  venue: z.string().trim().min(3, "Venue must be at least 3 characters"),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case"),
  message: z
    .string()
    .trim()
    .max(500, "Message must be 500 characters or less")
    .optional()
    .or(z.literal("")),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export { normalizeHumanName };
