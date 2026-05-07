"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { submitRsvp } from "@/lib/actions/rsvps";

type RsvpFormProps = {
  eventId: string;
  slug: string;
};

type RsvpState = { error?: string; success?: string };

const initialState: RsvpState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-12 w-full rounded-xl bg-primary text-sm font-semibold text-white transition hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Submitting..." : "Submit RSVP"}
    </button>
  );
}

export function RsvpForm({ eventId, slug }: RsvpFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const submitAction = submitRsvp.bind(null, eventId, slug);
  const [state, formAction] = useActionState(submitAction, initialState);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-4 rounded-2xl border border-border bg-surface p-5"
    >
      <h3 className="text-2xl text-textMain">RSVP & Wishes</h3>
      <p className="text-sm text-textMuted">
        Please confirm your attendance and leave a short message for the couple.
      </p>
      <label className="block">
        <span className="mb-1 block text-sm text-textMain">Guest Name</span>
        <input
          name="guest_name"
          required
          className="h-11 w-full rounded-lg border border-border bg-white px-3 outline-none focus:border-primary"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm text-textMain">Attendance</span>
        <select
          name="attendance"
          defaultValue="attending"
          className="h-11 w-full rounded-lg border border-border bg-white px-3 outline-none focus:border-primary"
        >
          <option value="attending">Attending</option>
          <option value="not_attending">Not Attending</option>
          <option value="maybe">Maybe</option>
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-sm text-textMain">Pax Count</span>
        <input
          name="pax_count"
          type="number"
          min={0}
          max={10}
          defaultValue={1}
          className="h-11 w-full rounded-lg border border-border bg-white px-3 outline-none focus:border-primary"
        />
        <p className="mt-1 text-xs text-textMuted">Allowed range: 0 to 10.</p>
      </label>
      <label className="block">
        <span className="mb-1 block text-sm text-textMain">Wish Message (Optional)</span>
        <textarea
          name="wish_message"
          maxLength={500}
          className="min-h-24 w-full rounded-lg border border-border bg-white p-3 outline-none focus:border-primary"
        />
      </label>
      <SubmitButton />
      <div aria-live="polite" className="min-h-5">
        {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
        {state.success ? <p className="text-sm text-emerald-700">{state.success}</p> : null}
      </div>
    </form>
  );
}
