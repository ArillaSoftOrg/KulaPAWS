"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { EmptyState } from "@/components/ui/EmptyState";
import { fieldId } from "@/components/appointment/wizardState";
import type { StepProps } from "@/components/appointment/steps/stepProps";
import type { Service } from "@/data/services";
import { resolveImageSrc } from "@/lib/images/resolveImageSrc";
import { cn } from "@/lib/cn";
import { ChevronRightIcon } from "@/components/appointment/icons";

interface ServiceStepProps extends StepProps {
  // Live services, already filtered to bookable ones.
  services: readonly Service[];
}

// The 3 flagship services get the supplied, pre-composed design assets
// (icon + photo-on-pink-blob, docs/design/appointment-assets/) matched by
// slug keyword. Never used for title/description — those always stay
// whatever listResolved() returns for the active locale — only for which
// icon/photo graphic to show. A service that doesn't match (any future
// admin-added one, or wash-basic-care/wash-trim-care) falls back to a
// generic paw icon and its own admin-uploaded photo, so nothing is hidden
// or broken for slugs outside the curated 3.
//
// photoW/photoH are each PNG's real pixel size — all 3 share the same
// 1448x1086 canvas. Every card targets the SAME display HEIGHT (see the
// Image className below) and lets width scale naturally from that shared
// ratio — intentionally NOT a fixed-size box with object-contain: these
// PNGs are already cleanly cut out, so a box bigger than the scaled image
// would just letterbox, exposing the card's own white background through
// the gap. Auto width means there's never a gap to expose.
const SERVICE_VISUALS = {
  dog: { icon: "/appointment/icon-dog.svg", photo: "/appointment/servicephoto.png", photoW: 1448, photoH: 1086 },
  // Source file is actually named "seervicephoto2.png" (typo in the
  // supplied asset) — referencing it as delivered rather than renaming.
  cat: { icon: "/appointment/icon-cat.svg", photo: "/appointment/seervicephoto2.png", photoW: 1448, photoH: 1086 },
  van: { icon: "/appointment/icon-van.svg", photo: "/appointment/servicephoto3.png", photoW: 1448, photoH: 1086 },
} as const;

function matchServiceVisual(slug: string) {
  const value = slug.toLowerCase();
  if (value.includes("cat")) return SERVICE_VISUALS.cat;
  if (value.includes("dog")) return SERVICE_VISUALS.dog;
  if (value.includes("mobile") || value.includes("van")) return SERVICE_VISUALS.van;
  return null;
}

interface ServiceOptionProps {
  service: Service;
  name: string;
  checked: boolean;
  onSelect: () => void;
}

// One selectable service card — a real radio input (sr-only) inside a
// label, same accessible pattern ChoiceGroup.tsx uses, just with a richer
// layout (icon, photo) than that shared component supports. Kept local to
// this step rather than added to ChoiceGroup since no other ChoiceGroup
// consumer (pet type, size, date, time) needs this layout.
function ServiceOption({ service, name, checked, onSelect }: ServiceOptionProps) {
  const visual = matchServiceVisual(service.slug);
  const [adminPhoto, setAdminPhoto] = useState<string | null>(null);

  // Only resolves the admin-uploaded photo as a fallback for services that
  // don't match one of the 3 curated design assets above.
  useEffect(() => {
    if (visual) return;
    let active = true;
    resolveImageSrc(service.image).then((src) => {
      if (active) setAdminPhoto(src);
    });
    return () => {
      active = false;
    };
  }, [service.image, visual]);

  const photoSrc = visual?.photo ?? adminPhoto;

  return (
    <label
      className={cn(
        "group relative flex cursor-pointer items-center gap-3 rounded-xl bg-surface p-3.5 sm:gap-4 sm:p-5",
        "transition-[border-color,border-width,background-color,box-shadow] duration-200 ease-out",
        "hover:border-primary/50 hover:shadow-sm",
        "has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-offset-2",
        checked ? "border-2 border-primary bg-soft-pink/25 shadow-sm" : "border border-input",
      )}
    >
      <input type="radio" name={name} value={service.slug} checked={checked} onChange={onSelect} className="sr-only" />

      <Image
        src={visual?.icon ?? "/appointment/icon-paw.svg"}
        alt=""
        width={72}
        height={72}
        unoptimized
        className="h-11 w-11 flex-shrink-0 sm:h-12 sm:w-12"
      />

      <span className="min-w-0 flex-1">
        <span className="block text-[15.5px] font-semibold text-foreground sm:text-[16px]">{service.title}</span>
        <span className="mt-1 line-clamp-2 block text-[13px] text-muted-foreground sm:text-[13.5px]">
          {service.shortDescription}
        </span>
      </span>

      {photoSrc && (
        <span className="relative ml-1 flex-shrink-0 sm:ml-3">
          {/* Height-constrained, width auto from each asset's own aspect
              ratio — no fixed box, so there's never empty letterbox space
              for the card's background to show through. Consistent HEIGHT
              across all 3 cards is what keeps them visually aligned; width
              naturally differs (narrower for dog/cat portrait shots, wider
              for the van's landscape shot), same as the reference. */}
          <Image
            src={photoSrc}
            alt=""
            width={visual?.photoW ?? 1448}
            height={visual?.photoH ?? 1086}
            unoptimized={!visual}
            className="h-[95px] w-auto sm:h-[125px] lg:h-[142px]"
          />
          <span
            className={cn(
              "absolute -left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform duration-200 sm:-left-4 sm:h-9 sm:w-9",
              "group-hover:-translate-y-1/2 group-hover:translate-x-0.5",
            )}
            aria-hidden="true"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </span>
        </span>
      )}
    </label>
  );
}

export function ServiceStep({ state, dispatch, errorFor, copy, services }: ServiceStepProps) {
  if (services.length === 0) {
    return <EmptyState title={copy.service.none} />;
  }

  const id = fieldId("serviceSlug");
  const error = errorFor("serviceSlug");
  const errorId = error ? `${id}-error` : undefined;

  return (
    <fieldset id={id} aria-describedby={errorId} className="flex min-w-0 flex-col gap-3">
      <legend className="sr-only">{copy.fields.service.label}</legend>
      {services.map((service) => (
        <ServiceOption
          key={service.slug}
          service={service}
          name="appointment-service"
          checked={state.serviceSlug === service.slug}
          onSelect={() => dispatch({ type: "selectService", slug: service.slug })}
        />
      ))}
      {error && (
        <p id={errorId} className="text-[14px] text-destructive">
          {error}
        </p>
      )}
    </fieldset>
  );
}
