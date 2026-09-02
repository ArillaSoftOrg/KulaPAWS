import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import type { Service } from "@/data/services";

interface ServiceGridProps {
  heading?: string;
  description?: string;
  items: Service[];
  tone?: "background" | "surface" | "muted" | "secondary";
}

export function ServiceGrid({ heading, description, items, tone = "background" }: ServiceGridProps) {
  return (
    <Section tone={tone}>
      <Container size="wide">
        {heading && (
          <div className="max-w-[65ch]">
            <Heading level="h2">{heading}</Heading>
            {description && (
              <p className="mt-4 text-[16px] text-muted-foreground sm:text-[18px]">{description}</p>
            )}
          </div>
        )}
        <div className={heading ? "mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" : "grid gap-5 sm:grid-cols-2 lg:grid-cols-3"}>
          {items.map((service) => (
            <Card key={service.slug} as="article" interactive>
              <h3 className="text-[19px] font-semibold text-foreground">
                <Link
                  href={`/services/${service.slug}`}
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                >
                  {service.title}
                </Link>
              </h3>
              <p className="mt-2 text-[15px] text-muted-foreground">{service.shortDescription}</p>
              <Link
                href={`/services/${service.slug}`}
                className="mt-4 inline-flex text-[15px] font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              >
                Learn more →
              </Link>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
