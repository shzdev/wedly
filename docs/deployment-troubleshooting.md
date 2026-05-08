# Deployment Troubleshooting

Use this guide when Vercel deploys succeed but behavior is wrong, or when the build fails unexpectedly.

## 1. Build fails because metadata URL is malformed

Symptom:

- Build fails during metadata generation or share links point to the wrong host.

Check:

- [src/app/layout.tsx](../src/app/layout.tsx)
- `.env` / Vercel project settings

Likely cause:

- `NEXT_PUBLIC_SITE_URL` is missing, malformed, or still points to an old domain.

Fix:

1. Set `NEXT_PUBLIC_SITE_URL` to the exact production URL.
2. Redeploy.

## 2. Landing email submit does nothing useful

Symptom:

- Submitting the email form returns to the same state or shows a validation error unexpectedly.

Check:

- [src/components/auth-card.tsx](../src/components/auth-card.tsx)
- [src/lib/actions/events.ts](../src/lib/actions/events.ts)
- [src/lib/owner-session.ts](../src/lib/owner-session.ts)

Likely cause:

- invalid email input, cookie issue, or domain mismatch

Fix:

1. Confirm the email format is valid.
2. Clear cookies for the deployment domain.
3. Retry from `/`.

## 3. Workspace disappears after refresh

Symptom:

- The owner lands back on the logged-out state after reloading `/`.

Check:

- [src/lib/owner-session.ts](../src/lib/owner-session.ts)
- [src/app/page.tsx](../src/app/page.tsx)

Likely cause:

- owner cookie not being set, blocked, or tied to a different domain

Fix:

1. Verify cookies are enabled.
2. Confirm deployment domain consistency.
3. Re-enter the owner email.

## 4. Create event fails

Symptom:

- Create-event submission returns a generic failure or stays stuck.

Check:

- [src/lib/actions/events.ts](../src/lib/actions/events.ts)
- [supabase/schema.sql](../supabase/schema.sql)

Likely cause:

- schema not applied, malformed input, or the email workspace already owns an event

Fix:

1. Re-apply the schema.
2. Confirm the current owner email does not already have an event.
3. Check Sentry for `feature=create_event`.

## 5. Public RSVP insert fails

Symptom:

- Guest RSVP submission shows a generic failure.

Check:

- [src/lib/actions/rsvps.ts](../src/lib/actions/rsvps.ts)
- [supabase/schema.sql](../supabase/schema.sql)

Likely cause:

- insert/select policy drift, validation failure, or event lookup mismatch

Fix:

1. Re-apply the schema and policies.
2. Re-test with a valid public slug.
3. Check Sentry for `feature=submit_rsvp`.

## 6. Public RSVP page loads, but guests cannot submit quickly

Symptom:

- A real user gets blocked with a fast-submit error.

Check:

- [src/lib/actions/rsvps.ts](../src/lib/actions/rsvps.ts)

Likely cause:

- submission happened under the 2-second threshold

Fix:

1. Confirm this is not an automated submission.
2. Wait briefly before resubmitting.

## 7. Duplicate RSVP is flagged incorrectly

Symptom:

- Different formatting of the same name still triggers a duplicate rejection.

Check:

- [src/lib/actions/rsvps.ts](../src/lib/actions/rsvps.ts)

Likely cause:

- duplicate detection intentionally normalizes casing and repeated whitespace

Fix:

1. Treat this as expected behavior unless product requirements change.
2. If requirements change, update the normalization rule deliberately and re-index if needed.

## 8. CSV export returns `401` or `404`

Symptom:

- `/api/rsvps/export?slug=...` fails.

Check:

- [src/app/api/rsvps/export/route.ts](../src/app/api/rsvps/export/route.ts)

Likely cause:

- missing owner cookie, wrong slug, or slug that does not belong to the active email workspace

Fix:

1. Re-open `/` using the correct owner email.
2. Retry export from the owner dashboard itself.

## 9. Sticky invitation does not stay pinned on desktop

Symptom:

- Owner or public RSVP left invitation panel scrolls away instead of staying sticky.

Check:

- [src/app/globals.css](../src/app/globals.css)
- [src/components/manage-wedding-card.tsx](../src/components/manage-wedding-card.tsx)
- [src/app/w/[slug]/page.tsx](../src/app/w/[slug]/page.tsx)

Likely cause:

- overflow or layout changes interfering with `.wedly-sticky-panel`

Fix:

1. Verify no ancestor now blocks sticky positioning.
2. Re-test at desktop widths only.

## 10. Mobile input overflows on create-event form

Symptom:

- a field, especially `input[type="date"]`, exceeds the ticket width on real mobile devices

Check:

- [src/app/globals.css](../src/app/globals.css)
- [src/components/create-wedding-form.tsx](../src/components/create-wedding-form.tsx)

Likely cause:

- native mobile input sizing or a missing width constraint

Fix:

1. Re-test on real iPhone Safari/Chrome.
2. Confirm shared form controls still have `max-width: 100%` and `min-width: 0`.

## 11. `/_not-found` fails during build

Symptom:

- Next.js build fails while prerendering `/_not-found` or `/404`.

Check:

- [src/components/scroll-reset.tsx](../src/components/scroll-reset.tsx)
- [src/app/layout.tsx](../src/app/layout.tsx)

Likely cause:

- a client navigation hook in the global layout requiring unsupported prerender behavior

Fix:

1. Keep `ScrollReset` server-safe.
2. Avoid `useSearchParams()` there unless wrapped correctly for the rendering mode.

## 12. Social preview image does not update

Symptom:

- WhatsApp, Telegram, X, or LinkedIn still show an old preview image or wrong title.

Check:

- [src/app/layout.tsx](../src/app/layout.tsx)
- [src/app/w/[slug]/page.tsx](../src/app/w/[slug]/page.tsx)
- [public/og-img.png](../public/og-img.png)

Likely cause:

- stale cache or mismatched `NEXT_PUBLIC_SITE_URL`

Fix:

1. Confirm metadata is pointing to the right production domain.
2. Redeploy if needed.
3. Re-test with the relevant preview debugger.

## 13. Workspace deletion fails

Symptom:

- Danger-zone delete action throws or leaves the workspace partially intact.

Check:

- [src/lib/actions/events.ts](../src/lib/actions/events.ts)
- [supabase/schema.sql](../supabase/schema.sql)

Likely cause:

- database delete failure or missing cascade expectation

Fix:

1. Verify `rsvps.event_id` still has `on delete cascade`.
2. Check Sentry for `feature=delete_owner_workspace`.

## 14. Sentry events do not appear

Symptom:

- expected errors never arrive in Sentry

Check:

- [next.config.ts](../next.config.ts)
- [sentry.server.config.ts](../sentry.server.config.ts)
- [sentry.edge.config.ts](../sentry.edge.config.ts)
- [instrumentation-client.ts](../instrumentation-client.ts)

Likely cause:

- DSN or Sentry build credentials are missing

Fix:

1. Set `NEXT_PUBLIC_SENTRY_DSN`.
2. If source map upload is required, also set `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and `SENTRY_PROJECT`.
3. Redeploy.
