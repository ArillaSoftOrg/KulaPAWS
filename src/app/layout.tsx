import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { getSiteUrl } from "@/lib/seo/siteUrl";
import { OG_SITE_DEFAULTS, TWITTER_CARD } from "@/lib/seo/socialDefaults";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Kulapaws",
    template: "%s | Kulapaws",
  },
  description: "Mobile pet grooming and pet-care products.",
  // No `locale` — the only confirmed language signal is <html lang="en">
  // below, which has no territory (US, GB, ...); business.address is
  // still null, so there's no confirmed location to justify one over
  // another. Covers routes with no page-level openGraph/twitter of their
  // own (admin, products, privacy); every other page re-spreads
  // OG_SITE_DEFAULTS/TWITTER_CARD itself — see socialDefaults.ts for why.
  // og:image/twitter:image come from opengraph-image.tsx/twitter-image.tsx.
  openGraph: OG_SITE_DEFAULTS,
  // No `site`/`creator` handle — none is confirmed.
  twitter: {
    card: TWITTER_CARD,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <SiteChrome header={<Header />} footer={<Footer />}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
