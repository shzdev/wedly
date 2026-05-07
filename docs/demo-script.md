# Wedly Demo Script

## Demo Goal
Show that Wedly is a focused, production-minded wedding RSVP app:
- fast owner setup
- elegant public RSVP page
- reliable owner management (summary, delete, export)
- practical security controls (RLS, spam/duplicate guard, owner-only actions)

## Recommended Demo Setup
- Use one owner account email dedicated for demo (magic link login).
- Ensure schema from `supabase/schema.sql` is already applied.
- Seed demo content using `supabase/seed.sql` with a real `demo_user_id`.
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
2. Show owner state on `/`:
   - public link
   - copy link
   - RSVP summary cards
   - RSVP entries list
   - CSV export action
3. Open `/w/nadia-aiman` in incognito:
   - show invitation hero, date, venue, message
   - submit a new RSVP + wish
4. Return to owner tab:
   - refresh state (or wait revalidation) and show the new RSVP appears
5. Delete one RSVP and explain owner moderation.
6. Click export CSV and show downloaded file fields.
7. Close with stack and security summary.

## 60-Second Quick Demo Script
1. "Wedly is a one-day MVP wedding RSVP + guestbook built with Next.js, Supabase, Sentry, and Vercel."
2. Show owner view on `/`: summary, entries, copy link, export CSV.
3. Open `/w/nadia-aiman`, submit RSVP, and show wishes appear.
4. Mention safeguards: spam honeypot, duplicate RSVP handling, and RLS owner isolation.

## Screenshot Checklist
1. Home (logged out): `/` with auth card visible.
2. Home (owner manage): `/` with RSVP summary + entries.
3. Public page: `/w/nadia-aiman` hero + RSVP form.
4. Public page: wishes section with realistic messages.
5. Mobile screenshot (375px width): `/w/nadia-aiman` form and hero stack.

## Q&A Talking Points
If asked about stack:
- "Next.js App Router for UI and server actions, Supabase for auth + Postgres + RLS, Sentry for monitoring, Vercel for deployment."

If asked about security:
- "Owner actions are server-validated and RLS-protected. Public guests can RSVP, but cannot access owner data or exports."

If asked why scope is small:
- "This is intentional scope discipline. The goal is a reliable, elegant MVP that can be shipped and maintained in one day."

If asked what comes next:
- v1.1: spam/duplicate/owner tools (already implemented)
- v1.2 candidates: stronger rate limiting, optional CAPTCHA, RSVP edit flow, basic moderation tools
