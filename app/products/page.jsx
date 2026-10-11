import Link from "next/link";
import { products } from "@/lib/data";

export const metadata = { title: "Our Products" };

const icons = ["🩺", "🏢", "🛒"];

export default function Products() {
  return (
    <>
      <section className="page-head">
        <div className="container">
          <h1>Our Own Products</h1>
          <p>We build products as well as deliver services.</p>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="cards">
            {products.map((p, i) => (
              <article className="card" key={p.title}>
                <div className="card-art" aria-hidden="true">{icons[i]}</div>
                <span className="badge">{p.status}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <Link href="/contact" className="learn c-purple">Get early access ↗</Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
