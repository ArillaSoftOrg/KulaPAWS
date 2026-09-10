import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Our privacy policy is being finalized and will be published here soon.",
  alternates: { canonical: "/privacy" },
  // Placeholder page — the real policy isn't written yet. Noindex until
  // real content lands; follow stays true so this isn't a crawl dead end.
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader title="Privacy policy" />

      <Section tone="background">
        <Container size="narrow">
          <EmptyState
            title="Privacy policy pending"
            description="This page will contain Kulapaws' real privacy policy once the underlying legal and business information is confirmed."
          />
        </Container>
      </Section>
    </>
  );
}
