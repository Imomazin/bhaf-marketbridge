import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AiChatWidget } from "@/components/ui/AiChatWidget";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { SessionWrapper } from "@/components/auth/SessionWrapper";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://bhaf-marketbridge.vercel.app"),
  title: {
    default: "BHAF MarketBridge — Marketplace & Impact Infrastructure for African Women Entrepreneurs",
    template: "%s · BHAF MarketBridge",
  },
  description:
    "BHAF MarketBridge connects African women entrepreneurs with funders, corporate partners and global markets through verified profiles, ESG documentation and impact reporting.",
  keywords: [
    "African women entrepreneurs",
    "BHAF",
    "MarketBridge",
    "ESG reporting",
    "impact investing",
    "AFAWA",
    "supplier diversity",
    "circular economy",
    "Africa marketplace",
  ],
  openGraph: {
    type: "website",
    siteName: "BHAF MarketBridge",
    title: "BHAF MarketBridge — Marketplace & Impact Infrastructure for African Women Entrepreneurs",
    description:
      "Verified African women-led businesses meet funders, corporate buyers and global market access.",
    images: [
      {
        url: "/media/bhaf/bhaf-launch-nyc-1.jpg",
        width: 1600,
        height: 1067,
        alt: "BHAF Global Launch — convened with IPWRA at the United Nations.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BHAF MarketBridge",
    description:
      "Verified African women-led businesses meet funders, corporate buyers and global market access.",
    images: ["/media/bhaf/bhaf-launch-nyc-1.jpg"],
  },
  alternates: {
    canonical: "/",
    languages: {
      "en": "/",
      "fr": "/?lang=fr",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BHAF MarketBridge",
    legalName: "BHAF Circular Academy & Consulting Firm",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "https://bhaf-marketbridge.vercel.app",
    logo: "/brand/bhaf-mark.svg",
    description:
      "BHAF MarketBridge connects African women entrepreneurs with funders, corporate partners and global markets through verified profiles, ESG documentation and impact reporting.",
    sameAs: ["https://www.linkedin.com/company/bhaf-circular-academy"],
    foundingLocation: { "@type": "Place", name: "Africa" },
  };
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-md focus:bg-forest-900 focus:px-3 focus:py-2 focus:text-cream-50"
        >
          Skip to content
        </a>
        <SessionWrapper>
          <Navbar />
          <main id="main-content" tabIndex={-1}>{children}</main>
          <Footer />
          <AiChatWidget />
          <CookieConsent />
        </SessionWrapper>
      </body>
    </html>
  );
}
