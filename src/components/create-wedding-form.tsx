"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { createEvent, type ActionState } from "@/lib/actions/events";
import { normalizeSlug } from "@/lib/utils/slug";

const initialState: ActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="wedly-btn-primary">
      {pending ? "Creating..." : "Create Wedding Event"}
    </button>
  );
}

function normalizePreviewName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function CreateWeddingForm() {
  const router = useRouter();
  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");
  const [state, formAction] = useActionState(createEvent, initialState);

  useEffect(() => {
    if (state.success) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      router.refresh();
    }
  }, [router, state.success]);

  const couplePreview = useMemo(() => {
    const bride = normalizePreviewName(brideName);
    const groom = normalizePreviewName(groomName);
    if (!bride && !groom) {
      return "Bride Name & Groom Name";
    }
    if (!bride) {
      return `Bride Name & ${groom}`;
    }
    if (!groom) {
      return `${bride} & Groom Name`;
    }
    return `${bride} & ${groom}`;
  }, [brideName, groomName]);

  const slugPreview = useMemo(() => {
    const slug = normalizeSlug(`${brideName} ${groomName}`);
    return slug || "generated automatically";
  }, [brideName, groomName]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-textMain">Bride Name</span>
          <input
            name="bride_name"
            required
            placeholder="Sarah"
            className="wedly-input"
            value={brideName}
            onChange={(event) => setBrideName(event.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-textMain">Groom Name</span>
          <input
            name="groom_name"
            required
            placeholder="James"
            className="wedly-input"
            value={groomName}
            onChange={(event) => setGroomName(event.target.value)}
          />
        </label>
      </div>

      <p className="text-sm text-textMuted">
        Couple preview: <span className="font-medium text-textMain">{couplePreview}</span>{" "}
        <span aria-hidden="true">&middot;</span> Link preview:{" "}
        <span className="font-medium text-primaryDark">/{slugPreview}</span>
      </p>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-textMain">Wedding Date</span>
        <input name="wedding_date" type="date" required className="wedly-input" />
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
