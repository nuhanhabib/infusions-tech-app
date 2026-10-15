import "./clients.css";

// Add or remove a client here. Put the logo file in /public/clients/.
const clients = [
  { name: "Nilkona", logo: "/clients/nilkona.webp" },
  { name: "Nexora Elegent", logo: "/clients/nexora-elegent.webp" },
  { name: "ServyGo", logo: "/clients/servygo.webp" },
  { name: "Shobhaat", logo: "/clients/shobhaat.webp" },
  { name: "Fusion Studio", logo: "/clients/fusion-studio.webp" },
  { name: "Shari Pori", logo: "/clients/shari-pori.webp" },
  { name: "Nexora Foods", logo: "/clients/nexora-foods.webp" },
  { name: "Space Interiors and Builders", logo: "/clients/space-interiors.webp" },
  { name: "Dr Arindam Das", logo: "/clients/dr-arindam-das.webp" },
];

export default function ClientsMarquee() {
  const row = (hidden) =>
    clients.map((c) => (
      <li key={c.name + hidden} aria-hidden={hidden || undefined}>
        <img src={c.logo} alt={hidden ? "" : c.name} loading="lazy" />
      </li>
    ));

  return (
    <section className="clients-band" aria-label="Our clients">
      <div className="container">
        <h2 className="clients-title">Clients</h2>
      </div>
      <div className="clients-viewport">
        <ul className="clients-track">
          {row(false)}
          {row(true)}
        </ul>
      </div>
    </section>
  );
}
