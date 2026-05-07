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
        <p className="rounded-xl border border-dashed border-border bg-[color:var(--surfaceMuted)]/55 p-4 text-sm text-textMuted">
          No wishes yet. Be the first to leave a warm note for the couple.
        </p>
      ) : null}
      {wishes.map((wish) => (
        <article
          key={wish.id}
          className="rounded-xl border border-border bg-white p-4 shadow-[0_8px_16px_rgba(63,48,42,0.04)]"
        >
          <div className="flex items-center justify-between gap-3">
            <h4 className="break-words text-base font-semibold text-textMain">
              {wish.guest_name}
            </h4>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-textMuted">
              {wish.attendance.replace("_", " ")}
            </span>
          </div>
          {wish.wish_message ? (
            <p className="mt-2 break-words text-sm text-textMuted">{wish.wish_message}</p>
          ) : null}
        </article>
      ))}
    </div>
  );
}
