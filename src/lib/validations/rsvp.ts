import { z } from "zod";

export const rsvpSchema = z.object({
  guest_name: z.string().trim().min(2, "Guest name must be at least 2 characters"),
  attendance: z.enum(["attending", "not_attending", "maybe"]),
  pax_count: z.coerce.number().min(0, "Minimum 0").max(10, "Maximum 10"),
  wish_message: z
    .string()
    .trim()
    .max(500, "Wish message must be 500 characters or less")
    .optional()
    .or(z.literal("")),
});

export type RsvpInput = z.infer<typeof rsvpSchema>;
