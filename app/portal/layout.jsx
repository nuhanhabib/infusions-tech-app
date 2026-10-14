import PortalShell from "@/components/portal/PortalShell";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: { default: "Client portal", template: "%s | Client portal" }, robots: { index: false } };

export default async function PortalLayout({ children }) {
  const { supabase, user, profile } = await requireUser({ allowIncomplete: true });
  const { count } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("customer_id", user.id)
    .eq("sender", "admin")
    .eq("is_read", false);

  const items = [
    { href: "/portal", label: "Dashboard", icon: "dashboard", exact: true },
    { href: "/portal/projects", label: "My projects", icon: "projects" },
    { href: "/portal/orders", label: "Orders", icon: "orders" },
    { href: "/portal/messages", label: "Messages", icon: "messages", badge: count || 0 },
    { href: "/portal/reviews", label: "Reviews & feedback", icon: "star" },
    { href: "/portal/profile", label: "Profile", icon: "user" },
  ];
  return (
    <PortalShell items={items} profile={profile}>
      {children}
    </PortalShell>
  );
}
