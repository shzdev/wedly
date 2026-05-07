# Wedly Case Study

## Project Overview
Wedly is a one-day MVP that helps couples create a beautiful wedding RSVP page with a simple guestbook experience.

## Goal
Build a small, production-ready app that feels premium, ships fast, and is maintainable for solo/freelance delivery.

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
1. Login with magic link
2. Create one event
3. Share `/w/[slug]`
4. Collect RSVP + wishes

## MVP Scope
- Included:
  - Auth (magic link)
  - Single-event management
  - Public RSVP page
  - RLS-secured Supabase data model
  - Sentry error monitoring
- Excluded:
  - Image upload
  - Multiple themes
  - Payments
  - Invitation automation
  - Seating/vendor modules

## Tech Stack
- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- Supabase Auth + Postgres + RLS
- Zod
- Sentry
- Vercel

## System Architecture
- Server-rendered route decisions on `/` based on auth + event existence
- Public dynamic route `/w/[slug]` for invitation pages
- Server Actions for event creation and RSVP submission
- Supabase RLS as the primary data-access guard

## Database Design
- `events`: one event per user, unique slug
- `rsvps`: references events, includes attendance and wish message
- Indexes for lookup speed by user, slug, and event

## Authentication Approach
- Supabase magic-link sign-in
- Callback route exchanges code for session
- Supabase SSR cookie refresh via request proxy

## Monitoring Approach
- Sentry on client, server, and edge runtimes
- Tagged errors on critical paths:
  - `feature=create_event`
  - `feature=submit_rsvp`
  - `slug` when relevant

## Key Implementation Decisions
- One-event-per-user enforced at DB and app layers
- Public RSVP kept open for frictionless guest flow
- Strictly small component architecture for maintainability

## Trade-offs
- Faster delivery over deep feature set
- Manual anti-spam hardening deferred to v1.1
- Single visual theme to preserve speed and polish

## What I Would Improve in v1.1
1. Add rate limiting and CAPTCHA for RSVP route
2. Add owner moderation tools for wishes
3. Add CSV export
4. Add basic delivery analytics

## Final Outcome
Wedly is a focused, launch-ready micro-product that demonstrates rapid product delivery with solid engineering hygiene.
