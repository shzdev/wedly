# Wedly Case Study

## Overview

Wedly is a luxury RSVP and guestbook micro-product focused on one sharp job: let couples publish a polished wedding invitation page, collect responses, and manage everything from a lightweight owner workspace.

## Product Intent

The goal was not to build a full wedding website platform. The goal was to ship a narrower product with:

- stronger visual polish
- lower setup friction
- a fast owner flow
- a simple guest-facing RSVP experience

## Core Problem

Many wedding products are heavier than necessary for couples who only need:

- one invitation page
- one RSVP link
- one simple way to collect warm wishes

That gap is where Wedly sits.

## Solution Shape

Wedly reduces the journey to three meaningful moments:

1. Enter owner email and open the workspace.
2. Create one wedding page.
3. Share one public RSVP link.

From there, the owner gets one manage view with:

- invitation preview
- copyable public link
- RSVP summary
- guestbook carousel
- CSV export

## UX Direction

The UI leans into an editorial wedding tone rather than a generic dashboard aesthetic.

Key design decisions:

- invitation-first layout
- serif-forward typography
- warm ivory and mocha palette
- shared visual language across owner and guest surfaces
- sticky invitation card on desktop for owner and guest pages

## Architecture Summary

- Next.js App Router on the frontend
- server-rendered branching on `/`
- Supabase Postgres as the database
- Server Actions for owner and RSVP workflows
- Sentry for operational monitoring
- Vercel deployment target

Notable implementation characteristics:

- owner access currently uses an `httpOnly` email cookie rather than verified auth
- event slugs are name-based prefixes with UUID suffixes
- public RSVP protection uses honeypot, minimum-delay, and duplicate-name checks

## Trade-offs Chosen Deliberately

### Speed over full auth hardness

Using email-only workspace access removes the friction of email delivery during MVP testing, but it weakens ownership guarantees.

### Depth over breadth

Wedly intentionally does not include:

- multi-event management
- theme builders
- media uploads
- payment flows
- seating plans
- vendor workflows

### Lightweight abuse controls over heavy friction

Public RSVP uses practical server-side checks without introducing CAPTCHA or guest login.

## Why the Current Build Matters

The current version demonstrates:

- a complete owner-to-guest flow
- a coherent visual system
- reasonable production discipline around validation, error capture, and deployment
- explicit handling of MVP security trade-offs instead of pretending they do not exist

## What Would Change for a Production-Hard Version

1. Restore verified authentication.
2. Move ownership checks back into strict identity-backed RLS.
3. Add stronger rate limiting and optional CAPTCHA.
4. Introduce a more secure owner model before onboarding paying users.

## Outcome

Wedly is a strong portfolio-ready micro-product because it shows product judgment, UI refinement, backend pragmatism, and a realistic understanding of MVP trade-offs instead of overbuilding the first version.
