# Wedly Security Review

## 1) Security Overview
Wedly is currently running in **email-only MVP owner access mode**.

Owner flow:
- visitor enters an email on `/`
- app stores normalized owner email in an httpOnly cookie
- owner workspace loads by `events.owner_email`

Public guest flow:
- read invitation data via slug
- submit RSVP and wish

This avoids Supabase free-plan email limits during testing, but it is **not production-grade authentication**.

## 2) Security Limitation
This model is intentionally weaker than real auth:
- anyone who knows an owner email can access that workspace on the same deployment
- database ownership is no longer enforced by `auth.uid()`
- owner isolation is enforced in server actions/routes, not by a verified identity provider

This is acceptable for local testing, demo mode, or temporary MVP review only.

## 3) Data Access Model
- Server Supabase client:
  - [src/lib/supabase/server.ts](c:/MyProjects/Wedly/src/lib/supabase/server.ts)
- Owner cookie helper:
  - [src/lib/owner-session.ts](c:/MyProjects/Wedly/src/lib/owner-session.ts)
- Owner server checks:
  - [src/lib/actions/events.ts](c:/MyProjects/Wedly/src/lib/actions/events.ts)
  - [src/lib/actions/rsvps.ts](c:/MyProjects/Wedly/src/lib/actions/rsvps.ts)
  - [src/app/api/rsvps/export/route.ts](c:/MyProjects/Wedly/src/app/api/rsvps/export/route.ts)

## 4) Public vs Private Data
- Publicly visible:
  - `events` invitation content by slug
  - `rsvps` guest wishes and attendance summaries shown publicly
- Owner-only in app UX:
  - event creation
  - owner manage view on `/`
  - delete RSVP action
  - CSV export route

## 5) Current Schema / RLS Posture
Defined in [supabase/schema.sql](c:/MyProjects/Wedly/supabase/schema.sql):

- `events.owner_email` is the owner identifier
- public read of `events` and `rsvps` is enabled
- insert/delete/update policies are relaxed so server-side anon-key calls can work without Supabase Auth

Important consequence:
- these policies are intentionally looser than a real production setup
- do not treat this schema as secure multi-tenant production isolation

## 6) Owner-Only Action Checks
- Create event:
  - [src/lib/actions/events.ts](c:/MyProjects/Wedly/src/lib/actions/events.ts)
  - reads owner email from cookie, never from form data
- Delete RSVP:
  - [src/lib/actions/rsvps.ts](c:/MyProjects/Wedly/src/lib/actions/rsvps.ts)
  - fetches RSVP, then event, then checks `event.owner_email === cookie owner email`
- Export CSV:
  - [src/app/api/rsvps/export/route.ts](c:/MyProjects/Wedly/src/app/api/rsvps/export/route.ts)
  - filters by both `slug` and `owner_email`

## 7) CSV Export Security
- Export requires owner email cookie.
- Query filters by both `slug` and `owner_email`.
- CSV output uses explicit escaping for quotes.
- Response includes `X-Content-Type-Options: nosniff`.
- Exported columns are limited to RSVP reporting fields only.

## 8) Spam Protection Security
- Implemented in [src/lib/actions/rsvps.ts](c:/MyProjects/Wedly/src/lib/actions/rsvps.ts)
- Controls:
  - honeypot field `company_website`
  - form-render timestamp `form_rendered_at`
  - minimum submit delay check
- Checks are server-side, not client-only.
- Suspicious submissions are handled gracefully to reduce abuse signal leaks.

## 9) Duplicate RSVP Protection
- Guest name normalized (`trim`, `lowercase`, whitespace collapse) in server action.
- Duplicate detection scoped to the same event.
- Performance index:
  - `rsvps_event_guest_name_ci_idx` in schema.

## 10) Environment Variable Safety
- Public-safe env vars:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_SITE_URL`
  - `NEXT_PUBLIC_SENTRY_DSN`
- Sensitive env vars:
  - `SENTRY_AUTH_TOKEN`
  - `SENTRY_ORG`
  - `SENTRY_PROJECT`
- No Supabase service role key is used by this app.
- Env files are ignored via `.gitignore`.

## 11) Sentry Privacy Notes
- Sentry captures operational errors and warning signals.
- RSVP private message content should not be intentionally sent to Sentry.
- Owner email should not be intentionally sent to Sentry.
- Captured tags are scoped to technical context:
  - `feature`
  - `slug`
  - event/rsvp identifiers
  - db error codes/messages

## 12) Manual Security Test Checklist
1. Logged-out visitor cannot create event.
2. Email A cannot see Email B owner view.
3. Email A cannot delete Email B RSVP through app flow.
4. Email A cannot export Email B RSVP CSV through app flow.
5. Public guest can open `/w/[slug]`.
6. Public guest can submit RSVP.
7. Duplicate RSVP gets friendly rejection.
8. Honeypot-triggered submission is rejected.
9. CSV export returns `401` with no owner cookie.
10. Unknown slug shows not-found.
11. Dev Sentry test route works only in non-production.
12. Verify no secrets are committed to repo.

## 13) Known Security Limitations
- Owner access is email-only and not verified.
- RLS is intentionally relaxed for MVP mode.
- Public wishes are intentionally readable as guestbook content.
- This setup should not be used for real production clients.

## 14) Recommended Production Upgrade Path
1. Restore real auth:
  - Supabase Auth on a sufficient plan
  - passwordless provider with proper verification
  - OAuth
  - password auth if desired
2. Move DB ownership back to verified identity
3. Reinstate strict RLS policies
4. Add rate limiting and optional CAPTCHA

## 15) Related Launch Docs
- Demo flow and talking points: [docs/demo-script.md](c:/MyProjects/Wedly/docs/demo-script.md)
- Production verification steps: [docs/production-smoke-test.md](c:/MyProjects/Wedly/docs/production-smoke-test.md)
