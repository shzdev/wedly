# Production Smoke Test

Run this checklist after every production deployment.

## Preconditions

- Vercel environment variables are set.
- [supabase/schema.sql](../supabase/schema.sql) has been applied.
- You have one owner email available for testing.
- You can open an incognito window or a second browser profile for guest testing.

## Checklist

1. Open the production URL.
Expected: landing page renders with the Wedly hero, feature section, and email access area.

2. Check social metadata.
Expected: page source and link previews point to `og-img.png` and use the correct production domain from `NEXT_PUBLIC_SITE_URL`.

3. Enter an owner email on `/`.
Expected: no email is sent; the create-event workspace or owner dashboard opens immediately.

4. Refresh `/`.
Expected: the current owner workspace persists through the owner email cookie.

5. If no event exists yet, create one event.
Expected: owner dashboard loads after submission and the viewport resets to top.

6. Confirm the public link block is present.
Expected: the owner dashboard shows a full public RSVP URL containing a UUID-style slug suffix.

7. Use the copy button.
Expected: copy feedback appears and the copied value matches the visible link.

8. Open the public link in incognito.
Expected: `/w/[slug]` renders the invitation, guestbook section, and RSVP form correctly.

9. Submit one RSVP from incognito.
Expected: success message appears, the form resets, and the page remains stable.

10. Submit the same guest name again for the same event.
Expected: duplicate RSVP is rejected with a friendly message.

11. Attempt a too-fast submission.
Expected: the request is rejected gracefully by the minimum-delay spam guard.

12. Return to the owner dashboard.
Expected: RSVP summary counts update and the guestbook carousel can show the new message if one was provided.

13. Export the CSV.
Expected: a file downloads as `wedly-rsvps-[slug].csv`.

14. Open the CSV file.
Expected: columns are `guest_name`, `attendance`, `pax_count`, `wish_message`, and `created_at`.

15. Open the same export URL without an owner cookie.
Expected: the endpoint returns `401 Unauthorized`.

16. Test unknown public slug.
Expected: the elegant not-found page renders for `/w/unknown-slug`.

17. Check mobile layout at 375px.
Expected: no horizontal overflow on landing, create-event, owner, or public RSVP screens.

18. Check desktop sticky behavior.
Expected: owner and public invitation card stay sticky on the left while the right column scrolls.

19. If using demo data, test full workspace deletion last.
Expected: the danger-zone action deletes the event and associated RSVPs, clears the owner cookie, and returns to landing state.

20. Review Vercel logs and Sentry.
Expected: no unhandled action or route errors after the smoke test.

## Failure Triage

- Build or metadata issue: [docs/deployment-troubleshooting.md](./deployment-troubleshooting.md)
- Owner access or cookie issue: [src/lib/owner-session.ts](../src/lib/owner-session.ts)
- Event creation issue: [src/lib/actions/events.ts](../src/lib/actions/events.ts)
- Public RSVP issue: [src/lib/actions/rsvps.ts](../src/lib/actions/rsvps.ts)
- CSV export issue: [src/app/api/rsvps/export/route.ts](../src/app/api/rsvps/export/route.ts)
