import Image from "next/image";
import { cn } from "@/lib/cn";

interface PhotoPlaceholderProps {
  src?: string | null;
  alt?: string;
  label?: string;
  aspect?: "square" | "video" | "portrait";
  fit?: "cover" | "contain";
  className?: string;
}

const aspectClasses: Record<NonNullable<PhotoPlaceholderProps["aspect"]>, string> = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
};

// Structural stand-in for real photography (README.md §16 / Imagery rules
// forbid stock/fake business imagery). Pass `src` once a real photo exists —
// the aspect ratio and rounding stay the same either way, so layouts don't
// shift when images are added.
export function PhotoPlaceholder({
  src,
  alt,
  label = "Photo coming soon",
  aspect = "video",
  fit = "cover",
  className,
}: PhotoPlaceholderProps) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden rounded-xl", aspectClasses[aspect], className)}>
        <Image
          src={src}
          alt={alt ?? label}
          fill
          className={fit === "contain" ? "object-contain" : "object-cover"}
          unoptimized={src.startsWith("blob:") || src.startsWith("data:")}
        />
      </div>
    );
  }

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
