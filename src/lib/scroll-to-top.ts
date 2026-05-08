"use client";

const SCROLL_TOP_AFTER_TRANSITION_KEY = "wedly-scroll-top-after-transition";

export function scrollViewportToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export function requestScrollTopAfterTransition() {
  sessionStorage.setItem(SCROLL_TOP_AFTER_TRANSITION_KEY, "1");
  scrollViewportToTop();
}

export function consumeScrollTopAfterTransition() {
  if (sessionStorage.getItem(SCROLL_TOP_AFTER_TRANSITION_KEY) !== "1") {
    return;
  }

  sessionStorage.removeItem(SCROLL_TOP_AFTER_TRANSITION_KEY);
  scrollViewportToTop();
  requestAnimationFrame(scrollViewportToTop);
  window.setTimeout(scrollViewportToTop, 0);
}
