# Wedly Developer Guide

## Purpose

This guide explains the current application structure, request flow, and the implementation constraints that matter when extending Wedly safely.

## App State Model

The root route [src/app/page.tsx](../src/app/page.tsx) is server-rendered and branches into three states:

1. Logged out: editorial landing page with hero, feature cards, and owner email access.
2. Owner email cookie exists but no event exists: create-event workspace.
3. Owner email cookie exists and an event exists: owner manage dashboard.

That branching is the backbone of the app. Most product behavior is a state transition inside `/`, not a route change.

## Important Files

- Home route: [src/app/page.tsx](../src/app/page.tsx)
- Root metadata and fonts: [src/app/layout.tsx](../src/app/layout.tsx)
- Public invitation route: [src/app/w/[slug]/page.tsx](../src/app/w/[slug]/page.tsx)
- Public not-found state: [src/app/w/[slug]/not-found.tsx](../src/app/w/[slug]/not-found.tsx)
- Legacy auth callback redirect: [src/app/auth/callback/route.ts](../src/app/auth/callback/route.ts)
- Owner session helper: [src/lib/owner-session.ts](../src/lib/owner-session.ts)
- Event server actions: [src/lib/actions/events.ts](../src/lib/actions/events.ts)
- RSVP server actions: [src/lib/actions/rsvps.ts](../src/lib/actions/rsvps.ts)
- CSV export route: [src/app/api/rsvps/export/route.ts](../src/app/api/rsvps/export/route.ts)
- Event validation: [src/lib/validations/event.ts](../src/lib/validations/event.ts)
- RSVP validation: [src/lib/validations/rsvp.ts](../src/lib/validations/rsvp.ts)
- Shared invitation component: [src/components/wedding-invitation-card.tsx](../src/components/wedding-invitation-card.tsx)
- Shared shell layout: [src/components/wedding-shell.tsx](../src/components/wedding-shell.tsx)
- Database schema: [supabase/schema.sql](../supabase/schema.sql)

## Owner Access Model

Wedly no longer uses active Supabase Auth for owner access.

- The owner enters an email address on the landing page.
- The server validates and normalizes the email.
- Wedly stores it in the `wedly_owner_email` `httpOnly` cookie.
- Owner event lookups, CSV export, RSVP deletion, and workspace deletion all depend on that cookie.

Important rule:

- Never trust owner identity from the client, query params, or hidden form inputs.
- Always resolve it from [src/lib/owner-session.ts](../src/lib/owner-session.ts).

## Event Creation Flow

Create-event UI:

- [src/components/create-wedding-form.tsx](../src/components/create-wedding-form.tsx)

Create-event action:

- [src/lib/actions/events.ts](../src/lib/actions/events.ts)

Current behavior:

- Groom name is collected first, then bride name.
- The database still stores one `couple_names` string in the format `Bride & Groom`.
- Public slug generation is server-side only.
- The slug format is `readable-name-prefix + "-" + crypto.randomUUID()`.
- One event per normalized owner email is enforced in both app logic and schema indexes.

## Public RSVP Flow

Public route:

- [src/app/w/[slug]/page.tsx](../src/app/w/[slug]/page.tsx)

RSVP form:

- [src/components/rsvp-form.tsx](../src/components/rsvp-form.tsx)

Submission rules:

- Honeypot field: `company_website`
- Render timestamp field: `form_rendered_at`
- Minimum submit delay: 2 seconds
- Duplicate RSVP detection by normalized guest name within the same event

The public page intentionally remains open for guests. It is invitation-driven, not account-driven.

## Owner Dashboard Surfaces

The owner view is centered in [src/components/manage-wedding-card.tsx](../src/components/manage-wedding-card.tsx).

Current surfaces:

- Sticky invitation preview on desktop
- Public link tools with copy and CSV export
- RSVP summary cards
- Single-card guestbook carousel
- Danger zone to delete the full workspace

Notably absent now:

- No raw RSVP ledger card in the owner UI
- No visible `Switch Email` action in the current UI

## Shared UI Conventions

- Border radius is standardized around `12px`.
- The invitation preview and companion panels use the same visual system.
- On desktop, owner and public pages use a sticky left invitation column.
- The shared invitation card displays groom first visually, even though the stored `couple_names` string remains unchanged.
- The wishes carousel shows exactly one active card at a time.

## Metadata and Share Preview

- Root metadata is defined in [src/app/layout.tsx](../src/app/layout.tsx).
- Public RSVP metadata is generated per slug in [src/app/w/[slug]/page.tsx](../src/app/w/[slug]/page.tsx).
- Social preview image is [public/og-img.png](../public/og-img.png).

## Scroll and Transition Behavior

Wedly uses same-route state transitions on `/`, so scroll handling is explicit.

- [src/lib/scroll-to-top.ts](../src/lib/scroll-to-top.ts) manages top-scroll intent across transitions.
- [src/components/scroll-reset.tsx](../src/components/scroll-reset.tsx) restores the viewport after route or same-route state changes.

If you change the `/` flow, retest scroll behavior carefully.

## Database Notes

Tables in [supabase/schema.sql](../supabase/schema.sql):

- `events`
- `rsvps`

Key constraints and indexes:

- unique event slug
- one event per normalized owner email
- event-level guest name lookup index for duplicate RSVP detection
- cascading delete from `events` to `rsvps`

## Environment Variables

Runtime:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SENTRY_DSN`

Build / Sentry release:

- `SENTRY_AUTH_TOKEN`
- `SENTRY_ORG`
- `SENTRY_PROJECT`

## Safe Extension Checklist

When adding a new event field:

1. Add the DB column in [supabase/schema.sql](../supabase/schema.sql).
2. Add UI input in [src/components/create-wedding-form.tsx](../src/components/create-wedding-form.tsx).
3. Extend [src/lib/validations/event.ts](../src/lib/validations/event.ts).
4. Pass it through [src/lib/actions/events.ts](../src/lib/actions/events.ts).
5. Render it where appropriate in owner/public invitation surfaces.

When adding a new RSVP field:

1. Add the DB column in [supabase/schema.sql](../supabase/schema.sql).
2. Add the UI field in [src/components/rsvp-form.tsx](../src/components/rsvp-form.tsx).
3. Extend [src/lib/validations/rsvp.ts](../src/lib/validations/rsvp.ts).
4. Save it in [src/lib/actions/rsvps.ts](../src/lib/actions/rsvps.ts).
5. Decide whether it belongs in owner reporting, the guestbook carousel, or nowhere public.

## Validation Before Shipping

Run:

```bash
npm run lint
npm run typecheck
npm run build
```

Then complete the deploy checks in [docs/production-smoke-test.md](./production-smoke-test.md).
