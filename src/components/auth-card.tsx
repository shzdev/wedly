"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const COOLDOWN_MS = 60_000;

function getCooldownKey(email: string) {
  return `wedly-sign-in-link:${email.trim().toLowerCase()}`;
}

function formatCooldownMessage(msRemaining: number) {
  const seconds = Math.ceil(msRemaining / 1000);
  if (seconds >= 60) {
    const minutes = Math.ceil(seconds / 60);
    return `Please wait about ${minutes} minute${minutes === 1 ? "" : "s"} before requesting another link.`;
  }
  return `Please wait about ${seconds} second${seconds === 1 ? "" : "s"} before requesting another link.`;
}

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

    const normalizedEmail = email.trim().toLowerCase();
    const cooldownKey = getCooldownKey(normalizedEmail);
    const lastSentRaw = window.localStorage.getItem(cooldownKey);
    const lastSentAt = lastSentRaw ? Number(lastSentRaw) : 0;
    const elapsed = Date.now() - lastSentAt;

    if (Number.isFinite(lastSentAt) && elapsed >= 0 && elapsed < COOLDOWN_MS) {
      setError(formatCooldownMessage(COOLDOWN_MS - elapsed));
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: { emailRedirectTo: redirectTo },
    });

    if (signInError) {
      if (signInError.message.toLowerCase().includes("rate limit")) {
        setError(
          "Supabase is temporarily rate limiting sign-in emails. Please wait a minute and try again.",
        );
      } else {
        setError(signInError.message);
      }
      setLoading(false);
      return;
    }

    window.localStorage.setItem(cooldownKey, Date.now().toString());
    setSuccess("A sign-in link has been sent to your inbox.");
    setLoading(false);
    setEmail("");
  }

  return (
    <div className="wedly-card wedly-ticket-soft p-6 md:p-7">
      <h3 className="text-3xl leading-tight text-textMain md:text-4xl">Sign In to Wedly</h3>
      <p className="mt-2 text-sm leading-relaxed text-textMuted">
        Enter your email and we&apos;ll send you a secure sign-in link.
      </p>
      <form className="mt-6 space-y-4" onSubmit={handleLogin}>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-textMain">Email Address</span>
          <input
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="wedly-input"
          />
        </label>
        <button
          disabled={loading}
          className="wedly-btn-primary"
        >
          {loading ? "Sending..." : "Send Sign-In Link"}
        </button>
      </form>
      <p className="mt-4 text-xs text-textMuted">
        No password needed. Use the link in your inbox to continue.
      </p>
      <div aria-live="polite" className="mt-2 min-h-5">
        {error ? <p className="text-sm text-rose-700">{error}</p> : null}
        {success ? (
          <p className="text-sm text-emerald-800">
            A sign-in link has been sent to your inbox. Please check your email and spam folder.
          </p>
        ) : null}
      </div>
    </div>
  );
}
