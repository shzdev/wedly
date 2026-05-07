"use client";

import { useFormStatus } from "react-dom";

export function DeleteRsvpButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm("Delete this RSVP entry?")) {
          event.preventDefault();
        }
      }}
      className="inline-flex min-h-9 items-center justify-center rounded-full border border-rose-300/85 bg-white/70 px-3.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
