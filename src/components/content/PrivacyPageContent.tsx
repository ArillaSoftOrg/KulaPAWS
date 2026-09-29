"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Heading } from "@/components/ui/Heading";
import { appointmentCopy } from "@/data/appointment";
import { appointmentCopyTr } from "@/lib/i18n/content/appointment.tr";
import { appointmentCopyRu } from "@/lib/i18n/content/appointment.ru";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { useLocalizedValue } from "@/lib/i18n/useLocalizedValue";

// See FaqPageIntro.tsx for why this is a small standalone Client Component
// rather than threading a locale prop through the Server Component page.
//
// Only the appointment section is real content so far: it states what the
// booking form collects and why, and nothing that depends on legal or
// business facts not yet confirmed (retention, rights, processors).
export function PrivacyPageContent() {
  const { dictionary } = useLocale();
  const privacy = useLocalizedValue(appointmentCopy, appointmentCopyTr, appointmentCopyRu).privacy;

  return (
    <>
      <PageHeader title={dictionary.shared.privacyPage.title} />

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

          <EmptyState
            title={dictionary.shared.privacyPage.emptyTitle}
            description={dictionary.shared.privacyPage.emptyDescription}
          />
        </Container>
      </Section>
    </>
  );
}
