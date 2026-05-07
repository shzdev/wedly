"use client";

import { useActionState, useEffect, useRef, useState } from "react";
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
    <button type="submit" disabled={pending} className="wedly-btn-primary">
      {pending ? "Submitting..." : "Submit RSVP"}
    </button>
  );
}

export function RsvpForm({ eventId, slug }: RsvpFormProps) {
  const [renderedAt] = useState(() => Date.now().toString());
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
      className="wedly-card wedly-ticket-soft space-y-4 p-5 md:p-6"
    >
      <h3 className="text-3xl leading-tight text-textMain">RSVP & Wishes</h3>
      <p className="text-sm leading-relaxed text-textMuted">
        Please confirm your attendance and leave a short message for the couple.
      </p>
      <label className="block">
        <span className="mb-1 block text-sm text-textMain">Guest Name</span>
        <input
          name="guest_name"
          required
          placeholder="Your full name"
          className="wedly-input"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm text-textMain">Attendance</span>
        <select
          name="attendance"
          defaultValue="attending"
          className="wedly-select"
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
          className="wedly-input"
        />
        <p className="mt-1 text-xs text-textMuted">Allowed range: 0 to 10.</p>
      </label>
      <label className="block">
        <span className="mb-1 block text-sm text-textMain">Wish Message (Optional)</span>
        <textarea
          name="wish_message"
          maxLength={500}
          placeholder="Wishing you both a lifetime of love and happiness."
          className="wedly-textarea"
        />
      </label>
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
      />
      <input type="hidden" name="form_rendered_at" value={renderedAt} />
      <SubmitButton />
      <div aria-live="polite" className="min-h-5">
        {state.error ? <p className="text-sm text-rose-700">{state.error}</p> : null}
        {state.success ? <p className="text-sm text-emerald-800">{state.success}</p> : null}
      </div>
    </form>
  );
}
