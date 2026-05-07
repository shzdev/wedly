# Production Smoke Test

Run this sequence right after every production deploy on Vercel.

## Preconditions
- Vercel env vars are set.
- Supabase schema is applied from [supabase/schema.sql](c:/MyProjects/Wedly/supabase/schema.sql).
- You have one owner email ready for magic link login.

## Sequential Checks
1. Open production URL (`[LIVE_DEMO_URL]`).
Expected: Home page loads with Wedly branding and auth card.
If fail: Check Vercel deployment status and runtime logs.

2. Check home page render quality.
Expected: No broken styles, no hydration warning, no blank sections.
If fail: Check browser console and Vercel logs.

3. Login using magic link.
Expected: Email is sent successfully from Supabase auth.
If fail: Check Supabase Auth provider settings and Site URL.

4. Confirm auth callback works.
Expected: User returns to `/` in logged-in state after clicking email link.
If fail: Check redirect URLs and [src/app/auth/callback/route.ts](c:/MyProjects/Wedly/src/app/auth/callback/route.ts).

5. Create demo wedding event (if owner has no event yet).
Expected: Success message and manage card appears.
If fail: Check RLS/constraints in [supabase/schema.sql](c:/MyProjects/Wedly/supabase/schema.sql) and action logs.

6. Copy public link.
Expected: Copy button feedback appears (`Copied`).
If fail: Check [src/components/copy-link-button.tsx](c:/MyProjects/Wedly/src/components/copy-link-button.tsx).

7. Open public link in incognito.
Expected: `/w/[slug]` page renders event details correctly.
If fail: Check event slug data and route logs.

8. Submit RSVP from incognito.
Expected: Success message appears and no crash.
If fail: Check insert policy on `rsvps` and action in [src/lib/actions/rsvps.ts](c:/MyProjects/Wedly/src/lib/actions/rsvps.ts).

9. Submit duplicate RSVP (same guest name).
Expected: Friendly duplicate message appears.
If fail: Check duplicate logic in [src/lib/actions/rsvps.ts](c:/MyProjects/Wedly/src/lib/actions/rsvps.ts).

10. Confirm guestbook updates.
Expected: New wish appears on public page (if wish message provided).
If fail: Check revalidation path and select query.

11. Return to owner manage view (`/`).
Expected: Event manage card still loads without auth/session issues.
If fail: Check session refresh proxy in [src/proxy.ts](c:/MyProjects/Wedly/src/proxy.ts).

12. Check RSVP summary.
Expected: Counts reflect submitted RSVP values.
If fail: Check summary math in [src/components/manage-wedding-card.tsx](c:/MyProjects/Wedly/src/components/manage-wedding-card.tsx).

13. Delete one RSVP as owner.
Expected: RSVP entry is removed.
If fail: Check owner delete policy and `deleteRsvp` action.

14. Export CSV.
Expected: File downloads as `wedly-rsvps-[slug].csv`.
If fail: Check [src/app/api/rsvps/export/route.ts](c:/MyProjects/Wedly/src/app/api/rsvps/export/route.ts) and auth status.

15. Test unknown slug.
Expected: Elegant not-found state appears.
If fail: Check [src/app/w/[slug]/not-found.tsx](c:/MyProjects/Wedly/src/app/w/[slug]/not-found.tsx).

16. Test mobile layout (375px width).
Expected: No horizontal overflow on `/` and `/w/[slug]`.
If fail: Check long text wrapping in manage/wishes components.

17. Trigger safe Sentry test (non-production only).
Expected: `/api/dev/sentry-test` returns success on non-production, 404 on production.
If fail: Check [src/app/api/dev/sentry-test/route.ts](c:/MyProjects/Wedly/src/app/api/dev/sentry-test/route.ts).

18. Check Vercel logs.
Expected: No unhandled route/action runtime errors.
If fail: Correlate failing request path and redeploy after fix.

19. Check Supabase logs.
Expected: No repeated policy denials for expected flows.
If fail: Review RLS policies and redirect/auth configuration.

20. Check Sentry issues.
Expected: Errors appear only for real failures, with `feature` tags.
If fail: Verify `NEXT_PUBLIC_SENTRY_DSN` and runtime config files.
