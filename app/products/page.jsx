import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Products",
  description:
    "Our own products: Doctor's Dashboard, Portal for Corporate Office and E-Commerce Website, built by Infusions Tech.",
};

const products = [
  {
    title: "Doctor's Dashboard",
    text: "A clinic management dashboard that brings appointments, patient records, prescriptions, and billing into one secure workspace, so doctors spend less time on admin and more time with patients.",
    items: [
      "Appointment scheduling & reminders",
      "Digital patient records & history",
      "Prescription & report management",
      "Billing & revenue insights",
    ],
    image: "/products/doctor-dashboard.png",
    alt: "Infusions Tech Doctor's Dashboard preview",
    warm: false,
  },
  {
    title: "Portal for Corporate Office",
    text: "An internal portal that connects your teams: attendance, leave, approvals, documents, and announcements in one place, with the right access for every role.",
    items: [
      "Attendance & leave management",
      "Approval workflows",
      "Document & announcement hub",
      "Role-based access control",
    ],
    image: "/products/office-platform.png",
    alt: "Infusions Tech office management portal preview",
    warm: true,
  },
  {
    title: "E-Commerce Website",
    text: "A fast, mobile-first online store with secure checkout, inventory, and order management built in, ready to carry your brand, launch, and grow with your business.",
    items: [
      "Product catalog & inventory",
      "Secure checkout & payments",
      "Order tracking & customer accounts",
      "Sales reports & promotions",
    ],
    image: "/products/ecommerce-cms.png",
    alt: "Infusions Tech E-commerce CMS preview",
    warm: false,
  },
];

const css = `
.prod-section { padding: 90px 0; background: #ffffff; }
.prod-section.warm { background: #fbf8f5; }

.prod-row {
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: 56px;
  align-items: center;
}
/* Image on the left: flip the column widths so the image column stays the wide one */
.prod-row.reverse { grid-template-columns: 1.25fr 1fr; }
.prod-row.reverse .prod-media { order: -1; }
.prod-text, .prod-media { min-width: 0; }

.prod-text h2 {
  font-size: clamp(30px, 3.6vw, 44px);
  line-height: 1.15;
  letter-spacing: -1px;
  font-weight: 800;
  color: #1b3a8a;
}
.prod-desc { margin-top: 18px; color: #5b6475; font-size: 17px; line-height: 1.75; }

.prod-included {
  margin-top: 30px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: #8a93a6;
}
.prod-items {
  list-style: none;
  margin: 14px 0 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.prod-items li {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #ffffff;
  border: 1px solid #e8edf5;
  border-radius: 14px;
  padding: 14px 16px;
  font-size: 15px;
  font-weight: 500;
  color: #0d0a2e;
  box-shadow: 0 2px 8px rgba(120, 140, 180, 0.08);
}
.prod-items li svg { flex: none; width: 20px; height: 20px; color: #ff7a18; }

.prod-actions { margin-top: 32px; }
.prod-order { border-radius: 12px; padding: 15px 28px; }

.prod-frame {
  width: 100%;
  background: #f1f6ff;
  border-radius: 32px;
  padding: 16px;
  border: 1px solid #e3ebf8;
  box-shadow: 0 24px 60px rgba(60, 90, 150, 0.18);
}
.prod-section.warm .prod-frame {
  background: #fff1ea;
  border-color: #fde3d4;
  box-shadow: 0 24px 60px rgba(242, 98, 0, 0.15);
}
/* Same shape for all three images */
.prod-frame img {
  width: 100%;
  height: auto;
  aspect-ratio: 1852 / 849;
  object-fit: cover;
  border-radius: 20px;
  display: block;
}

@media (max-width: 960px) {
  .prod-section { padding: 60px 0; }
  .prod-row,
  .prod-row.reverse { grid-template-columns: 1fr; gap: 36px; }
  .prod-row.reverse .prod-media { order: 0; }
}
@media (max-width: 520px) {
  .prod-items { grid-template-columns: 1fr; }
}
`;

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.5" />
      <path d="M8 12.5l2.7 2.7L16 9.8" />
    </svg>
  );
}

export default function ProductsPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <section className="page-head">
        <div className="container">
          <h1>Our Own Products</h1>
          <p>We build products as well as deliver services.</p>
        </div>
      </section>

      {products.map((p, i) => (
        <section key={p.title} className={`prod-section ${p.warm ? "warm" : ""}`}>
          <div className="container">
            <div className={`prod-row ${i % 2 === 1 ? "reverse" : ""}`}>
              <div className="prod-text">
                <h2>{p.title}</h2>
                <p className="prod-desc">{p.text}</p>

                <div className="prod-included">What&apos;s included</div>
                <ul className="prod-items">
                  {p.items.map((it) => (
                    <li key={it}>
                      <CheckIcon />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>

                <div className="prod-actions">
                  <Link href="/contact" className="btn btn-orange prod-order">
                    Order Now <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>

              <div className="prod-media">
                <div className="prod-frame">
                  <Image
                    src={p.image}
                    alt={p.alt}
                    width={1852}
                    height={849}
                    sizes="(max-width: 960px) 100vw, 640px"
                    priority={i === 0}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}