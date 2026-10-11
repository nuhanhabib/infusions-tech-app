import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import { serviceGroups } from "@/lib/data";

export const metadata = { title: "Services" };

const icons = {
  "Software Development": "💻",
  "Web Design & Development": "🌐",
  "Mobile App Development": "📱",
  "AI & Automation Solutions": "🤖",
  "Cyber Security": "🛡️",
  "Digital Marketing": "📈",
  "Graphics Design": "🎨",
  "UX/UI Design": "🧭",
  "Motion Graphics": "✨",
  "Video Editing": "🎬",
  "Fusion Studio": "🎥",
  "Business & Digital Consulting": "🧠",
  "Complete Branding Solution": "🏷️",
};

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
          {serviceGroups.map((g) => (
            <div key={g.group}>
              <h2 className={`group-title c-${g.color}`}>
                <span style={{ color: "var(--ink)" }}>{g.group}</span>
              </h2>
              <div className="cards" style={{ marginTop: 28 }}>
                {g.items.map((s) => (
                  <ServiceCard key={s.title} title={s.title} text={s.text} color={g.color} icon={icons[s.title]} />
                ))}
              </div>
            </div>
          ))}
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
