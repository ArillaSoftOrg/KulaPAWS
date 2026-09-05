"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { FeatureSplit } from "@/components/sections/FeatureSplit";
import { BenefitsGrid } from "@/components/sections/BenefitsGrid";
import { CTASection } from "@/components/sections/CTASection";
import { aboutRepository } from "@/lib/content/aboutRepository";
import { resolveImageSrc } from "@/lib/images/resolveImageSrc";
import type { AboutContent as AboutContentData } from "@/data/about";
import type { NavItem } from "@/data/navigation";

interface AboutContentProps {
  defaultAbout: AboutContentData;
  primaryCta: NavItem;
}

export function AboutContent({ defaultAbout, primaryCta }: AboutContentProps) {
  const [about, setAbout] = useState(defaultAbout);
  const [image, setImage] = useState<string | null>(defaultAbout.mobileStory.image);

  useEffect(() => {
    let active = true;
    aboutRepository.get().then(async (value) => {
      if (!active) return;
      setAbout(value);
      setImage(await resolveImageSrc(value.mobileStory.image));
    });
    return () => {
      active = false;
    };
  }, []);

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
      />

      <BenefitsGrid heading={about.values.heading} tone="muted" items={about.values.items} />

      <CTASection heading={about.cta.heading} description={about.cta.description} cta={primaryCta} />
    </>
  );
}
