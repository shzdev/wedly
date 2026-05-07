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
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setError("Copy failed. Please copy manually.");
    }
  }

  return (
    <div>
      <button
        onClick={handleCopy}
        className="wedly-btn-secondary min-w-[8.5rem]"
        type="button"
      >
        {copied ? "Copied" : "Copy Link"}
      </button>
      <p aria-live="polite" className="mt-1 text-xs text-red-600">
        {error}
      </p>
    </div>
  );
}
