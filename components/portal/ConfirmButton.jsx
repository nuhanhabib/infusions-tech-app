"use client";

// A button that asks "are you sure?" before the form is sent.
export default function ConfirmButton({ children, message = "Are you sure?", className = "pt-btn danger sm" }) {
  return (
    <button
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
