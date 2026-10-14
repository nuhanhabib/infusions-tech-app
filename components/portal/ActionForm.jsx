"use client";

import { useActionState, useEffect, useRef, startTransition } from "react";

// A form wired to a server action. Shows errors / success, and keeps what you typed if something fails.
export default function ActionForm({
  action,
  children,
  submitLabel = "Save",
  className = "",
  resetOnSuccess = false,
  buttonClass = "pt-btn",
  footer = null,
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const ref = useRef(null);

  useEffect(() => {
    if (state?.ok && resetOnSuccess) ref.current?.reset();
  }, [state, resetOnSuccess]);

  function onSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => formAction(data));
  }

  return (
    <form ref={ref} onSubmit={onSubmit} className={className}>
      {children}
      {state?.error && (
        <p className="pt-alert error" role="alert">
          {state.error}
        </p>
      )}
      {state?.ok && state?.message && <p className="pt-alert ok">{state.message}</p>}
      <div className="pt-form-actions">
        <button className={buttonClass} disabled={pending}>
          {pending ? "Please wait…" : submitLabel}
        </button>
        {footer}
      </div>
    </form>
  );
}
