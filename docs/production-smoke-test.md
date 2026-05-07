# Production Smoke Test

Run this checklist immediately after each Vercel production deploy.

## Preconditions
- Production env vars are set in Vercel.
- Supabase schema is applied (`supabase/schema.sql`).
- At least one owner account exists.

## Step-by-Step Checks
1. Open home page `/`.
   - Expect polished landing + auth experience.
2. Login with magic link.
   - Expect redirect through `/auth/callback` and return to `/`.
3. If account has no event, create event.
   - Expect success state and manage card appears.
4. Copy public link.
   - Expect copy feedback appears.
5. Open public link `/w/[slug]` in incognito.
   - Expect wedding page content to load.
6. Submit RSVP in incognito.
   - Expect success message and no runtime error.
7. Submit same guest name again.
   - Expect duplicate RSVP friendly rejection.
8. Return to owner tab.
   - Expect RSVP summary count and entries updated.
9. Delete one RSVP as owner.
   - Expect entry removed and no authorization error.
10. Export CSV as owner.
    - Expect CSV download with correct columns.
11. Call dev Sentry test route only in non-production:
    - `/api/dev/sentry-test`
    - Expect non-production success response.
12. Mobile verification (375px width):
    - `/` and `/w/[slug]` should have no horizontal overflow.

## If Something Fails
- Check Vercel runtime logs for route/action errors.
- Check Supabase logs and SQL policies for permission issues.
- Check Sentry issues filtered by tags:
  - `feature=create_event`
  - `feature=submit_rsvp`
  - `feature=delete_rsvp`
  - `feature=export_csv`

## Quick Security Sanity
1. Logged-out CSV export request returns `401`.
2. Public user cannot trigger owner delete action.
3. Unknown slug returns elegant not-found page.
