"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import PasswordInput from "./PasswordInput";

export default function ResetForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("The two passwords do not match.");
    const supabase = createClient();
    if (!supabase) return setError("The portal is not set up yet.");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setBusy(false);
      return setError("This reset link has expired. Please request a new one.");
    }
    router.push("/portal");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="pt-form">
      <label className="pt-label">New password</label>
      <PasswordInput name="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" placeholder="At least 8 characters" />
      <label className="pt-label">Retype new password</label>
      <PasswordInput name="confirm" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
      {error && <p className="pt-alert error" role="alert">{error}</p>}
      <button className="pt-btn block" disabled={busy}>{busy ? "Saving…" : "Save new password"}</button>
    </form>
  );
}
