"use client";

import { useEffect, useRef, useState } from "react";
import { company } from "@/lib/data";
import "./chat.css";

const GREETING = {
  role: "assistant",
  content:
    "Hello! 👋 I'm the Infusions Tech 24/7 assistant. How can I help you today?\nহ্যালো! আমি Infusions Tech-এর ২৪/৭ অ্যাসিস্ট্যান্ট। আমি কীভাবে সাহায্য করতে পারি?",
};

const QUICK = [
  "Web / App development",
  "Cyber security",
  "Digital marketing",
  "Book a free consultation",
  "আমি দাম জানতে চাই",
];

const STORE_KEY = "infusions-chat-v1";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  // Restore the conversation for this browser tab.
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORE_KEY) || "null");
      if (Array.isArray(saved) && saved.length) setMessages(saved);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {}
  }, [messages]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, loading, open]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  async function send(text) {
    const content = text.trim();
    if (!content || loading) return;

    const next = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (!res.ok || !data.reply) throw new Error("bad response");
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          content: `Sorry, something went wrong. Please try again, or reach our team on WhatsApp at ${company.phoneDisplay}.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const whatsappUrl = `https://wa.me/${company.phone.replace("+", "")}?text=${encodeURIComponent(
    "Hello Infusions Tech, I'd like to talk about a project."
  )}`;

  const showChips = messages.length <= 1;

  return (
    <>
      {open && (
        <div className="chat-panel" role="dialog" aria-label="Infusions Tech assistant">
          <div className="chat-head">
            <div className="chat-avatar">
              <img src="/logo.png" alt="Infusions Tech" />
            </div>
            <div className="chat-head-text">
              <b>Infusions Tech Assistant</b>
              <span>Online </span>
            </div>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" title="Talk to our team on WhatsApp" aria-label="WhatsApp">
              💬
            </a>
            <button onClick={() => setOpen(false)} aria-label="Close chat">✕</button>
          </div>

          <div className="chat-body" ref={bodyRef}>
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role === "user" ? "user" : "bot"}`}>
                {m.content}
              </div>
            ))}
            {showChips && (
              <div className="chips">
                {QUICK.map((q) => (
                  <button key={q} onClick={() => send(q)}>{q}</button>
                ))}
              </div>
            )}
            {loading && (
              <div className="msg bot typing" aria-label="Typing">
                <i /><i /><i />
              </div>
            )}
          </div>

          <form
            className="chat-input"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message… / মেসেজ লিখুন…"
              maxLength={500}
            />
            <button type="submit" disabled={loading || !input.trim()} aria-label="Send">➤</button>
          </form>
        </div>
      )}

      <button className="chat-fab" onClick={() => setOpen(!open)} aria-label={open ? "Close chat" : "Open chat"}>
        {!open && <span className="ping" />}
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.03 2 11c0 2.4 1.05 4.58 2.76 6.2-.2 1.5-.9 2.9-1.9 3.9a.5.5 0 0 0 .5.84c2.2-.4 3.9-1.3 5-2.1 1.1.4 2.4.66 3.64.66 5.52 0 10-4.03 10-9S17.52 2 12 2z" />
          </svg>
        )}
      </button>
    </>
  );
}