import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RsvpForm } from "@/components/rsvp-form";
import { WishesList } from "@/components/wishes-list";
import { getEventBySlug } from "@/lib/actions/events";
import { getRsvpsByEvent } from "@/lib/actions/rsvps";
import { formatDate } from "@/lib/utils/date";
import { normalizeSlug } from "@/lib/utils/slug";

type WeddingPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: WeddingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const normalizedSlug = normalizeSlug(slug);
  const event = await getEventBySlug(normalizedSlug);

  if (!event) {
    return {
      title: "Wedding page not found | Wedly",
      description: "This wedding invitation page is unavailable.",
    };
  }

  return {
    title: `${event.couple_names} | Wedly`,
    description: `RSVP for ${event.couple_names} wedding at ${event.venue}.`,
  };
}

export default async function WeddingPage({ params }: WeddingPageProps) {
  const { slug } = await params;
  const normalizedSlug = normalizeSlug(slug);
  const event = await getEventBySlug(normalizedSlug);
  if (!event) {
    notFound();
  }

  const rsvps = await getRsvpsByEvent(event.id);

  return (
    <main className="relative min-h-screen bg-background px-4 py-10 md:px-8 md:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(185,143,120,0.18),transparent_42%),radial-gradient(circle_at_bottom_left,rgba(139,96,76,0.12),transparent_48%)]" />
      <section className="relative mx-auto grid w-full max-w-6xl gap-8 md:grid-cols-[1fr_0.95fr]">
        <div className="rounded-[2rem] border border-border bg-surface p-7 shadow-[0_30px_60px_rgba(63,48,42,0.09)] md:p-9">
          <p className="text-xs font-semibold tracking-[0.35em] uppercase text-primary">
            You are invited
          </p>
          <h1 className="mt-4 text-5xl leading-[1.04] text-textMain md:text-7xl">
            {event.couple_names}
          </h1>
          <div className="mt-6 space-y-2 text-textMuted md:text-lg">
            <p className="break-words">
              <span className="font-semibold text-textMain">Date:</span>{" "}
              {formatDate(event.wedding_date)}
            </p>
            <p className="break-words">
              <span className="font-semibold text-textMain">Venue:</span> {event.venue}
            </p>
          </div>
          {event.message ? (
            <p className="mt-6 rounded-xl border border-border/60 bg-[color:var(--surfaceMuted)]/50 p-4 text-textMuted">
              {event.message}
            </p>
          ) : null}
          <div className="mt-8">
            <h2 className="text-3xl text-textMain">Guestbook Wishes</h2>
            <p className="mt-1 text-sm text-textMuted">
              Loving notes from family and friends.
            </p>
            <div className="mt-4">
              <WishesList wishes={rsvps.slice(0, 8)} />
            </div>
          </div>
          <div className="mt-8">
            <Link
              href="/"
              className="wedly-btn-secondary inline-flex items-center"
            >
              Create your own Wedly page
            </Link>
          </div>
        </div>
        <div>
          <RsvpForm eventId={event.id} slug={normalizedSlug} />
        </div>
      </section>
      <footer className="mx-auto mt-8 w-full max-w-6xl">
        <p className="text-center text-xs text-textMuted">
          Built with Next.js, Supabase, Sentry, and Vercel.
        </p>
      </footer>
    </main>
  );
}
