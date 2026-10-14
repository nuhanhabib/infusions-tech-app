import { requireUser } from "@/lib/auth";
import { orderStatuses, serviceOptions, fmtDate } from "@/lib/portalData";
import { submitOrder, cancelOrder } from "@/lib/actions";
import ActionForm from "@/components/portal/ActionForm";
import StatusBadge from "@/components/portal/StatusBadge";

export const metadata = { title: "Orders" };

export default async function Orders() {
  const { supabase, user } = await requireUser();
  const { data } = await supabase.from("orders").select("*").eq("customer_id", user.id).order("created_at", { ascending: false });
  const list = data || [];

  return (
    <>
      <div className="pt-head">
        <div>
          <h1 className="pt-h1">Orders</h1>
          <p className="pt-lead">Tell us what you need. We will review it and reply, usually within one working day.</p>
        </div>
      </div>

      <div className="pt-cols">
        <div className="pt-panel">
          <h2>Your orders</h2>
          {list.length === 0 ? (
            <div className="pt-empty"><b>No orders yet</b>Use the form to place your first one.</div>
          ) : (
            <ul className="pt-list">
              {list.map((o) => (
                <li key={o.id}>
                  <div className="pt-grow">
                    <b>{o.title}</b>
                    <small>{o.service} · {fmtDate(o.created_at)}{o.deadline ? ` · needed by ${fmtDate(o.deadline)}` : ""}</small>
                    {o.details && <span className="pt-clamp pt-muted" style={{ fontSize: 14 }}>{o.details}</span>}
                    {o.status === "new" && (
                      <form action={cancelOrder} style={{ marginTop: 8 }}>
                        <input type="hidden" name="id" value={o.id} />
                        <button className="pt-btn danger sm">Cancel order</button>
                      </form>
                    )}
                  </div>
                  <StatusBadge list={orderStatuses} value={o.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="pt-panel">
          <h2>New order</h2>
          <ActionForm action={submitOrder} submitLabel="Send order" resetOnSuccess>
            <label className="pt-label" htmlFor="service">Service</label>
            <select id="service" name="service" className="pt-select" defaultValue="" required>
              <option value="" disabled>Choose a service…</option>
              {serviceOptions.map((s) => <option key={s}>{s}</option>)}
            </select>
            <label className="pt-label" htmlFor="title">Order title</label>
            <input id="title" name="title" className="pt-input" placeholder="e.g. Company website redesign" required />
            <label className="pt-label" htmlFor="details">What do you need?</label>
            <textarea id="details" name="details" className="pt-textarea" placeholder="Describe your goals, features, or anything we should know." required />
            <div className="pt-grid-2">
              <div>
                <label className="pt-label" htmlFor="budget">Budget <span className="pt-opt">(optional)</span></label>
                <input id="budget" name="budget" className="pt-input" placeholder="e.g. 50,000 BDT" />
              </div>
              <div>
                <label className="pt-label" htmlFor="deadline">Needed by <span className="pt-opt">(optional)</span></label>
                <input id="deadline" name="deadline" type="date" className="pt-input" />
              </div>
            </div>
          </ActionForm>
        </div>
      </div>
    </>
  );
}
