"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { createEvent, type ActionState } from "@/lib/actions/events";
import { requestScrollTopAfterTransition } from "@/lib/scroll-to-top";

const initialState: ActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="wedly-btn-primary">
      {pending ? "Creating..." : "Create Wedding Event"}
    </button>
  );
}

export function CreateWeddingForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(createEvent, initialState);

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [router, state.success]);

  return (
    <form
      action={formAction}
      className="space-y-4"
      onSubmit={requestScrollTopAfterTransition}
    >
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block min-w-0">
          <span className="mb-2 block text-sm font-medium text-textMain">Groom Name</span>
          <input
            name="groom_name"
            required
            placeholder="James"
            className="wedly-input"
          />
        </label>
        <label className="block min-w-0">
          <span className="mb-2 block text-sm font-medium text-textMain">Bride Name</span>
          <input
            name="bride_name"
            required
            placeholder="Sarah"
            className="wedly-input"
          />
        </label>
      </div>

      <label className="block min-w-0">
        <span className="mb-2 block text-sm font-medium text-textMain">Wedding Date</span>
        <input name="wedding_date" type="date" required className="wedly-input" />
      </label>

      <label className="block min-w-0">
        <span className="mb-2 block text-sm font-medium text-textMain">Venue</span>
        <input
          name="venue"
          required
          placeholder="The Glasshouse, Kuala Lumpur"
          className="wedly-input"
        />
      </label>

      <label className="block min-w-0">
        <span className="mb-2 block text-sm font-medium text-textMain">Welcome Message</span>
        <textarea
          name="message"
          maxLength={500}
          placeholder="Join us as we celebrate our special day with the people we love most."
          className="wedly-textarea"
        />
      </label>

      <SubmitButton />
      <p className="text-xs text-textMuted">
        You can edit these details later from your Wedly dashboard.
      </p>

      <div aria-live="polite" className="min-h-5">
        {state.error ? <p className="text-sm text-rose-700">{state.error}</p> : null}
        {state.success ? <p className="text-sm text-emerald-800">{state.success}</p> : null}
      </div>
    </form>
  );
}
