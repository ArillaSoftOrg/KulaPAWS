import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { buttonVariants } from "@/components/ui/Button";
import type { NavItem } from "@/data/navigation";

interface CTASectionProps {
  heading: string;
  description?: string;
  cta: NavItem;
}

export function CTASection({ heading, description, cta }: CTASectionProps) {
  return (
    <Section tone="secondary">
      <Container size="content" className="flex flex-col items-center gap-5 text-center">
        <Heading level="h2">{heading}</Heading>
        {description && (
          <p className="max-w-[55ch] text-[16px] text-secondary-foreground/80 sm:text-[18px]">
            {description}
          </p>
        )}
        <Link href={cta.href} className={buttonVariants({ variant: "primary", size: "lg" })}>
          {cta.label}
        </Link>
      </Container>
    </Section>
  );
}
