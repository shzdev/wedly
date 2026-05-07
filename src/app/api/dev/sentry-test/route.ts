import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 404 });
  }

  try {
    throw new Error("Dev-only Sentry test error");
  } catch (error) {
    Sentry.captureException(error, {
      tags: { feature: "sentry_test" },
    });
    return NextResponse.json({ ok: true, message: "Sentry test error captured" });
  }
}
