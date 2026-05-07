import { signOut } from "@/lib/actions/events";
import { formatDate } from "@/lib/utils/date";
import { CopyLinkButton } from "./copy-link-button";
import { WishesList } from "./wishes-list";

type RsvpLite = {
  id: string;
  guest_name: string;
  attendance: "attending" | "not_attending" | "maybe";
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
  rsvpCount: number;
  latestWishes: RsvpLite[];
};

export function ManageWeddingCard({
  event,
  publicLink,
  rsvpCount,
  latestWishes,
}: ManageWeddingCardProps) {
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
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-white p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-textMuted">Couple</p>
          <p className="mt-1 text-lg font-semibold text-textMain">{event.couple_names}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-textMuted">RSVP Count</p>
          <p className="mt-1 text-lg font-semibold text-textMain">{rsvpCount}</p>
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
        <h3 className="text-xl text-textMain">Latest Wishes</h3>
        <p className="mt-1 text-sm text-textMuted">
          Your newest guest messages will appear here.
        </p>
        <div className="mt-3">
          <WishesList wishes={latestWishes} />
        </div>
      </div>
    </div>
  );
}
