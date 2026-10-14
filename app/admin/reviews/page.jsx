import Link from "next/link";
import { requireAdmin, fullName } from "@/lib/auth";
import { fmtDate } from "@/lib/portalData";
import { setReviewApproved, deleteReview } from "@/lib/actions";
import ConfirmButton from "@/components/portal/ConfirmButton";
import Stars from "@/components/portal/Stars";

export const metadata = { title: "Reviews" };

const filters = [
  { key: "", label: "All" },
  { key: "pending", label: "Waiting for approval" },
  { key: "published", label: "Published" },
  { key: "feedback", label: "Private feedback" },
];

export default async function AdminReviews({ searchParams }) {
  const sp = await searchParams;
  const f = filters.some((x) => x.key === sp?.f) ? sp.f : "";
  const { supabase } = await requireAdmin();

  let query = supabase.from("reviews").select("*, profiles(first_name, last_name, email)").order("created_at", { ascending: false });
  if (f === "pending") query = query.eq("kind", "review").eq("approved", false);
  if (f === "published") query = query.eq("approved", true);
  if (f === "feedback") query = query.eq("kind", "feedback");
  const { data } = await query;
  const list = data || [];

  return (
    <>
      <div className="pt-head">
        <div>
          <h1 className="pt-h1">Reviews &amp; feedback</h1>
          <p className="pt-lead">Approve reviews to show them on your website. Private feedback stays between you and the customer.</p>
        </div>
      </div>
      <div className="pt-filters">
        {filters.map((x) => (
          <Link key={x.key} href={x.key ? `/admin/reviews?f=${x.key}` : "/admin/reviews"} className={f === x.key ? "active" : ""}>{x.label}</Link>
        ))}
      </div>
      {list.length === 0 ? (
        <div className="pt-panel pt-empty"><b>Nothing here</b></div>
      ) : (
        <div className="pt-panel">
          <ul className="pt-list">
            {list.map((r) => (
              <li key={r.id}>
                <div className="pt-grow">
                  <Stars value={r.rating} />
                  <span style={{ display: "block", whiteSpace: "pre-wrap", wordBreak: "break-word", margin: "4px 0" }}>{r.comment}</span>
                  <small>
                    {fullName(r.profiles)} · {r.service || "General"} · {fmtDate(r.created_at)} ·{" "}
                    {r.kind === "feedback" ? "Private feedback" : r.approved ? "Published" : "Waiting"}
                  </small>
                  <div className="pt-actions-row" style={{ marginTop: 10 }}>
                    {r.kind === "review" && (
                      <form action={setReviewApproved}>
                        <input type="hidden" name="id" value={r.id} />
                        <input type="hidden" name="approved" value={r.approved ? "false" : "true"} />
                        <button className={r.approved ? "pt-btn ghost sm" : "pt-btn sm"}>{r.approved ? "Unpublish" : "Approve & publish"}</button>
                      </form>
                    )}
                    <form action={deleteReview}>
                      <input type="hidden" name="id" value={r.id} />
                      <ConfirmButton message="Delete this permanently?">Delete</ConfirmButton>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
