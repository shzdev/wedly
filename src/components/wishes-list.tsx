"use client";

import { useEffect, useState } from "react";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (wishes.length <= 1 || isPaused) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % wishes.length);
    }, 4800);

    return () => window.clearInterval(intervalId);
  }, [isPaused, wishes.length]);

  if (wishes.length === 0) {
    return (
      <div className="wedly-card wedly-ticket-soft relative rounded-[2rem] px-6 py-8 text-center">
        <div className="wedly-flower-outline left-6 top-6 h-14 w-14 opacity-40" />
        <div className="wedly-flower-outline bottom-6 right-6 h-18 w-18 opacity-35" />
        <p className="wedly-kicker">Guestbook</p>
        <h4 className="mt-3 text-3xl text-textMain">Awaiting your first heartfelt note</h4>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-textMuted">
          Once guests begin leaving wishes, they will appear here in a rotating keepsake
          view for you to revisit at a glance.
        </p>
      </div>
    );
  }

  const safeIndex = activeIndex % wishes.length;
  const activeWish = wishes[safeIndex];

  return (
    <div
      className="wedly-card wedly-ticket-soft relative rounded-[2rem] px-5 py-6 md:px-7 md:py-7"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="wedly-flower-outline left-5 top-5 h-12 w-12 opacity-35" />
      <div className="wedly-flower-outline bottom-5 right-5 h-16 w-16 opacity-30" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="wedly-kicker">Guestbook Carousel</p>
          <h4 className="mt-2 text-3xl text-textMain">Wishes From Your Guests</h4>
        </div>
        <div className="rounded-full border border-border bg-white/75 px-3 py-1 text-xs font-medium text-textMuted">
          {safeIndex + 1} / {wishes.length}
        </div>
      </div>

      <article
        key={activeWish.id}
        className="wedly-fade-slide relative mt-6 min-h-[15rem] rounded-[1.7rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(251,243,237,0.95))] px-5 py-6 shadow-[0_18px_36px_rgba(110,83,69,0.08)] md:px-7"
      >
        <div className="text-4xl leading-none text-primary/45">&ldquo;</div>
        <p className="mt-3 break-words text-lg leading-8 text-textMain md:text-[1.15rem]">
          {activeWish.wish_message || "Warm wishes received."}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-4">
          <div>
            <h5 className="break-words text-lg font-semibold text-textMain">
              {activeWish.guest_name}
            </h5>
            <p className="mt-1 text-xs font-medium tracking-[0.16em] uppercase text-textMuted">
              {activeWish.attendance.replace("_", " ")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setActiveIndex((current) => (current - 1 + wishes.length) % wishes.length)
              }
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/85 text-textMain transition hover:bg-white"
              aria-label="Show previous wish"
            >
              &larr;
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((current) => (current + 1) % wishes.length)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/85 text-textMain transition hover:bg-white"
              aria-label="Show next wish"
            >
              &rarr;
            </button>
          </div>
        </div>
      </article>

      {wishes.length > 1 ? (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {wishes.map((wish, index) => (
            <button
              key={wish.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={[
                "h-2.5 rounded-full transition-all",
                index === safeIndex ? "w-8 bg-primaryDark" : "w-2.5 bg-primary/30",
              ].join(" ")}
              aria-label={`Show wish ${index + 1}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
