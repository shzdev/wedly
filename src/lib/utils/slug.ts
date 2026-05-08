import { randomUUID } from "node:crypto";

export function normalizeSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generateEventSlug(brideName: string, groomName: string) {
  const readablePrefix = normalizeSlug(`${brideName} ${groomName}`);
  if (!readablePrefix) {
    return "";
  }

  return `${readablePrefix}-${randomUUID()}`;
}
