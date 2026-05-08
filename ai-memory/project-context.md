# Project Context

## Home Page State Model
- `/` is auth-conditional:
  - logged out: editorial landing page with hero, feature tickets, and auth entry section
  - logged in with no event: focused create-event screen using `WeddingShell` with `priority="content"`
  - logged in with existing event: dedicated owner manage page that bypasses the landing hero and renders a full-width invitation-led layout

## Event Creation Conventions
- The database still stores couple names only in `events.couple_names`.
- `src/components/create-wedding-form.tsx` collects `bride_name` and `groom_name` separately for UX, then `src/lib/actions/events.ts` combines them into `${bride} & ${groom}` before insert.
- The event slug is auto-generated from the two names with the existing slug utility and is not user-editable.
- Name safety is enforced server-side in `src/lib/validations/event.ts` before slug generation.

## Owner View Conventions
- `src/components/manage-wedding-card.tsx` is the main owner UI surface and now owns the invitation preview, link tools, RSVP summary, wishes carousel, and RSVP ledger.
- The invitation preview is sticky on larger screens and moves above the companion panels on mobile.
- `src/components/wishes-list.tsx` is now a client component because the owner guestbook uses an auto-rotating carousel.

## Shared Invitation/Public Guest Conventions
- `src/components/wedding-invitation-card.tsx` is the shared printed-invitation surface used by both owner and public wedding pages.
- `/w/[slug]` now follows the same two-column pattern as the owner page on desktop: sticky invitation left, guest interaction content right.
- `src/components/rsvp-form.tsx` keeps the existing hidden anti-spam fields and server action flow, but now renders as an invitation-style form with segmented attendance controls.
