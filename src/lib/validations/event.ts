import { z } from "zod";

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

export type EventInput = z.infer<typeof eventSchema>;
