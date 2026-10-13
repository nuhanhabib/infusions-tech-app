import Link from "next/link";
import Icon from "@/components/Icon";
import ServiceCard from "@/components/ServiceCard";
import { serviceDetails } from "@/lib/serviceDetails";

export const metadata = {
  title: "Services",
  description:
    "Software, web and mobile development, AI and automation, cyber security, digital marketing, design, studio, strategy and branding from one accountable team.",
};

const steps = [
  { icon: "search", title: "Discovery", text: "We dig into your goals, users, and constraints first." },
  { icon: "compass", title: "Architecture", text: "Scalable systems and intuitive UX, planned up front." },
  { icon: "settings", title: "Engineering", text: "Clean, tested code shipped in transparent sprints." },
  { icon: "network", title: "Scale", text: "Automated deployment and continuous optimization." },
];

export default function Services() {
  return (
    <>
      <section className="page-head">
        <div className="container">
          <h1>Our Services</h1>
          <p>Technology, creative, studio and strategy, delivered by one accountable team.</p>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <h2 className="svc-title">Explore Our Services</h2>
          <div className="svc-grid">
            {serviceDetails.map((s) => (
              <ServiceCard key={s.slug} slug={s.slug} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="process">
        <div className="container">
          <h2 className="svc-title">Precision in Every Step</h2>
          <div className="process-grid">
            {steps.map((s, i) => (
              <article className="process-card" key={s.title}>
                <span className="process-num">{i + 1}</span>
                <div className="process-ico">
                  <Icon name={s.icon} size={24} />
                </div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Not sure which service fits?</h2>
          <p>Tell us where you are today and where you want to be.</p>
          <Link href="/contact" className="btn btn-orange">Get a free consultation</Link>
        </div>
      </section>
    </>
  );
}
