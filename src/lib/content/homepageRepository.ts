import { createPageContentRepository, pageContentSyncKey } from "@/lib/content/pageContentRepository";
import { homepage as defaultHomepage } from "@/data/homepage";
import type { HomepageContent } from "@/data/homepage";

export const HOMEPAGE_SYNC_PING_KEY = pageContentSyncKey("homepage");

export const homepageRepository = createPageContentRepository<HomepageContent>(
  "homepage",
  defaultHomepage,
  (stored) => ({
    ...defaultHomepage,
    ...stored,
    hero: { ...defaultHomepage.hero, ...stored.hero },
    servicesSection: { ...defaultHomepage.servicesSection, ...stored.servicesSection },
    mobileHighlight: { ...defaultHomepage.mobileHighlight, ...stored.mobileHighlight },
    whyKulapaws: { ...defaultHomepage.whyKulapaws, ...stored.whyKulapaws },
    productsPreview: { ...defaultHomepage.productsPreview, ...stored.productsPreview },
    howItWorks: { ...defaultHomepage.howItWorks, ...stored.howItWorks },
    faqPreview: { ...defaultHomepage.faqPreview, ...stored.faqPreview },
    finalCta: { ...defaultHomepage.finalCta, ...stored.finalCta },
  }),
);
