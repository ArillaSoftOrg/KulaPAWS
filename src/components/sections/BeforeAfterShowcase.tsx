"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { cn } from "@/lib/cn";

export interface BeforeAfterGalleryItem {
  // Matches a real file in public/before-after/{id}.jpg. Each file is a
  // single comparison graphic (left half = before, right half = after) —
  // there is no separate "after" image to pair it with.
  id: string;
  alt: string;
  width: number;
  height: number;
}

interface BeforeAfterShowcaseProps {
  eyebrow: string;
  heading: string;
  description: string;
  gallery: BeforeAfterGalleryItem[];
  prevLabel: string;
  nextLabel: string;
  goToSlideLabel: string;
  tone?: "background" | "surface" | "muted" | "secondary";
}

// Real grooming comparison photos only (README §16 / DESIGN.md Imagery
// rules) — four supplied graphics, each already a combined before/after
// image, not split pairs. Mobile shows a snap-scrolling filmstrip sized so
// one card reads as "current" while the next peeks in at the edge, making
// the swipe affordance obvious at 360–390px; sm/lg switch to a static grid
// once there's room to show several at once. Prev/next buttons and dots
// mirror the scroll position via IntersectionObserver rather than driving
// it, so native touch scrolling stays the source of truth.
export function BeforeAfterShowcase({
  eyebrow,
  heading,
  description,
  gallery,
  prevLabel,
  nextLabel,
  goToSlideLabel,
  tone = "surface",
}: BeforeAfterShowcaseProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!mostVisible) return;
        const index = cardRefs.current.findIndex((card) => card === mostVisible.target);
        if (index !== -1) setActiveIndex(index);
      },
      { root: track, threshold: [0.6] },
    );

    cardRefs.current.forEach((card) => card && observer.observe(card));
    return () => observer.disconnect();
  }, [gallery.length]);

  const scrollToIndex = useCallback((index: number) => {
    cardRefs.current[index]?.scrollIntoView({ block: "nearest", inline: "start" });
  }, []);

  const isFirst = activeIndex === 0;
  const isLast = activeIndex === gallery.length - 1;

  return (
    <Section tone={tone}>
      <Container size="wide">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-[65ch]">
            <p className="text-[14px] font-medium uppercase tracking-wide text-primary">{eyebrow}</p>
            <Heading level="h2" className="mt-2">
              {heading}
            </Heading>
            <p className="mt-4 text-[16px] text-muted-foreground sm:text-[18px]">{description}</p>
          </div>

          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <NavButton direction="prev" label={prevLabel} disabled={isFirst} onClick={() => scrollToIndex(activeIndex - 1)} />
            <NavButton direction="next" label={nextLabel} disabled={isLast} onClick={() => scrollToIndex(activeIndex + 1)} />
          </div>
        </div>

        <div
          ref={trackRef}
          role="region"
          aria-label={heading}
          tabIndex={0}
          className="
            mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2
            [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
            sm:grid sm:snap-none sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0
            lg:grid-cols-4
          "
        >
          {gallery.map((item, index) => (
            <figure
              key={item.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="w-[85%] flex-none snap-start sm:w-auto"
            >
              <div className="overflow-hidden rounded-2xl bg-muted">
                <Image
                  src={`/before-after/${item.id}.jpg`}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  sizes="(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 85vw"
                  className="h-auto w-full"
                />
              </div>
            </figure>
          ))}
        </div>

        {gallery.length > 1 && (
          <div className="mt-5 flex items-center justify-center gap-2 sm:hidden">
            {gallery.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToIndex(index)}
                aria-label={`${goToSlideLabel} ${index + 1}`}
                aria-current={index === activeIndex}
                className={cn(
                  "h-2 rounded-full transition-[width,background-color]",
                  index === activeIndex ? "w-6 bg-primary" : "w-2 bg-border",
                )}
              />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}

function NavButton({
  direction,
  label,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="
        flex h-10 w-10 items-center justify-center rounded-full border border-border
        text-foreground transition-colors hover:bg-muted
        disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
      "
    >
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4">
        <path
          d={direction === "prev" ? "M12.5 5l-5 5 5 5" : "M7.5 5l5 5-5 5"}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
