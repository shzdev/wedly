# Lessons

## 2026-05-08 - Dependency Audits Need Version Verification First
- `npm audit` can look alarming, but the root cause may be a bad dependency pin rather than a vulnerable direct code path.
- Verify `package.json` and lockfile state before trying to chase advisories.
- In this repo, restoring `next@16.2.5` and overriding `postcss` was enough to clear the audit without changing product behavior.

## 2026-05-08 - Auth Rate Limits Need UX Feedback
- Magic/sign-in link systems can fail because of service-side email throttling, not because the callback is broken.
- Add a small cooldown or a clearer error so repeated clicks do not create noisy support/debug cycles.
- Keep the underlying provider limit visible in docs so the maintainer knows where the boundary lives.

## 2026-05-08 - Keep Portfolio Docs Honest
- Public-facing docs should use placeholders until real URLs and screenshots exist.
- Avoid claiming "magic link" in user-facing copy when the chosen product language is "sign-in link".
- Keep the technical docs clear about what is automatic in code and what still must be configured manually in Supabase/Vercel.
