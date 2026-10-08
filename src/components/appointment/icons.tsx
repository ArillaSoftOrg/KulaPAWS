import { cn } from "@/lib/cn";

interface IconProps {
  className?: string;
  filled?: boolean;
}

// Small hand-drawn icons for tiny inline use (badge pills at ~14px) where
// the supplied design assets (docs/design/appointment-assets/ — self-
// contained icons with their own ~64-72px circle backdrop) would look
// muddy at that size. Everything else in the appointment flow (benefit
// icons, service card icons/photos, decorative paw/leaf/heart doodles)
// uses the real asset files directly via next/image — see
// AppointmentHero.tsx and steps/ServiceStep.tsx.

export function PawIcon({ className, filled = false }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={filled ? 0 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="7" cy="8.5" r="2.1" />
      <circle cx="12" cy="6.3" r="2.1" />
      <circle cx="17" cy="8.5" r="2.1" />
      <path d="M12 12.3c-2.6 0-5.4 1.9-5.4 4.6 0 1.6 1.3 2.6 2.9 2.3.9-.2 1.6-.6 2.5-.6s1.6.4 2.5.6c1.6.3 2.9-.7 2.9-2.3 0-2.7-2.8-4.6-5.4-4.6Z" />
    </svg>
  );
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-4 w-4", className)} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5.5 15.5 12 9 18.5" />
    </svg>
  );
}
