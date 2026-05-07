"use server";

import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/actions/events";
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

function normalizeGuestName(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

export async function submitRsvp(
  eventId: string,
  slug: string,
  _prevState: RsvpActionState,
  formData: FormData,
): Promise<RsvpActionState> {
  const honeypot = String(formData.get("company_website") ?? "").trim();
  const renderedAtRaw = String(formData.get("form_rendered_at") ?? "").trim();

  if (honeypot.length > 0) {
    Sentry.withScope((scope) => {
      scope.setLevel("warning");
      scope.setTag("feature", "submit_rsvp");
      scope.setTag("slug", slug);
      scope.setExtra("event_id", eventId);
      scope.setExtra("reason", "honeypot_triggered");
      Sentry.captureMessage("Suspicious RSVP rejected");
    });
    return { success: "Thank you. Your RSVP and wish have been received." };
  }

  const renderedAt = Number(renderedAtRaw);
  if (!Number.isFinite(renderedAt)) {
    Sentry.withScope((scope) => {
      scope.setLevel("warning");
      scope.setTag("feature", "submit_rsvp");
      scope.setTag("slug", slug);
      scope.setExtra("event_id", eventId);
      scope.setExtra("reason", "missing_render_timestamp");
      Sentry.captureMessage("RSVP rejected due to missing timestamp");
    });
    return { success: "Thank you. Your RSVP and wish have been received." };
  }

  const elapsedMs = Date.now() - renderedAt;
  if (elapsedMs >= 0 && elapsedMs < 2000) {
    Sentry.withScope((scope) => {
      scope.setLevel("warning");
      scope.setTag("feature", "submit_rsvp");
      scope.setTag("slug", slug);
      scope.setExtra("event_id", eventId);
      scope.setExtra("reason", "submitted_too_fast");
      scope.setExtra("elapsed_ms", elapsedMs);
      Sentry.captureMessage("Fast RSVP submission rejected");
    });
    return { error: "Please wait a moment and try again." };
  }

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
  const normalizedGuestName = normalizeGuestName(parsed.data.guest_name);
  const { data: existingRows, error: existingError } = await supabase
    .from("rsvps")
    .select("guest_name")
    .eq("event_id", eventId);

  if (existingError) {
    Sentry.withScope((scope) => {
      scope.setTag("feature", "submit_rsvp");
      scope.setTag("slug", slug);
      scope.setExtra("event_id", eventId);
      scope.setExtra("db_error_code", existingError.code);
      scope.setExtra("db_error_message", existingError.message);
      Sentry.captureException(existingError);
    });
    return { error: "Failed to submit RSVP. Please try again." };
  }

  const isDuplicate = (existingRows ?? []).some(
    (row) => normalizeGuestName(row.guest_name) === normalizedGuestName,
  );
  if (isDuplicate) {
    Sentry.withScope((scope) => {
      scope.setLevel("warning");
      scope.setTag("feature", "submit_rsvp");
      scope.setTag("slug", slug);
      scope.setExtra("event_id", eventId);
      scope.setExtra("reason", "duplicate_guest_name");
      Sentry.captureMessage("Duplicate RSVP attempt rejected");
    });
    return {
      error:
        "Looks like you've already RSVP'd. If this is a mistake, please contact the couple.",
    };
  }

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

export async function deleteRsvp(rsvpId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return;
  }

  const supabase = await createClient();
  const { data: rsvp, error: rsvpError } = await supabase
    .from("rsvps")
    .select("id,event_id")
    .eq("id", rsvpId)
    .maybeSingle();

  if (rsvpError || !rsvp) {
    if (rsvpError) {
      Sentry.withScope((scope) => {
        scope.setTag("feature", "delete_rsvp");
        scope.setUser({ id: user.id });
        scope.setExtra("rsvp_id", rsvpId);
        scope.setExtra("db_error_code", rsvpError.code);
        scope.setExtra("db_error_message", rsvpError.message);
        Sentry.captureException(rsvpError);
      });
    }
    return;
  }

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id,slug,user_id")
    .eq("id", rsvp.event_id)
    .maybeSingle();

  if (eventError || !event || event.user_id !== user.id) {
    if (eventError) {
      Sentry.withScope((scope) => {
        scope.setTag("feature", "delete_rsvp");
        scope.setUser({ id: user.id });
        scope.setExtra("rsvp_id", rsvpId);
        scope.setExtra("db_error_code", eventError.code);
        scope.setExtra("db_error_message", eventError.message);
        Sentry.captureException(eventError);
      });
    }
    return;
  }

  const { error: deleteError } = await supabase.from("rsvps").delete().eq("id", rsvpId);
  if (deleteError) {
    Sentry.withScope((scope) => {
      scope.setTag("feature", "delete_rsvp");
      scope.setTag("slug", event.slug);
      scope.setUser({ id: user.id });
      scope.setExtra("rsvp_id", rsvpId);
      scope.setExtra("db_error_code", deleteError.code);
      scope.setExtra("db_error_message", deleteError.message);
      Sentry.captureException(deleteError);
    });
    return;
  }

  revalidatePath("/");
  revalidatePath(`/w/${event.slug}`);
}
