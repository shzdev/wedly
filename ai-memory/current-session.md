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
- The public RSVP page now mirrors the owner visual system with a sticky invitation on the left, then a guest content column containing the wishes carousel and RSVP form.
- The RSVP form now uses the same invitation/ticket language as the rest of the app and keeps the existing honeypot, timestamp, and duplicate-protection flow unchanged.
- The wedding invitation card is now shared between owner and public pages through a reusable component.
- Supabase magic-link auth has been removed from the active owner flow and replaced with email-only owner workspace access via an httpOnly cookie.
- Event ownership now resolves through `events.owner_email` and the cookie helper in `src/lib/owner-session.ts`.
- Create event, owner page, CSV export, and RSVP delete now perform ownership checks through the owner email cookie instead of Supabase Auth user id.
- Schema and docs were rewritten to reflect that this solves free-plan email limits for testing, but is not production-secure authentication.

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
