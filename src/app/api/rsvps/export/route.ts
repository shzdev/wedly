import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { normalizeSlug } from "@/lib/utils/slug";

function escapeCsv(value: string | number | null) {
  const safe = value === null ? "" : String(value);
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET(request: NextRequest) {
  const slugRaw = request.nextUrl.searchParams.get("slug") ?? "";
  const slug = normalizeSlug(slugRaw);

  if (!slug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id,slug,user_id")
    .eq("slug", slug)
    .eq("user_id", user.id)
    .maybeSingle();

  if (eventError || !event) {
    if (eventError) {
      Sentry.withScope((scope) => {
        scope.setTag("feature", "export_csv");
        scope.setTag("slug", slug);
        scope.setUser({ id: user.id });
        scope.setExtra("db_error_code", eventError.code);
        scope.setExtra("db_error_message", eventError.message);
        Sentry.captureException(eventError);
      });
    }
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: rsvps, error: rsvpError } = await supabase
    .from("rsvps")
    .select("guest_name,attendance,pax_count,wish_message,created_at")
    .eq("event_id", event.id)
    .order("created_at", { ascending: false });

  if (rsvpError) {
    Sentry.withScope((scope) => {
      scope.setTag("feature", "export_csv");
      scope.setTag("slug", slug);
      scope.setUser({ id: user.id });
      scope.setExtra("db_error_code", rsvpError.code);
      scope.setExtra("db_error_message", rsvpError.message);
      Sentry.captureException(rsvpError);
    });
    return NextResponse.json({ error: "Failed to export CSV" }, { status: 500 });
  }

  const header = ["guest_name", "attendance", "pax_count", "wish_message", "created_at"];
  const lines = [header.join(",")];
  for (const row of rsvps ?? []) {
    lines.push(
      [
        escapeCsv(row.guest_name),
        escapeCsv(row.attendance),
        escapeCsv(row.pax_count),
        escapeCsv(row.wish_message),
        escapeCsv(row.created_at),
      ].join(","),
    );
  }

  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="wedly-rsvps-${event.slug}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
