"use server";

import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { rsvpSchema } from "@/lib/validations/rsvp";

type RsvpActionState = {
  error?: string;
  success?: string;
};

export async function getRsvpsByEvent(eventId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("rsvps")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function submitRsvp(
  eventId: string,
  slug: string,
  _prevState: RsvpActionState,
  formData: FormData,
): Promise<RsvpActionState> {
  const rawInput = {
    guest_name: String(formData.get("guest_name") ?? ""),
    attendance: String(formData.get("attendance") ?? ""),
    pax_count: formData.get("pax_count"),
    wish_message: String(formData.get("wish_message") ?? ""),
  };

  const parsed = rsvpSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid RSVP input." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("rsvps").insert({
    event_id: eventId,
    ...parsed.data,
    wish_message: parsed.data.wish_message || null,
  });

  if (error) {
    Sentry.withScope((scope) => {
      scope.setTag("feature", "submit_rsvp");
      scope.setTag("slug", slug);
      scope.setExtra("event_id", eventId);
      scope.setExtra("db_error_code", error.code);
      scope.setExtra("db_error_message", error.message);
      Sentry.captureException(error);
    });
    return { error: "Failed to submit RSVP. Please try again." };
  }

  revalidatePath(`/w/${slug}`);
  revalidatePath("/");
  return { success: "Thank you. Your RSVP and wish have been received." };
}
