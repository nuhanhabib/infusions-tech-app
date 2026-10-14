"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PasswordInput from "./PasswordInput";
import GoogleButton from "./GoogleButton";

const empty = { firstName: "", lastName: "", phone: "", email: "", company: "", password: "", confirm: "", website: "" };

export default function RegisterForm() {
  const router = useRouter();
  const [f, setF] = useState(empty);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (f.password.length < 8) return setError("Password must be at least 8 characters.");
    if (f.password !== f.confirm) return setError("The two passwords do not match.");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not create your account.");
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
      <GoogleButton label="Sign up with Google" />
      <div className="pt-divider"><span>or sign up with email</span></div>
      <form onSubmit={submit} className="pt-form" noValidate>
        <div className="pt-grid-2">
          <div>
            <label className="pt-label" htmlFor="firstName">First name</label>
            <input id="firstName" className="pt-input" value={f.firstName} onChange={set("firstName")} autoComplete="given-name" required />
          </div>
          <div>
            <label className="pt-label" htmlFor="lastName">Last name</label>
            <input id="lastName" className="pt-input" value={f.lastName} onChange={set("lastName")} autoComplete="family-name" required />
          </div>
        </div>
        <label className="pt-label" htmlFor="phone">Phone number</label>
        <input id="phone" className="pt-input" type="tel" value={f.phone} onChange={set("phone")} autoComplete="tel" placeholder="01712345678" required />
        <label className="pt-label" htmlFor="email">Email</label>
        <input id="email" className="pt-input" type="email" value={f.email} onChange={set("email")} autoComplete="email" placeholder="you@company.com" required />
        <label className="pt-label" htmlFor="company">Company <span className="pt-opt">(optional)</span></label>
        <input id="company" className="pt-input" value={f.company} onChange={set("company")} autoComplete="organization" />
        <div className="pt-grid-2">
          <div>
            <label className="pt-label">Password</label>
            <PasswordInput name="password" value={f.password} onChange={set("password")} autoComplete="new-password" placeholder="8+ characters" />
          </div>
          <div>
            <label className="pt-label">Retype password</label>
            <PasswordInput name="confirm" value={f.confirm} onChange={set("confirm")} autoComplete="new-password" placeholder="Repeat password" />
          </div>
        </div>
        {/* Honeypot: hidden from people, bots fill it in */}
        <input className="pt-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" value={f.website} onChange={set("website")} />
        {error && <p className="pt-alert error" role="alert">{error}</p>}
        <button className="pt-btn block" disabled={busy}>{busy ? "Creating account…" : "Create account"}</button>
      </form>
      <p className="pt-switch">
        Already have an account? <Link href="/login" className="pt-link">Log in</Link>
      </p>
    </>
  );
}
