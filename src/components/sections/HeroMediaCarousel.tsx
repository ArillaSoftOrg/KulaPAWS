"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

interface HeroMediaCarouselProps {
  images: string[];
  alt: string;
}

// Same full-cycle length as the desktop crossfade (see HeroMedia.tsx's
// CYCLE_SECONDS) — one auto-advance per image, split evenly, so both
// variants take the same 13s to cycle through the gallery once.
const CYCLE_SECONDS = 13;
// Fraction of the slide width a drag must cross before it counts as a
// swipe instead of snapping back to the current slide.
const SWIPE_THRESHOLD_RATIO = 0.18;

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

// useSyncExternalStore (rather than effect+setState) since this reads a
// live browser API — the recommended React pattern for subscribing to an
// external source, and it stays correct through SSR/hydration.
function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, getReducedMotionServerSnapshot);
}

// Touch-first slide carousel for the Hero's vehicle photos below lg (see
// Hero.tsx, which shows this instead of the desktop HeroMedia crossfade).
// Auto-advances on the same cadence as the desktop version and supports
// manual drag/swipe — plain pointer events and a CSS transform, no
// carousel dependency, per the mobile Hero requirements.
export function HeroMediaCarousel({ images, alt }: HeroMediaCarouselProps) {
  const count = images.length;
  const [index, setIndex] = useState(0);
  const [dragPx, setDragPx] = useState(0);
  const [dragging, setDragging] = useState(false);
  // Measured on drag start (see onPointerDown) — state, not a ref, since
  // it feeds the transform below during render.
  const [trackWidth, setTrackWidth] = useState(0);
  // Bumped after every manual interaction to restart the autoplay
  // interval from a full window instead of continuing a partial one.
  const [cycleTick, setCycleTick] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const activePointerId = useRef<number | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const restartAutoplay = useCallback(() => setCycleTick((tick) => tick + 1), []);

  useEffect(() => {
    if (count <= 1 || reducedMotion) return;
    const slideMs = (CYCLE_SECONDS / count) * 1000;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, slideMs);
    return () => window.clearInterval(id);
    // cycleTick isn't read here — bumping it is what restarts this effect
    // (see restartAutoplay), giving manual interaction a fresh 13s window
    // instead of continuing a partial one.
  }, [count, reducedMotion, cycleTick]);

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (count <= 1) return;
    activePointerId.current = event.pointerId;
    dragStartX.current = event.clientX;
    setTrackWidth(trackRef.current?.getBoundingClientRect().width || 1);
    setDragging(true);
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging || activePointerId.current !== event.pointerId) return;
    setDragPx(event.clientX - dragStartX.current);
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging || activePointerId.current !== event.pointerId) return;
    const threshold = (trackWidth || 1) * SWIPE_THRESHOLD_RATIO;
    if (dragPx <= -threshold && index < count - 1) {
      setIndex((current) => current + 1);
    } else if (dragPx >= threshold && index > 0) {
      setIndex((current) => current - 1);
    }
    setDragging(false);
    setDragPx(0);
    activePointerId.current = null;
    restartAutoplay();
  }

  const dragPercent = trackWidth ? (dragPx / trackWidth) * 100 : 0;
  const translatePercent = -index * 100 + dragPercent;

  return (
    <div
      {...(count > 1 ? { role: "img", "aria-label": alt } : {})}
      className="relative mx-auto aspect-video w-full max-w-[560px] touch-pan-y select-none overflow-hidden rounded-xl border border-border/70 shadow-[0_24px_48px_-20px_#a83e6847]"
    >
      <div
        ref={trackRef}
        className={cn("flex h-full w-full", !dragging && "transition-transform duration-500 ease-out")}
        style={{ transform: `translateX(${translatePercent}%)` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={(event) => dragging && endDrag(event)}
      >
        {images.map((src, i) => (
          <div key={src} className="relative h-full w-full flex-shrink-0">
            <Image
              src={src}
              alt={count > 1 ? "" : alt}
              fill
              sizes="100vw"
              preload={i === 0}
              draggable={false}
              className="pointer-events-none object-cover"
            />
          </div>
        ))}
      </div>

      {count > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5">
          {images.map((src, i) => (
            <span
              key={src}
              aria-hidden="true"
              className={cn(
                "h-1.5 rounded-pill transition-all",
                i === index ? "w-5 bg-white" : "w-1.5 bg-white/50",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
