"use client";

import { useSyncExternalStore } from "react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { StarIcon } from "@/components/ui/StarIcon";
import { cn } from "@/lib/cn";

export interface Testimonial {
  text: string;
  name: string;
  // Real customer photo path, once available — omit rather than fabricate.
  avatar?: string | null;
  // Only set this when the quote is a real, attributable review (e.g.
  // "Google" or "Instagram") — never label a fabricated quote with a real
  // platform name.
  source?: string;
  // 1-5. Optional — omit rather than guess.
  rating?: number;
}

interface TestimonialsSectionProps {
  eyebrow: string;
  heading: string;
  description: string;
  items: Testimonial[];
  tone?: "background" | "surface" | "muted" | "secondary";
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, getReducedMotionServerSnapshot);
}

// Column count follows the section's own breakpoints (1 → 2 → 3, see the
// `hidden`/`sm:block`/`lg:block` wrappers below) rather than a JS resize
// listener — each column is always rendered, CSS just decides how many are
// visible, so there's nothing to recompute on resize.
function splitIntoColumns(items: Testimonial[], columnCount: number): Testimonial[][] {
  const columns: Testimonial[][] = Array.from({ length: columnCount }, () => []);
  items.forEach((item, index) => {
    columns[index % columnCount].push(item);
  });
  return columns;
}

// Vertically looping columns of testimonial cards — inspired by the
// "testimonials columns" interaction (continuous vertical marquee per
// column, top/bottom mask fade). Pure CSS: each column renders its items
// twice back-to-back and animates translateY(0 → -50%), which is exactly
// one set's height, so the loop repeats with no visible seam. The three
// speeds/directions live in globals.css (.testimonials-marquee-a/b/c) —
// kept out of inline styles so the mobile-only slower speed for column A
// can be a plain media query instead of a JS breakpoint check.
export function TestimonialsSection({ eyebrow, heading, description, items, tone = "surface" }: TestimonialsSectionProps) {
  const reducedMotion = usePrefersReducedMotion();
  const columns = splitIntoColumns(items, 3);

  return (
    <Section tone={tone}>
      <Container size="wide">
        <div className="max-w-[65ch]">
          <p className="text-[14px] font-medium uppercase tracking-wide text-primary">{eyebrow}</p>
          <Heading level="h2" className="mt-2">
            {heading}
          </Heading>
          <p className="mt-4 text-[16px] text-muted-foreground sm:text-[18px]">{description}</p>
        </div>

        <div
          className="
            relative mt-10 h-[480px] overflow-hidden
            [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]
            [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]
            sm:h-[540px] lg:h-[600px]
          "
        >
          <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            <TestimonialColumn items={columns[0]} animationClass="testimonials-marquee-a" reducedMotion={reducedMotion} />
            <TestimonialColumn
              items={columns[1]}
              animationClass="testimonials-marquee-b"
              reducedMotion={reducedMotion}
              className="hidden sm:block"
            />
            <TestimonialColumn
              items={columns[2]}
              animationClass="testimonials-marquee-c"
              reducedMotion={reducedMotion}
              className="hidden lg:block"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}

function TestimonialColumn({
  items,
  animationClass,
  reducedMotion,
  className,
}: {
  items: Testimonial[];
  animationClass: string;
  reducedMotion: boolean;
  className?: string;
}) {
  // Reduced motion: render the set once (no duplication, no animation)
  // instead of leaving a static doubled list sitting there mid-scroll.
  const cards = reducedMotion ? items : [...items, ...items];

  return (
    <div className={cn("h-full overflow-hidden", className)}>
      <div
        className={cn(
          "flex flex-col gap-4",
          !reducedMotion && "testimonials-marquee",
          !reducedMotion && animationClass,
        )}
      >
        {cards.map((testimonial, index) => (
          <TestimonialCard key={`${testimonial.name}-${index}`} testimonial={testimonial} />
        ))}
      </div>
    </div>
  );
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="rounded-2xl border border-border/70 bg-surface p-5 shadow-[0_10px_24px_-18px_#29252633]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-soft-pink text-[13px] font-semibold text-primary">
          {initials(testimonial.name)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold text-foreground">{testimonial.name}</p>
          {testimonial.source && <p className="text-[12px] text-muted-foreground">{testimonial.source}</p>}
        </div>
      </div>
      {typeof testimonial.rating === "number" && (
        <div className="mt-3 flex gap-0.5">
          {Array.from({ length: 5 }, (_, index) => (
            <StarIcon key={index} filled={index < testimonial.rating!} />
          ))}
        </div>
      )}
      <p className="mt-3 text-[14px] leading-relaxed text-foreground">{testimonial.text}</p>
    </article>
  );
}
