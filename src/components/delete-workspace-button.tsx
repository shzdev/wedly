"use client";

import { useFormStatus } from "react-dom";

export function DeleteWorkspaceButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (
          !window.confirm(
            "Delete all wedding data in this workspace? This action cannot be undone.",
          )
        ) {
          event.preventDefault();
        }
      }}
      className="inline-flex min-h-10 items-center justify-center rounded-[var(--wedly-radius)] border border-rose-400/80 bg-rose-50 px-4 py-2 text-sm font-semibold tracking-[0.08em] uppercase text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Deleting..." : "Delete All Workspace Data"}
    </button>
  );
}
