import Link from "next/link";

const art = { teal: "💻", orange: "🛡️", purple: "📈" };

export default function ServiceCard({ title, text, color = "teal", icon }) {
  return (
    <article className="card">
      <div className="card-art" aria-hidden="true">{icon || art[color]}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      <Link href="/contact" className={`learn c-${color}`}>
        Learn more ↗
      </Link>
    </article>
  );
}
