"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function ScrollReset() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  useEffect(() => {
    const handlePageShow = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
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
