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
- Global scroll reset behavior was added so route changes and browser page-show events restore viewport to top, preventing the app from reopening at lower scroll positions on create/owner/public pages.
- Create-event and public RSVP submit success handlers now explicitly scroll to top before refresh/reset to keep focus at the upper page after submission.
- Mobile date input overflow on create-event form was fixed by enforcing `min-width: 0` on shared form controls and `max-width: 100%` for `.wedly-input[type="date"]` so width matches other text inputs.
- Owner wedding page top-right `Switch Email` button was removed from the owner overview header.
- Owner page wording was updated only: invitation-card subheading and owner-overview subheading now use the new refined copy requested by client.
- Vercel prerender failure on `/_not-found` was traced to global `ScrollReset` in layout using `useSearchParams()` without a Suspense boundary; this crashed static `/404` generation.
- `ScrollReset` was hardened to depend on `usePathname()` only, preserving top-scroll behavior while remaining safe for prerender.
- Global first-landing refresh was added per route in `ScrollReset`: each pathname triggers `router.refresh()` once per browser session (sessionStorage key) to ensure first arrival on a page revalidates data/state after transitions such as homepage submit -> create page.
- Landing/auth `WeddingShell` now enables `equalHeightDesktop` so desktop left decorative card matches right content card height.
- Real mobile date input overflow on create-event page was hardened further: shared form controls now explicitly use block display, max-width, border-box sizing, inherited font, and targeted WebKit date input constraints; create form labels now use `min-w-0`.
- Owner wedding page and public RSVP page sticky invitation behavior was fixed again by replacing desktop-page `overflow-x-hidden` with `overflow-x-clip`, keeping grid overflow visible, and hardening `.wedly-sticky-panel` with fit-content height, z-index, clipped horizontal overflow, and contained overscroll.
- Shared wishes/guestbook carousel now renders exactly one active wish card at a time for both owner and public RSVP pages; side preview cards/fade overlays were removed, single-wish controls are hidden, multi-wish auto-slide/manual arrows/dots remain, and touch swipe navigation was added.
- Create-event date input vertical alignment was adjusted for real mobile by giving shared single-line controls an explicit line-height and centering the WebKit date value pseudo-element within the existing input height.
- State-transition scroll behavior was fixed for same-route Wedly transitions by adding a client scroll helper, marking pending top-scroll on `Continue`, consuming it globally after refresh/render, and using it after successful event creation before `router.refresh()`.
- Landing `Continue` scroll timing was adjusted so it only marks a pending top-scroll and does not scroll immediately before the create-state transition.
- Create-event submit now mirrors landing `Continue`: it marks pending top-scroll on submit and waits until owner-state render/refresh before resetting viewport to top.
- Landing hero now uses `public/hero-img.png` as a full-section background image with layered ivory gradients; the previous right-side image card and `next/image` hero markup were removed.
- The RSVP form no longer renders the four corner border ornaments, removing the black corner lines from the public RSVP page while leaving the rest of the ticket styling intact.
- Event slug generation now keeps the readable bride/groom prefix and appends a server-generated UUID suffix via `generateEventSlug`, making public RSVP links less guessable and much less collision-prone.
- Create-event form no longer shows the couple/link preview text; the public link appears only after event creation in the owner page.
- Open Graph and Twitter link preview metadata now use `public/og-img.png` as the default sharing image for the site and dynamic public RSVP pages.
- Create-event form input order was swapped so `Groom Name` appears before `Bride Name`, with matching `name` attributes preserved for server-side submission.
- Shared invitation card now renders the couple name in groom-first display order (`Groom & Bride`) while leaving stored event data unchanged.
- Landing email-start page no longer renders a duplicated inner auth card; the email form now sits directly under the outer `WeddingShell` heading and subheading.

## Validation
- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run build` passed.
- `npm audit` was reduced to `0 vulnerabilities` after fixing the dependency tree.
- Post-update revalidation: `npm run lint`, `npm run typecheck`, and `npm run build` all passed after adding workspace-delete action/UI.
- Follow-up validation after sticky fix: `npm run lint` and `npm run typecheck` both passed.
- Validation after create-event UI simplification: `npm run typecheck` passed.
- Validation after scroll-focus fix: `npm run lint` and `npm run typecheck` passed.
- Validation after mobile date-width fix: `npm run typecheck` passed.
- Validation after removing owner `Switch Email` button: `npm run typecheck` passed.
- Validation after prerender fix: `npm run build` passed, including static generation for `/_not-found`.
- Validation after first-landing refresh update: `npm run typecheck` and `npm run build` passed.
- Validation after landing equal-height tweak: `npm run typecheck` passed.
- Validation after real-mobile date input hardening: `npm run lint`, `npm run typecheck`, and `npm run build` passed.
- Validation after owner/public sticky invitation fix: `npm run lint`, `npm run typecheck`, and `npm run build` passed.
- Validation after single-card wishes carousel refactor: `npm run lint`, `npm run typecheck`, and `npm run build` passed.
- Validation after date input vertical alignment fix: `npm run lint`, `npm run typecheck`, and `npm run build` passed.
- Validation after state-transition scroll reset fix: `npm run lint`, `npm run typecheck`, and `npm run build` passed.
- Validation after landing `Continue` scroll timing fix: `npm run lint` and `npm run typecheck` passed.
- Validation after create-event scroll timing alignment: `npm run lint` and `npm run typecheck` passed.
- Validation after full-background landing hero image correction: `npm run lint`, `npm run typecheck`, and `npm run build` passed.
- Validation after RSVP corner-border removal: `npm run lint`, `npm run typecheck`, and `npm run build` passed.
- Validation after UUID-suffixed event slug update and preview removal: `npm run lint`, `npm run typecheck`, and `npm run build` passed.
- Validation after OG/Twitter metadata update: `npm run lint`, `npm run typecheck`, and `npm run build` passed.
- Validation after create-event field order swap: `npm run lint`, `npm run typecheck`, and `npm run build` passed.
- Validation after invitation-card name order swap: `npm run lint` and `npm run typecheck` passed.
- Validation after landing auth-card deduplication: `npm run lint` and `npm run typecheck` passed.

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
