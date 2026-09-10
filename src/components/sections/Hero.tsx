import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { buttonVariants } from "@/components/ui/Button";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import type { NavItem } from "@/data/navigation";

interface HeroProps {
  heading: string;
  description: string;
  primaryCta: NavItem;
  secondaryCta?: NavItem;
  image?: string | null;
}

export function Hero({ heading, description, primaryCta, secondaryCta, image }: HeroProps) {
  return (
    <Section tone="background">
      <Container size="wide" className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <Heading level="display">{heading}</Heading>
          <p className="mt-5 max-w-[55ch] text-[18px] text-muted-foreground sm:text-[20px]">
            {description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={primaryCta.href} className={buttonVariants({ variant: "primary", size: "lg" })}>
              {primaryCta.label}
            </Link>
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className={buttonVariants({ variant: "secondary", size: "lg" })}
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        </div>
        <PhotoPlaceholder
          src={image}
          alt="Kulapaws mobile grooming"
          label="Kulapaws mobile grooming photo coming soon"
          aspect="video"
          preload
        />
      </Container>
    </Section>
  );
}
