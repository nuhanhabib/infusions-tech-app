export default function manifest() {
  return {
    name: "Infusions Tech",
    short_name: "Infusions",
    description: "Your best partner for complete tech solutions.",
    start_url: "/",
    display: "standalone",
    background_color: "#0d0a2e",
    theme_color: "#0d0a2e",
    icons: [
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}