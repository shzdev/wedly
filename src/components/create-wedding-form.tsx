"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { createEvent, type ActionState } from "@/lib/actions/events";

const initialState: ActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-12 w-full rounded-xl bg-primary text-sm font-semibold text-white transition hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-70"
    >
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
    <div className="rounded-[1.5rem] border border-border bg-surface p-6 shadow-[0_20px_45px_rgba(63,48,42,0.08)]">
      <h2 className="text-3xl text-textMain">Create Your Wedding Page</h2>
      <p className="mt-2 text-sm text-textMuted">
        One event per account in v1. Keep details simple and elegant.
      </p>
      <form ref={formRef} action={formAction} className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-textMain">Couple Names</span>
          <input
            name="couple_names"
            required
            placeholder="Aisyah & Hafiz"
            className="h-12 w-full rounded-xl border border-border bg-[#fffdfb] px-4 outline-none focus:border-primary"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-textMain">Wedding Date</span>
          <input
            name="wedding_date"
            type="date"
            required
            className="h-12 w-full rounded-xl border border-border bg-[#fffdfb] px-4 outline-none focus:border-primary"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-textMain">Venue</span>
          <input
            name="venue"
            required
            placeholder="Putrajaya Marriott Hotel"
            className="h-12 w-full rounded-xl border border-border bg-[#fffdfb] px-4 outline-none focus:border-primary"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-textMain">Public Slug</span>
          <input
            name="slug"
            required
            placeholder="nadia-aiman"
            className="h-12 w-full rounded-xl border border-border bg-[#fffdfb] px-4 outline-none focus:border-primary"
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
            placeholder="A short message for your loved ones..."
            className="min-h-24 w-full rounded-xl border border-border bg-[#fffdfb] p-4 outline-none focus:border-primary"
          />
        </label>
        <SubmitButton />
        <div aria-live="polite" className="min-h-5">
          {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
          {state.success ? <p className="text-sm text-emerald-700">{state.success}</p> : null}
        </div>
      </form>
    </div>
  );
}
