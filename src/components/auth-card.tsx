"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AuthCard() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    setSuccess("Magic link sent. Please check your email.");
    setLoading(false);
    setEmail("");
  }

  return (
    <div className="rounded-[1.5rem] border border-border bg-surface p-6 shadow-[0_20px_45px_rgba(63,48,42,0.08)]">
      <h2 className="text-3xl text-textMain">Start Your Wedly Page</h2>
      <p className="mt-2 text-sm text-textMuted">
        Use your email and we&apos;ll send a secure magic link.
      </p>
      <form className="mt-6 space-y-4" onSubmit={handleLogin}>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-textMain">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-12 w-full rounded-xl border border-border bg-[#fffdfb] px-4 text-textMain outline-none focus:border-primary"
          />
        </label>
        <button
          disabled={loading}
          className="h-12 w-full rounded-xl bg-primary text-sm font-semibold text-white transition hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Sending..." : "Send Magic Link"}
        </button>
      </form>
      <p className="mt-3 text-xs text-textMuted">
        No password needed. Your link expires automatically for safety.
      </p>
      <div aria-live="polite" className="mt-2 min-h-5">
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? (
          <p className="text-sm text-emerald-700">
            Magic link sent. Please check your inbox and spam folder.
          </p>
        ) : null}
      </div>
    </div>
  );
}
