"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { businessRepository } from "@/lib/content/businessRepository";
import { resolveImageSrc } from "@/lib/images/resolveImageSrc";
import type { Business } from "@/data/business";

interface LiveLogoProps {
  defaultBusiness: Business;
  size: number;
  priority?: boolean;
  className?: string;
}

// Renders the server-provided default logo/name immediately (matching SSR
// output), then swaps in a locally saved admin override once the
// repository read resolves. Only plain, serializable props cross the
// Server → Client boundary here — no functions.
//
// Uses `fill` inside a fixed-size wrapper rather than width/height props:
// Tailwind's preflight (`img { height: auto }`) overrides a plain
// next/image width/height box for any non-square source, shrinking the
// slot itself instead of just letterboxing the image inside it. `fill`
// sizes via Next's own inline styles, which preflight can't touch, so the
// slot always stays exactly `size`×`size` and `object-contain` shows the
// whole logo without cropping or distortion.
export function LiveLogo({ defaultBusiness, size, priority, className }: LiveLogoProps) {
  const [business, setBusiness] = useState(defaultBusiness);
  const [src, setSrc] = useState(defaultBusiness.logoSrc);

  useEffect(() => {
    let active = true;
    businessRepository.get().then(async (value) => {
      if (!active) return;
      setBusiness(value);
      setSrc((await resolveImageSrc(value.logoSrc)) ?? value.logoSrc);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <span className="relative inline-block flex-shrink-0" style={{ width: size, height: size }}>
      <Image
        src={src}
        alt={business.name}
        fill
        className={className ?? "rounded-full object-contain"}
        priority={priority}
        unoptimized={src.startsWith("blob:") || src.startsWith("data:")}
      />
    </span>
  );
}
