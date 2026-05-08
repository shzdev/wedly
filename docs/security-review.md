# Wedly Security Review

## Overview

Wedly is currently operating in an email-only owner workspace model intended for MVP testing and demo review.

Owner flow:

- visitor enters an email on `/`
- the server stores a normalized owner email in an `httpOnly` cookie
- owner workspace data is resolved by `events.owner_email`

Public flow:

- anyone with the invitation URL can open `/w/[slug]`
- guests can submit RSVP data and optional wishes

This model deliberately reduces setup friction, but it is not equivalent to verified authentication.

## Current Security Posture

What is true today:

- owner identity is app-enforced, not identity-provider-enforced
- Supabase Auth is not the active owner boundary
- database policies are intentionally relaxed for MVP compatibility
- public invitation content and guestbook content are readable by slug

What this means:

- anyone who knows an owner email can open that workspace on the same deployment
- this setup should not be treated as production-grade tenant isolation

## Core Enforcement Points

- Owner cookie helper:
  - [src/lib/owner-session.ts](../src/lib/owner-session.ts)
- Owner event actions:
  - [src/lib/actions/events.ts](../src/lib/actions/events.ts)
- RSVP actions:
  - [src/lib/actions/rsvps.ts](../src/lib/actions/rsvps.ts)
- CSV export:
  - [src/app/api/rsvps/export/route.ts](../src/app/api/rsvps/export/route.ts)
- Supabase server client:
  - [src/lib/supabase/server.ts](../src/lib/supabase/server.ts)

## Owner-Only Operations

The following operations are protected by server-side owner email checks:

- create event
- load owner event on `/`
- export RSVP CSV
- delete RSVP
- delete full workspace

Important implementation rule:

- owner identity must always come from the `wedly_owner_email` cookie, never from form data or URL parameters

## Publicly Accessible Data

By design, the following are public to anyone with the slug:

- invitation details
- RSVP summary context implied by visible wishes
- wishes displayed in the guestbook carousel

The following are not intended to be public in app UX:

- owner dashboard
- CSV export
- workspace deletion

## Schema and RLS Reality

See [supabase/schema.sql](../supabase/schema.sql).

Current posture:

- `events.owner_email` is the durable owner identifier
- `events.slug` is unique
- `rsvps.event_id` cascades on delete
- read and write policies are intentionally broad enough to support the current anon-key server flow

Consequence:

- the database is not enforcing strict owner isolation through verified identity
- the application layer is carrying that responsibility

## Anti-Spam and Duplicate Controls

Public RSVP protection is lightweight but real:

- honeypot field `company_website`
- hidden render timestamp `form_rendered_at`
- minimum submit delay check
- duplicate guest detection by normalized guest name within the same event

These checks live in [src/lib/actions/rsvps.ts](../src/lib/actions/rsvps.ts).

## CSV Export Safety

CSV export currently includes only reporting fields:

- `guest_name`
- `attendance`
- `pax_count`
- `wish_message`
- `created_at`

Additional safeguards:

- requires owner cookie
- filters by both `slug` and `owner_email`
- escapes quotes in CSV output
- sends `X-Content-Type-Options: nosniff`

## Sentry Privacy Notes

Sentry is used for operational visibility, not content analytics.

Expected behavior:

- RSVP message content should not be intentionally sent to Sentry
- owner email should not be intentionally sent to Sentry
- captured context should stay at the technical level such as `feature`, `slug`, IDs, and database errors

## Manual Security Checklist

1. Logged-out visitors cannot create an event.
2. Email A cannot see Email B owner dashboard through normal app flow.
3. Email A cannot export Email B CSV through normal app flow.
4. Email A cannot delete Email B RSVP through normal app flow.
5. Public guests can open `/w/[slug]`.
6. Public guests can submit RSVP successfully.
7. Duplicate RSVP attempts are rejected gracefully.
8. Honeypot-triggered or too-fast submissions are handled safely.
9. CSV export returns `401` without an owner cookie.
10. Unknown slug renders the public not-found page.
11. No secrets are committed to the repository.

## Known Security Limitations

- Owner access is not verified authentication.
- Relaxed RLS is not suitable for a real multi-tenant client deployment.
- Public wishes are intentionally visible to other guests on the event page.
- There is no IP-based rate limiting or CAPTCHA yet.

## Recommended Production Upgrade Path

1. Restore verified authentication.
2. Move ownership back to a verified identity boundary.
3. Reinstate strict RLS policies.
4. Add stronger rate limiting and optional CAPTCHA.
5. Reassess whether public wishes should remain broadly readable.

## Related Docs

- [docs/developer-guide.md](./developer-guide.md)
- [docs/production-smoke-test.md](./production-smoke-test.md)
- [docs/deployment-troubleshooting.md](./deployment-troubleshooting.md)
