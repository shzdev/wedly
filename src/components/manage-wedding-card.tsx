import { deleteRsvp } from "@/lib/actions/rsvps";
import { formatDate, formatDateTime } from "@/lib/utils/date";
import { DeleteRsvpButton } from "./delete-rsvp-button";
import { signOut } from "@/lib/actions/events";
import { CopyLinkButton } from "./copy-link-button";

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

  return (
    <div className="space-y-5 rounded-[1.5rem] border border-border bg-surface p-6 shadow-[0_20px_45px_rgba(63,48,42,0.08)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-3xl text-textMain">Your Wedding Page</h2>
          <p className="mt-1 text-sm text-textMuted">
            Share your link, track RSVPs, and read guest wishes in one place.
          </p>
        </div>
        <form action={signOut}>
          <button className="text-sm text-textMuted underline-offset-2 hover:underline">
            Sign out
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-border bg-white p-4">
        <p className="text-xs font-semibold tracking-[0.22em] uppercase text-textMuted">
          Public Link
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <code className="rounded-lg bg-secondary px-3 py-2 text-sm text-textMain">
            {publicLink}
          </code>
          <CopyLinkButton url={publicLink} />
          <a
            href={exportHref}
            className="h-10 rounded-lg border border-border bg-white px-4 text-sm font-semibold text-textMain transition hover:border-primary hover:bg-[#fff9f4] inline-flex items-center"
          >
            Export CSV
          </a>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-white p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-textMuted">Couple</p>
          <p className="mt-1 text-lg font-semibold text-textMain">{event.couple_names}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-textMuted">Total RSVPs</p>
          <p className="mt-1 text-lg font-semibold text-textMain">{rsvps.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-textMuted">Date</p>
          <p className="mt-1 text-lg font-semibold text-textMain">
            {formatDate(event.wedding_date)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-white p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-textMuted">Venue</p>
          <p className="mt-1 text-lg font-semibold text-textMain">{event.venue}</p>
        </div>
      </div>

      <div>
        <h3 className="text-xl text-textMain">RSVP Summary</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl border border-border bg-white p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-textMuted">Attending</p>
            <p className="mt-1 text-2xl font-semibold text-textMain">{attendingCount}</p>
          </div>
          <div className="rounded-xl border border-border bg-white p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-textMuted">Maybe</p>
            <p className="mt-1 text-2xl font-semibold text-textMain">{maybeCount}</p>
          </div>
          <div className="rounded-xl border border-border bg-white p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-textMuted">Not Attending</p>
            <p className="mt-1 text-2xl font-semibold text-textMain">{notAttendingCount}</p>
          </div>
          <div className="rounded-xl border border-border bg-white p-4 sm:col-span-2 lg:col-span-2">
            <p className="text-xs uppercase tracking-[0.18em] text-textMuted">
              Total Pax Attending
            </p>
            <p className="mt-1 text-2xl font-semibold text-textMain">{totalPaxAttending}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl text-textMain">RSVP Entries</h3>
        <p className="mt-1 text-sm text-textMuted">
          Review entries and remove unwanted submissions.
        </p>
        <div className="mt-3 space-y-3">
          {rsvps.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-white/70 p-4 text-sm text-textMuted">
              No RSVP entries yet.
            </p>
          ) : null}
          {rsvps.map((rsvp) => (
            <article
              key={rsvp.id}
              className="rounded-xl border border-border bg-white p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h4 className="text-base font-semibold text-textMain">{rsvp.guest_name}</h4>
                  <p className="text-xs text-textMuted">{formatDateTime(rsvp.created_at)}</p>
                </div>
                <form action={deleteRsvp.bind(null, rsvp.id)}>
                  <DeleteRsvpButton />
                </form>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-secondary px-3 py-1 font-medium text-textMuted">
                  {rsvp.attendance.replace("_", " ")}
                </span>
                <span className="rounded-full bg-secondary px-3 py-1 font-medium text-textMuted">
                  Pax: {rsvp.pax_count}
                </span>
              </div>
              {rsvp.wish_message ? (
                <p className="mt-3 text-sm text-textMuted">{rsvp.wish_message}</p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
