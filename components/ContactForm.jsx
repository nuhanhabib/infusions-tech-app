"use client";

import { useState } from "react";
import { company } from "@/lib/data";

const interests = [
  "Software / Web / Mobile Development",
  "AI & Automation",
  "Cyber Security",
  "Digital Marketing",
  "Design (Graphics, UI/UX, Motion, Video)",
  "Branding",
  "Business & Digital Consulting",
  "Not sure yet",
];

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    contact: "",
    interest: interests[0],
    message: "",
  });

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const messageBody = `Hello Infusions Tech,\n\nName: ${form.name}\nContact: ${form.contact}\nInterested in: ${form.interest}\n\n${form.message}`;
  const subject = `Project enquiry from ${form.name || "website"}`;

  const cleanPhone = (company?.phone || "").replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageBody)}`;

  // Direct Gmail webmail URL — opens draft immediately in browser tab
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    company?.email || ""
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(messageBody)}`;

  return (
    <form className="form-card" onSubmit={(e) => e.preventDefault()}>
      <h3>Tell us where you are and where you want to be</h3>

      <label htmlFor="name">Your name</label>
      <input
        id="name"
        value={form.name}
        onChange={update("name")}
        placeholder="Full name"
        required
      />

      <label htmlFor="contact">Email or phone</label>
      <input
        id="contact"
        value={form.contact}
        onChange={update("contact")}
        placeholder="How can we reach you?"
        required
      />

      <label htmlFor="interest">I'm interested in</label>
      <select
        id="interest"
        value={form.interest}
        onChange={update("interest")}
      >
        {interests.map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </select>

      <label htmlFor="message">Message</label>
      <textarea
        id="message"
        value={form.message}
        onChange={update("message")}
        placeholder="Briefly describe your project or goals"
      />

      <div className="form-actions">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-orange"
          style={{ textAlign: "center", textDecoration: "none", display: "inline-block" }}
        >
          Send via WhatsApp
        </a>

        {company?.email && (
          <a
            href={gmailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-dark"
            style={{ textAlign: "center", textDecoration: "none", display: "inline-block" }}
          >
            Send via Email
          </a>
        )}
      </div>

      <p className="note">
        Your message opens in WhatsApp
        {company?.email ? " or your email app" : ""} so you can review it before sending.
      </p>
    </form>
  );
}