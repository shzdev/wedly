# Wedly Developer Guide

## 1) Folder Structure
- `src/app`: routes and route handlers
- `src/components`: UI components
- `src/lib/actions`: server actions for business flow
- `src/lib/owner-session.ts`: owner email cookie helpers
- `src/lib/supabase`: Supabase server client
- `src/lib/validations`: Zod schemas
- `src/lib/utils`: utilities (slug/date formatting)
- `supabase/schema.sql`: DB schema + MVP RLS posture
- `supabase/seed.sql`: demo seed script

## 2) Important Files
- Home route: [src/app/page.tsx](c:/MyProjects/Wedly/src/app/page.tsx)
- Public wedding route: [src/app/w/[slug]/page.tsx](c:/MyProjects/Wedly/src/app/w/[slug]/page.tsx)
- Legacy callback redirect: [src/app/auth/callback/route.ts](c:/MyProjects/Wedly/src/app/auth/callback/route.ts)
- Owner session helper: [src/lib/owner-session.ts](c:/MyProjects/Wedly/src/lib/owner-session.ts)
- Event actions: [src/lib/actions/events.ts](c:/MyProjects/Wedly/src/lib/actions/events.ts)
- RSVP actions: [src/lib/actions/rsvps.ts](c:/MyProjects/Wedly/src/lib/actions/rsvps.ts)
- CSV export route: [src/app/api/rsvps/export/route.ts](c:/MyProjects/Wedly/src/app/api/rsvps/export/route.ts)
- Event validation: [src/lib/validations/event.ts](c:/MyProjects/Wedly/src/lib/validations/event.ts)
- RSVP validation: [src/lib/validations/rsvp.ts](c:/MyProjects/Wedly/src/lib/validations/rsvp.ts)
- Schema: [supabase/schema.sql](c:/MyProjects/Wedly/supabase/schema.sql)

## 3) Data Flow
1. Visitor opens `/`
2. Server checks owner email cookie via `getCurrentOwnerEmail`
3. If cookie exists, server loads event by `owner_email`
4. Owner creates event via Server Action (`createEvent`)
5. Guests open `/w/[slug]`
6. Guests submit RSVP via Server Action (`submitRsvp`)
7. Server applies spam + duplicate checks before insert
8. Owner sees summary/list updates and can export CSV/delete entries

## 4) Owner Access Flow
- Access starts in [src/components/auth-card.tsx](c:/MyProjects/Wedly/src/components/auth-card.tsx)
- Owner enters an email
- No email is sent
- Server action validates and normalizes email, then sets the `wedly_owner_email` cookie
- The cookie is httpOnly, `sameSite=lax`, path `/`, and lasts 30 days
- `clearOwnerSession` clears that cookie and returns the app to landing state

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

## 6) Ownership Model
- Event ownership is now stored in `events.owner_email`
- One event per normalized owner email
- Server actions and route handlers must read owner email from cookie
- Never trust owner email from client form input or URL params

## 7) Supabase / RLS Reality
- This MVP mode no longer uses Supabase Auth as the identity boundary
- Because of that, `auth.uid()`-based RLS is no longer available for owner checks
- Owner restrictions now happen in app-layer server checks
- Schema policies are intentionally relaxed to keep anon-key server queries working
- This is acceptable for local testing/demo mode only, not for real production security

## 8) Sentry Flow
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
- Do not send RSVP message content or owner email to Sentry intentionally

## 9) Add New Event Field
1. Add DB column in `supabase/schema.sql`
2. Add input in [src/components/create-wedding-form.tsx](c:/MyProjects/Wedly/src/components/create-wedding-form.tsx)
3. Add Zod rule in [src/lib/validations/event.ts](c:/MyProjects/Wedly/src/lib/validations/event.ts)
4. Pass value in [src/lib/actions/events.ts](c:/MyProjects/Wedly/src/lib/actions/events.ts)
5. Render field in relevant UI cards/pages

## 10) Add New RSVP Field
1. Add DB column in `supabase/schema.sql`
2. Add input in [src/components/rsvp-form.tsx](c:/MyProjects/Wedly/src/components/rsvp-form.tsx)
3. Add Zod rule in [src/lib/validations/rsvp.ts](c:/MyProjects/Wedly/src/lib/validations/rsvp.ts)
4. Save value in [src/lib/actions/rsvps.ts](c:/MyProjects/Wedly/src/lib/actions/rsvps.ts)
5. Display field in [src/components/wishes-list.tsx](c:/MyProjects/Wedly/src/components/wishes-list.tsx) if needed

## 11) Deploy
1. Set env vars in Vercel
2. Apply SQL schema in Supabase
3. Run `npm run lint`, `npm run typecheck`, `npm run build`
4. Deploy
5. Run security checklist in [docs/security-review.md](c:/MyProjects/Wedly/docs/security-review.md)

## 12) Common Debug Cases
- Email workspace does not persist after submit:
  - Check [src/lib/owner-session.ts](c:/MyProjects/Wedly/src/lib/owner-session.ts)
- Create event fails:
  - Check owner cookie, schema uniqueness, and action logs
- RSVP fails:
  - Check `rsvps` insert access and validation
- Duplicate RSVP flagged too aggressively:
  - Check normalization logic in [src/lib/actions/rsvps.ts](c:/MyProjects/Wedly/src/lib/actions/rsvps.ts)
- Export CSV fails:
  - Check owner cookie, slug lookup, and [src/app/api/rsvps/export/route.ts](c:/MyProjects/Wedly/src/app/api/rsvps/export/route.ts)
- Sentry events missing:
  - Check DSN env var and runtime init files

## 13) Security Notes
- Public-safe vars: `NEXT_PUBLIC_*` values only.
- Sensitive vars: `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`.
- Never add Supabase service role key to frontend env.
- This MVP owner-access model is not secure enough for production clients.
- Use [docs/security-review.md](c:/MyProjects/Wedly/docs/security-review.md) as the current security reference.

## 14) Launch and Demo Docs
- Live demo talk track: [docs/demo-script.md](c:/MyProjects/Wedly/docs/demo-script.md)
- Post-deploy verification: [docs/production-smoke-test.md](c:/MyProjects/Wedly/docs/production-smoke-test.md)
- Deployment troubleshooting: [docs/deployment-troubleshooting.md](c:/MyProjects/Wedly/docs/deployment-troubleshooting.md)
- Final launch copy pack: [docs/final-launch-copy.md](c:/MyProjects/Wedly/docs/final-launch-copy.md)
