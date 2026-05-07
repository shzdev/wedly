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

## 2) Supabase magic link redirects to localhost
Symptom: Clicking email link opens `localhost` from production email.
Likely cause: Supabase Site URL/redirect URLs still point to local.
Check:
- Supabase Auth URL configuration
- [src/components/auth-card.tsx](c:/MyProjects/Wedly/src/components/auth-card.tsx)
Fix:
1. Set Supabase Site URL to production domain.
2. Add production callback URL to redirect allowlist.

## 3) Auth callback fails
Symptom: Redirect loops or returns to `/` with auth failure.
Likely cause: Invalid code exchange or redirect mismatch.
Check:
- [src/app/auth/callback/route.ts](c:/MyProjects/Wedly/src/app/auth/callback/route.ts)
Fix:
1. Recheck redirect URL entries.
2. Ensure callback URL exactly matches deployed domain.

## 4) Logged in locally but not in production
Symptom: Session appears to disappear after redirect.
Likely cause: Cookie domain/proxy/session refresh mismatch.
Check:
- [src/proxy.ts](c:/MyProjects/Wedly/src/proxy.ts)
- [src/lib/supabase/server.ts](c:/MyProjects/Wedly/src/lib/supabase/server.ts)
Fix:
1. Verify production domain consistency.
2. Re-login after clearing browser cookies.

## 5) Public RSVP insert fails due to RLS
Symptom: Guest submit shows generic failure.
Likely cause: `rsvps` insert policy missing or not applied.
Check:
- [supabase/schema.sql](c:/MyProjects/Wedly/supabase/schema.sql)
- [src/lib/actions/rsvps.ts](c:/MyProjects/Wedly/src/lib/actions/rsvps.ts)
Fix:
1. Re-apply schema/policies in Supabase SQL editor.
2. Re-test incognito submission.

## 6) Owner manage view cannot read RSVP
Symptom: Owner summary/list appears empty unexpectedly.
Likely cause: Wrong event ownership or query access issue.
Check:
- [src/lib/actions/events.ts](c:/MyProjects/Wedly/src/lib/actions/events.ts)
- [src/lib/actions/rsvps.ts](c:/MyProjects/Wedly/src/lib/actions/rsvps.ts)
Fix:
1. Confirm logged-in user owns the event.
2. Verify event and RSVP rows in Supabase.

## 7) Delete RSVP fails due to RLS
Symptom: Delete button does nothing.
Likely cause: Missing `rsvps owner delete` policy or ownership mismatch.
Check:
- [supabase/schema.sql](c:/MyProjects/Wedly/supabase/schema.sql)
- [src/lib/actions/rsvps.ts](c:/MyProjects/Wedly/src/lib/actions/rsvps.ts)
Fix:
1. Re-apply schema policy.
2. Confirm RSVP belongs to owner's event.

## 8) CSV export returns unauthorized
Symptom: `/api/rsvps/export` returns `401`.
Likely cause: User not authenticated or session expired.
Check:
- [src/app/api/rsvps/export/route.ts](c:/MyProjects/Wedly/src/app/api/rsvps/export/route.ts)
Fix:
1. Re-login as owner.
2. Retry export from owner view.

## 9) Sentry does not receive errors
Symptom: No events visible after intentional failure.
Likely cause: DSN missing/invalid.
Check:
- `NEXT_PUBLIC_SENTRY_DSN`
- [sentry.server.config.ts](c:/MyProjects/Wedly/sentry.server.config.ts)
- [sentry.edge.config.ts](c:/MyProjects/Wedly/sentry.edge.config.ts)
Fix:
1. Set DSN in Vercel.
2. Redeploy and trigger safe error path.

## 10) Sentry source map upload fails
Symptom: Build warns about source map upload.
Likely cause: `SENTRY_AUTH_TOKEN` missing or invalid.
Check:
- `SENTRY_AUTH_TOKEN`
- [next.config.ts](c:/MyProjects/Wedly/next.config.ts)
Fix:
1. Set valid token with correct org/project access.
2. Confirm `SENTRY_ORG` and `SENTRY_PROJECT`.

## 11) NEXT_PUBLIC_SITE_URL is wrong
Symptom: Metadata/callback/share links point to wrong host.
Likely cause: Env var not updated after domain change.
Check:
- [src/app/layout.tsx](c:/MyProjects/Wedly/src/app/layout.tsx)
- [README.md](c:/MyProjects/Wedly/README.md)
Fix:
1. Update env var to exact production URL.
2. Redeploy.

## 12) Duplicate slug error on create event
Symptom: Create event fails with slug conflict.
Likely cause: Slug already used by another event.
Check:
- [src/lib/actions/events.ts](c:/MyProjects/Wedly/src/lib/actions/events.ts)
Fix:
1. Use a unique slug.
2. Keep lowercase kebab-case.

## 13) Vercel deployment cache issue
Symptom: Old behavior persists after merge.
Likely cause: Stale cached build or wrong branch.
Check:
- Vercel deployment history and selected branch.
Fix:
1. Trigger redeploy from latest commit.
2. Clear cache and redeploy if needed.

## 14) Mobile layout issue after deploy
Symptom: Overflow or clipped actions at 375px.
Likely cause: Long text without wrapping or fixed-width container.
Check:
- [src/components/manage-wedding-card.tsx](c:/MyProjects/Wedly/src/components/manage-wedding-card.tsx)
- [src/components/wishes-list.tsx](c:/MyProjects/Wedly/src/components/wishes-list.tsx)
Fix:
1. Verify `break-words` and responsive utility classes.
2. Re-test at 375px and tablet widths.
