"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks } from "@/lib/data";
import "./navextra.css";

// tile = put the logo on a white rounded tile (needed on dark backgrounds)
export function Logo({ tile = false }) {
  return (
    <span className="logo">
      <img src="/logo.png" alt="" width="40" height="40" className={`logo-img ${tile ? "logo-tile" : ""}`} />
      <span className="logo-text">
        <span>INFUSIONS</span>
        <span>TECH</span>
      </span>
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="nav-wrap">
      <div className="container">
        <nav className={`nav ${open ? "open" : ""}`}>
          <Link href="/" onClick={() => setOpen(false)} aria-label="Infusions Tech home">
            <Logo />
          </Link>
          <div className="nav-links">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={pathname === l.href ? "active" : ""}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/login"
              className={`nav-login ${pathname === "/login" ? "active" : ""}`}
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
          </div>
          <Link href="/contact" className="btn btn-orange btn-pill nav-cta" onClick={() => setOpen(false)}>
            Contact Us
          </Link>
          <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? "✕" : "☰"}
          </button>
        </nav>
      </div>
    </div>
  );
}
