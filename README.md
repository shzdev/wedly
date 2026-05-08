# Wedly
Create a beautiful wedding RSVP page in minutes.

Live demo: `[LIVE_DEMO_URL]`  
GitHub: `[GITHUB_REPO_URL]`

## Screenshot
- Home (landing + email workspace access): `<SCREENSHOT_URL_OR_PATH>`
- Home (owner manage workspace): `<SCREENSHOT_URL_OR_PATH>`
- Public RSVP page (`/w/nadia-aiman`): `<SCREENSHOT_URL_OR_PATH>`

## Product Summary
Wedly is a focused wedding RSVP + guestbook MVP for couples who only need:
- one elegant invitation page
- RSVP collection
- guest wishes

## Important MVP Access Note
Wedly now uses **email-only owner access** for MVP/testing:
- the owner enters an email on `/`
- no email is sent
- the app stores that email in an httpOnly cookie
- the event workspace is loaded by `owner_email`

This avoids Supabase free-plan email limits during testing, but it is **not production-secure authentication**. Anyone who knows the owner email can open that workspace on the same deployment.

## Core Features
- Email-only owner workspace access for MVP/demo mode
- One event per owner email (v1 scope)
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
- Supabase Postgres
- Zod
- Sentry
- Vercel

## Architecture Overview
- `src/app/page.tsx`: owner-email-aware home route
- `src/lib/owner-session.ts`: owner email cookie helpers
- `src/lib/actions/events.ts`: owner session and event flow
- `src/lib/actions/rsvps.ts`: guest RSVP flow + owner RSVP delete
- `src/app/api/rsvps/export/route.ts`: owner CSV export by slug + owner email
- `supabase/schema.sql`: DB schema + MVP RLS posture

## User Flow
1. Visitor opens `/`
2. Visitor enters owner email
3. App creates an email workspace cookie
4. Owner creates one event
5. Owner shares `/w/[slug]`
6. Guest submits RSVP + wish
7. Owner returns to `/` and manages responses

## Database Overview
- `events`
  - stores owner email, event details, and unique slug
  - one event per owner email
- `rsvps`
  - stores guest responses and wishes per event

See full schema: [supabase/schema.sql](c:/MyProjects/Wedly/supabase/schema.sql)

## Security Model Summary
- Public guest flow remains open for RSVP + invitation viewing
- Owner actions are gated in server actions/routes by the owner email cookie
- No Supabase service role key is used
- This MVP model is weaker than real auth because DB ownership is no longer enforced by `auth.uid()`
- Detailed notes: [docs/security-review.md](c:/MyProjects/Wedly/docs/security-review.md)

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
1. Create a Supabase project.
2. Apply [supabase/schema.sql](c:/MyProjects/Wedly/supabase/schema.sql) in SQL Editor.
3. No Supabase email auth setup is required for this MVP mode.
4. Confirm tables and indexes exist on `events` and `rsvps`.
5. Review [docs/security-review.md](c:/MyProjects/Wedly/docs/security-review.md) before public sharing.

## Schema and Seed Instructions
- Base schema:
  - [supabase/schema.sql](c:/MyProjects/Wedly/supabase/schema.sql)
- Demo seed:
  - [supabase/seed.sql](c:/MyProjects/Wedly/supabase/seed.sql)

Seed note:
- Replace the demo owner email in `seed.sql` if needed.
- Demo event slug: `nadia-aiman`.

## Vercel Deployment
1. Push repository to GitHub.
2. Import project in Vercel (framework preset: Next.js).
3. Set environment variables from [.env.example](c:/MyProjects/Wedly/.env.example).
4. Deploy once, copy production URL, then set `NEXT_PUBLIC_SITE_URL` to that URL.
5. Redeploy after updating `NEXT_PUBLIC_SITE_URL`.
6. Run the production smoke test.

## Testing Checklist
- Email workspace access works without sending email
- Create event works
- Duplicate slug shows friendly error
- Public page `/w/[slug]` loads
- Guest RSVP submission succeeds
- Honeypot/fast-submit spam checks reject suspicious submissions
- Duplicate RSVP shows friendly message
- Wishes carousel updates
- Owner can delete RSVP from manage panel
- Owner CSV export download works
- Not-found state works for invalid slug
- Sentry dev test route works on local:
  - `GET /api/dev/sentry-test`

## Manual Security Checklist
- Logged-out visitor cannot create event
- Email A cannot see Email B workspace
- Email A cannot delete Email B RSVP through the app
- Email A cannot export Email B CSV through the app
- Public guest can open `/w/[slug]`
- Public guest can submit RSVP
- Duplicate RSVP gets friendly rejection
- Honeypot spam simulation is rejected
- CSV route returns unauthorized when no owner cookie exists
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
- Owner access is email-only and not production-secure
- No image upload
- No multiple themes
- No payment flow
- No invite automation
- No seating planner/vendor tools
- No advanced analytics dashboard

## Future Improvements (Real Auth Path)
1. Restore proper Supabase Auth on a plan with sufficient email capacity
2. Add passwordless OTP provider or OAuth
3. Reintroduce DB ownership tied to verified identity
4. Add stronger rate limiting and optional CAPTCHA

## Before Sharing Publicly
1. Replace placeholders:
- `[LIVE_DEMO_URL]`
- `[GITHUB_REPO_URL]`
- Screenshot placeholders
2. Confirm production env vars are set in Vercel.
3. Run [docs/production-smoke-test.md](c:/MyProjects/Wedly/docs/production-smoke-test.md) end-to-end.
4. Decide whether the email-only owner access limitation is acceptable for your audience.
5. Use [docs/final-launch-copy.md](c:/MyProjects/Wedly/docs/final-launch-copy.md) for first public post.

## Portfolio Case Study Summary
Wedly demonstrates end-to-end MVP delivery: product scoping, invitation-led UI polish, owner/guest workflows, server action flows, and monitoring within a small, maintainable codebase.

Detailed write-up: [docs/case-study.md](c:/MyProjects/Wedly/docs/case-study.md)
