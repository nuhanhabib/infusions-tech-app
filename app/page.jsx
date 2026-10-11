import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import { advantages, company, featuredServices } from "@/lib/data";

const advIcons = ["🧩", "🌐", "✅", "🚀"];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="rotator" aria-hidden="true">
            <span className="rotator-item">Software Development</span>
            <span className="rotator-item">Cyber Security</span>
            <span className="rotator-item">Digital Marketing</span>
            <span className="rotator-item">Motion Graphics</span>
            <span className="rotator-item">AI & Automation</span>
          </div>
          <div>
            <h1>
              Your <em>Best</em> Partner for Complete <em>Tech Solutions</em>
            </h1>
            <p>{company.description}</p>
            <div className="hero-actions">
              <Link href="/contact" className="btn btn-orange">Get Started</Link>
              <Link href="/services" className="btn btn-ghost">Explore Solutions</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <p className="eyebrow">What we do</p>
          <h2 className="section-title">Precision Services</h2>
          <p className="section-sub">
            Six specialized capabilities under one accountable partner, from creative production to engineering, security, and growth.
          </p>
          <div className="cards">
            {featuredServices.map((s) => (
              <ServiceCard key={s.title} {...s} />
            ))}
          </div>
          <div className="center">
            <Link href="/services" className="link-arrow">View all services →</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">The Infusions Advantage</h2>
          <p className="section-sub">
            At Infusions Tech, we don't just deliver services, we build partnerships. Our cross-disciplinary teams combine creative craft with engineering rigor, so every project ships polished, on time, and ready to scale.
          </p>
          <div className="adv-grid">
            <div className="adv-panel">
              <div>
                <div className="big">🧑‍💻</div>
                <h3>One accountable team</h3>
                <p style={{ color: "var(--muted)" }}>From the first line of code to the final campaign.</p>
              </div>
            </div>
            <div className="adv-list">
              {advantages.map((a, i) => (
                <div className="adv-item" key={a.title}>
                  <div className={`adv-ico bg-${a.color}`}>{advIcons[i]}</div>
                  <div>
                    <h4>{a.title}</h4>
                    <p>{a.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Not sure what your business needs next?</h2>
          <p>Tell us where you are today and where you want to be. We will help you find the right path forward.</p>
          <Link href="/contact" className="btn btn-orange">Talk to our team</Link>
        </div>
      </section>
    </>
  );
}
