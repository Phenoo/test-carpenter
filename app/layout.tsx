import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://companyname.example"),
  title: {
    default: "COMPANY NAME | Premium Furniture and Interior Design",
    template: "%s | COMPANY NAME",
  },
  description:
    "Luxury furniture, bespoke interiors, and white-glove installation for homes, workplaces, hospitality, and commercial spaces.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "COMPANY NAME | Premium Furniture and Interior Design",
    description:
      "Explore bespoke furniture, architectural interiors, and complete project delivery from concept to installation.",
    url: "https://companyname.example",
    siteName: "COMPANY NAME",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
        width: 1600,
        height: 900,
        alt: "Elegant interior featuring bespoke furniture and warm lighting.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "COMPANY NAME | Premium Furniture and Interior Design",
    description:
      "Luxury furniture, curated interiors, and thoughtful project delivery for residential and commercial spaces.",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f6f1e9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-[var(--color-charcoal)] focus:px-4 focus:py-3 focus:text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
