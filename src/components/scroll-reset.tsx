"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  consumeScrollTopAfterTransition,
  scrollViewportToTop,
} from "@/lib/scroll-to-top";

export function ScrollReset() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    scrollViewportToTop();
  }, [pathname]);

  useEffect(() => {
    consumeScrollTopAfterTransition();
  });

  useEffect(() => {
    const handlePageShow = () => {
      scrollViewportToTop();
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  useEffect(() => {
    const key = `wedly-first-landing-refreshed:${pathname}`;
    if (sessionStorage.getItem(key) === "1") {
      return;
    }

    sessionStorage.setItem(key, "1");
    router.refresh();
  }, [pathname, router]);

  return null;
}
