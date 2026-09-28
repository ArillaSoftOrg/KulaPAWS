import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Heading } from "@/components/ui/Heading";
import { appointmentCopy } from "@/data/appointment";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Our privacy policy is being finalized and will be published here soon.",
  alternates: { canonical: "/privacy" },
  // Placeholder page — the real policy isn't written yet. Noindex until
  // real content lands; follow stays true so this isn't a crawl dead end.
  robots: { index: false, follow: true },
};

// Only the appointment section is real content so far: it states what the
// booking form collects and why, and nothing that depends on legal or
// business facts not yet confirmed (retention, rights, processors).
export default function PrivacyPage() {
  const privacy = appointmentCopy.privacy;

  return (
    <>
      <PageHeader title="Privacy policy" />

      <Section tone="background">
        <Container size="narrow" className="flex flex-col gap-10">
          <section aria-labelledby="privacy-appointments" className="flex flex-col gap-4 text-[16px] text-foreground">
            <Heading level="h3" as="h2" id="privacy-appointments">
              {privacy.sectionTitle}
            </Heading>
            <p>{privacy.intro}</p>
            <ul className="flex flex-col gap-2">
              {privacy.collected.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p>{privacy.purpose}</p>
            <p>{privacy.whatsapp}</p>
          </section>

          <EmptyState title="Full privacy policy pending" description={privacy.pending} />
        </Container>
      </Section>
    </>
  );
}
