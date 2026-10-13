import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import { ctaButton, detailHref, getService, serviceDetails } from "@/lib/serviceDetails";
import "./service.css";

// Build every service page ahead of time (works great on Vercel's free plan).
export function generateStaticParams() {
  return serviceDetails.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return { title: s.title, description: s.tagline };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  const others = serviceDetails.filter((o) => o.slug !== s.slug);

  return (
    <>
      <section className="page-head sd-hero">
        <div className="container">
          <Link href="/services" className="crumb">← All services</Link>
          <div className="sd-badge" aria-hidden="true">
            <Icon name={s.icon} size={34} />
          </div>
          <span className="kicker">{s.title}</span>
          <h1>{s.heading}</h1>
          <p>{s.tagline}</p>
          <Link href="/contact" className="btn btn-orange">{ctaButton}</Link>
        </div>
      </section>

      <section className="section">
        <div className="container sd-wrap">
          <h2 className="sd-h">Everything You Need In This Service</h2>
          <div className="sd-features">
            {s.features.map(([title, text]) => (
              <article className="sd-feature" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container sd-wrap sd-about">
          <h2>{s.aboutHeading}</h2>
          {s.about.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container sd-wrap">
          <h2 className="sd-h">How We Deliver Our Results</h2>
          <div className="sd-steps">
            {s.steps.map(([title, text], i) => (
              <article className="sd-step" key={title}>
                <span className="sd-num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta sd-cta">
        <div className="container">
          <h2>{s.ctaHeading}</h2>
          {s.cta.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <Link href="/contact" className="btn btn-orange">{ctaButton}</Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="sd-h">Explore other services</h2>
          <div className="other">
            {others.map((o) => (
              <Link key={o.slug} href={detailHref(o.slug)}>
                <Icon name={o.icon} size={16} /> {o.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
