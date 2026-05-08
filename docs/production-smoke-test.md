# Production Smoke Test

Run this sequence right after every production deploy on Vercel.

## Preconditions
- Vercel env vars are set.
- Supabase schema is applied from [supabase/schema.sql](c:/MyProjects/Wedly/supabase/schema.sql).
- You have one owner email ready for workspace access.

## Sequential Checks
1. Open production URL (`[LIVE_DEMO_URL]`).
Expected: Home page loads with Wedly branding and email access card.
If fail: Check Vercel deployment status and runtime logs.

2. Check home page render quality.
Expected: No broken styles, no hydration warning, no blank sections.
If fail: Check browser console and Vercel logs.

3. Enter owner email and continue.
Expected: No email is sent. The app opens the owner workspace immediately.
If fail: Check [src/components/auth-card.tsx](c:/MyProjects/Wedly/src/components/auth-card.tsx) and cookie behavior.

4. Refresh `/`.
Expected: Same owner workspace persists from cookie.
If fail: Check [src/lib/owner-session.ts](c:/MyProjects/Wedly/src/lib/owner-session.ts).

5. Create demo wedding event (if workspace has no event yet).
Expected: Success message and manage card appears.
If fail: Check [supabase/schema.sql](c:/MyProjects/Wedly/supabase/schema.sql) and [src/lib/actions/events.ts](c:/MyProjects/Wedly/src/lib/actions/events.ts).

6. Copy public link.
Expected: Copy button feedback appears (`Copied`).
If fail: Check [src/components/copy-link-button.tsx](c:/MyProjects/Wedly/src/components/copy-link-button.tsx).

7. Open public link in incognito.
Expected: `/w/[slug]` page renders event details correctly.
If fail: Check event slug data and route logs.

8. Submit RSVP from incognito.
Expected: Success message appears and no crash.
If fail: Check insert access on `rsvps` and action in [src/lib/actions/rsvps.ts](c:/MyProjects/Wedly/src/lib/actions/rsvps.ts).

9. Submit duplicate RSVP (same guest name).
Expected: Friendly duplicate message appears.
If fail: Check duplicate logic in [src/lib/actions/rsvps.ts](c:/MyProjects/Wedly/src/lib/actions/rsvps.ts).

10. Confirm guestbook updates.
Expected: New wish appears on public page (if wish message provided).
If fail: Check revalidation path and select query.

11. Return to owner manage view (`/`).
Expected: Event manage card still loads in the same email workspace.
If fail: Check owner cookie and event lookup by `owner_email`.

12. Check RSVP summary.
Expected: Counts reflect submitted RSVP values.
If fail: Check summary math in [src/components/manage-wedding-card.tsx](c:/MyProjects/Wedly/src/components/manage-wedding-card.tsx).

13. Delete one RSVP as owner.
Expected: RSVP entry is removed.
If fail: Check owner email match in [src/lib/actions/rsvps.ts](c:/MyProjects/Wedly/src/lib/actions/rsvps.ts).

14. Export CSV.
Expected: File downloads as `wedly-rsvps-[slug].csv`.
If fail: Check [src/app/api/rsvps/export/route.ts](c:/MyProjects/Wedly/src/app/api/rsvps/export/route.ts) and owner cookie.

15. Switch email.
Expected: Owner workspace clears and landing/email access state appears.
If fail: Check `clearOwnerSession` in [src/lib/actions/events.ts](c:/MyProjects/Wedly/src/lib/actions/events.ts).

16. Test owner isolation with a second email.
Expected: Second email does not see the first email workspace.
If fail: Check `events.owner_email` rows and owner cookie normalization.

17. Test unknown slug.
Expected: Elegant not-found state appears.
If fail: Check [src/app/w/[slug]/not-found.tsx](c:/MyProjects/Wedly/src/app/w/[slug]/not-found.tsx).

18. Test mobile layout (375px width).
Expected: No horizontal overflow on `/` and `/w/[slug]`.
If fail: Check long text wrapping in manage/form/wishes components.

19. Trigger safe Sentry test (non-production only).
Expected: `/api/dev/sentry-test` returns success on non-production, 404 on production.
If fail: Check [src/app/api/dev/sentry-test/route.ts](c:/MyProjects/Wedly/src/app/api/dev/sentry-test/route.ts).

20. Check Vercel logs, Supabase logs, and Sentry issues.
Expected: No unhandled route/action runtime errors; only real failures appear.
If fail: Correlate failing request path with the relevant server action/route handler.
