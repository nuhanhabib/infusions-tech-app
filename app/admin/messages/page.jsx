import Link from "next/link";
import { requireAdmin, fullName } from "@/lib/auth";
import { fmtDateTime } from "@/lib/portalData";

export const metadata = { title: "Messages" };

export default async function AdminMessages() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("messages")
    .select("id, customer_id, sender, body, is_read, created_at, profiles(first_name, last_name, company)")
    .order("created_at", { ascending: false })
    .limit(1000);

  // One row per customer: latest message + unread count.
  const threads = new Map();
  for (const m of data || []) {
    const t = threads.get(m.customer_id) || { customer_id: m.customer_id, profile: m.profiles, last: m, unread: 0 };
    if (m.sender === "customer" && !m.is_read) t.unread += 1;
    threads.set(m.customer_id, t);
  }
  const list = [...threads.values()];

  return (
    <>
      <div className="pt-head">
        <div>
          <h1 className="pt-h1">Messages</h1>
          <p className="pt-lead">Conversations with your customers.</p>
        </div>
      </div>
      {list.length === 0 ? (
        <div className="pt-panel pt-empty"><b>No messages yet</b>When a customer writes to you, the conversation appears here.</div>
      ) : (
        <div className="pt-panel">
          <ul className="pt-list">
            {list.map((t) => (
              <li key={t.customer_id}>
                <div className="pt-grow">
                  <Link href={`/admin/messages/${t.customer_id}`} className="pt-link">
                    {t.unread > 0 && <span className="pt-unread-dot" />}
                    {fullName(t.profile)}
                  </Link>
                  <span className="pt-clamp pt-muted" style={{ fontSize: 14 }}>{t.last.sender === "admin" ? "You: " : ""}{t.last.body}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <small>{fmtDateTime(t.last.created_at)}</small>
                  {t.unread > 0 && <div><span className="pt-badge warn">{t.unread} new</span></div>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
