import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AppointmentWizard } from "@/components/appointment/AppointmentWizard";
import { appointmentCopy } from "@/data/appointment";
import { business } from "@/data/business";
import { services } from "@/data/services";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbList } from "@/lib/seo/jsonLd";
import { OG_IMAGE, OG_SITE_DEFAULTS, TWITTER_CARD, TWITTER_IMAGE } from "@/lib/seo/socialDefaults";

const TITLE = appointmentCopy.page.title;
const DESCRIPTION = appointmentCopy.page.description;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/appointment" },
  openGraph: {
    ...OG_SITE_DEFAULTS,
    title: TITLE,
    description: DESCRIPTION,
    url: "/appointment",
    images: [OG_IMAGE],
  },
  twitter: {
    card: TWITTER_CARD,
    title: TITLE,
    description: DESCRIPTION,
    images: [TWITTER_IMAGE],
  },
};

export default function AppointmentPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: TITLE, path: "/appointment" },
        ])}
      />
      <PageHeader title={TITLE} description={DESCRIPTION} />

      <Section tone="background">
        <Container size="narrow">
          {/* AppointmentWizard reads ?service= via useSearchParams, which
              renders it client-side up to the nearest Suspense boundary —
              this keeps the page header above it statically prerendered. */}
          <Suspense
            fallback={
              <p role="status" className="py-10 text-[15px] text-muted-foreground">
                {appointmentCopy.loading}
              </p>
            }
          >
            <AppointmentWizard defaultServices={services} defaultBusiness={business} />
          </Suspense>
        </Container>
      </Section>
    </>
  );
}
