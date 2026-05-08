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
    <button type="submit" disabled={pending} className="wedly-btn-primary max-w-sm">
      {pending ? "Submitting..." : "Submit RSVP"}
    </button>
  );
}

const attendanceOptions = [
  { value: "attending", label: "Attending" },
  { value: "maybe", label: "Maybe" },
  { value: "not_attending", label: "Not Attending" },
] as const;

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
      className="wedly-ticket wedly-ticket-large wedly-ticket-soft relative space-y-6 px-5 py-6 sm:px-6 sm:py-7 md:px-8"
    >
      <div className="wedly-invitation-corner wedly-invitation-corner-top-left" />
      <div className="wedly-invitation-corner wedly-invitation-corner-top-right" />
      <div className="wedly-invitation-corner wedly-invitation-corner-bottom-left" />
      <div className="wedly-invitation-corner wedly-invitation-corner-bottom-right" />
      <div className="wedly-flower-outline left-4 top-5 h-16 w-16 wedly-float-soft opacity-30" />
      <div className="wedly-flower-outline bottom-5 right-4 h-20 w-20 wedly-float-slower opacity-30" />

      <div className="relative z-10 text-center">
        <div className="mx-auto flex max-w-xs items-center justify-center gap-4">
          <span className="h-px flex-1 bg-primary/25" />
          <p className="text-sm font-medium tracking-[0.26em] uppercase text-primary/80">
            Wedding RSVP
          </p>
          <span className="h-px flex-1 bg-primary/25" />
        </div>
        <h3 className="mt-4 text-4xl text-textMain md:text-[2.8rem]">Kindly RSVP</h3>
        <p className="mt-2 text-sm leading-7 text-textMuted md:text-base">
          We look forward to celebrating with you.
        </p>
      </div>

      <div className="relative z-10 grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-textMain">Guest Name</span>
          <input
            name="guest_name"
            required
            placeholder="Enter your full name"
            className="wedly-input"
          />
        </label>

        <div>
          <span className="mb-2 block text-sm font-medium text-textMain">Attendance Status</span>
          <div className="grid gap-2 sm:grid-cols-3">
            {attendanceOptions.map((option) => (
              <label key={option.value} className="block">
                <input
                  type="radio"
                  name="attendance"
                  value={option.value}
                  defaultChecked={option.value === "attending"}
                  className="peer sr-only"
                />
                <span className="inline-flex min-h-[3.15rem] w-full items-center justify-center rounded-[1rem] border border-border bg-white/82 px-3 text-sm font-medium text-textMuted transition peer-checked:border-primaryDark peer-checked:bg-[linear-gradient(180deg,rgba(201,149,127,0.14),rgba(185,143,120,0.2))] peer-checked:text-textMain peer-focus-visible:ring-2 peer-focus-visible:ring-primary/35">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-textMain">Number of Guests</span>
          <select name="pax_count" defaultValue="1" className="wedly-select">
            {Array.from({ length: 11 }, (_, index) => (
              <option key={index} value={index}>
                {index === 0 ? "0 guests" : index === 1 ? "1 guest" : `${index} guests`}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-textMuted">Allowed range: 0 to 10.</p>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-textMain">Message / Wishes</span>
          <textarea
            name="wish_message"
            maxLength={500}
            placeholder="Share your warm wishes for the couple..."
            className="wedly-textarea min-h-[8.4rem]"
          />
        </label>
      </div>

      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
      />
      <input type="hidden" name="form_rendered_at" value={renderedAt} />

      <div className="relative z-10 flex flex-col items-center gap-3 text-center">
        <SubmitButton />
        <p className="text-xs leading-6 text-textMuted">
          Thank you. Your response means the world to the couple.
        </p>
        <div aria-live="polite" className="min-h-5 text-center">
          {state.error ? <p className="text-sm text-rose-700">{state.error}</p> : null}
          {state.success ? <p className="text-sm text-emerald-800">{state.success}</p> : null}
        </div>
      </div>
    </form>
  );
}
