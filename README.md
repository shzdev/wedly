# Wedly
Create a beautiful wedding RSVP page in minutes.

Live demo: `[LIVE_DEMO_URL]`  
GitHub: `[GITHUB_REPO_URL]`

## Screenshot
- Logged-out home (hero + magic-link form): `<SCREENSHOT_URL_OR_PATH>`
- Logged-in home (manage RSVP + summary + CSV): `<SCREENSHOT_URL_OR_PATH>`
- Public RSVP page (`/w/nadia-aiman`): `<SCREENSHOT_URL_OR_PATH>`

## Problem Statement
Most wedding tools are either too heavy or too expensive for couples who only need:
- one elegant invitation page
- RSVP collection
- guest wishes

Wedly solves this with a focused MVP flow and warm luxury visual direction.

## Core Features
- Magic-link login (Supabase Auth)
- One event per account (v1 scope)
- Public wedding page at `/w/[slug]`
- Guest RSVP + wish submission
- Basic spam protection (honeypot + minimum submit delay)
- Duplicate RSVP protection per event + guest name
- Owner RSVP management (summary + list + delete)
- Owner CSV export for RSVP list
- Sentry monitoring for critical server actions

## Tech Stack
- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- Supabase Auth + Postgres + RLS
- Zod
- Sentry
- Vercel

## Architecture Overview
- `src/app/page.tsx`: main route with auth-aware UI branching
- `src/app/w/[slug]/page.tsx`: public invitation + RSVP page
- `src/lib/actions/events.ts`: event actions and owner flow
- `src/lib/actions/rsvps.ts`: RSVP actions and guest flow
- `supabase/schema.sql`: DB schema + RLS policies

## User Flow
1. User opens `/`
2. User logs in via magic link
3. User creates one event
4. User copies public link
5. Guest opens `/w/[slug]`
6. Guest submits RSVP + wish
7. Owner sees latest wishes on `/`

## Database Overview
- `events`
  - stores owner event details and unique slug
  - one-event-per-user constraint
- `rsvps`
  - stores guest responses and wishes per event

See full schema: [supabase/schema.sql](c:/MyProjects/Wedly/supabase/schema.sql)

## Security and RLS Overview
- RLS enabled on `events` and `rsvps`
- Owner can manage own event data
- Public can read invitation data and submit RSVP
- No Supabase service role key exposed in frontend
- Owner RSVP delete is enforced by RLS policy (`rsvps owner delete`)
- Owner CSV export is enforced by session + ownership checks in route handler
- Detailed security notes: [docs/security-review.md](c:/MyProjects/Wedly/docs/security-review.md)

## Sentry Monitoring Overview
- Runtime init:
  - [sentry.server.config.ts](c:/MyProjects/Wedly/sentry.server.config.ts)
  - [sentry.edge.config.ts](c:/MyProjects/Wedly/sentry.edge.config.ts)
  - [instrumentation-client.ts](c:/MyProjects/Wedly/instrumentation-client.ts)
- Error capture in:
  - [src/lib/actions/events.ts](c:/MyProjects/Wedly/src/lib/actions/events.ts)
  - [src/lib/actions/rsvps.ts](c:/MyProjects/Wedly/src/lib/actions/rsvps.ts)
  - [src/app/api/rsvps/export/route.ts](c:/MyProjects/Wedly/src/app/api/rsvps/export/route.ts)

## Local Setup
```bash
npm install
```

Create `.env.local` from `.env.example`:
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=
```

Run local:
```bash
npm run dev
```

## Supabase Setup
1. Create project in Supabase.
2. Apply [supabase/schema.sql](c:/MyProjects/Wedly/supabase/schema.sql) in SQL Editor.
3. Configure Auth URL settings:
  - Site URL: `https://YOUR_VERCEL_DOMAIN` (or custom domain)
  - Redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `https://YOUR_VERCEL_DOMAIN/auth/callback`
  - `https://YOUR_CUSTOM_DOMAIN/auth/callback` (if custom domain is enabled)
4. Confirm RLS is enabled and policies exist on `events` and `rsvps`.

