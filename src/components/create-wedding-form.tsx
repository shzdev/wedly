"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { createEvent, type ActionState } from "@/lib/actions/events";

const initialState: ActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="wedly-btn-primary">
      {pending ? "Creating..." : "Create Wedding Page"}
    </button>
  );
}

export function CreateWeddingForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(createEvent, initialState);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [router, state.success]);

  return (
    <div className="wedly-card wedly-ticket-soft p-6 md:p-7">
      <h3 className="text-3xl leading-tight text-textMain md:text-4xl">Create Your Wedding Page</h3>
      <p className="mt-2 text-sm leading-relaxed text-textMuted">
        Fill in a few details and we&apos;ll prepare your elegant RSVP page.
      </p>
      <form ref={formRef} action={formAction} className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-textMain">Couple Names</span>
          <input
            name="couple_names"
            required
            placeholder="Nadia & Aiman"
            className="wedly-input"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-textMain">Wedding Date</span>
          <input
            name="wedding_date"
            type="date"
            required
            className="wedly-input"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-textMain">Venue</span>
          <input
            name="venue"
            required
            placeholder="The Glasshouse, Kuala Lumpur"
            className="wedly-input"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-textMain">Public Slug</span>
          <input
            name="slug"
            required
            placeholder="nadia-aiman"
            className="wedly-input"
          />
          <p className="mt-1 text-xs text-textMuted">
            Lowercase letters, numbers, and hyphens only.
          </p>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-textMain">Message (Optional)</span>
          <textarea
            name="message"
            maxLength={500}
            placeholder="Join us as we celebrate our special day with the people we love most."
            className="wedly-textarea"
          />
        </label>
        <SubmitButton />
        <div aria-live="polite" className="min-h-5">
          {state.error ? <p className="text-sm text-rose-700">{state.error}</p> : null}
          {state.success ? <p className="text-sm text-emerald-800">{state.success}</p> : null}
        </div>
      </form>
    </div>
  );
}
