export default function manifest() {
  return {
    name: "Infusions Tech",
    short_name: "Infusions",
    description: "Your best partner for complete tech solutions.",
    start_url: "/",
    display: "standalone",
    background_color: "#0d0a2e",
    theme_color: "#0d0a2e",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
