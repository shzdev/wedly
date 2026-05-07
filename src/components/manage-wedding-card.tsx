import { deleteRsvp } from "@/lib/actions/rsvps";
import { formatDate, formatDateTime } from "@/lib/utils/date";
import { DeleteRsvpButton } from "./delete-rsvp-button";
import { signOut } from "@/lib/actions/events";
import { CopyLinkButton } from "./copy-link-button";
import { WishesList } from "./wishes-list";

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
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] xl:gap-10">
        <aside className="self-start lg:sticky lg:top-8">
          <div className="wedly-invitation-card wedly-card rounded-[2.4rem] px-6 py-7 sm:px-8 sm:py-9">
            <div className="wedly-invitation-corner wedly-invitation-corner-top-left" />
            <div className="wedly-invitation-corner wedly-invitation-corner-top-right" />
            <div className="wedly-invitation-corner wedly-invitation-corner-bottom-left" />
            <div className="wedly-invitation-corner wedly-invitation-corner-bottom-right" />
            <div className="wedly-flower-outline left-8 top-10 h-18 w-18 wedly-float-soft opacity-40" />
            <div className="wedly-flower-outline bottom-12 right-8 h-24 w-24 wedly-float-slower opacity-35" />

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="wedly-kicker">Wedly Invitation</p>
                  <p className="mt-2 text-sm leading-7 text-textMuted">
                    A refined preview of the wedding page your guests will receive.
                  </p>
                </div>
                <div className="rounded-full border border-border/80 bg-white/70 px-4 py-2 text-sm font-medium text-primaryDark shadow-[0_10px_22px_rgba(110,83,69,0.08)]">
                  Wedly
                </div>
              </div>

              <div className="mt-10 rounded-[2rem] border border-primary/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(249,240,233,0.92))] px-6 py-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:px-8">
                <p className="text-center text-xs font-semibold tracking-[0.34em] uppercase text-primary/80">
                  Together With Their Families
                </p>
                <h3 className="mt-8 text-center text-4xl leading-[1] text-textMain sm:text-5xl xl:text-[3.8rem]">
                  {event.couple_names}
                </h3>
                <p className="mx-auto mt-5 max-w-md text-center text-sm leading-7 text-textMuted sm:text-base">
                  Request the pleasure of your company as they celebrate their wedding
                  day surrounded by the people they love most.
                </p>

                <div className="mx-auto mt-8 max-w-md border-y border-border/70 px-4 py-5 text-center">
                  <p className="text-sm font-medium tracking-[0.24em] uppercase text-primary/85">
                    {formatDate(event.wedding_date)}
                  </p>
                  <p className="mt-3 break-words text-lg leading-8 text-textMain sm:text-[1.18rem]">
                    {event.venue}
                  </p>
                </div>

                {event.message ? (
                  <p className="mx-auto mt-7 max-w-lg break-words text-center text-sm leading-8 text-textMuted sm:text-base">
                    {event.message}
                  </p>
                ) : null}

                <div className="mt-8 flex items-center justify-center gap-3">
                  <span className="h-px w-12 bg-primary/35" />
                  <span className="text-sm tracking-[0.3em] uppercase text-primary/75">
                    RSVP
                  </span>
                  <span className="h-px w-12 bg-primary/35" />
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="space-y-6">
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
            <form action={signOut}>
              <button className="rounded-full border border-border bg-white/80 px-4 py-2 text-sm font-medium text-textMuted transition hover:bg-white">
                Sign out
              </button>
            </form>
          </div>

          <section className="wedly-ticket wedly-ticket-soft rounded-[2rem] px-5 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="wedly-kicker">Wedding Link</p>
                <h3 className="mt-2 text-3xl text-textMain">Share Your Invitation</h3>
                <p className="mt-2 max-w-xl text-sm leading-7 text-textMuted">
                  This is the link your guests can open to RSVP and leave their wishes.
                </p>
              </div>
              <div className="rounded-full border border-border/80 bg-secondary/40 px-3 py-1 text-xs font-medium tracking-[0.18em] uppercase text-primaryDark">
                Public Page Ready
              </div>
            </div>

            <div className="mt-5 rounded-[1.5rem] border border-border/80 bg-white/86 p-4 shadow-[0_14px_28px_rgba(63,48,42,0.05)]">
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

          <section className="wedly-ticket wedly-ticket-soft rounded-[2rem] px-5 py-5 sm:px-6 sm:py-6">
            <p className="wedly-kicker">RSVP Summary</p>
            <h3 className="mt-2 text-3xl text-textMain">Guest Response Snapshot</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-textMuted">
              A calm overview of responses so you can track attendance and guest count
              quickly.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {summaryItems.map((item) => (
                <article
                  key={item.label}
                  className="rounded-[1.45rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,243,238,0.92))] p-4 shadow-[0_12px_24px_rgba(63,48,42,0.05)]"
                >
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

          <section className="wedly-ticket wedly-ticket-soft rounded-[2rem] px-5 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="wedly-kicker">Guest Entries</p>
                <h3 className="mt-2 text-3xl text-textMain">Your RSVP Ledger</h3>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-textMuted">
                  Review every submission, confirm attendance details, and remove entries
                  you do not want to keep.
                </p>
              </div>
              <div className="rounded-full border border-border/80 bg-white/75 px-3 py-1 text-xs font-medium text-textMuted">
                Updated in real time
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {rsvps.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-border bg-white/75 px-5 py-6 text-sm leading-7 text-textMuted">
                  No RSVP entries yet. Once guests reply, they will appear here with
                  their attendance status and any message they share.
                </div>
              ) : null}

              {rsvps.map((rsvp) => (
                <article
                  key={rsvp.id}
                  className="rounded-[1.5rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(250,244,239,0.92))] px-4 py-4 shadow-[0_12px_24px_rgba(63,48,42,0.05)] sm:px-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="break-words text-lg font-semibold text-textMain">
                        {rsvp.guest_name}
                      </h4>
                      <p className="mt-1 text-xs text-textMuted">
                        {formatDateTime(rsvp.created_at)}
                      </p>
                    </div>
                    <form action={deleteRsvp.bind(null, rsvp.id)}>
                      <DeleteRsvpButton />
                    </form>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-secondary/80 px-3 py-1.5 font-medium text-textMuted">
                      {rsvp.attendance.replace("_", " ")}
                    </span>
                    <span className="rounded-full bg-secondary/80 px-3 py-1.5 font-medium text-textMuted">
                      Pax: {rsvp.pax_count}
                    </span>
                  </div>
                  {rsvp.wish_message ? (
                    <p className="mt-4 break-words text-sm leading-7 text-textMuted">
                      {rsvp.wish_message}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
