import Link from "next/link";
import Icon from "./Icon";
import { detailHref, getService } from "@/lib/serviceDetails";
import "./services.css";

// One service card. Pass the service slug, e.g. <ServiceCard slug="cyber-security" />.
// The whole card is clickable and opens /services/<slug>.
export default function ServiceCard({ slug }) {
  const s = getService(slug);
  if (!s) return null;

  return (
    <article className="svc-card">
      <Icon name={s.icon} size={30} className="svc-card-icon" />
      <h3>{s.title}</h3>
      <p>{s.tagline}</p>
      <Link href={detailHref(s.slug)} className="svc-card-link" aria-label={`Explore more: ${s.title}`}>
        Explore More <Icon name="arrow" size={15} />
      </Link>
    </article>
  );
}
