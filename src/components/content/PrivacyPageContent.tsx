"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { useLocale } from "@/lib/i18n/LocaleProvider";

// See FaqPageIntro.tsx for why this is a small standalone Client Component
// rather than threading a locale prop through the Server Component page.
export function PrivacyPageContent() {
  const { dictionary } = useLocale();

  return (
    <>
      <PageHeader title={dictionary.shared.privacyPage.title} />

      <Section tone="background">
        <Container size="narrow">
          <EmptyState
            title={dictionary.shared.privacyPage.emptyTitle}
            description={dictionary.shared.privacyPage.emptyDescription}
          />
        </Container>
      </Section>
    </>
  );
}
