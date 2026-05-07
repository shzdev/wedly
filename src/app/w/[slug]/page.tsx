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
    <main className="min-h-screen bg-background px-4 py-10 md:px-8 md:py-16">
      <section className="mx-auto grid w-full max-w-6xl gap-8 md:grid-cols-[1fr_0.95fr]">
        <div className="rounded-[2rem] border border-border bg-surface p-8 shadow-[0_30px_60px_rgba(63,48,42,0.09)]">
          <p className="text-xs font-semibold tracking-[0.35em] uppercase text-primary">
            You are invited
          </p>
          <h1 className="mt-4 text-5xl leading-tight text-textMain md:text-6xl">
            {event.couple_names}
          </h1>
          <div className="mt-6 space-y-2 text-textMuted">
            <p>
              <span className="font-semibold text-textMain">Date:</span>{" "}
              {formatDate(event.wedding_date)}
            </p>
            <p>
              <span className="font-semibold text-textMain">Venue:</span> {event.venue}
            </p>
          </div>
          {event.message ? (
            <p className="mt-6 rounded-xl bg-secondary/45 p-4 text-textMuted">
              {event.message}
            </p>
          ) : null}
          <div className="mt-8">
            <h2 className="text-2xl text-textMain">Latest Wishes</h2>
            <div className="mt-4">
              <WishesList wishes={rsvps.slice(0, 8)} />
            </div>
          </div>
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm font-semibold text-textMain transition hover:border-primary"
            >
              Create your own Wedly
            </Link>
          </div>
        </div>
        <div>
          <RsvpForm eventId={event.id} slug={normalizedSlug} />
        </div>
      </section>
    </main>
  );
}
