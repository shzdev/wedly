# Wedly MVP

Wedly ialah MVP satu-hari untuk wedding RSVP + guestbook:
- Login magic link (Supabase Auth)
- Setiap user cipta satu event sahaja (v1 scope)
- Public page di `/w/[slug]` untuk RSVP + wishes
- Owner boleh salin link, lihat kiraan RSVP, dan wishes terkini

## Tech Stack
- Next.js App Router + TypeScript + Tailwind CSS
- Supabase Auth + Supabase Postgres + RLS
- Zod validation
- Sentry (error monitoring)
- Vercel-ready deployment

## Ciri Utama
- Logged-out: landing + login card
- Logged-in tanpa event: create event form
- Logged-in dengan event: manage card + copy link + latest wishes
- Public guests: submit RSVP dan wish message
- Elegant not-found state untuk slug tidak sah

## Struktur Projek
```txt
src/
  app/
    page.tsx
    auth/callback/route.ts
    w/[slug]/page.tsx
    w/[slug]/not-found.tsx
    api/dev/sentry-test/route.ts
  components/
    auth-card.tsx
    create-wedding-form.tsx
    manage-wedding-card.tsx
    rsvp-form.tsx
    wishes-list.tsx
    copy-link-button.tsx
    wedding-shell.tsx
  lib/
    actions/
      events.ts
      rsvps.ts
    supabase/
      client.ts
      server.ts
    validations/
      event.ts
      rsvp.ts
    utils/
      slug.ts
      date.ts
  proxy.ts
  instrumentation.ts
supabase/
  schema.sql
```

## Setup dari Kosong

### 1) Install dependencies
```bash
npm install
```

### 2) Cipta Supabase project
Ambil dari Supabase dashboard:
- `Project URL`
- `Anon key`

### 3) Apply schema SQL
1. Buka Supabase SQL Editor.
2. Run kandungan [supabase/schema.sql](c:/MyProjects/Wedly/supabase/schema.sql).

Jika perlu reset:
1. Drop tables `public.rsvps` dan `public.events`.
2. Run semula `supabase/schema.sql`.

### 4) Auth redirect configuration
Di Supabase `Authentication > URL Configuration`:
- Site URL: `http://localhost:3000`
- Redirect URL local: `http://localhost:3000/auth/callback`
- Redirect URL production: `https://<your-domain>/auth/callback`

### 5) Environment variables
Copy `.env.example` ke `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=
```

Nota keselamatan:
- Jangan letak `SUPABASE_SERVICE_ROLE_KEY` di browser.
- MVP ini tidak perlukan service role key.

### 6) Run local
```bash
npm run dev
```
Open `http://localhost:3000`.

## Integrasi Sentry
- Runtime config:
  - [sentry.server.config.ts](c:/MyProjects/Wedly/sentry.server.config.ts)
  - [sentry.edge.config.ts](c:/MyProjects/Wedly/sentry.edge.config.ts)
  - [instrumentation-client.ts](c:/MyProjects/Wedly/instrumentation-client.ts)
  - [src/instrumentation.ts](c:/MyProjects/Wedly/src/instrumentation.ts)
- Next config wrapper:
  - [next.config.ts](c:/MyProjects/Wedly/next.config.ts)
- Dev-only error test:
  - `GET /api/dev/sentry-test`
  - Di production route ini pulangkan `404`.

## Validation Commands
```bash
npm run lint
npm run build
```

## Manual QA Checklist
1. Logged-out user nampak login card pada `/`.
2. Magic link dihantar, callback sign-in berjaya.
3. Logged-in user tanpa event boleh create event.
4. Cuba slug duplicate, dapat error mesra pengguna.
5. Logged-in user dengan event nampak manage card + copy link.
6. Buka `/w/[slug]`, event detail dipaparkan.
7. Submit RSVP berjaya, wishes terkini dikemas kini.
8. Slug tidak wujud tunjuk state not-found elegan.
9. Layout mobile masih kemas untuk `/` dan `/w/[slug]`.
10. Dev Sentry test route hantar event ke Sentry.

## Vercel Deployment Checklist
1. Push repo ke GitHub.
2. Import project di Vercel.
3. Set env vars sama seperti `.env.local`.
4. Set `NEXT_PUBLIC_SITE_URL` ke domain production.
5. Update Supabase Auth redirect URL ke domain Vercel.
6. Deploy dan run checklist manual di atas.

## Known Limitations (v1 scope)
- Tiada image upload
- Tiada multiple themes
- Tiada advanced admin dashboard
- Tiada spam protection lanjutan (hanya validation asas)
- Tiada export CSV RSVP
- Tiada automasi WhatsApp/email invite

## Next Improvements (v1.1 cadangan)
1. Tambah rate limiting + captcha pada RSVP form.
2. Tambah owner moderation (hide/delete wishes).
3. Tambah export CSV RSVP.
4. Tambah analytics ringkas attendance breakdown.
