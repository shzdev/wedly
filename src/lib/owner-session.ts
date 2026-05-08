import { cookies } from "next/headers";
import { z } from "zod";

const OWNER_EMAIL_COOKIE = "wedly_owner_email";
const ownerEmailSchema = z.email("Please enter a valid email address.");

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

export function normalizeOwnerEmail(value: string) {
  return value.trim().toLowerCase();
}

export function validateOwnerEmail(value: string) {
  return ownerEmailSchema.safeParse(normalizeOwnerEmail(value));
}

export async function setOwnerEmailCookie(email: string) {
  const cookieStore = await cookies();
  cookieStore.set(OWNER_EMAIL_COOKIE, normalizeOwnerEmail(email), cookieOptions);
}

export async function getCurrentOwnerEmail() {
  const cookieStore = await cookies();
  const rawValue = cookieStore.get(OWNER_EMAIL_COOKIE)?.value;
  if (!rawValue) {
    return null;
  }

  const parsed = validateOwnerEmail(rawValue);
  return parsed.success ? parsed.data : null;
}

export async function clearOwnerEmailCookie() {
  const cookieStore = await cookies();
  cookieStore.set(OWNER_EMAIL_COOKIE, "", { ...cookieOptions, maxAge: 0 });
}
