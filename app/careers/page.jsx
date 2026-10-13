import { company, socials } from "@/lib/data";

export const metadata = { title: "Careers" };

export default function Careers() {
  const linkedin = socials.find((s) => s.key === "linkedin");

  return (
    <>
      <section className="page-head">
        <div className="container">
          <h1>Careers</h1>
          <p>Build the future of enterprise IT with Infusions Tech.</p>
        </div>
      </section>

      <section className="section alt">
        <div className="container" style={{ maxWidth: 780, textAlign: "center" }}>
          <h2 className="section-title">Join our team</h2>
          <p className="section-sub">
            We're always glad to meet talented developers, designers, marketers and creators. Send your CV and a short
            introduction and we'll be in touch when a suitable role opens.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginTop: 30 }}>
            <a
              className="btn btn-orange"
              href={`mailto:${company.email}?subject=${encodeURIComponent("Career enquiry")}`}
            >
              Email your CV
            </a>
            <a className="btn btn-dark" href={linkedin.url} target="_blank" rel="noopener noreferrer">
              Follow us on LinkedIn
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
