type WishItem = {
  id: string;
  guest_name: string;
  attendance: "attending" | "not_attending" | "maybe";
  wish_message: string | null;
  created_at: string;
};

type WishesListProps = {
  wishes: WishItem[];
};

export function WishesList({ wishes }: WishesListProps) {
  return (
    <div className="space-y-3">
      {wishes.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-white/70 p-4 text-sm text-textMuted">
          No wishes yet. Share your page link to start receiving RSVP notes.
        </p>
      ) : null}
      {wishes.map((wish) => (
        <article key={wish.id} className="rounded-xl border border-border bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-base font-semibold text-textMain">{wish.guest_name}</h4>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-textMuted">
              {wish.attendance.replace("_", " ")}
            </span>
          </div>
          {wish.wish_message ? (
            <p className="mt-2 text-sm text-textMuted">{wish.wish_message}</p>
          ) : null}
        </article>
      ))}
    </div>
  );
}
