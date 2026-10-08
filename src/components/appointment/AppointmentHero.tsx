"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { appointmentCopy } from "@/data/appointment";
import { appointmentCopyTr } from "@/lib/i18n/content/appointment.tr";
import { appointmentCopyRu } from "@/lib/i18n/content/appointment.ru";
import { useLocalizedValue } from "@/lib/i18n/useLocalizedValue";
import { PawIcon } from "@/components/appointment/icons";

// Paired by index with copy.page.benefits — exactly 3 entries, enforced by
// AppointmentCopy's tuple type (see src/data/appointment.ts). These are the
// supplied design assets (self-contained circle-badge icons), not the
// hand-drawn icons.tsx set — see docs/design/appointment-assets/.
const BENEFIT_ICONS = ["/appointment/icon-paw.svg", "/appointment/icon-heart.svg", "/appointment/icon-home.svg"];

// Single pre-composed hero visual (dog + towel + slogan + grooming
// products, already laid out together) — replaces the earlier 4-image
// manual composition (hero-dog/hero-slogan/hero-grooming-products/
// heart-doodle). Real pixel size 1448x1086 (4:3-ish landscape); the
// wrapper below matches that ratio exactly so object-contain never has to
// letterbox.
const HERO_IMAGE = "/appointment/hero-gromming.png";
const HERO_IMAGE_RATIO = "1448/1086";

export function AppointmentHero() {
  const copy = useLocalizedValue(appointmentCopy, appointmentCopyTr, appointmentCopyRu);

  return (
    <Section
      tone="muted"
      padding="hero"
      className="appointment-hero-section relative overflow-hidden border-b border-border bg-gradient-to-b from-soft-pink/45 to-transparent"
    >
      {/* Bottom-left paw — sized/positioned to clear the shorter lg+ hero
          (see .appointment-hero-section above): small enough and close
          enough to the corner that it can't reach up into the badge/
          heading/description/benefits column above it. Mobile/sm keep the
          original larger size since that hero height wasn't reduced. */}
      <Image
        src="/appointment/paw-decoration-1.svg"
        alt=""
        width={118}
        height={112}
        unoptimized
        className="pointer-events-none absolute -bottom-6 -left-6 h-28 w-auto sm:h-32 lg:bottom-2 lg:left-2 lg:h-16"
      />
      <Image
        src="/appointment/paw-decoration-2.svg"
        alt=""
        width={96}
        height={92}
        unoptimized
        className="pointer-events-none absolute -right-4 top-1/3 hidden h-24 w-auto sm:block lg:h-28"
      />
      <Image
        src="/appointment/leaf-decoration.svg"
        alt=""
        width={118}
        height={132}
        unoptimized
        className="pointer-events-none absolute bottom-6 left-1/2 hidden h-20 w-auto -scale-x-100 lg:block"
      />

      {/* Base (<lg) layout is a simple stacked flex column: full-width text
          block on top, then the image in its own row anchored bottom-right
          (object-right-bottom inside a fixed-height box) — not a side-by-
          side column sharing the row with text, which read as "a small
          image shoved to the side." At lg, this switches to the original
          2-column grid (text col + a spacer col — the real desktop artwork
          is the separate absolute overlay further down). */}
      <Container size="wide" className="relative flex flex-col gap-4 lg:grid lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-x-10 lg:gap-y-0">
        <div>
         <span className=" -mt-5 inline-flex items-center gap-1.5 rounded-pill bg-soft-pink/70 px-3 py-1.5 text-[13px] font-semibold text-primary">
            <PawIcon className="h-3.5 w-3.5" filled />
            {copy.page.badge}
          </span>

          <Heading level="display" className="mt-0 text-[30px] leading-[1.05] sm:text-[48px] lg:mt-4 lg:text-[56px]">
  {copy.page.title}
</Heading>

          <p className="relative z-10 mt-0 max-w-[85%] text-[15.5px] leading-6 text-muted-foreground sm:text-[17px] lg:mt-4 lg:max-w-[52ch] lg:text-[18px]">
  {copy.page.description}
</p>

          <ul className="mt-6 hidden flex-wrap gap-x-6 gap-y-3 lg:flex">
            {copy.page.benefits.map((benefit, index) => (
              <li key={benefit} className="flex items-center gap-2 text-[14px] font-medium text-foreground">
                <Image src={BENEFIT_ICONS[index]} alt="" width={64} height={64} unoptimized className="h-9 w-9 flex-shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {/* <lg only — its own row below the text, image anchored to this
            row's bottom-right corner (object-contain, so the full
            composition stays uncropped and unstretched; object-right-
            bottom means any leftover space goes to the top-left of this
            box, not split evenly, so the dog ends up tucked into the
            corner rather than floating centered). Height is tuned to keep
            the image a clearly-sized visual, not a thumbnail, while
            keeping this row (and so the section) from growing tall. */}
        <div className="relative h-[100px] w-full sm:h-[130px] lg:hidden">
  <div className="absolute -bottom-15 -right-7 h-[240px] w-[295px] sm:h-[270px] sm:w-[335px]">
    <Image
      src={HERO_IMAGE}
      alt=""
      fill
      sizes="(min-width: 640px) 370px, 330px"
      className="object-contain object-right-bottom"
    />
  </div>
</div>

        {/* lg+ only — reserves the column's grid track width (the actual
            artwork is rendered by the absolute overlay below, anchored to
            the section's true bottom edge rather than this column's box).
            Height is intentionally LESS than the overlay image's own
            395px crop box — once that's taller than this spacer, the text
            column (≈363px) becomes the row's real height driver instead,
            which is what lets the section shrink close to its true floor
            (text height + padding) rather than being pinned to the
            image's height. */}
        <div aria-hidden="true" className="hidden lg:block lg:h-[400px]" />
      </Container>

      {/* Desktop visual, anchored to the SECTION's own bottom-RIGHT corner
          (not Container's padded/max-width box) — "touch the bottom and
          right edge" means the section's true edges, not the standard
          content margin every other element respects. Section itself is
          `relative`, so an absolutely positioned bottom-0/right-0 child's
          containing block is Section's own padding box: that lands flush
          with Section's true bottom and flush with the viewport-width
          Section's true right edge (bypassing Container's max-width+
          padding, which is why this is a plain div, not a Container).

          This outer box is shorter (395px) than the image's own full
          height at this width (450px) and clips via overflow-hidden — the
          inner image keeps its EXACT same rendered scale (still 600px
          wide, same as before, so the dog is not shrunk), just anchored
          bottom-0 so the extra ~55px gets cropped off the TOP of the
          composition (the floating hearts/slogan area) instead of the
          whole image being scaled down. This is what lets the section
          shrink by far more than padding alone could, without reducing
          the dog's visible size. */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 hidden w-[46%] max-w-[600px] overflow-hidden lg:block"
        style={{ height: "425px" }}
      >
        <div className="absolute -bottom-6 left-0 w-full" style={{ aspectRatio: HERO_IMAGE_RATIO }}>
          <Image src={HERO_IMAGE} alt="" fill sizes="600px" className="object-contain object-right-bottom" />
        </div>
      </div>
    </Section>
  );
}
