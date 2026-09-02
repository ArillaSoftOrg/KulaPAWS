import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { EmptyState } from "@/components/ui/EmptyState";
import { buttonVariants } from "@/components/ui/Button";
import type { Faq } from "@/data/faqs";
import type { NavItem } from "@/data/navigation";

interface FAQSectionProps {
  heading: string;
  description?: string;
  items: Faq[];
  viewAllCta?: NavItem;
  tone?: "background" | "surface" | "muted" | "secondary";
}

export function FAQSection({ heading, description, items, viewAllCta, tone = "background" }: FAQSectionProps) {
  return (
    <Section tone={tone}>
      <Container size="content">
        <div className="max-w-[65ch]">
          <Heading level="h2">{heading}</Heading>
          {description && (
            <p className="mt-4 text-[16px] text-muted-foreground sm:text-[18px]">{description}</p>
          )}
        </div>

        <div className="mt-10">
          {items.length > 0 ? (
            <Accordion>
              {items.map((item) => (
                <AccordionItem key={item.question} question={item.question}>
                  {item.answer}
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <EmptyState
              title="FAQs are being finalized"
              description="Real, confirmed answers will be added here before launch."
            />
          )}
        </div>

        {viewAllCta && (
          <div className="mt-8">
            <Link href={viewAllCta.href} className={buttonVariants({ variant: "secondary" })}>
              {viewAllCta.label}
            </Link>
          </div>
        )}
      </Container>
    </Section>
  );
}
