import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/server";
import Stars from "@/components/portal/Stars";
import "@/components/portal/work.css";

export const metadata = { title: "Our Work" };
export const revalidate = 60;

export default async function Work() {
  const supabase = createPublicClient();
  let work = [];
  let reviews = [];
  if (supabase) {
    const [w, r] = await Promise.all([
      supabase.from("portfolio").select("*").eq("published", true).order("created_at", { ascending: false }),
      supabase.from("reviews").select("author_name, company, rating, service, comment, created_at").eq("approved", true).eq("kind", "review").order("created_at", { ascending: false }).limit(12),
    ]);
    work = w.data || [];
    reviews = r.data || [];
  }

  return (
    <>
      <section className="page-head">
        <div className="container">
          <h1>Our Work</h1>
          <p>A look at the latest projects we have delivered, and what our clients say about working with us.</p>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <p className="eyebrow">Latest projects</p>
          <h2 className="section-title">Built with precision</h2>
          {work.length === 0 ? (
            <p className="section-sub">New projects are being added. Check back soon, or <Link href="/contact" style={{ color: "var(--orange-d)", fontWeight: 700 }}>talk to us</Link> about yours.</p>
          ) : (
            <div className="wk-grid">
              {work.map((p) => {
                const body = (
                  <>
                    {p.image_url ? <img src={p.image_url} alt={p.title} loading="lazy" /> : <div className="wk-noimg">{p.title[0]}</div>}
                    <div className="wk-body">
                      {p.category && <span className="badge">{p.category}</span>}
                      <h3>{p.title}</h3>
                      {p.description && <p>{p.description}</p>}
                      {p.link_url && <span className="wk-link">View project ↗</span>}
                    </div>
                  </>
                );
                return p.link_url ? (
                  <a key={p.id} className="wk-card" href={p.link_url} target="_blank" rel="noopener noreferrer">{body}</a>
                ) : (
                  <article key={p.id} className="wk-card">{body}</article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="section">
          <div className="container">
            <p className="eyebrow">Client reviews</p>
            <h2 className="section-title">What our clients say</h2>
            <div className="wk-reviews">
              {reviews.map((r, i) => (
                <figure key={i} className="wk-review">
                  <Stars value={r.rating} />
                  <blockquote>{r.comment}</blockquote>
                  <figcaption>
                    <b>{r.author_name}</b>
                    {r.company ? `, ${r.company}` : ""}
                    {r.service ? <small>{r.service}</small> : null}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="cta">
        <div className="container">
          <h2>Have a project in mind?</h2>
          <p>Create a free client account to place an order and follow your project live.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" className="btn btn-orange">Create an account</Link>
            <Link href="/contact" className="btn btn-ghost">Contact us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
