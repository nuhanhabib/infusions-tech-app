import Link from "next/link";
import { requireAdmin, fullName } from "@/lib/auth";
import { orderStatuses, fmtDate } from "@/lib/portalData";
import { setOrderStatus, acceptOrderCreateProject } from "@/lib/actions";
import StatusBadge from "@/components/portal/StatusBadge";

export const metadata = { title: "Orders" };

export default async function AdminOrders({ searchParams }) {
  const sp = await searchParams;
  const status = orderStatuses.some((s) => s.value === sp?.status) ? sp.status : "";
  const { supabase } = await requireAdmin();

  let query = supabase.from("orders").select("*, profiles(id, first_name, last_name, email, phone)").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data } = await query;
  const list = data || [];

  return (
    <>
      <div className="pt-head">
        <div>
          <h1 className="pt-h1">Orders</h1>
          <p className="pt-lead">Review what customers have asked for. Accepting an order creates a project for them.</p>
        </div>
      </div>
      <div className="pt-filters">
        <Link href="/admin/orders" className={!status ? "active" : ""}>All</Link>
        {orderStatuses.map((s) => (
          <Link key={s.value} href={`/admin/orders?status=${s.value}`} className={status === s.value ? "active" : ""}>{s.label}</Link>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="pt-panel pt-empty"><b>No orders here</b></div>
      ) : (
        <div className="pt-cards" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}>
          {list.map((o) => (
            <div key={o.id} className="pt-pcard">
              <div className="pt-row-between" style={{ marginTop: 0 }}>
                <StatusBadge list={orderStatuses} value={o.status} />
                <small className="pt-muted">{fmtDate(o.created_at)}</small>
              </div>
              <h3>{o.title}</h3>
              <div className="pt-meta">
                <span>{o.service}</span>
                {o.budget && <span>Budget: {o.budget}</span>}
                {o.deadline && <span>Needed by {fmtDate(o.deadline)}</span>}
              </div>
              {o.details && <p style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{o.details}</p>}
              <p>
                <Link href={`/admin/customers/${o.profiles?.id}`} className="pt-link">{fullName(o.profiles)}</Link>
                <span className="pt-muted"> · {o.profiles?.phone || o.profiles?.email}</span>
              </p>
              <div className="pt-actions-row">
                {["new", "reviewing"].includes(o.status) && (
                  <form action={acceptOrderCreateProject}>
                    <input type="hidden" name="id" value={o.id} />
                    <button className="pt-btn sm">Accept &amp; create project</button>
                  </form>
                )}
                <form action={setOrderStatus} className="pt-inline">
                  <input type="hidden" name="id" value={o.id} />
                  <select name="status" className="pt-select" defaultValue={o.status}>
                    {orderStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  <button className="pt-btn ghost sm">Set</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
