import Link from "next/link";

export default function WeddingNotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(185,143,120,0.16),transparent_40%)]" />
      <section className="relative w-full max-w-xl rounded-3xl border border-border bg-surface p-8 text-center shadow-[0_25px_45px_rgba(63,48,42,0.08)]">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary">
          Wedly
        </p>
        <h1 className="mt-3 text-4xl text-textMain">Wedding page not found</h1>
        <p className="mt-3 text-textMuted">
          This invitation link may be incorrect or no longer available.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primaryDark"
        >
          Back to Wedly
        </Link>
        <p className="mt-6 text-xs text-textMuted">
          Built with Next.js, Supabase, Sentry, and Vercel.
        </p>
      </section>
    </main>
  );
}
