import { requireUser } from "@/lib/auth";
import { fmtDateTime } from "@/lib/portalData";
import { sendMessage } from "@/lib/actions";
import ActionForm from "@/components/portal/ActionForm";

export const metadata = { title: "Messages" };

export default async function Messages() {
  const { supabase, user } = await requireUser();
  const { data } = await supabase.from("messages").select("*").eq("customer_id", user.id).order("created_at", { ascending: true });
  const list = data || [];

  // Opening the page marks our replies as read.
  if (list.some((m) => m.sender === "admin" && !m.is_read)) {
    await supabase.from("messages").update({ is_read: true }).eq("customer_id", user.id).eq("sender", "admin").eq("is_read", false);
  }

  return (
    <>
      <div className="pt-head">
        <div>
          <h1 className="pt-h1">Messages</h1>
          <p className="pt-lead">Talk directly with the Infusions Tech team.</p>
        </div>
      </div>
      <div className="pt-panel">
        {list.length === 0 ? (
          <div className="pt-empty"><b>No messages yet</b>Send us a message below. We usually reply within one working day.</div>
        ) : (
          <div className="pt-chat">
            {list.map((m) => (
              <div key={m.id} className={`pt-msg ${m.sender === "customer" ? "me" : "them"}`}>
                {m.body}
                <time>{m.sender === "admin" ? "Infusions Tech · " : ""}{fmtDateTime(m.created_at)}</time>
              </div>
            ))}
          </div>
        )}
        <ActionForm action={sendMessage} submitLabel="Send" resetOnSuccess className="pt-chat-send">
          <textarea name="body" className="pt-textarea" placeholder="Type your message…" required maxLength={2000} />
        </ActionForm>
      </div>
    </>
  );
}
