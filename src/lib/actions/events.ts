"use server";

import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { normalizeSlug } from "@/lib/utils/slug";
import { createEventSchema, eventSchema } from "@/lib/validations/event";

export type ActionState = {
  error?: string;
  success?: string;
};

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return null;
  }
  return data.user;
}

export async function getUserEvent() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", user.id)
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

export async function createEvent(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Please log in first." };
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
  const existing = await getUserEvent();
  if (existing) {
    return { error: "You already have one event for v1." };
  }

  const { error } = await supabase.from("events").insert({
    user_id: user.id,
    ...parsed.data,
    message: parsed.data.message || null,
  });

  if (error) {
    Sentry.withScope((scope) => {
      scope.setTag("feature", "create_event");
      scope.setTag("slug", parsed.data.slug);
      scope.setUser({ id: user.id });
      scope.setExtra("db_error_code", error.code);
      scope.setExtra("db_error_message", error.message);
      Sentry.captureException(error);
    });
    if (error.code === "23505") {
      if (error.message.includes("events_user_one_event_idx")) {
        return { error: "You already have one event for v1." };
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

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
