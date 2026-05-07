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
7. Wishes list refreshes from `getRsvpsByEvent`

## 4) Auth Flow
- Login starts in [src/components/auth-card.tsx](c:/MyProjects/Wedly/src/components/auth-card.tsx)
- Supabase sends magic link
- Callback exchange in [src/app/auth/callback/route.ts](c:/MyProjects/Wedly/src/app/auth/callback/route.ts)
- Session cookies stay fresh through [src/proxy.ts](c:/MyProjects/Wedly/src/proxy.ts)

## 5) RSVP Flow
- Form UI: [src/components/rsvp-form.tsx](c:/MyProjects/Wedly/src/components/rsvp-form.tsx)
- Validation + insert: [src/lib/actions/rsvps.ts](c:/MyProjects/Wedly/src/lib/actions/rsvps.ts)
- Schema rules: [src/lib/validations/rsvp.ts](c:/MyProjects/Wedly/src/lib/validations/rsvp.ts)

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

## 12) Common Debug Cases
- Magic link redirect fails:
  - Check Supabase redirect URL config
- Create event fails:
  - Check RLS and unique constraints in `events`
- RSVP fails:
  - Check `rsvps` insert policies
- Sentry events missing:
  - Check DSN env var and runtime init files
