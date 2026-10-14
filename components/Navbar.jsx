
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks } from "@/lib/data";
import "./navextra.css";

export function Logo({ tile = false }) {
  return (
    <span className="logo">
      <img
        src="/logo.png"
        alt=""
        width="40"
        height="40"
        className={`logo-img ${tile ? "logo-tile" : ""}`}
      />
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
          <Link
            href="/"
            onClick={() => setOpen(false)}
            aria-label="Infusions Tech home"
          >
            <Logo />
          </Link>

          <div className="nav-links">
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href ||
                    pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={active ? "active" : ""}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <Link
            href="/login"
            className="btn btn-orange btn-pill nav-cta"
            onClick={() => setOpen(false)}
          >
            Log In
          </Link>

          <button
            type="button"
            className="menu-btn"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? "✕" : "☰"}
          </button>
        </nav>
      </div>
    </div>
  );
}
