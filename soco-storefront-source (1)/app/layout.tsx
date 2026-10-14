import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SOCO Beauty | Beauty, Curated for You",
  description: "Temukan skincare dan makeup favoritmu. Checkout praktis tanpa wajib membuat akun.",
  applicationName: "SOCO Beauty",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "SOCO Beauty" },
  icons: { icon: "/icon.svg", apple: "/icon.svg" }
};
export const viewport: Viewport = { themeColor: "#c92770", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
