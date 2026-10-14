import Link from "next/link";
import { requireAdmin, fullName } from "@/lib/auth";
import { orderStatuses, fmtDate, fmtDateTime } from "@/lib/portalData";
import StatusBadge from "@/components/portal/StatusBadge";

export const metadata = { title: "Overview" };

export default async function AdminHome() {
  const { supabase, profile } = await requireAdmin();
  const head = { count: "exact", head: true };

  const [customers, active, newOrders, unread, pending, recentOrders, recentCustomers, recentMessages] = await Promise.all([
    supabase.from("profiles").select("id", head).eq("role", "customer"),
    supabase.from("projects").select("id", head).neq("status", "completed"),
    supabase.from("orders").select("id", head).eq("status", "new"),
    supabase.from("messages").select("id", head).eq("sender", "customer").eq("is_read", false),
    supabase.from("reviews").select("id", head).eq("approved", false),
    supabase.from("orders").select("id, title, service, status, created_at, profiles(first_name, last_name)").order("created_at", { ascending: false }).limit(5),
    supabase.from("profiles").select("id, first_name, last_name, email, company, created_at").eq("role", "customer").order("created_at", { ascending: false }).limit(5),
    supabase.from("messages").select("id, body, created_at, customer_id, profiles(first_name, last_name)").eq("sender", "customer").eq("is_read", false).order("created_at", { ascending: false }).limit(5),
  ]);

  return (
    <>
      <div className="pt-head">
        <div>
          <h1 className="pt-h1">Welcome back, {profile.first_name || "Admin"}</h1>
          <p className="pt-lead">Here is what needs your attention.</p>
        </div>
        <Link href="/admin/projects/new" className="pt-btn">+ New project</Link>
      </div>

      <div className="pt-stats">
        <div className="pt-stat"><span>Customers</span><b>{customers.count || 0}</b></div>
        <div className="pt-stat"><span>Active projects</span><b>{active.count || 0}</b></div>
        <div className={`pt-stat ${newOrders.count ? "hot" : ""}`}><span>New orders</span><b>{newOrders.count || 0}</b></div>
        <div className={`pt-stat ${unread.count ? "hot" : ""}`}><span>Unread messages</span><b>{unread.count || 0}</b></div>
        <div className={`pt-stat ${pending.count ? "hot" : ""}`}><span>Reviews to approve</span><b>{pending.count || 0}</b></div>
      </div>

      <div className="pt-cols pt-section">
        <div className="pt-panel">
          <h2>Recent orders</h2>
          {(recentOrders.data || []).length === 0 ? (
            <div className="pt-empty"><b>No orders yet</b></div>
          ) : (
            <ul className="pt-list">
              {recentOrders.data.map((o) => (
                <li key={o.id}>
                  <div className="pt-grow">
                    <b>{o.title}</b>
                    <small>{fullName(o.profiles)} · {o.service} · {fmtDate(o.created_at)}</small>
                  </div>
                  <StatusBadge list={orderStatuses} value={o.status} />
                </li>
              ))}
            </ul>
          )}
          <p style={{ marginTop: 14 }}><Link href="/admin/orders" className="pt-link">Manage orders →</Link></p>
        </div>

        <div className="pt-panel">
          <h2>Unread messages</h2>
          {(recentMessages.data || []).length === 0 ? (
            <div className="pt-empty"><b>All caught up</b></div>
          ) : (
            <ul className="pt-list">
              {recentMessages.data.map((m) => (
                <li key={m.id}>
                  <div className="pt-grow">
                    <Link href={`/admin/messages/${m.customer_id}`} className="pt-link">{fullName(m.profiles)}</Link>
                    <span className="pt-clamp pt-muted" style={{ fontSize: 14 }}>{m.body}</span>
                    <small>{fmtDateTime(m.created_at)}</small>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="pt-panel pt-section">
        <h2>Newest customers</h2>
        {(recentCustomers.data || []).length === 0 ? (
          <div className="pt-empty"><b>No customers yet</b>People who register on the website will appear here.</div>
        ) : (
          <ul className="pt-list">
            {recentCustomers.data.map((c) => (
              <li key={c.id}>
                <div className="pt-grow">
                  <Link href={`/admin/customers/${c.id}`} className="pt-link">{fullName(c)}</Link>
                  <small>{c.email}{c.company ? ` · ${c.company}` : ""}</small>
                </div>
                <small>{fmtDate(c.created_at)}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
