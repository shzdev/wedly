# Final Launch Copy

Use placeholders and replace before posting:
- `[LIVE_DEMO_URL]`
- `[GITHUB_REPO_URL]`
- `[SCREENSHOT_URL]`

## A) X/Twitter Short Post
Built **Wedly** as a one-day MVP: a luxury wedding RSVP + guestbook app.

Stack: Next.js, Supabase, Sentry, Vercel.

Create one wedding page, share the link, and collect RSVP + wishes.

Demo note: owner access is email-only in this MVP version so no email is sent during testing.

Live demo: [LIVE_DEMO_URL]  
Code: [GITHUB_REPO_URL]

## B) X/Twitter Thread
1. I built **Wedly** as a focused one-day MVP for wedding RSVP + guestbook.
2. Problem: many wedding tools are too heavy if couples only need one elegant RSVP page.
3. Wedly flow: enter owner email -> create event -> share `/w/[slug]` -> guests RSVP + leave wishes.
4. Stack: Next.js App Router, Supabase Postgres, Sentry, Vercel.
5. Security note: this demo build uses email-only owner access to avoid free-plan auth email limits, so it is not production-secure auth.
6. Public RSVP flow still keeps server-side validation, spam checks, and duplicate protection.
7. Live demo: [LIVE_DEMO_URL]
8. Source code: [GITHUB_REPO_URL]
9. Feedback welcome on UX polish and the next production-hardening step.

## C) LinkedIn Post
Just shipped **Wedly**, a one-day MVP wedding RSVP + guestbook app.

I built it as a focused portfolio project to show end-to-end delivery with practical scope control:
- Email-only owner workspace for demo mode
- One-event owner management
- Public RSVP + wishes
- Owner RSVP summary, delete, and CSV export
- Server-side checks and Sentry monitoring

Stack: Next.js, Supabase, Sentry, Vercel.

Note: this version avoids Supabase free-plan email limits by using email-only owner access for MVP testing, so it is not the final production auth model.

Live demo: [LIVE_DEMO_URL]  
GitHub: [GITHUB_REPO_URL]

If you want, I can share the architecture and security trade-offs used before launch.

## D) Portfolio Project Card
**Wedly**  
Luxury wedding RSVP + guestbook web app built as a one-day MVP.  
Next.js + Supabase + Sentry + Vercel.  
Current demo uses email-only owner access for testing.  
Live: [LIVE_DEMO_URL]  
Source: [GITHUB_REPO_URL]  
Screenshot: [SCREENSHOT_URL]

## E) GitHub Repo Description
Wedly is a one-day MVP luxury wedding RSVP + guestbook app built with Next.js, Supabase, Sentry, and Vercel.

## F) One-Sentence Pitch
Wedly helps couples create a beautiful wedding RSVP page in minutes and collect guest wishes through one shareable link.

## G) 30-Second Demo Pitch
Wedly is a focused wedding RSVP + guestbook app. In this MVP version, owners enter an email to open a workspace, create one event, and share a public page for guests to RSVP and leave wishes. It is built with Next.js, Supabase, Sentry, and Vercel, with server-side validation and practical spam protection.

## H) Technical Interview Explanation
I scoped Wedly as a small but complete system: Next.js App Router UI + server actions, Supabase Postgres, and Sentry for monitoring critical flows like create event, RSVP submit, delete, and CSV export. To avoid free-plan auth email limits during testing, I temporarily replaced real auth with an httpOnly email workspace cookie. That keeps the MVP testable, but I would restore verified auth and stricter RLS before production.

## I) Freelance Client Explanation
Wedly shows how I deliver a polished, business-ready MVP quickly. This demo version keeps access simple by using an email-only workspace for testing, while the UI, RSVP flow, owner tools, and production checklists show how the product would be shaped before moving to a stronger auth layer.
