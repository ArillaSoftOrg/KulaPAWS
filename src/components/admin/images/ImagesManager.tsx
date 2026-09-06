"use client";

import { useEffect, useState } from "react";
import { AdminLoadingState } from "@/components/admin/layout/AdminLoadingState";
import { ImageSlotEditor } from "@/components/admin/images/ImageSlotEditor";
import { businessRepository } from "@/lib/content/businessRepository";
import { homepageRepository } from "@/lib/content/homepageRepository";
import { aboutRepository } from "@/lib/content/aboutRepository";
import { servicesRepository } from "@/lib/content/servicesRepository";
import { business as defaultBusiness } from "@/data/business";
import { homepage as defaultHomepage } from "@/data/homepage";
import { aboutContent as defaultAbout } from "@/data/about";
import { services as defaultServices } from "@/data/services";
import type { Business } from "@/data/business";
import type { HomepageContent } from "@/data/homepage";
import type { AboutContent } from "@/data/about";
import type { Service } from "@/data/services";

export function ImagesManager() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [homepage, setHomepage] = useState<HomepageContent | null>(null);
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [servicesList, setServicesList] = useState<Service[] | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      businessRepository.get(),
      homepageRepository.get(),
      aboutRepository.get(),
      servicesRepository.list(),
    ]).then(([b, h, a, s]) => {
      if (!active) return;
      setBusiness(b);
      setHomepage(h);
      setAbout(a);
      setServicesList(s);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!business || !homepage || !about || !servicesList) {
    return <AdminLoadingState />;
  }

  return (
    <div className="flex flex-col gap-6">
      <ImageSlotEditor
        label="Logo"
        currentRef={business.logoSrc}
        defaultRef={defaultBusiness.logoSrc}
        aspect="square"
        fit="contain"
        onChange={async (ref) => {
          const next = { ...business, logoSrc: ref ?? defaultBusiness.logoSrc };
          await businessRepository.set(next);
          setBusiness(next);
        }}
      />

      <ImageSlotEditor
        label="Homepage Hero Image"
        currentRef={homepage.hero.image}
        defaultRef={defaultHomepage.hero.image}
        onChange={async (ref) => {
          const next = { ...homepage, hero: { ...homepage.hero, image: ref } };
          await homepageRepository.set(next);
          setHomepage(next);
        }}
      />

      <ImageSlotEditor
        label="Homepage Mobile Service Image"
        currentRef={homepage.mobileHighlight.image}
        defaultRef={defaultHomepage.mobileHighlight.image}
        onChange={async (ref) => {
          const next = { ...homepage, mobileHighlight: { ...homepage.mobileHighlight, image: ref } };
          await homepageRepository.set(next);
          setHomepage(next);
        }}
      />

      <ImageSlotEditor
        label="About Page Image"
        currentRef={about.mobileStory.image}
        defaultRef={defaultAbout.mobileStory.image}
        onChange={async (ref) => {
          const next = { ...about, mobileStory: { ...about.mobileStory, image: ref } };
          await aboutRepository.set(next);
          setAbout(next);
        }}
      />

      {servicesList.map((service) => (
        <ImageSlotEditor
          key={service.slug}
          label={`${service.title} Image`}
          currentRef={service.image}
          defaultRef={defaultServices.find((s) => s.slug === service.slug)?.image ?? null}
          onChange={async (ref) => {
            const next = { ...service, image: ref };
            await servicesRepository.update(service.slug, next);
            setServicesList((prev) => prev?.map((s) => (s.slug === service.slug ? next : s)) ?? null);
          }}
        />
      ))}
    </div>
  );
}
