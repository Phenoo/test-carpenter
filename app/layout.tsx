import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Instrument_Sans,
  Instrument_Serif,
  Manrope,
} from "next/font/google";
import { SiteChrome } from "@/components/site/site-chrome";
import { StorefrontProvider } from "@/components/site/storefront-provider";
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

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://demutzhair.example"),
  title: {
    default: "demutzhair | Luxury Pixie Wigs, Appointments and Education",
    template: "%s | demutzhair",
  },
  description:
    "Luxury bespoke pixie wigs, short-hair appointments, and specialist pixie-wig education led by Selina Williams.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "demutzhair | Luxury Pixie Wigs, Appointments and Education",
    description:
      "Shop bespoke pixie units, book premium short-hair services, and learn Selina Williams’ pixie method.",
    url: "https://demutzhair.example",
    siteName: "demutzhair",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80",
        width: 1600,
        height: 900,
        alt: "Editorial portrait of a woman wearing a polished pixie wig by demutzhair.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "demutzhair | Luxury Pixie Wigs, Appointments and Education",
    description:
      "Luxury pixie wigs, refined short-hair services, and specialist training by Selina Williams.",
    images: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80",
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${cormorant.variable} ${instrumentSans.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-[var(--color-espresso)] focus:px-4 focus:py-3 focus:text-white"
        >
          Skip to content
        </a>
        <StorefrontProvider>
          <SiteChrome>{children}</SiteChrome>
        </StorefrontProvider>
      </body>
    </html>
  );
}
