"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { FeatureSplit } from "@/components/sections/FeatureSplit";
import { BenefitsGrid } from "@/components/sections/BenefitsGrid";
import { CTASection } from "@/components/sections/CTASection";
import { aboutRepository, ABOUT_SYNC_PING_KEY } from "@/lib/content/aboutRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";
import { resolveImageSrc } from "@/lib/images/resolveImageSrc";
import type { AboutContent as AboutContentData } from "@/data/about";
import type { NavItem } from "@/data/navigation";

const STORAGE_KEYS = [ABOUT_SYNC_PING_KEY];

interface AboutContentProps {
  defaultAbout: AboutContentData;
  primaryCta: NavItem;
}

export function AboutContent({ defaultAbout, primaryCta }: AboutContentProps) {
  const about = useLiveContent(defaultAbout, aboutRepository.get, STORAGE_KEYS);
  const [image, setImage] = useState<string | null>(defaultAbout.mobileStory.image);

  useEffect(() => {
    let active = true;
    resolveImageSrc(about.mobileStory.image).then((resolved) => {
      if (active) setImage(resolved);
    });
    return () => {
      active = false;
    };
  }, [about.mobileStory.image]);

  return (
    <>
      <PageHeader
        eyebrow={about.header.eyebrow}
        title={about.header.title}
        description={about.header.description}
      />

      <FeatureSplit
        eyebrow={about.mobileStory.eyebrow}
        heading={about.mobileStory.heading}
        description={about.mobileStory.description}
        image={image}
        imageLabel="Kulapaws team photo coming soon"
        tone="surface"
        cta={{ label: "Explore Our Services", href: "/services" }}
      />

      <BenefitsGrid heading={about.values.heading} tone="muted" items={about.values.items} />

      <CTASection heading={about.cta.heading} description={about.cta.description} cta={primaryCta} />
    </>
  );
}
