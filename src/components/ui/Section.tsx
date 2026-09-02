import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type SectionTone = "background" | "surface" | "muted" | "secondary";

const toneClasses: Record<SectionTone, string> = {
  background: "bg-background",
  surface: "bg-surface",
  muted: "bg-muted",
  secondary: "bg-secondary",
};

interface SectionProps extends HTMLAttributes<HTMLElement> {
  tone?: SectionTone;
  as?: "section" | "div";
}

export function Section({
  tone = "background",
  as: Tag = "section",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Tag
      className={cn("py-14 sm:py-16 lg:py-20", toneClasses[tone], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
