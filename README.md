# Wedly

[![GitHub last commit](https://img.shields.io/github/last-commit/shzdev/wedly?style=for-the-badge)](https://github.com/shzdev/wedly)
[![GitHub repo size](https://img.shields.io/github/repo-size/shzdev/wedly?style=for-the-badge)](https://github.com/shzdev/wedly)
[![GitHub issues](https://img.shields.io/github/issues/shzdev/wedly?style=for-the-badge)](https://github.com/shzdev/wedly/issues)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

Wedly is a luxury wedding RSVP and guestbook app built for a focused, elegant flow: create one invitation page, share one public link, and manage guest responses from a single owner workspace.

![Wedly preview](./public/og-img.png)

## Highlights

- Premium invitation-led UI across landing, owner, and public RSVP flows
- Email-only owner workspace access for MVP/testing, with no email sent
- One event per owner email
- Public invitation page at `/w/[slug]`
- UUID-suffixed public slugs for better uniqueness and lower guessability
- Guest RSVP submission with message support
- Anti-spam protection using a honeypot and minimum submit delay
- Duplicate RSVP protection per event and guest name
- Owner dashboard with invitation preview, public link tools, RSVP summary, guestbook carousel, CSV export, and full workspace deletion
- Open Graph and Twitter metadata using a shared social preview image
- Sentry monitoring across client, server actions, API routes, and edge/server runtime setup

## Product Flow

1. A visitor opens `/` and enters an email address.
2. Wedly stores the normalized email in an `httpOnly` cookie.
3. If no event exists for that email, the visitor is taken to the create-event workspace.
4. The owner creates one event with groom name, bride name, date, venue, and welcome message.
5. Wedly generates a public slug in the format `name-prefix-<uuid>`.
6. Guests open `/w/[slug]`, browse wishes, and submit their RSVP.
7. The owner returns to `/` to review the invitation, track summary counts, export CSV, and manage the workspace.

## Current Scope

### Included

- Editorial landing page with background hero image
- Owner email workspace access
- Single-event creation flow
- Shared invitation card for owner and public page
- Public RSVP page with wishes carousel
- Owner dashboard with summary cards and guestbook carousel
- CSV export
- Full workspace deletion
- Production build support for Vercel deployment

### Explicitly Out of Scope

- Production-grade authentication
- Multiple weddings per owner
- Media upload
- Seating planner or vendor management
- Payment or invitation automation
- Theme switching or design customization

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Supabase Postgres via `@supabase/supabase-js` and `@supabase/ssr`
- Zod
- Sentry
- Vercel

## Architecture Summary

- [src/app/page.tsx](./src/app/page.tsx) is the stateful home route:
  - logged out: landing page
  - owner email with no event: create-event workspace
  - owner email with event: owner manage dashboard
- [src/lib/owner-session.ts](./src/lib/owner-session.ts) manages the owner email cookie.
- [src/lib/actions/events.ts](./src/lib/actions/events.ts) handles owner email access, event creation, owner event lookup, and workspace deletion.
- [src/lib/actions/rsvps.ts](./src/lib/actions/rsvps.ts) handles public RSVP submission, duplicate detection, spam checks, and owner RSVP deletion.
- [src/app/api/rsvps/export/route.ts](./src/app/api/rsvps/export/route.ts) streams CSV exports for the active owner workspace.
- [src/components/wedding-invitation-card.tsx](./src/components/wedding-invitation-card.tsx) is the shared invitation surface used on both owner and public pages.

## Security Note

Wedly currently uses an email-only owner workspace model for MVP/testing.

- No email is sent during access.
- Owner identity is resolved from an `httpOnly` cookie.
- Owner-only operations are enforced in server actions and route handlers.
- The schema is intentionally relaxed so the anon-key flow works without Supabase Auth.

This is acceptable for demo and internal review, but it is not production-secure multi-tenant authentication. Read [docs/security-review.md](./docs/security-review.md) before exposing the app to real client traffic.

## Local Development

Install dependencies:

```bash
npm install
```

Create `.env.local` from [.env.example](./.env.example):

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SENTRY_DSN=
```

Run the app:

```bash
npm run dev
```

## Database Setup

1. Create a Supabase project.
2. Apply [supabase/schema.sql](./supabase/schema.sql).
3. Optionally seed local/demo data from [supabase/seed.sql](./supabase/seed.sql).
4. Confirm both `events` and `rsvps` tables exist with the expected indexes and policies.

## Environment Variables

Required for app runtime:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SENTRY_DSN`

Used for Sentry build and release integration:

- `SENTRY_AUTH_TOKEN`
- `SENTRY_ORG`
- `SENTRY_PROJECT`

## Validation Commands

```bash
npm run lint
npm run typecheck
npm run build
```

## Deployment Notes

1. Push the repository to GitHub.
2. Import it into Vercel as a Next.js project.
3. Add the required environment variables.
4. Apply the Supabase schema.
5. Deploy, then verify metadata and public routes using the production URL.
6. Run the checklist in [docs/production-smoke-test.md](./docs/production-smoke-test.md).

## Documentation

- [docs/developer-guide.md](./docs/developer-guide.md)
- [docs/production-smoke-test.md](./docs/production-smoke-test.md)
- [docs/deployment-troubleshooting.md](./docs/deployment-troubleshooting.md)
- [docs/security-review.md](./docs/security-review.md)
- [docs/case-study.md](./docs/case-study.md)

## Known Limitations

- Owner access is cookie-based by email and not identity-verified.
- One event per owner email.
- Public invitation pages are intentionally readable by anyone with the slug.
- No image upload or custom invitation builder yet.
- Public anti-spam protection is lightweight by design.

## Production Upgrade Path

1. Restore real authentication.
2. Move ownership enforcement back to verified identity.
3. Reinstate strict RLS policies.
4. Add stronger rate limiting and optional CAPTCHA.
5. Expand workspace features only after auth and isolation are hardened.
