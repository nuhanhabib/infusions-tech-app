import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { projectStatuses, fmtDate } from "@/lib/portalData";
import StatusBadge from "@/components/portal/StatusBadge";
import Progress from "@/components/portal/Progress";

export const metadata = { title: "Dashboard" };

export default async function PortalHome() {
  const { supabase, user, profile } = await requireUser();
  const head = { count: "exact", head: true };

  const [projects, updates, openOrders, unread] = await Promise.all([
    supabase.from("projects").select("*").eq("customer_id", user.id).order("created_at", { ascending: false }),
    supabase
      .from("project_updates")
      .select("id, message, progress, created_at, projects(id, title)")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("orders").select("id", head).eq("customer_id", user.id).in("status", ["new", "reviewing"]),
    supabase.from("messages").select("id", head).eq("customer_id", user.id).eq("sender", "admin").eq("is_read", false),
  ]);

  const list = projects.data || [];
  const active = list.filter((p) => p.status !== "completed");
  const done = list.filter((p) => p.status === "completed");

  return (
    <>
      <div className="pt-head">
        <div>
          <h1 className="pt-h1">Hello, {profile.first_name || "there"} 👋</h1>
          <p className="pt-lead">Here is where your projects stand today.</p>
        </div>
        <Link href="/portal/orders" className="pt-btn">+ New order</Link>
      </div>

      <div className="pt-stats">
        <div className="pt-stat"><span>Active projects</span><b>{active.length}</b></div>
        <div className="pt-stat"><span>Completed</span><b>{done.length}</b></div>
        <div className="pt-stat"><span>Open orders</span><b>{openOrders.count || 0}</b></div>
        <div className={`pt-stat ${unread.count ? "hot" : ""}`}><span>Unread messages</span><b>{unread.count || 0}</b></div>
      </div>

      <div className="pt-cols pt-section">
        <div className="pt-panel">
          <h2>Your projects</h2>
          {list.length === 0 ? (
            <div className="pt-empty">
              <b>No projects yet</b>
              Place an order and our team will set up your project here.
            </div>
          ) : (
            <ul className="pt-list">
              {list.slice(0, 5).map((p) => (
                <li key={p.id}>
                  <div className="pt-grow">
                    <Link href={`/portal/projects/${p.id}`} className="pt-link">{p.title}</Link>
                    <div style={{ marginTop: 8, maxWidth: 360 }}><Progress value={p.progress} /></div>
                  </div>
                  <StatusBadge list={projectStatuses} value={p.status} />
                </li>
              ))}
            </ul>
          )}
          {list.length > 5 && <p style={{ marginTop: 14 }}><Link href="/portal/projects" className="pt-link">See all projects →</Link></p>}
        </div>

        <div className="pt-panel">
          <h2>Latest updates</h2>
          {(updates.data || []).length === 0 ? (
            <div className="pt-empty"><b>Nothing yet</b>Updates from our team will show up here.</div>
          ) : (
            <ul className="pt-list">
              {updates.data.map((u) => (
                <li key={u.id}>
                  <div className="pt-grow">
                    <small>{u.projects?.title} · {fmtDate(u.created_at)}</small>
                    <span className="pt-clamp">{u.message}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="pt-section pt-actions-row">
        <Link href="/portal/messages" className="pt-btn ghost">Message our team</Link>
        <Link href="/portal/reviews" className="pt-btn ghost">Leave a review</Link>
      </div>
    </>
  );
}
