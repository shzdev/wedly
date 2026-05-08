# Deployment Troubleshooting

Use this guide when production deploy on Vercel fails or behavior differs from local.

## 1) Build fails due to missing env vars
Symptom: Build error on `process.env.*` or malformed URL in metadata.
Likely cause: Required env vars not set.
Check:
- [README.md](c:/MyProjects/Wedly/README.md)
- [.env.example](c:/MyProjects/Wedly/.env.example)
- [src/app/layout.tsx](c:/MyProjects/Wedly/src/app/layout.tsx)
Fix:
1. Set all required env vars in Vercel.
2. Redeploy.

## 2) Email workspace does not open after submit
Symptom: Submitting email on `/` returns to the same state.
Likely cause: Invalid email input or cookie not being set.
Check:
- [src/components/auth-card.tsx](c:/MyProjects/Wedly/src/components/auth-card.tsx)
- [src/lib/owner-session.ts](c:/MyProjects/Wedly/src/lib/owner-session.ts)
Fix:
1. Verify a valid email format is being entered.
2. Clear cookies and retry.
3. Check deployment domain/cookie behavior.

## 3) Legacy `/auth/callback` link does nothing useful
Symptom: Opening an old auth callback URL just lands on `/`.
Likely cause: Auth callback is now legacy-only.
Check:
- [src/app/auth/callback/route.ts](c:/MyProjects/Wedly/src/app/auth/callback/route.ts)
Fix:
1. Stop using old auth links.
2. Enter owner email directly on `/`.

## 4) Workspace disappears after refresh
Symptom: Owner page falls back to landing after reload.
Likely cause: Owner cookie missing, expired, or blocked.
Check:
- [src/lib/owner-session.ts](c:/MyProjects/Wedly/src/lib/owner-session.ts)
- [src/app/page.tsx](c:/MyProjects/Wedly/src/app/page.tsx)
Fix:
1. Verify cookies are enabled.
2. Re-enter email on `/`.
3. Check production domain consistency.

## 5) Create event fails
Symptom: Create event action shows generic failure.
Likely cause: Schema not reapplied or uniqueness conflict.
Check:
- [supabase/schema.sql](c:/MyProjects/Wedly/supabase/schema.sql)
- [src/lib/actions/events.ts](c:/MyProjects/Wedly/src/lib/actions/events.ts)
Fix:
1. Re-apply schema in Supabase SQL editor.
2. Check `events_owner_email_one_event_idx` and unique slug state.

## 6) Public RSVP insert fails
Symptom: Guest submit shows generic failure.
Likely cause: `rsvps` insert access missing or schema not current.
Check:
- [supabase/schema.sql](c:/MyProjects/Wedly/supabase/schema.sql)
- [src/lib/actions/rsvps.ts](c:/MyProjects/Wedly/src/lib/actions/rsvps.ts)
Fix:
1. Re-apply schema/policies in Supabase SQL editor.
2. Re-test incognito submission.

## 7) Owner manage view cannot read RSVP
Symptom: Owner summary/list appears empty unexpectedly.
Likely cause: Wrong owner email workspace or wrong event ownership.
Check:
- [src/lib/actions/events.ts](c:/MyProjects/Wedly/src/lib/actions/events.ts)
- [src/lib/actions/rsvps.ts](c:/MyProjects/Wedly/src/lib/actions/rsvps.ts)
Fix:
1. Confirm you are in the correct email workspace.
2. Verify event and RSVP rows in Supabase.

## 8) Delete RSVP fails
Symptom: Delete button does nothing.
Likely cause: Owner email cookie does not match event owner email.
Check:
- [src/lib/actions/rsvps.ts](c:/MyProjects/Wedly/src/lib/actions/rsvps.ts)
- [supabase/schema.sql](c:/MyProjects/Wedly/supabase/schema.sql)
Fix:
1. Confirm the active workspace email owns the event.
2. Switch email and try again.

## 9) CSV export returns unauthorized or not found
Symptom: `/api/rsvps/export` returns `401` or `404`.
Likely cause: Missing owner cookie or wrong email workspace.
Check:
- [src/app/api/rsvps/export/route.ts](c:/MyProjects/Wedly/src/app/api/rsvps/export/route.ts)
Fix:
1. Re-enter the owner email on `/`.
2. Confirm slug belongs to that email workspace.

## 10) Sentry does not receive errors
Symptom: No events visible after intentional failure.
Likely cause: DSN missing/invalid.
Check:
- `NEXT_PUBLIC_SENTRY_DSN`
- [sentry.server.config.ts](c:/MyProjects/Wedly/sentry.server.config.ts)
- [sentry.edge.config.ts](c:/MyProjects/Wedly/sentry.edge.config.ts)
Fix:
1. Set DSN in Vercel.
2. Redeploy and trigger safe error path.

## 11) Sentry source map upload fails
Symptom: Build warns about source map upload.
Likely cause: `SENTRY_AUTH_TOKEN` missing or invalid.
Check:
- `SENTRY_AUTH_TOKEN`
- [next.config.ts](c:/MyProjects/Wedly/next.config.ts)
Fix:
1. Set valid token with correct org/project access.
2. Confirm `SENTRY_ORG` and `SENTRY_PROJECT`.

## 12) NEXT_PUBLIC_SITE_URL is wrong
Symptom: Metadata/share links point to wrong host.
Likely cause: Env var not updated after domain change.
Check:
- [src/app/layout.tsx](c:/MyProjects/Wedly/src/app/layout.tsx)
- [README.md](c:/MyProjects/Wedly/README.md)
Fix:
1. Update env var to exact production URL.
2. Redeploy.

## 13) Duplicate slug error on create event
Symptom: Create event fails with slug conflict.
Likely cause: Slug already used by another event.
Check:
- [src/lib/actions/events.ts](c:/MyProjects/Wedly/src/lib/actions/events.ts)
Fix:
1. Use a unique couple name combination.
2. Keep lowercase kebab-case generation logic unchanged.

## 14) Vercel deployment cache issue
Symptom: Old behavior persists after merge.
Likely cause: Stale cached build or wrong branch.
Check:
- Vercel deployment history and selected branch.
Fix:
1. Trigger redeploy from latest commit.
2. Clear cache and redeploy if needed.

## 15) Mobile layout issue after deploy
Symptom: Overflow or clipped actions at 375px.
Likely cause: Long text without wrapping or fixed-width container.
Check:
- [src/components/manage-wedding-card.tsx](c:/MyProjects/Wedly/src/components/manage-wedding-card.tsx)
- [src/components/rsvp-form.tsx](c:/MyProjects/Wedly/src/components/rsvp-form.tsx)
- [src/components/wishes-list.tsx](c:/MyProjects/Wedly/src/components/wishes-list.tsx)
Fix:
1. Verify `break-words` and responsive utility classes.
2. Re-test at 375px and tablet widths.
