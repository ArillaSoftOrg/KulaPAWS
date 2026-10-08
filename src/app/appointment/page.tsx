import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AppointmentWizard } from "@/components/appointment/AppointmentWizard";
import { AppointmentPageIntro, AppointmentLoadingFallback } from "@/components/appointment/AppointmentPageIntro";
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
      <AppointmentPageIntro />

      <Section tone="background" className="relative overflow-hidden">
        {/* Ambient paw accents for the empty margins either side of the
            narrow (760px) content column — shown from lg (1024px) up.
            At the narrowest lg width (1024px), Container's margin on each
            side is (1024-760)/2 = 132px, so every offset+size pair below
            is kept well under that (max reach ~70px) to guarantee no
            overlap with the card/stepper/CTA even at that floor; they
            scale up a little at xl (1280px+, ≥260px margin) since there's
            plenty of room to be more noticeable there. Reusing the same
            low-opacity SVGs as the hero (paw-decoration-1/2.svg) rather
            than adding new assets. pointer-events-none + no interactive
            role: decorative only, behind the content (DOM order before
            Container, so it paints first / sits visually behind it). */}
        <Image
          src="/appointment/paw-decoration-2.svg"
          alt=""
          width={96}
          height={92}
          unoptimized
          className="pointer-events-none absolute right-20 top-60 hidden h-14 w-auto rotate-30 opacity-80 lg:block xl:h-20"
        />
        
        <Image
          src="/appointment/paw-decoration-1.svg"
          alt=""
          width={118}
          height={112}
          unoptimized
          className="pointer-events-none absolute left-15 top-70 hidden h-16 w-auto -translate-y-1/2 -rotate-30 opacity-70 lg:block xl:h-24"
        />
        <Image
  src="/appointment/paw-decoration-2.svg"
  alt=""
  width={96}
  height={92}
  unoptimized
  className="pointer-events-none absolute left-28 top-[72%] hidden h-14 w-auto -rotate-12 opacity-70 lg:block xl:h-16"
/>
        <Image
          src="/appointment/paw-decoration-2.svg"
          alt=""
          width={96}
          height={92}
          unoptimized
          className="pointer-events-none absolute right-50 top-[60%] hidden h-12 w-auto -rotate-35 opacity-70 lg:block xl:h-16"
        />
        <Image
          src="/appointment/paw-decoration-1.svg"
          alt=""
          width={118}
          height={112}
          unoptimized
          className="pointer-events-none absolute bottom-10 right-3 hidden h-16 w-auto rotate-30 opacity-80 lg:block xl:h-20"
        />

        <Container size="narrow" className="relative">
          {/* AppointmentWizard reads ?service= via useSearchParams, which
              renders it client-side up to the nearest Suspense boundary —
              this keeps the page header above it statically prerendered. */}
          <Suspense fallback={<AppointmentLoadingFallback />}>
            <AppointmentWizard defaultServices={services} defaultBusiness={business} />
          </Suspense>
        </Container>
      </Section>
    </>
  );
}
