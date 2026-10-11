import Link from "next/link";
import { company, navLinks } from "@/lib/data";
import { Logo } from "./Navbar";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Logo />
            <p>{company.description}</p>
          </div>
          <div>
            <h5>Explore</h5>
            <ul>
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h5>Connect</h5>
            <ul>
              <li>
                <a href={`tel:${company.phone}`}>{company.phoneDisplay}</a>
              </li>
              <li>{company.location}</li>
              <li>
                <a href={company.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              </li>
              <li>
                <a href={company.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
              </li>
              <li>
                <a href={company.website} target="_blank" rel="noopener noreferrer">infusionstech.com</a>
              </li>
            </ul>
          </div>
        </div>
        <p className="copy">© {new Date().getFullYear()} Infusions Tech. All rights reserved.</p>
      </div>
    </footer>
  );
}
