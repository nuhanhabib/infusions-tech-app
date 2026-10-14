import Link from "next/link";
import { Logo } from "@/components/Navbar";
import ThemeScript from "./ThemeScript";
import ThemeToggle from "./ThemeToggle";
import PIcon from "./PIcon";
import "./portal.css";

export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="pt-root pt-auth">
      <ThemeScript />
      <aside className="pt-auth-brand">
        <Link href="/" aria-label="Infusions Tech website">
          <Logo tile />
        </Link>
        <div className="pt-auth-copy">
          <h2>
            Your projects. <em>One secure place.</em>
          </h2>
          <p>Track progress, place new orders, talk to our team and share your feedback, all in your Infusions Tech client portal.</p>
          <ul>
            <li><PIcon name="projects" size={18} /> Live updates on every project</li>
            <li><PIcon name="orders" size={18} /> Order new services in minutes</li>
            <li><PIcon name="messages" size={18} /> Message our team directly</li>
            <li><PIcon name="shield" size={18} /> Private and protected</li>
          </ul>
        </div>
        <small>Precision Elegance in Enterprise IT.</small>
      </aside>

      <main className="pt-auth-main">
        <div className="pt-auth-top">
          <Link href="/" className="pt-link-back">← Back to website</Link>
          <ThemeToggle />
        </div>
        <div className="pt-auth-card pt-card">
          <div className="pt-auth-mobile-logo">
            <Logo />
          </div>
          <h1>{title}</h1>
          {subtitle && <p className="pt-sub">{subtitle}</p>}
          {children}
        </div>
      </main>
    </div>
  );
}
