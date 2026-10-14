"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PasswordInput from "./PasswordInput";
import GoogleButton from "./GoogleButton";

export default function LoginForm({ next = "", initialError = "" }) {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(initialError);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password, next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not log in. Please try again.");
        setBusy(false);
        return;
      }
      router.push(data.redirect || "/portal");
      router.refresh();
    } catch {
      setError("Network problem. Please try again.");
      setBusy(false);
    }
  }

  return (
    <>
      <form onSubmit={submit} className="pt-form" noValidate>
        <label className="pt-label" htmlFor="identifier">Email or phone number</label>
        <input
          id="identifier"
          className="pt-input"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          autoComplete="username"
          placeholder="you@company.com or 01712345678"
          required
        />
        <label className="pt-label" htmlFor="password">Password</label>
        <PasswordInput name="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" placeholder="Your password" />
        <div className="pt-row-between">
          <span />
          <Link href="/forgot-password" className="pt-link">Forgot password?</Link>
        </div>
        {error && <p className="pt-alert error" role="alert">{error}</p>}
        <button className="pt-btn block" disabled={busy}>{busy ? "Logging in…" : "Log in"}</button>
      </form>
      <div className="pt-divider"><span>or</span></div>
      <GoogleButton label="Continue with Google" next={next} />
      <p className="pt-switch">
        New to Infusions Tech? <Link href="/register" className="pt-link">Create an account</Link>
      </p>
    </>
  );
}
