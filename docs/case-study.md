# Wedly Case Study

## Project Overview
Wedly is a one-day MVP that helps couples create a beautiful wedding RSVP page with a simple guestbook experience.

## Goal
Build a small, production-ready-feeling app that feels premium, ships fast, and is maintainable for solo/freelance delivery.

## Target Users
- Couples who need a simple RSVP page quickly
- Freelancers/clients who want a focused wedding micro-product instead of a full website builder

## Problem
Many wedding tools are either too complex or too expensive for couples who only need:
- one sharable page
- RSVP collection
- guest wishes

## Solution
Wedly keeps the workflow minimal:
1. Enter owner email
2. Create one event
3. Share `/w/[slug]`
4. Collect RSVP + wishes

## MVP Scope
- Included:
  - Email-only owner workspace access for demo mode
  - Single-event management
  - Public RSVP page
  - Basic anti-spam guard on public RSVP
  - Duplicate RSVP prevention
  - Owner RSVP management + CSV export
  - Sentry error monitoring
- Excluded:
  - Production-grade authentication
  - Image upload
  - Multiple themes
  - Payments
  - Invitation automation
  - Seating/vendor modules

## Tech Stack
- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- Supabase Postgres
- Zod
- Sentry
- Vercel

## System Architecture
- Server-rendered route decisions on `/` based on owner email cookie + event existence
- Public dynamic route `/w/[slug]` for invitation pages
- Server Actions for event creation and RSVP submission
- Server-side owner checks for export/delete

## Database Design
- `events`: one event per owner email, unique slug
- `rsvps`: references events, includes attendance and wish message
- Indexes for lookup speed by owner email, slug, and event

## Access Approach
- Owner identity is a normalized email stored in an httpOnly cookie
- No email is sent in MVP mode
- This was chosen to avoid Supabase free-plan email rate limits during testing
- It is intentionally not a production-secure auth system

## Monitoring Approach
- Sentry on client, server, and edge runtimes
- Tagged errors on critical paths:
  - `feature=create_event`
  - `feature=submit_rsvp`
  - `feature=delete_rsvp`
  - `feature=export_csv`
  - `slug` when relevant

## Key Implementation Decisions
- One-event-per-email enforced at DB and app layers
- Public RSVP kept open for frictionless guest flow
- Shared invitation-led UI system across owner and guest pages
- Temporary email-only owner access used to remove free-plan email testing friction

## Trade-offs
- Faster delivery over deep feature set
- Lightweight spam control (honeypot + timing) instead of heavy CAPTCHA
- Single visual theme to preserve speed and polish
- Weaker auth model in exchange for simpler MVP testing

## What I Would Improve for Production
1. Restore verified authentication
2. Reinstate strict DB ownership/RLS
3. Add robust rate limiting per IP/session
4. Add optional CAPTCHA switch for public events

## Final Outcome
Wedly is a focused, launch-ready-feeling micro-product that demonstrates rapid product delivery with strong UI polish and explicit trade-off handling around MVP authentication.
