import { requireUser } from "@/lib/auth";
import { serviceOptions, fmtDate } from "@/lib/portalData";
import { submitReview, deleteMyReview } from "@/lib/actions";
import ActionForm from "@/components/portal/ActionForm";
import RatingInput from "@/components/portal/RatingInput";
import Stars from "@/components/portal/Stars";

export const metadata = { title: "Reviews & feedback" };

export default async function Reviews() {
  const { supabase, user } = await requireUser();
  const { data } = await supabase.from("reviews").select("*").eq("customer_id", user.id).order("created_at", { ascending: false });
  const list = data || [];

  return (
    <>
      <div className="pt-head">
        <div>
          <h1 className="pt-h1">Reviews &amp; feedback</h1>
          <p className="pt-lead">Your voice helps us improve and helps other businesses trust us.</p>
        </div>
      </div>

      <div className="pt-cols">
        <div className="pt-panel">
          <h2>Share your experience</h2>
          <ActionForm action={submitReview} submitLabel="Submit" resetOnSuccess>
            <label className="pt-label">What would you like to send?</label>
            <div className="pt-seg">
              <label>
                <input type="radio" name="kind" value="review" defaultChecked />
                <span>Public review<small>Shown on our website after approval</small></span>
              </label>
              <label>
                <input type="radio" name="kind" value="feedback" />
                <span>Private feedback<small>Only our team sees this</small></span>
              </label>
            </div>
            <label className="pt-label">Your rating</label>
            <RatingInput />
            <label className="pt-label" htmlFor="service">Service <span className="pt-opt">(optional)</span></label>
            <select id="service" name="service" className="pt-select" defaultValue="">
              <option value="">General / our app</option>
              {serviceOptions.map((s) => <option key={s}>{s}</option>)}
            </select>
            <label className="pt-label" htmlFor="comment">Your message</label>
            <textarea id="comment" name="comment" className="pt-textarea" placeholder="Tell us what went well and what we can do better." required />
          </ActionForm>
        </div>

        <div className="pt-panel">
          <h2>Your submissions</h2>
          {list.length === 0 ? (
            <div className="pt-empty"><b>Nothing yet</b>What you send will be listed here.</div>
          ) : (
            <ul className="pt-list">
              {list.map((r) => (
                <li key={r.id}>
                  <div className="pt-grow">
                    <Stars value={r.rating} />
                    <span style={{ display: "block", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{r.comment}</span>
                    <small>
                      {r.kind === "feedback" ? "Private feedback" : r.approved ? "Published on website" : "Waiting for approval"} · {fmtDate(r.created_at)}
                    </small>
                    <form action={deleteMyReview} style={{ marginTop: 8 }}>
                      <input type="hidden" name="id" value={r.id} />
                      <button className="pt-btn danger sm">Delete</button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
