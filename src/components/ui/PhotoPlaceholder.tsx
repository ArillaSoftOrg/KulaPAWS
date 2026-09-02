import { cn } from "@/lib/cn";

interface PhotoPlaceholderProps {
  label?: string;
  aspect?: "square" | "video" | "portrait";
  className?: string;
}

const aspectClasses: Record<NonNullable<PhotoPlaceholderProps["aspect"]>, string> = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
};

// Structural stand-in for real photography (README.md §16 / Imagery rules
// forbid stock/fake business imagery). Swap for next/image once real photos
// exist — the aspect ratio and rounding are set here so layouts don't shift.
export function PhotoPlaceholder({
  label = "Photo coming soon",
  aspect = "video",
  className,
}: PhotoPlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "flex items-center justify-center rounded-xl border border-dashed border-border bg-muted text-center",
        aspectClasses[aspect],
        className,
      )}
    >
      <span className="px-4 text-[14px] text-muted-foreground">{label}</span>
    </div>
  );
}
