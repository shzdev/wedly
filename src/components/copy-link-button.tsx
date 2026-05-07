"use client";

import { useState } from "react";

type CopyLinkButtonProps = {
  url: string;
};

export function CopyLinkButton({ url }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setError(null);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setError("Copy failed. Please copy manually.");
    }
  }

  return (
    <div className="min-w-[8.75rem]">
      <button onClick={handleCopy} className="wedly-btn-secondary w-full" type="button">
        {copied ? "Copied" : "Copy Link"}
      </button>
      <p
        aria-live="polite"
        className={[
          "mt-1 text-xs",
          error ? "text-rose-700" : copied ? "text-emerald-700" : "text-transparent",
        ].join(" ")}
      >
        {error ?? (copied ? "Link copied to clipboard." : "Link copied to clipboard.")}
      </p>
    </div>
  );
}
