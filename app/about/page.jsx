import Link from "next/link";
import { advantages, whyPoints } from "@/lib/data";

export const metadata = { title: "About" };

export default function About() {
  return (
    <>
      <section className="page-head">
        <div className="container">
          <h1>About Infusions Tech</h1>
          <p>A technology company and marketing agency under one roof.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <p style={{ fontSize: 18, color: "var(--muted)" }}>
            Infusions Tech was founded on a simple belief : businesses shouldn’t need five different vendors to run one digital operation. Creative, engineering, security, and marketing belong in one accountable team.

            Today, from our home base in Dhaka, Bangladesh, we serve clients around the world — from a single promotional video to full-scale software platforms.

            We measure our success by one metric only : the growth of the businesses we partner with.
          </p>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <h2 className="section-title">Why businesses work with us</h2>
          <ul className="checks">
            {whyPoints.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">The Infusions Advantage</h2>
          <div className="cards">
            {advantages.map((a) => (
              <article className="card" key={a.title}>
                <h3 className={`c-${a.color}`}>{a.title}</h3>
                <p>{a.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Let's build something together</h2>
          <p>We grow when you grow.</p>
          <Link href="/contact" className="btn btn-orange">Contact Us</Link>
        </div>
      </section>
    </>
  );
}
