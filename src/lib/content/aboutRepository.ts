import { createPageContentRepository, pageContentSyncKey } from "@/lib/content/pageContentRepository";
import { aboutContent as defaultAbout } from "@/data/about";
import type { AboutContent } from "@/data/about";

export const ABOUT_SYNC_PING_KEY = pageContentSyncKey("about");

export const aboutRepository = createPageContentRepository<AboutContent>("about", defaultAbout, (stored) => ({
  ...defaultAbout,
  ...stored,
  header: { ...defaultAbout.header, ...stored.header },
  mobileStory: { ...defaultAbout.mobileStory, ...stored.mobileStory },
  values: { ...defaultAbout.values, ...stored.values },
  cta: { ...defaultAbout.cta, ...stored.cta },
}));
