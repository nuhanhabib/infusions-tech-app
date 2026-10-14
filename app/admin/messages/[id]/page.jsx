import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin, fullName } from "@/lib/auth";
import { fmtDateTime } from "@/lib/portalData";
import { sendMessage } from "@/lib/actions";
import ActionForm from "@/components/portal/ActionForm";

export const metadata = { title: "Conversation" };

export default async function Thread({ params }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const { data: customer } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
  if (!customer) notFound();
  const { data } = await supabase.from("messages").select("*").eq("customer_id", id).order("created_at", { ascending: true });
  const list = data || [];

  if (list.some((m) => m.sender === "customer" && !m.is_read)) {
    await supabase.from("messages").update({ is_read: true }).eq("customer_id", id).eq("sender", "customer").eq("is_read", false);
  }

  return (
    <>
      <Link href="/admin/messages" className="pt-back">← All messages</Link>
      <div className="pt-head">
        <div>
          <h1 className="pt-h1">{fullName(customer)}</h1>
          <p className="pt-lead">{customer.email}{customer.phone ? ` · ${customer.phone}` : ""}</p>
        </div>
        <Link href={`/admin/customers/${customer.id}`} className="pt-btn ghost sm">View customer</Link>
      </div>
      <div className="pt-panel">
        {list.length === 0 ? (
          <div className="pt-empty"><b>No messages yet</b>Start the conversation below.</div>
        ) : (
          <div className="pt-chat">
            {list.map((m) => (
              <div key={m.id} className={`pt-msg ${m.sender === "admin" ? "me" : "them"}`}>
                {m.body}
                <time>{fmtDateTime(m.created_at)}</time>
              </div>
            ))}
          </div>
        )}
        <ActionForm action={sendMessage} submitLabel="Send reply" resetOnSuccess className="pt-chat-send">
          <input type="hidden" name="customer_id" value={customer.id} />
          <textarea name="body" className="pt-textarea" placeholder="Write a reply…" required maxLength={2000} />
        </ActionForm>
      </div>
    </>
  );
}
