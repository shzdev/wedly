# Decision Log

## 2026-05-08 - Preserve Stable Next.js 16 and Fix Audit via Override
- Kept `next` at `16.2.5` instead of downgrading or jumping to canary.
- Added an `overrides` entry for `postcss@8.5.10` to clear the remaining `npm audit` warning without changing app behavior.
- Result: `npm audit` returned `0 vulnerabilities`, and the production build still passed.

## 2026-05-08 - Treat Supabase Email Rate Limit as Auth UX, Not App Bug
- Confirmed the `email rate limit exceeded` path comes from Supabase Auth when magic/sign-in links are requested repeatedly.
- Added a small client-side cooldown in `src/components/auth-card.tsx` to reduce repeated requests for the same email.
- Kept the Supabase-side limit in place and changed UI copy to explain the wait more clearly.

## 2026-05-08 - Public UI Reworked as Editorial Landing Page
- Rebuilt the homepage into a premium wedding-style landing page with hero, feature ticket cards, and a centered form/manage section.
- Removed user-facing footer stack text and normalized ticket-style visual language across auth/create/manage cards.
- Kept existing app logic unchanged while replacing the presentation layer around it.

## 2026-05-08 - Separate Create-Event Setup Flow from Marketing Landing
- Logged-in users without an event now render a dedicated create-event screen instead of the marketing hero and feature sections.
- The create form collects bride and groom names separately, then combines them into the existing `couple_names` field to avoid any schema change.
- Slugs are now generated automatically from the names and are no longer editable in the UI, reducing user error and keeping link creation consistent.
- Name validation moved into server-side Zod checks so unsafe symbols, emoji, and script-like input are rejected before slug generation.

## 2026-05-08 - Owner Manage View Reframed Around a Sticky Invitation
- The existing event owner state now skips the landing page and renders a dedicated owner layout to avoid mixing marketing UI with post-creation management.
- The invitation preview became the visual anchor on the left, while operational tools stay in a right-hand companion column.
- Guest wishes were upgraded from a static list to a lightweight client-side carousel so the owner view feels editorial rather than dashboard-like, without adding new dependencies.

## 2026-05-08 - Public RSVP Page Aligned to the Owner Visual System
- The public guest page now reuses the same invitation-led layout, motion treatment, and carousel style as the owner page instead of presenting a simpler one-off card and form.
- A shared invitation component was introduced so owner and guest pages stay visually consistent without duplicating the printed-invitation markup.
- The RSVP form was redesigned visually, but the honeypot, render timestamp, server action names, and submission values were intentionally preserved to avoid weakening spam or duplicate protection.

## 2026-05-08 - Publish Local Main to GitHub
- Pushed local `main` to `origin/main` with `--force-with-lease` because the remote only contained the initial commit.
- This preserved the Wedly project history and avoided merging against an empty remote baseline.
