import type { Metadata } from "next";
import { PrivacyPageContent } from "@/components/content/PrivacyPageContent";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Our privacy policy is being finalized and will be published here soon.",
  alternates: { canonical: "/privacy" },
  // Placeholder page — the real policy isn't written yet. Noindex until
  // real content lands; follow stays true so this isn't a crawl dead end.
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return <PrivacyPageContent />;
}
