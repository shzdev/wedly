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

function getWishPreview(message: string | null) {
  const trimmed = (message ?? "").trim();
  if (!trimmed) {
    return "Warm wishes received.";
  }
  if (trimmed.length <= 140) {
    return trimmed;
  }
  return `${trimmed.slice(0, 137)}...`;
}

export function WishesList({ wishes }: WishesListProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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
  const previousWish = wishes[(safeIndex - 1 + wishes.length) % wishes.length];
  const nextWish = wishes[(safeIndex + 1) % wishes.length];

  const sideCards = [previousWish, activeWish, nextWish];

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
        <div className="wedly-pill border border-border bg-white/75 px-3 py-1 text-xs font-medium text-textMuted">
          {safeIndex + 1} / {wishes.length}
        </div>
      </div>

      <div className="wedly-carousel-stage mt-5">
        {sideCards.map((wish, index) => {
          const isCenter = index === 1 || wishes.length === 1;
          return (
            <article
              key={`${wish.id}-${isCenter ? "active" : index}`}
              className={[
                "wedly-carousel-card wedly-fade-slide px-4 py-5 sm:px-5 sm:py-6",
                isCenter
                  ? "wedly-carousel-card-center min-h-[15rem]"
                  : "wedly-carousel-card-side hidden min-h-[13rem] lg:block",
              ].join(" ")}
            >
              <div className="text-4xl leading-none text-primary/38">&ldquo;</div>
              <p
                className={[
                  "mt-3 break-words leading-8 text-textMain",
                  isCenter ? "text-lg md:text-[1.12rem]" : "text-sm",
                ].join(" ")}
              >
                {isCenter ? wish.wish_message || "Warm wishes received." : getWishPreview(wish.wish_message)}
              </p>
              <div className="mt-5 border-t border-border/70 pt-4">
                <h5 className="break-words text-lg font-semibold text-textMain">
                  {wish.guest_name}
                </h5>
                <p className="mt-1 text-xs font-medium tracking-[0.16em] uppercase text-textMuted">
                  {wish.attendance.replace("_", " ")}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setActiveIndex((current) => (current - 1 + wishes.length) % wishes.length)}
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
          onClick={() => setActiveIndex((current) => (current + 1) % wishes.length)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/85 text-textMain transition hover:bg-white"
          aria-label="Show next wish"
        >
          &rarr;
        </button>
      </div>
    </div>
  );
}
