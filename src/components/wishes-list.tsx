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
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (wishes.length <= 1 || isPaused) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % wishes.length);
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, [isPaused, wishes.length]);

  if (wishes.length === 0) {
    return (
      <div className="wedly-card wedly-ticket-soft relative px-5 py-6 text-center sm:px-6 sm:py-7">
        <div className="wedly-flower-outline left-5 top-5 h-14 w-14 opacity-40" />
        <div className="wedly-flower-outline bottom-5 right-5 h-18 w-18 opacity-35" />
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
  const hasMultipleWishes = wishes.length > 1;
  const showPreviousWish = () => {
    setActiveIndex((current) => (current - 1 + wishes.length) % wishes.length);
  };
  const showNextWish = () => {
    setActiveIndex((current) => (current + 1) % wishes.length);
  };

  return (
    <div
      className="wedly-card wedly-ticket-soft relative px-4 py-5 sm:px-5 sm:py-6 md:px-6"
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
        {hasMultipleWishes ? (
          <div className="wedly-pill border border-border bg-white/75 px-3 py-1 text-xs font-medium text-textMuted">
            {safeIndex + 1} / {wishes.length}
          </div>
        ) : null}
      </div>

      <div
        className="wedly-carousel-stage mt-5"
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        onTouchStart={(event) => {
          if (hasMultipleWishes) {
            setTouchStartX(event.touches[0]?.clientX ?? null);
          }
        }}
        onTouchEnd={(event) => {
          if (!hasMultipleWishes || touchStartX === null) {
            return;
          }

          const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
          const deltaX = touchEndX - touchStartX;
          if (Math.abs(deltaX) > 40) {
            if (deltaX > 0) {
              showPreviousWish();
            } else {
              showNextWish();
            }
          }
          setTouchStartX(null);
        }}
      >
        <article
          key={activeWish.id}
          className="wedly-carousel-card wedly-fade-slide mx-auto min-h-[15rem] w-full max-w-2xl px-4 py-5 sm:px-5 sm:py-6"
        >
          <div className="text-4xl leading-none text-primary/38">&ldquo;</div>
          <p className="mt-3 break-words text-lg leading-8 text-textMain md:text-[1.12rem]">
            {activeWish.wish_message || "Warm wishes received."}
          </p>
          <div className="mt-5 border-t border-border/70 pt-4">
            <h5 className="break-words text-lg font-semibold text-textMain">
              {activeWish.guest_name}
            </h5>
            <p className="mt-1 text-xs font-medium tracking-[0.16em] uppercase text-textMuted">
              {activeWish.attendance.replace("_", " ")}
            </p>
          </div>
        </article>
      </div>

      {hasMultipleWishes ? (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={showPreviousWish}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/85 text-textMain transition hover:bg-white"
            aria-label="Show previous wish"
          >
            &larr;
          </button>
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
          <button
            type="button"
            onClick={showNextWish}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/85 text-textMain transition hover:bg-white"
            aria-label="Show next wish"
          >
            &rarr;
          </button>
        </div>
      ) : null}
    </div>
  );
}
