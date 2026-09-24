"use client";

import { useEffect, useState } from "react";
import { ServiceDetail } from "@/components/sections/ServiceDetail";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { servicesRepository, SERVICES_SYNC_PING_KEY } from "@/lib/content/servicesRepository";
import { businessRepository, BUSINESS_SYNC_PING_KEY } from "@/lib/content/businessRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";
import { resolveImageSrc } from "@/lib/images/resolveImageSrc";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { navHref, navLabel } from "@/lib/i18n/navLabels";
import { buildLocalizedPath } from "@/lib/i18n/pathLocale";
import { getServiceTrBySlug } from "@/lib/i18n/content/services.tr";
import { getServiceRuBySlug } from "@/lib/i18n/content/services.ru";
import { primaryCta } from "@/data/navigation";
import { business as defaultBusiness } from "@/data/business";
import type { Service } from "@/data/services";

const STORAGE_KEYS = [SERVICES_SYNC_PING_KEY];
const BUSINESS_STORAGE_KEYS = [BUSINESS_SYNC_PING_KEY];

interface ServiceDetailLiveProps {
  slug: string;
  defaultService: Service | null;
}

// The server only knows about the static default services at request time,
// so an admin-created service slug renders as "not found" until this
// effect resolves and fetches the live list from Supabase. Existing
// default services render immediately from `defaultService` (no flash) and
// are only replaced if the Supabase row differs from the shipped default.
export function ServiceDetailLive({ slug, defaultService }: ServiceDetailLiveProps) {
  const { locale, dictionary } = useLocale();
  const liveServices = useLiveContent<Service[]>(
    defaultService ? [defaultService] : [],
    servicesRepository.list,
    STORAGE_KEYS,
  );
  const liveMatch = liveServices.find((item) => item.slug === slug) ?? null;
  // Turkish and Russian both bypass the Supabase-backed live list (services
  // has no locale dimension) and use their static translation instead,
  // falling back to the English live match for an admin-created service
  // that has no translation yet — see services.tr.ts / services.ru.ts.
  const match =
    locale === "tr"
      ? (getServiceTrBySlug(slug) ?? liveMatch)
      : locale === "ru"
        ? (getServiceRuBySlug(slug) ?? liveMatch)
        : liveMatch;
  const [resolvedImage, setResolvedImage] = useState<string | null>(defaultService?.image ?? null);
  const business = useLiveContent(defaultBusiness, businessRepository.get, BUSINESS_STORAGE_KEYS);

  useEffect(() => {
    if (!match) return;
    let active = true;
    resolveImageSrc(match.image).then((src) => {
      if (active) setResolvedImage(src);
    });
    return () => {
      active = false;
    };
  }, [match]);

  if (!match) {
    return (
      <Section tone="background">
        <Container size="narrow">
          <EmptyState
            title={dictionary.shared.serviceNotFoundTitle}
            description={dictionary.shared.serviceNotFoundDescription}
          />
        </Container>
      </Section>
    );
  }

  return (
    <ServiceDetail
      service={{ ...match, image: resolvedImage }}
      cta={{ label: navLabel(dictionary, primaryCta), href: navHref(locale, primaryCta) }}
      eyebrow={dictionary.shared.serviceEyebrow}
      backLabel={dictionary.shared.backToServices}
      backHref={buildLocalizedPath(locale, "/services")}
      overviewHeading={dictionary.shared.overview}
      imageLabel={
        locale === "tr"
          ? `${match.title} fotoğrafı yakında`
          : locale === "ru"
            ? `Фото «${match.title}» появится позже`
            : `${match.title} photo coming soon`
      }
      whoItsForHeading={dictionary.shared.whoItsFor}
      whatToExpectHeading={dictionary.shared.whatToExpect}
      ctaHeading={
        locale === "tr"
          ? `${match.title} randevusu almaya hazır mısınız?`
          : locale === "ru"
            ? `Готовы записаться на услугу «${match.title}»?`
            : `Ready to book ${match.title}?`
      }
      ctaDescription={dictionary.shared.serviceCtaDescription}
      whatsapp={business.whatsapp}
      whatsappButtonLabel={dictionary.shared.whatsapp}
      whatsappMessage={
        locale === "tr"
          ? `Merhaba! ${match.title} hakkında bilgi almak istiyorum.`
          : locale === "ru"
            ? `Здравствуйте! Хочу узнать подробнее об услуге «${match.title}».`
            : `Hi! I'd like to ask about ${match.title}.`
      }
      whatsappAriaLabel={
        locale === "tr"
          ? "Kulapaws'a WhatsApp'tan yazın (yeni sekmede açılır)"
          : locale === "ru"
            ? "Написать Kulapaws в WhatsApp (откроется в новой вкладке)"
            : "Message Kulapaws on WhatsApp (opens in a new tab)"
      }
    />
  );
}
