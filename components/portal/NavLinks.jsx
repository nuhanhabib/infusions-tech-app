"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import PIcon from "./PIcon";

export default function NavLinks({ items }) {
  const pathname = usePathname();
  return (
    <nav className="pt-nav" aria-label="Portal">
      {items.map((it) => {
        const active = it.exact ? pathname === it.href : pathname === it.href || pathname.startsWith(it.href + "/");
        return (
          <Link key={it.href} href={it.href} className={active ? "active" : ""}>
            <PIcon name={it.icon} size={18} />
            <span>{it.label}</span>
            {it.badge > 0 && <em className="pt-count">{it.badge > 99 ? "99+" : it.badge}</em>}
          </Link>
        );
      })}
    </nav>
  );
}
