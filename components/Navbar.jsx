"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks } from "@/lib/data";

// Import your uploaded SVG file
import icon from "@/app/icon.svg";

export function Logo() {
  return (
    <span className="logo">
      {/* Replaced the text "i" with the Next.js Image component */}
      <Image 
        src={icon} 
        alt="Infusions Tech Logo" 
        width={36} 
        height={36} 
        className="logo-mark"
        priority
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