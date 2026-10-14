import PortalShell from "@/components/portal/PortalShell";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: { default: "Admin", template: "%s | Admin" }, robots: { index: false } };

export default async function AdminLayout({ children }) {
  const { supabase, profile } = await requireAdmin();
  const head = { count: "exact", head: true };
  const [orders, messages, reviews] = await Promise.all([
    supabase.from("orders").select("id", head).eq("status", "new"),
    supabase.from("messages").select("id", head).eq("sender", "customer").eq("is_read", false),
    supabase.from("reviews").select("id", head).eq("approved", false),
  ]);

  const items = [
    { href: "/admin", label: "Overview", icon: "dashboard", exact: true },
    { href: "/admin/customers", label: "Customers", icon: "users" },
    { href: "/admin/projects", label: "Projects", icon: "projects" },
    { href: "/admin/orders", label: "Orders", icon: "orders", badge: orders.count || 0 },
    { href: "/admin/messages", label: "Messages", icon: "messages", badge: messages.count || 0 },
    { href: "/admin/reviews", label: "Reviews", icon: "star", badge: reviews.count || 0 },
    { href: "/admin/portfolio", label: "Website projects", icon: "image" },
  ];
  return (
    <PortalShell items={items} profile={profile} admin>
      {children}
    </PortalShell>
  );
}
