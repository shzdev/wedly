"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { continueWithEmail, type ActionState } from "@/lib/actions/events";
import { requestScrollTopAfterTransition } from "@/lib/scroll-to-top";

const initialState: ActionState = {};

function ContinueButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} className="wedly-btn-primary">
      {pending ? "Opening..." : "Continue"}
    </button>
  );
}

export function AuthCard() {
  const [state, formAction] = useActionState(continueWithEmail, initialState);

  return (
    <>
      <form
        className="space-y-4"
        action={formAction}
        onSubmit={requestScrollTopAfterTransition}
      >
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-textMain">Email Address</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            className="wedly-input"
          />
        </label>
        <ContinueButton />
      </form>
      <div aria-live="polite" className="mt-2 min-h-5">
        {state.error ? <p className="text-sm text-rose-700">{state.error}</p> : null}
      </div>
    </>
  );
}
