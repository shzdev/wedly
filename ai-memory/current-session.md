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
- Shared UI now standardizes toward a 12px radius system across cards, buttons, controls, and companion panels.
- `WeddingShell` was refactored into two sibling ticket panels so the decorative/invitation side can stay sticky on desktop for the create page.
- Owner RSVP ledger card was removed from the manage page, leaving invitation, link tools, summary, and guestbook carousel only.
- The wishes carousel now uses a center-focused premium layout with faded side previews, and falling petals were made denser and slightly faster on owner/public pages.
- The 4 corner border ornaments were removed from the shared invitation card used on owner and public pages.
- The shared invitation card no longer shows the `Wedly` pill in the top-right area; the card now keeps only the eyebrow, description, and invitation body.
- Owner wedding page now has a bottom-right danger zone section with a dedicated owner-only action to delete the full workspace (`events` + cascading `rsvps`) and clear the owner email session cookie in one step.
- Sticky invitation behavior was fixed for create/owner/public layouts using a shared `.wedly-sticky-panel` class with desktop `position: sticky`, capped viewport height, and `overflow-y: auto` so left panels remain sticky and scrollable when content is tall.
- Create-event screen UI was simplified: removed inner duplicate card/header/subheading and removed `Switch Email` action from the form body; form fields now render directly under the outer `WeddingShell` heading/subheading.
- Create-event desktop layout now uses equal-height shell columns (`equalHeightDesktop`) and disables sticky on the left panel for this state (`stickyPanel={false}`) to keep both sides visually aligned.

## Validation
- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run build` passed.
- `npm audit` was reduced to `0 vulnerabilities` after fixing the dependency tree.
- Post-update revalidation: `npm run lint`, `npm run typecheck`, and `npm run build` all passed after adding workspace-delete action/UI.
- Follow-up validation after sticky fix: `npm run lint` and `npm run typecheck` both passed.
- Validation after create-event UI simplification: `npm run typecheck` passed.

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
