import ContactForm from "@/components/ContactForm";
import { company } from "@/lib/data";

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
              <span>📞</span>
              <div>
                <b>Phone</b>
                <a href={`tel:${company.phone}`}>{company.phoneDisplay}</a>
              </div>
            </div>
            {company.email && (
              <div className="info-row">
                <span>✉️</span>
                <div>
                  <b>Email</b>
                  <a href={`mailto:${company.email}`}>{company.email}</a>
                </div>
              </div>
            )}
            <div className="info-row">
              <span>📍</span>
              <div>
                <b>Location</b>
                {company.location}
              </div>
            </div>
            <div className="info-row">
              <span>🌐</span>
              <div>
                <b>Website</b>
                <a href={company.website} target="_blank" rel="noopener noreferrer">infusionstech.com</a>
              </div>
            </div>
            <div className="info-row">
              <span>🔗</span>
              <div>
                <b>Social</b>
                <a href={company.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                {" · "}
                <a href={company.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
