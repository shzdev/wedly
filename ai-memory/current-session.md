# Current Session

Date: 2026-05-08
Project: Wedly

## Current State
- Wedly is now a launch-ready luxury wedding RSVP + guestbook MVP built with Next.js, Supabase, Sentry, and Vercel.
- Public flow, owner manage flow, spam protection, duplicate RSVP handling, CSV export, and Sentry monitoring are in place.
- Homepage was redesigned into a premium editorial landing page with ticket-style cards and no navigation bar.
- User-facing wording now prefers "sign-in link" over "magic link" in the app UI.
- Logged-in users without an event now bypass the marketing hero and see a focused create-event screen with a large ticket-style form.
- The create-event flow now collects `Bride Name` and `Groom Name`, combines them into the existing `events.couple_names` value, and auto-generates the RSVP slug instead of exposing an editable slug field.
- Server-side name validation now blocks unsafe/symbol-heavy input before slug generation while still allowing normal human name punctuation.
- Logged-in users with an existing event now bypass the landing hero as well and see a dedicated owner page with a sticky invitation preview on desktop.
- The owner page now uses a refined two-column layout: invitation card on the left, then link tools, RSVP summary, wishes carousel, and RSVP ledger on the right.
- Guest wishes in the owner view now rotate automatically in a lightweight client-side carousel, and the owner page includes subtle falling-petal motion with reduced-motion fallback.

## Validation
- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run build` passed.
- `npm audit` was reduced to `0 vulnerabilities` after fixing the dependency tree.

## Deployment
- Repository was pushed to GitHub on `main`.
- `origin/main` was force-updated from the local Wedly history because the remote only had the initial seed commit.

## Important Notes
- Supabase Auth may rate limit repeated sign-in email requests; the login card now has a small client-side cooldown and clearer error copy.
- Supabase email template wording still needs a manual dashboard update if the team wants "sign-in link" instead of "magic link" in the email body.
- No Supabase service role key is used in the app.
- No secrets were stored in memory.

## Next Likely Work
- Final production deploy on Vercel using real env vars and Supabase redirect URLs.
- Manual smoke test on production URL.
- Replace README/demo placeholders with live URLs and screenshots.
