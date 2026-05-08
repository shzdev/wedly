import { clearOwnerSession } from "@/lib/actions/events";
import { CopyLinkButton } from "./copy-link-button";
import { WishesList } from "./wishes-list";
import { WeddingInvitationCard } from "./wedding-invitation-card";

type RsvpLite = {
  id: string;
  guest_name: string;
  attendance: "attending" | "not_attending" | "maybe";
  pax_count: number;
  wish_message: string | null;
  created_at: string;
};

type ManageWeddingCardProps = {
  event: {
    id: string;
    slug: string;
    couple_names: string;
    wedding_date: string;
    venue: string;
    message: string | null;
  };
  publicLink: string;
  rsvps: RsvpLite[];
};

export function ManageWeddingCard({ event, publicLink, rsvps }: ManageWeddingCardProps) {
  const attendingCount = rsvps.filter((item) => item.attendance === "attending").length;
  const maybeCount = rsvps.filter((item) => item.attendance === "maybe").length;
  const notAttendingCount = rsvps.filter(
    (item) => item.attendance === "not_attending",
  ).length;
  const totalPaxAttending = rsvps
    .filter((item) => item.attendance === "attending")
    .reduce((sum, item) => sum + item.pax_count, 0);
  const exportHref = `/api/rsvps/export?slug=${encodeURIComponent(event.slug)}`;
  const wishes = rsvps.filter((item) => item.wish_message?.trim());

  const summaryItems = [
    { label: "Total RSVPs", value: rsvps.length },
    { label: "Attending", value: attendingCount },
    { label: "Maybe", value: maybeCount },
    { label: "Not Attending", value: notAttendingCount },
    { label: "Total Pax", value: totalPaxAttending },
  ];

  return (
    <div className="relative">
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-8 xl:gap-10">
        <aside className="self-start lg:sticky lg:top-8">
          <WeddingInvitationCard
            coupleNames={event.couple_names}
            weddingDate={event.wedding_date}
            venue={event.venue}
            message={event.message}
          />
        </aside>

        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="wedly-kicker">Owner Overview</p>
              <h2 className="mt-2 text-4xl text-textMain sm:text-[2.8rem]">
                Manage Your Wedly Page
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-textMuted sm:text-base">
                Keep your invitation link close, watch replies arrive, and revisit every
                guest message in one polished owner view.
              </p>
            </div>
            <form action={clearOwnerSession}>
              <button className="wedly-pill border border-border bg-white/80 px-4 py-2 text-sm font-medium text-textMuted transition hover:bg-white">
                Switch Email
              </button>
            </form>
          </div>

          <section className="wedly-ticket wedly-ticket-soft px-4 py-4 sm:px-5 sm:py-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="wedly-kicker">Wedding Link</p>
                <h3 className="mt-2 text-3xl text-textMain">Share Your Invitation</h3>
                <p className="mt-2 max-w-xl text-sm leading-7 text-textMuted">
                  This is the link your guests can open to RSVP and leave their wishes.
                </p>
              </div>
              <div className="wedly-pill border border-border/80 bg-secondary/40 px-3 py-1 text-xs font-medium tracking-[0.18em] uppercase text-primaryDark">
                Public Page Ready
              </div>
            </div>

            <div className="wedly-panel mt-4 p-4">
              <code className="block break-all text-sm leading-7 text-textMain sm:text-[0.95rem]">
                {publicLink}
              </code>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start">
                <CopyLinkButton url={publicLink} />
                <a href={exportHref} className="wedly-btn-secondary min-w-[8.75rem]">
                  Export CSV
                </a>
              </div>
            </div>
          </section>

          <section className="wedly-ticket wedly-ticket-soft px-4 py-4 sm:px-5 sm:py-5">
            <p className="wedly-kicker">RSVP Summary</p>
            <h3 className="mt-2 text-3xl text-textMain">Guest Response Snapshot</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-textMuted">
              A calm overview of responses so you can track attendance and guest count
              quickly.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {summaryItems.map((item) => (
                <article key={item.label} className="wedly-panel p-4">
                  <p className="text-xs font-semibold tracking-[0.18em] uppercase text-textMuted">
                    {item.label}
                  </p>
                  <p className="mt-3 text-3xl text-textMain">{item.value}</p>
                </article>
              ))}
            </div>
          </section>

          <section>
            <WishesList wishes={wishes} />
          </section>
        </div>
      </div>
    </div>
  );
}
