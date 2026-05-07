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
      className="inline-flex min-h-10 items-center justify-center rounded-full border border-rose-300/80 bg-rose-50/80 px-4 text-xs font-semibold tracking-[0.12em] uppercase text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
