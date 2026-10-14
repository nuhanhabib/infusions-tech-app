import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import SiteChrome from "@/components/SiteChrome";

export const metadata = {
  title: {
    default: "Infusions Tech | Your Best Partner for Complete Tech Solutions",
    template: "%s | Infusions Tech",
  },
  description:
    "Infusions Tech is a technology company and marketing agency under one roof: software, web, mobile, AI, cyber security, design, marketing and branding. Based in Dhaka, serving the world.",
  applicationName: "Infusions Tech",
  appleWebApp: { capable: true, title: "Infusions Tech", statusBarStyle: "black-translucent" },
};

export const viewport = {
  themeColor: "#0d0a2e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SiteChrome>
          <Navbar />
        </SiteChrome>
        <main>{children}</main>
        <SiteChrome>
          <Footer />
          <ChatWidget />
        </SiteChrome>
      </body>
    </html>
  );
}
