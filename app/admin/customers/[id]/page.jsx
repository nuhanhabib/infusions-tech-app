import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin, fullName } from "@/lib/auth";
import { projectStatuses, orderStatuses, fmtDate } from "@/lib/portalData";
import StatusBadge from "@/components/portal/StatusBadge";
import Progress from "@/components/portal/Progress";

export const metadata = { title: "Customer" };

export default async function Customer({ params }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const { data: c } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
  if (!c) notFound();
  const [projects, orders] = await Promise.all([
    supabase.from("projects").select("*").eq("customer_id", id).order("created_at", { ascending: false }),
    supabase.from("orders").select("*").eq("customer_id", id).order("created_at", { ascending: false }),
  ]);

  return (
    <>
      <Link href="/admin/customers" className="pt-back">← All customers</Link>
      <div className="pt-head">
        <div>
          <h1 className="pt-h1">{fullName(c)}</h1>
          <p className="pt-lead">{c.company || "Individual customer"} · joined {fmtDate(c.created_at)}</p>
        </div>
        <div className="pt-actions-row">
          <Link href={`/admin/projects/new?customer=${c.id}`} className="pt-btn">+ New project</Link>
          <Link href={`/admin/messages/${c.id}`} className="pt-btn ghost">Message</Link>
        </div>
      </div>

      <div className="pt-cols">
        <div>
          <div className="pt-panel">
            <h2>Projects</h2>
            {(projects.data || []).length === 0 ? (
              <div className="pt-empty"><b>No projects yet</b></div>
            ) : (
              <ul className="pt-list">
                {projects.data.map((p) => (
                  <li key={p.id}>
                    <div className="pt-grow">
                      <Link href={`/admin/projects/${p.id}`} className="pt-link">{p.title}</Link>
                      <div style={{ marginTop: 8, maxWidth: 340 }}><Progress value={p.progress} /></div>
                    </div>
                    <StatusBadge list={projectStatuses} value={p.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="pt-panel">
            <h2>Orders</h2>
            {(orders.data || []).length === 0 ? (
              <div className="pt-empty"><b>No orders yet</b></div>
            ) : (
              <ul className="pt-list">
                {orders.data.map((o) => (
                  <li key={o.id}>
                    <div className="pt-grow"><b>{o.title}</b><small>{o.service} · {fmtDate(o.created_at)}</small></div>
                    <StatusBadge list={orderStatuses} value={o.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="pt-panel">
          <h2>Contact</h2>
          <dl className="pt-kv">
            <dt>Email</dt><dd><a className="pt-link" href={`mailto:${c.email}`}>{c.email}</a></dd>
            <dt>Phone</dt><dd>{c.phone ? <a className="pt-link" href={`tel:${c.phone}`}>{c.phone}</a> : "—"}</dd>
            <dt>Company</dt><dd>{c.company || "—"}</dd>
          </dl>
        </div>
      </div>
    </>
  );
}
