"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import type { PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from "react";
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

// Vertically looping columns of testimonial cards — the "testimonials
// columns" interaction (continuous vertical marquee per column, top/bottom
// mask fade). Pure CSS animation drives the loop (see .testimonials-marquee
// in globals.css); TestimonialColumn adds a drag/wheel-driven manual offset
// on top of it (a separate translateY on a wrapper), so the visual/layout
// model is exactly the original one — nothing here is a native scroll
// container.
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

// How long after the visitor's last drag/wheel input before autoplay
// resumes — same idea (and value) as BeforeAfterShowcase's own
// RESUME_DELAY_MS, for the same "grab, look around, let go, it picks back
// up shortly after" feel the task asks for.
const RESUME_DELAY_MS = 1600;

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
  const cards = reducedMotion ? items : [...items, ...items];

  // wrapperRef carries ONLY the manual drag/wheel offset (a plain
  // translateY, written imperatively — same "direct DOM write, no
  // per-pixel re-render" approach BeforeAfterShowcase uses for its own
  // drag). animatedRef is the untouched CSS-marquee element from the
  // original implementation; autoplay is paused/resumed by toggling its
  // animation-play-state in place, which is how a CSS animation resumes
  // from exactly where it was without any position bookkeeping — never by
  // remounting it or changing its animation-delay. The two transforms
  // living on separate, nested elements is what lets a manual drag and the
  // ongoing marquee coexist without ever fighting over the same value.
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const dragRef = useRef<{ pointerId: number; startY: number; startOffset: number } | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resumeTimerRef.current !== null) clearTimeout(resumeTimerRef.current);
    },
    [],
  );

  function setPlaying(playing: boolean) {
    if (animatedRef.current) animatedRef.current.style.animationPlayState = playing ? "running" : "paused";
  }

  function pauseAutoplay() {
    if (resumeTimerRef.current !== null) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    setPlaying(false);
  }

  function scheduleResume() {
    if (resumeTimerRef.current !== null) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      resumeTimerRef.current = null;
      setPlaying(true);
    }, RESUME_DELAY_MS);
  }

  function applyOffset(px: number) {
    offsetRef.current = px;
    if (wrapperRef.current) wrapperRef.current.style.transform = `translateY(${px}px)`;
  }

  // Same general feel as BeforeAfterShowcase's own drag: grab, move,
  // release — no preventDefault (unlike the wheel case below), so this
  // doesn't fight normal page scrolling any more than that component's own
  // horizontal drag does. setPointerCapture just keeps move/up events
  // targeting this element if the gesture strays outside its (narrow)
  // bounds mid-drag — it doesn't affect touch-action/scroll gesture
  // recognition, so it's safe here (unlike the earlier native-scroll-
  // container attempt, where capturing a touch pointer would have fought
  // the browser's own scroll handling — that concern doesn't apply to a
  // plain transform-animated, non-scrollable element like this one).
  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (reducedMotion) return;
    dragRef.current = { pointerId: event.pointerId, startY: event.clientY, startOffset: offsetRef.current };
    containerRef.current?.setPointerCapture(event.pointerId);
    pauseAutoplay();
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    applyOffset(drag.startOffset + (event.clientY - drag.startY));
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    scheduleResume();
  }

  // Desktop wheel/trackpad — preventDefault here (only here) is what lets
  // the gesture actually move this column instead of just scrolling the
  // page underneath it; a plain hover-and-scroll over a nested region
  // capturing its own wheel input is standard, expected behavior, not the
  // "block page scroll" the task is warning against.
  function onWheel(event: ReactWheelEvent<HTMLDivElement>) {
    if (reducedMotion) return;
    event.preventDefault();
    pauseAutoplay();
    applyOffset(offsetRef.current - event.deltaY);
    scheduleResume();
  }

  return (
    <div
      ref={containerRef}
      className={cn("h-full overflow-hidden", className)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onWheel={onWheel}
    >
      <div ref={wrapperRef}>
        <div
          ref={animatedRef}
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
