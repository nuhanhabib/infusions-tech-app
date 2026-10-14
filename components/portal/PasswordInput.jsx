"use client";

import { useState } from "react";

export default function PasswordInput({ name, value, onChange, autoComplete, placeholder, minLength, required = true }) {
  const [show, setShow] = useState(false);
  const controlled = value !== undefined;
  return (
    <div className="pt-pass">
      <input
        className="pt-input"
        type={show ? "text" : "password"}
        name={name}
        autoComplete={autoComplete}
        placeholder={placeholder}
        minLength={minLength}
        required={required}
        {...(controlled ? { value, onChange } : {})}
      />
      <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}>
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}
