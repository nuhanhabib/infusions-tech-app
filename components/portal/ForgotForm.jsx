"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    const supabase = createClient();
    if (!supabase) return setError("The portal is not set up yet.");
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    setBusy(false);
    if (error) return setError("Could not send the email. Please try again in a few minutes.");
    setSent(true);
  }

  if (sent)
    return (
      <>
        <p className="pt-alert ok">If an account exists for {email}, a reset link is on its way. Open it in this same browser.</p>
        <p className="pt-switch"><Link href="/login" className="pt-link">Back to log in</Link></p>
      </>
    );

  return (
    <>
      <form onSubmit={submit} className="pt-form">
        <label className="pt-label" htmlFor="email">Your account email</label>
        <input id="email" className="pt-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        {error && <p className="pt-alert error" role="alert">{error}</p>}
        <button className="pt-btn block" disabled={busy}>{busy ? "Sending…" : "Send reset link"}</button>
      </form>
      <p className="pt-switch"><Link href="/login" className="pt-link">Back to log in</Link></p>
    </>
  );
}
