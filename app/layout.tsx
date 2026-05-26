import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AiChatWidget } from "@/components/ui/AiChatWidget";
import { SessionWrapper } from "@/components/auth/SessionWrapper";

export const metadata: Metadata = {
  title: "BHAF MarketBridge — Marketplace & Impact Infrastructure for African Women Entrepreneurs",
  description:
    "BHAF MarketBridge connects African women entrepreneurs with funders, corporate partners and global markets through verified profiles, ESG documentation and impact reporting.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <AiChatWidget />
        </SessionWrapper>
      </body>
    </html>
  );
}
