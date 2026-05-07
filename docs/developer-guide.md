# Wedly Developer Guide

## 1) Folder Structure
- `src/app`: routes and route handlers
- `src/components`: UI components
- `src/lib/actions`: server actions for business flow
- `src/lib/supabase`: Supabase clients
- `src/lib/validations`: Zod schemas
- `src/lib/utils`: utilities (slug/date formatting)
- `supabase/schema.sql`: DB schema + RLS
- `supabase/seed.sql`: demo seed script

## 2) Important Files
- Home route: [src/app/page.tsx](c:/MyProjects/Wedly/src/app/page.tsx)
- Public wedding route: [src/app/w/[slug]/page.tsx](c:/MyProjects/Wedly/src/app/w/[slug]/page.tsx)
- Auth callback: [src/app/auth/callback/route.ts](c:/MyProjects/Wedly/src/app/auth/callback/route.ts)
- Event actions: [src/lib/actions/events.ts](c:/MyProjects/Wedly/src/lib/actions/events.ts)
- RSVP actions: [src/lib/actions/rsvps.ts](c:/MyProjects/Wedly/src/lib/actions/rsvps.ts)
- CSV export route: [src/app/api/rsvps/export/route.ts](c:/MyProjects/Wedly/src/app/api/rsvps/export/route.ts)
- Event validation: [src/lib/validations/event.ts](c:/MyProjects/Wedly/src/lib/validations/event.ts)
- RSVP validation: [src/lib/validations/rsvp.ts](c:/MyProjects/Wedly/src/lib/validations/rsvp.ts)
- RLS: [supabase/schema.sql](c:/MyProjects/Wedly/supabase/schema.sql)

## 3) Data Flow
1. User opens `/`
2. Server checks auth (`getCurrentUser`)
3. If logged in, server checks event (`getUserEvent`)
4. User creates event via Server Action (`createEvent`)
5. Guests open `/w/[slug]`
6. Guests submit RSVP via Server Action (`submitRsvp`)
7. Server applies spam + duplicate checks before insert
8. Owner sees summary/list updates and can export CSV/delete entries

## 4) Auth Flow
- Login starts in [src/components/auth-card.tsx](c:/MyProjects/Wedly/src/components/auth-card.tsx)
- Supabase sends sign-in link email
- Callback exchange in [src/app/auth/callback/route.ts](c:/MyProjects/Wedly/src/app/auth/callback/route.ts)
- Session cookies stay fresh through [src/proxy.ts](c:/MyProjects/Wedly/src/proxy.ts)
- Supabase email template wording is managed manually in:
  - Authentication -> Email Templates -> Magic Link / Login template

## 5) RSVP Flow
- Form UI: [src/components/rsvp-form.tsx](c:/MyProjects/Wedly/src/components/rsvp-form.tsx)
- Validation + insert: [src/lib/actions/rsvps.ts](c:/MyProjects/Wedly/src/lib/actions/rsvps.ts)
- Schema rules: [src/lib/validations/rsvp.ts](c:/MyProjects/Wedly/src/lib/validations/rsvp.ts)
- Spam guard:
  - Honeypot field `company_website`
  - Hidden timestamp `form_rendered_at`
  - Server rejects unrealistic fast submits (<2s)
- Duplicate guard:
  - Server normalizes `guest_name` and checks existing RSVP in same event

## 6) Supabase RLS Flow
- `events` owner policies protect private management
- `events` public read supports `/w/[slug]`
- `rsvps` public insert allows guest RSVP without login
- `rsvps` owner update/delete reserved for event owner
- Full policies in [supabase/schema.sql](c:/MyProjects/Wedly/supabase/schema.sql)

## 7) Sentry Flow
- Init files:
  - [sentry.server.config.ts](c:/MyProjects/Wedly/sentry.server.config.ts)
  - [sentry.edge.config.ts](c:/MyProjects/Wedly/sentry.edge.config.ts)
  - [instrumentation-client.ts](c:/MyProjects/Wedly/instrumentation-client.ts)