## Schema and Seed Instructions
- Base schema:
  - [supabase/schema.sql](c:/MyProjects/Wedly/supabase/schema.sql)
- Demo seed:
  - [supabase/seed.sql](c:/MyProjects/Wedly/supabase/seed.sql)

Seed note:
- Replace `demo_user_id` in `seed.sql` with a real `auth.users.id` from your Supabase project before running.
- Demo event slug: `nadia-aiman`.

v1.1 schema note for existing projects:
- Re-run [supabase/schema.sql](c:/MyProjects/Wedly/supabase/schema.sql) to ensure:
  - `rsvps owner delete` policy exists
  - `rsvps_event_guest_name_ci_idx` index exists

## Vercel Deployment
1. Push repository to GitHub.
2. Import project in Vercel (framework preset: Next.js).
3. Set environment variables from [.env.example](c:/MyProjects/Wedly/.env.example).
4. Deploy once, copy production URL, then set `NEXT_PUBLIC_SITE_URL` to that URL.
5. Redeploy after updating `NEXT_PUBLIC_SITE_URL`.
6. Add production callback URL to Supabase redirect list.
7. Test magic-link auth on production URL.

## Testing Checklist
- Login magic link works
- Create event works
- Duplicate slug shows friendly error
- Public page `/w/[slug]` loads
- Guest RSVP submission succeeds
- Honeypot/fast-submit spam checks reject suspicious submissions
- Duplicate RSVP shows friendly message
- Wishes list updates
- Owner can delete RSVP from manage panel
- Owner CSV export download works
- Not-found state works for invalid slug
- Sentry dev test route works on local:
  - `GET /api/dev/sentry-test`

## Manual Security Checklist
- Logged-out user cannot create event
- User A cannot view/manage User B owner data
- User A cannot delete User B RSVP
- User A cannot export User B CSV
- Public guest can open `/w/[slug]`
- Public guest can submit RSVP
- Duplicate RSVP gets friendly rejection
- Honeypot spam simulation is rejected
- CSV route returns unauthorized when logged out
- Unknown slug shows not-found
- No secrets are committed in repo

## Commands
```bash
npm run lint
npm run typecheck
npm run build
```

## Demo and Launch Docs
- Demo walkthrough script: [docs/demo-script.md](c:/MyProjects/Wedly/docs/demo-script.md)
- Production smoke test: [docs/production-smoke-test.md](c:/MyProjects/Wedly/docs/production-smoke-test.md)
- Developer handoff: [docs/developer-guide.md](c:/MyProjects/Wedly/docs/developer-guide.md)
- Security checklist: [docs/security-review.md](c:/MyProjects/Wedly/docs/security-review.md)
- Deployment troubleshooting: [docs/deployment-troubleshooting.md](c:/MyProjects/Wedly/docs/deployment-troubleshooting.md)
- Final launch copy: [docs/final-launch-copy.md](c:/MyProjects/Wedly/docs/final-launch-copy.md)

## Known Limitations
- No image upload
- No multiple themes
- No payment flow
- No invite automation
- No seating planner/vendor tools
- No advanced analytics dashboard

## Future Improvements (v1.1)
1. Stronger rate limiting per IP/session
2. Optional CAPTCHA toggle for high-traffic events
3. Bulk RSVP actions (archive/restore)
4. Lightweight RSVP analytics summary

## Before Sharing Publicly
1. Replace placeholders:
- `[LIVE_DEMO_URL]`
- `[GITHUB_REPO_URL]`
- Screenshot placeholders
2. Confirm production env vars are set in Vercel.
3. Confirm Supabase redirect URLs include production domain.
4. Run [docs/production-smoke-test.md](c:/MyProjects/Wedly/docs/production-smoke-test.md) end-to-end.
5. Use [docs/final-launch-copy.md](c:/MyProjects/Wedly/docs/final-launch-copy.md) for first public post.

## Portfolio Case Study Summary
Wedly demonstrates end-to-end MVP delivery: product scoping, Supabase RLS design, server action flows, UI polish, and production monitoring within a small, maintainable codebase.

Detailed write-up: [docs/case-study.md](c:/MyProjects/Wedly/docs/case-study.md)
