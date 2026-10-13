import { socials } from "@/lib/data";

export const metadata = { title: "Blog" };

export default function Blog() {
  const linkedin = socials.find((s) => s.key === "linkedin");

  return (
    <>
      <section className="page-head">
        <div className="container">
          <h1>Blog</h1>
          <p>Enterprise IT insights from the Infusions Tech team.</p>
        </div>
      </section>

      <section className="section alt">
        <div className="container" style={{ maxWidth: 780, textAlign: "center" }}>
          <h2 className="section-title">Articles are on the way</h2>
          <p className="section-sub">
            Subscribe with the form in the footer to hear first, or follow us on LinkedIn for our latest updates.
          </p>
          <div style={{ marginTop: 30 }}>
            <a className="btn btn-orange" href={linkedin.url} target="_blank" rel="noopener noreferrer">
              Follow us on LinkedIn
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
