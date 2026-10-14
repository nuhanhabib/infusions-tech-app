import Link from "next/link";
import { Logo } from "@/components/Navbar";
import NavLinks from "./NavLinks";
import ThemeToggle from "./ThemeToggle";
import ThemeScript from "./ThemeScript";
import PIcon from "./PIcon";
import { fullName } from "@/lib/auth";
import "./portal.css";

export default function PortalShell({ items, profile, admin = false, children }) {
  const initials = ((profile.first_name?.[0] || "") + (profile.last_name?.[0] || "")).toUpperCase() || "U";
  return (
    <div className="pt-root pt-shell">
      <ThemeScript />
      <aside className="pt-side">
        <Link href="/" aria-label="Infusions Tech website" className="pt-side-logo">
          <Logo tile />
        </Link>
        <span className="pt-role">{admin ? "Admin portal" : "Client portal"}</span>
        <NavLinks items={items} />
        <div className="pt-side-foot">
          <Link href="/" className="pt-side-link">
            <PIcon name="globe" size={16} /> Visit website
          </Link>
        </div>
      </aside>

      <div className="pt-body">
        <header className="pt-top">
          <div className="pt-who">
            <span className="pt-avatar">{initials}</span>
            <div>
              <b>{fullName(profile)}</b>
              <small>{admin ? "Administrator" : profile.company || profile.email}</small>
            </div>
          </div>
          <div className="pt-top-actions">
            <ThemeToggle />
            <form action="/auth/signout" method="post">
              <button className="pt-ghost-btn" type="submit">
                <PIcon name="logout" size={16} /> Log out
              </button>
            </form>
          </div>
        </header>
        <main className="pt-page">{children}</main>
      </div>
    </div>
  );
}