- App registration: [src/instrumentation.ts](c:/MyProjects/Wedly/src/instrumentation.ts)
- Tagged errors from event/RSVP actions
- Also captures:
  - spam rejection warnings
  - duplicate RSVP warnings
  - delete/export failures

## 8) Add New Event Field
1. Add DB column in `supabase/schema.sql`
2. Add input in [src/components/create-wedding-form.tsx](c:/MyProjects/Wedly/src/components/create-wedding-form.tsx)
3. Add Zod rule in [src/lib/validations/event.ts](c:/MyProjects/Wedly/src/lib/validations/event.ts)
4. Pass value in [src/lib/actions/events.ts](c:/MyProjects/Wedly/src/lib/actions/events.ts)
5. Render field in relevant UI cards/pages

## 9) Add New RSVP Field
1. Add DB column in `supabase/schema.sql`
2. Add input in [src/components/rsvp-form.tsx](c:/MyProjects/Wedly/src/components/rsvp-form.tsx)
3. Add Zod rule in [src/lib/validations/rsvp.ts](c:/MyProjects/Wedly/src/lib/validations/rsvp.ts)
4. Save value in [src/lib/actions/rsvps.ts](c:/MyProjects/Wedly/src/lib/actions/rsvps.ts)
5. Display field in [src/components/wishes-list.tsx](c:/MyProjects/Wedly/src/components/wishes-list.tsx) if needed

## 10) Change UI Theme
- Edit tokens in [src/app/globals.css](c:/MyProjects/Wedly/src/app/globals.css)
- Update copy/layout in:
  - [src/components/wedding-shell.tsx](c:/MyProjects/Wedly/src/components/wedding-shell.tsx)
  - [src/app/page.tsx](c:/MyProjects/Wedly/src/app/page.tsx)
  - [src/app/w/[slug]/page.tsx](c:/MyProjects/Wedly/src/app/w/[slug]/page.tsx)

## 11) Deploy
1. Set env vars in Vercel
2. Apply SQL schema in Supabase
3. Set Supabase auth redirect URL
4. Run `npm run lint`, `npm run typecheck`, `npm run build`
5. Deploy
6. Run security checklist in [docs/security-review.md](c:/MyProjects/Wedly/docs/security-review.md)

## 12) Common Debug Cases
- Sign-in link redirect fails:
  - Check Supabase redirect URL config
- Create event fails:
  - Check RLS and unique constraints in `events`
- RSVP fails:
  - Check `rsvps` insert policies
- Duplicate RSVP flagged too aggressively:
  - Check normalization logic in [src/lib/actions/rsvps.ts](c:/MyProjects/Wedly/src/lib/actions/rsvps.ts)
- Export CSV fails:
  - Check owner auth, event ownership, and route params in [src/app/api/rsvps/export/route.ts](c:/MyProjects/Wedly/src/app/api/rsvps/export/route.ts)
- Sentry events missing:
  - Check DSN env var and runtime init files

## 13) Security Notes
- Public-safe vars: `NEXT_PUBLIC_*` values only.
- Sensitive vars: `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`.
- Never add Supabase service role key to frontend env.
- Use [docs/security-review.md](c:/MyProjects/Wedly/docs/security-review.md) as production security reference.

## 14) Launch and Demo Docs
- Live demo talk track: [docs/demo-script.md](c:/MyProjects/Wedly/docs/demo-script.md)
- Post-deploy verification: [docs/production-smoke-test.md](c:/MyProjects/Wedly/docs/production-smoke-test.md)
- Deployment troubleshooting: [docs/deployment-troubleshooting.md](c:/MyProjects/Wedly/docs/deployment-troubleshooting.md)
- Final launch copy pack: [docs/final-launch-copy.md](c:/MyProjects/Wedly/docs/final-launch-copy.md)
