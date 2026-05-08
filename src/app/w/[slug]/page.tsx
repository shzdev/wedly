import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FloatingPetals } from "@/components/floating-petals";
import { RsvpForm } from "@/components/rsvp-form";
import { WeddingInvitationCard } from "@/components/wedding-invitation-card";
import { WishesList } from "@/components/wishes-list";
import { getEventBySlug } from "@/lib/actions/events";
import { getRsvpsByEvent } from "@/lib/actions/rsvps";
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
  const wishes = rsvps.filter((item) => item.wish_message?.trim());

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.92),transparent_30%),radial-gradient(circle_at_top_right,rgba(244,225,214,0.62),transparent_35%),linear-gradient(180deg,rgba(255,250,246,0.96),rgba(248,243,238,0.9)_44%,rgba(247,239,232,0.98)_100%)]" />
      <FloatingPetals />

      <div className="wedly-page-frame relative flex min-h-screen flex-col pb-14 pt-7 md:pb-18 md:pt-9">
        <div className="wedly-pill inline-flex items-center gap-3 self-start border border-border/70 bg-white/70 px-4 py-2 shadow-[0_10px_24px_rgba(110,83,69,0.08)] backdrop-blur">
          <span className="font-serif text-xl tracking-[0.08em] text-primaryDark">Wedly</span>
        </div>

        <div className="mt-5 grid items-start gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-8 xl:gap-10">
          <aside className="wedly-sticky-panel">
            <WeddingInvitationCard
              coupleNames={event.couple_names}
              weddingDate={event.wedding_date}
              venue={event.venue}
              message={event.message}
              eyebrow="You Are Invited"
              description="A warm invitation to celebrate this wedding day and share your RSVP."
            />
          </aside>

          <div className="space-y-6">
            <section className="wedly-ticket wedly-ticket-soft px-4 py-4 sm:px-5 sm:py-5">
              <p className="wedly-kicker">Guest Welcome</p>
              <h2 className="mt-2 text-4xl text-textMain sm:text-[2.8rem]">
                Celebrate With The Couple
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-textMuted sm:text-base">
                Browse a few heartfelt wishes, then send your RSVP below with a warm
                note of your own.
              </p>
            </section>

            <section>
              <WishesList wishes={wishes} />
            </section>

            <section>
              <RsvpForm eventId={event.id} slug={normalizedSlug} />
            </section>

            <div className="flex justify-center pt-1">
              <Link href="/" className="wedly-btn-secondary wedly-btn-inline">
                Create your own Wedly page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
