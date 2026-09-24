import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";

export interface MobileSalonGalleryItem {
  // Matches a real file in public/mobile-salon/{id}.jpg — see that
  // directory's source note for where the photos came from.
  id: string;
  alt: string;
  caption: string;
}

interface MobileSalonShowcaseProps {
  eyebrow: string;
  heading: string;
  description: string;
  gallery: MobileSalonGalleryItem[];
  tone?: "background" | "surface" | "muted" | "secondary";
}

// Real photos only (README §16 / DESIGN.md Imagery rules) — a curated set
// pulled from actual Kulapaws van and grooming-session footage, not stock
// or placeholder imagery. Mobile shows a snap-scrolling filmstrip (one
// tall card at a time reads better than a cramped grid at 360–390px);
// sm/lg switch the same markup to a static grid once there's room for it.
export function MobileSalonShowcase({
  eyebrow,
  heading,
  description,
  gallery,
  tone = "surface",
}: MobileSalonShowcaseProps) {
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
            mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2
            sm:grid sm:snap-none sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:pb-0
            lg:grid-cols-4
          "
        >
          {gallery.map((item) => (
            <figure key={item.id} className="w-[78%] flex-none snap-center sm:w-auto">
              <PhotoPlaceholder
                src={`/mobile-salon/${item.id}.jpg`}
                alt={item.alt}
                aspect="portrait"
                sizes="(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 78vw"
              />
              <figcaption className="mt-3 text-[14px] font-medium text-foreground">
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </Section>
  );
}
