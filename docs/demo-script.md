# Wedly Demo Script

## Demo Goal
Show that Wedly is a focused, production-minded wedding RSVP app:
- fast owner setup
- elegant public RSVP page
- reliable owner management (summary, delete, export)
- practical spam/duplicate safeguards

## Recommended Demo Setup
- Use one owner email dedicated for demo workspace access.
- Ensure schema from `supabase/schema.sql` is already applied.
- Seed demo content using `supabase/seed.sql` with your chosen demo owner email.
- Recommended slug: `nadia-aiman`.

## Recommended Demo Event Data
- Couple names: `Nadia & Aiman`
- Date: `2026-12-20`
- Venue: `The Glasshouse, Kuala Lumpur`
- Message: `Join us as we celebrate our special day with the people we love most.`
- Slug: `nadia-aiman`

## Recommended Guest RSVP Test Data
Prepare 3 to 5 rows with mixed attendance:
1. `Sofia Rahman` - attending - pax 2
2. `Hakim Zulkifli` - attending - pax 1
3. `Liyana Omar` - maybe - pax 2
4. `Nora Aziz` - not_attending - pax 0

## 5-Minute Live Demo Script
1. Open `/` and explain positioning: "Create a beautiful wedding RSVP page in minutes."
2. Enter demo owner email and show that no email is sent.
3. Show owner state on `/`:
   - public link
   - copy link
   - RSVP summary cards
   - RSVP entries list
   - CSV export action
4. Open `/w/nadia-aiman` in incognito:
   - show invitation hero, date, venue, message
   - submit a new RSVP + wish
5. Return to owner tab:
   - refresh state (or wait revalidation) and show the new RSVP appears
6. Delete one RSVP and explain owner moderation.
7. Click export CSV and show downloaded file fields.
8. Close with stack, UI polish, and MVP auth limitation summary.

## 60-Second Quick Demo Script
1. "Wedly is a one-day MVP wedding RSVP + guestbook built with Next.js, Supabase, Sentry, and Vercel."
2. "For demo mode, owner access is email-only, so no sign-in email is sent."
3. Show owner view on `/`: summary, entries, copy link, export CSV.
4. Open `/w/nadia-aiman`, submit RSVP, and show wishes appear.
5. Mention safeguards: spam honeypot, duplicate RSVP handling, and owner-only app checks.

## Screenshot Checklist
1. Home (logged out): `/` with email access card visible.
2. Home (owner manage): `/` with RSVP summary + entries.
3. Public page: `/w/nadia-aiman` invitation + RSVP form.
4. Public page: wishes carousel with realistic messages.
5. Mobile screenshot (375px width): `/w/nadia-aiman` stacked invitation/wishes/form.

## Q&A Talking Points
If asked about stack:
- "Next.js App Router for UI and server actions, Supabase Postgres for storage, Sentry for monitoring, and Vercel for deployment."

If asked about security:
- "This demo version uses email-only workspace access to avoid free-plan email limits. It is intentionally not production-secure auth. Production would restore verified authentication."

If asked why scope is small:
- "This is intentional scope discipline. The goal is a reliable, elegant MVP that can be shipped and maintained quickly."

If asked what comes next:
- v1.1: stronger auth, rate limiting, optional CAPTCHA, and deeper moderation controls
