"use server";

import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { normalizeSlug } from "@/lib/utils/slug";
import { eventSchema } from "@/lib/validations/event";

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
    .select("*")
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

  const rawInput = {
    couple_names: String(formData.get("couple_names") ?? ""),
    wedding_date: String(formData.get("wedding_date") ?? ""),
    venue: String(formData.get("venue") ?? ""),
    slug: normalizeSlug(String(formData.get("slug") ?? "")),
    message: String(formData.get("message") ?? ""),
  };

  const parsed = eventSchema.safeParse(rawInput);
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
      return { error: "Slug already exists. Please choose another slug." };
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
