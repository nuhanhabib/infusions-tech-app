"use client";

import { usePathname } from "next/navigation";

// The public website header/footer/chatbot are hidden on the login + portal screens.
const HIDDEN = ["/login", "/register", "/forgot-password", "/reset-password", "/portal", "/admin"];

export default function SiteChrome({ children }) {
  const pathname = usePathname() || "/";
  const hide = HIDDEN.some((p) => pathname === p || pathname.startsWith(p + "/"));
  return hide ? null : children;
}
