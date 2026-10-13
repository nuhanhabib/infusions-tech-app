import Link from "next/link";
import Icon from "./Icon";
import SubscribeForm from "./SubscribeForm";
import { Logo } from "./Navbar";
import { company, socials } from "@/lib/data";
import "./footer.css";

const serviceLinks = [
  { label: "Software Development", href: "/services/software-development" },
  { label: "Web Development", href: "/services/web-design-development" },
  { label: "Cyber Security", href: "/services/cyber-security" },
  { label: "Graphics & UI/UX Design", href: "/services/graphics-design" },
  { label: "Digital Marketing", href: "/services/digital-marketing" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Our Process", href: "/services#process" },
  { label: "Careers", href: "/careers" },
];

const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address)}`;

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="sf-grid">
          <div className="sf-brand">
            <Link href="/" aria-label="Infusions Tech home">
              <Logo />
            </Link>
            <p className="sf-tagline">{company.footerTagline}</p>
            <h4 className="sf-office">Office</h4>
            <ul className="sf-contact">
              <li>
                <Icon name="pin" size={18} />
                <a href={mapUrl} target="_blank" rel="noopener noreferrer">{company.address}</a>
              </li>
              <li>
                <Icon name="call" size={18} />
                <a href={`tel:${company.phone}`}>{company.phoneDisplay}</a>
              </li>
              <li>
                <Icon name="mail" size={18} />
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </li>
            </ul>
          </div>

          <nav className="sf-col" aria-label="Services">
            <h4>Services</h4>
            <ul>
              {serviceLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/services" className="sf-more">See More…</Link>
              </li>
            </ul>
          </nav>

          <nav className="sf-col" aria-label="Company">
            <h4>Company</h4>
            <ul>
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sf-col sf-news">
            <h4><Link href="/blog">Blog</Link></h4>
            <h4 className="sf-sub">Subscribe</h4>
            <p>Get the latest enterprise IT insights.</p>
            <SubscribeForm />
            <div className="sf-social">
              {socials.map((s) => (
                <a
                  key={s.key}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Infusions Tech on ${s.name}`}
                  title={s.name}
                >
                  <Icon name={s.key} size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <p className="sf-copy">
          © {new Date().getFullYear()} Infusions Tech. {company.copyright}
        </p>
      </div>
    </footer>
  );
}
