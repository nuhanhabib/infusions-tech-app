import ContactForm from "@/components/ContactForm";
import Icon from "@/components/Icon";
import { company, socials } from "@/lib/data";

export const metadata = { title: "Contact Us" };

export default function Contact() {
  return (
    <>
      <section className="page-head">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Not sure what your business needs next? Tell us where you are today and where you want to be.</p>
        </div>
      </section>

      <section className="section alt">
        <div className="container contact-grid">
          <div className="info-card">
            <h3>Get in touch</h3>
            <div className="info-row">
              <Icon name="call" size={20} />
              <div>
                <b>Phone</b>
                <a href={`tel:${company.phone}`}>{company.phoneDisplay}</a>
              </div>
            </div>
            <div className="info-row">
              <Icon name="mail" size={20} />
              <div>
                <b>Email</b>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </div>
            </div>
            <div className="info-row">
              <Icon name="pin" size={20} />
              <div>
                <b>Office</b>
                {company.address}
              </div>
            </div>
            <div className="info-row">
              <Icon name="chart" size={20} />
              <div>
                <b>Website</b>
                <a href={company.website} target="_blank" rel="noopener noreferrer">infusionstech.com</a>
              </div>
            </div>
            <div className="sf-social" style={{ marginTop: 26 }}>
              {socials.map((s) => (
                <a
                  key={s.key}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Infusions Tech on ${s.name}`}
                  title={s.name}
                >
                  <Icon name={s.key} size={18} />
                </a>
              ))}
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
