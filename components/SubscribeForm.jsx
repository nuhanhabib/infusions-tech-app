"use client";

import { useState } from "react";
import { company } from "@/lib/data";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Footer newsletter box. It opens the visitor's email app with a ready-to-send
// subscription request to the company email (no server or paid service needed).
export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });

  function onSubmit(e) {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setMsg({ type: "error", text: "Please enter a valid email address." });
      return;
    }
    const subject = encodeURIComponent("Newsletter subscription");
    const body = encodeURIComponent(`Please subscribe this email address to the Infusions Tech newsletter:\n\n${value}`);
    setMsg({ type: "ok", text: "Almost done! Send the email that just opened to confirm your subscription." });
    setEmail("");
    window.location.href = `mailto:${company.email}?subject=${subject}&body=${body}`;
  }

  return (
    <form className="sf-form" onSubmit={onSubmit} noValidate>
      <div className="sf-input-wrap">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          aria-label="Email address"
          autoComplete="email"
        />
      </div>
      <button type="submit" aria-label="Subscribe">→</button>
      {msg.text && (
        <p className={`sf-msg ${msg.type}`} role="status">{msg.text}</p>
      )}
    </form>
  );
}
