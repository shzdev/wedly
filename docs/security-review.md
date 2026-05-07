# Wedly Security Review

## 1) Security Overview
Wedly uses Supabase Auth + PostgreSQL RLS as the primary security boundary.

- Authenticated owner operations:
  - create event
  - manage own RSVP list
  - delete own event RSVP
  - export own event RSVP CSV
- Public guest operations:
  - read invitation data via slug
  - submit RSVP and wish

## 2) Auth Model
- Magic link login handled by Supabase.
- Callback route exchanges auth code for session:
  - [src/app/auth/callback/route.ts](c:/MyProjects/Wedly/src/app/auth/callback/route.ts)
- Session refresh handled by:
  - [src/proxy.ts](c:/MyProjects/Wedly/src/proxy.ts)

## 3) Data Access Model
- Browser client (public-safe keys only):
  - [src/lib/supabase/client.ts](c:/MyProjects/Wedly/src/lib/supabase/client.ts)
- Server client (same anon key, server context + cookies):
  - [src/lib/supabase/server.ts](c:/MyProjects/Wedly/src/lib/supabase/server.ts)
- Server actions and route handlers enforce ownership checks.

## 4) Public vs Private Data
- Publicly visible:
  - `events` content by slug (intended invitation details)
  - `rsvps` guest wishes and attendance summaries (intended guestbook behavior)
- Private owner-only:
  - manage actions on `/`
  - delete RSVP action
  - CSV export route

## 5) RLS Policy Summary
Defined in [supabase/schema.sql](c:/MyProjects/Wedly/supabase/schema.sql):

- `events`:
  - owner insert/select/update/delete by `auth.uid() = user_id`
  - public read for invitation page
- `rsvps`:
  - public insert (guest submission)
  - public read (guestbook display)
  - owner update/delete for RSVP moderation

## 6) Owner-Only Action Checklist
- Delete RSVP:
  - [src/lib/actions/rsvps.ts](c:/MyProjects/Wedly/src/lib/actions/rsvps.ts)
  - verifies logged-in user and event ownership before delete
- Export CSV:
  - [src/app/api/rsvps/export/route.ts](c:/MyProjects/Wedly/src/app/api/rsvps/export/route.ts)
  - verifies logged-in user and owner event lookup by slug

## 7) CSV Export Security
- Export is route-handler based and requires authenticated owner session.
- Query filters by both `slug` and `user_id`.
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
  - `SENTRY_ORG` (optional)
  - `SENTRY_PROJECT` (optional)
- No Supabase service role key is used by this app.
- Env files are ignored via `.gitignore`.

## 11) Sentry Privacy Notes
- Sentry captures operational errors and warning signals.
- RSVP private message content should not be intentionally sent to Sentry.
- Captured tags are scoped to technical context:
  - `feature`
  - `slug`
  - event/rsvp identifiers
  - db error codes/messages

## 12) Manual Security Test Checklist
1. Logged-out user cannot create event.
2. User A cannot manage User B owner view.
3. User A cannot delete User B RSVP.
4. User A cannot export User B RSVP CSV.
5. Public guest can open `/w/[slug]`.
6. Public guest can submit RSVP.
7. Duplicate RSVP gets friendly rejection.
8. Honeypot-triggered submission is rejected.
9. CSV export returns `401` when logged out.
10. Unknown slug shows not-found.
11. Dev Sentry test route works only in non-production.
12. Verify no secrets are committed to repo.

## 13) Known Security Limitations
- Spam protection is lightweight (not full rate limiting).
- Duplicate detection is app-layer based (not strict DB unique constraint).
- Public wishes are intentionally readable as guestbook content.

## 14) Future Hardening Ideas
1. Add per-IP/session rate limiting.
2. Add optional CAPTCHA for high-traffic links.
3. Add security event dashboard/alerts for abuse patterns.
