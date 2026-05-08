"use server";

import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearOwnerEmailCookie,
  getCurrentOwnerEmail,
  setOwnerEmailCookie,
  validateOwnerEmail,
} from "@/lib/owner-session";
import { createClient } from "@/lib/supabase/server";
import { normalizeSlug } from "@/lib/utils/slug";
import { createEventSchema, eventSchema } from "@/lib/validations/event";

export type ActionState = {
  error?: string;
  success?: string;
};

export async function getOwnerEvent(ownerEmail?: string | null) {
  const resolvedOwnerEmail = ownerEmail ?? (await getCurrentOwnerEmail());
  if (!resolvedOwnerEmail) {
    return null;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("owner_email", resolvedOwnerEmail)
    .limit(1)
    .maybeSingle();

  return data;
}

export async function getEventBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("id,slug,couple_names,wedding_date,venue,message,created_at")
    .eq("slug", slug)
    .maybeSingle();

  return data;
}

export async function continueWithEmail(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const rawEmail = String(formData.get("email") ?? "");
  const parsed = validateOwnerEmail(rawEmail);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please enter a valid email." };
  }

  await setOwnerEmailCookie(parsed.data);
  redirect("/");
}

export async function createEvent(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ownerEmail = await getCurrentOwnerEmail();
  if (!ownerEmail) {
    return { error: "Please enter your email first." };
  }

  const rawFormInput = {
    bride_name: String(formData.get("bride_name") ?? ""),
    groom_name: String(formData.get("groom_name") ?? ""),
    wedding_date: String(formData.get("wedding_date") ?? ""),
    venue: String(formData.get("venue") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const parsedForm = createEventSchema.safeParse(rawFormInput);
  if (!parsedForm.success) {
    return { error: parsedForm.error.issues[0]?.message ?? "Invalid event input." };
  }

  const coupleNames = `${parsedForm.data.bride_name} & ${parsedForm.data.groom_name}`;
  const generatedSlug = normalizeSlug(
    `${parsedForm.data.bride_name} ${parsedForm.data.groom_name}`,
  );

  if (!generatedSlug) {
    return { error: "We could not generate a valid RSVP link from those names." };
  }

  const parsed = eventSchema.safeParse({
    couple_names: coupleNames,
    wedding_date: parsedForm.data.wedding_date,
    venue: parsedForm.data.venue,
    slug: generatedSlug,
    message: parsedForm.data.message,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid event input." };
  }

  const supabase = await createClient();
  const existing = await getOwnerEvent(ownerEmail);
  if (existing) {
    return { error: "This email workspace already has one event for v1." };
  }

  const { error } = await supabase.from("events").insert({
    owner_email: ownerEmail,
    ...parsed.data,
    message: parsed.data.message || null,
  });

  if (error) {
    Sentry.withScope((scope) => {
      scope.setTag("feature", "create_event");
      scope.setTag("slug", parsed.data.slug);
      scope.setExtra("db_error_code", error.code);
      scope.setExtra("db_error_message", error.message);
      Sentry.captureException(error);
    });
    if (error.code === "23505") {
      if (error.message.includes("events_owner_email_one_event_idx")) {
        return { error: "This email workspace already has one event for v1." };
      }
      return {
        error:
          "A similar RSVP link already exists. Try using a middle name or a different spelling.",
      };
    }
    return { error: "Failed to create event. Please try again." };
  }

  revalidatePath("/");
  return { success: "Wedding page created successfully." };
}

export async function clearOwnerSession() {
  await clearOwnerEmailCookie();
  revalidatePath("/");
  redirect("/");
}
