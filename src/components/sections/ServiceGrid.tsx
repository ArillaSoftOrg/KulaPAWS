import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { buildLocalizedPath } from "@/lib/i18n/pathLocale";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import type { Service } from "@/data/services";

interface ServiceGridProps {
  heading?: string;
  description?: string;
  items: Service[];
  tone?: "background" | "surface" | "muted" | "secondary";
  learnMoreLabel?: string;
  // Defaults to English so any caller that doesn't localize (none today
  // besides ServiceGridLive, which always does) still links to the
  // unprefixed English URL exactly as before.
  locale?: Locale;
}

export function ServiceGrid({
  heading,
  description,
  items,
  tone = "background",
  learnMoreLabel = "Learn more →",
  locale = DEFAULT_LOCALE,
}: ServiceGridProps) {
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
            <Card key={service.slug} as="article" interactive className="relative">
              <h3 className="text-[19px] font-semibold text-foreground">
                <Link
                  href={buildLocalizedPath(locale, "/services", `/${service.slug}`)}
                  className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                >
                  {service.title}
                </Link>
              </h3>
              <p className="mt-2 text-[15px] text-muted-foreground">{service.shortDescription}</p>
              <span className="mt-4 inline-flex text-[15px] font-medium text-primary" aria-hidden="true">
                {learnMoreLabel}
              </span>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
