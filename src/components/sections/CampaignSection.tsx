import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { buttonVariants } from "@/components/ui/Button";
import type { NavItem } from "@/data/navigation";

interface CampaignSectionProps {
  eyebrow: string;
  heading: string;
  description: string;
  perks: string[];
  cta: NavItem;
}

// Solid brand-color promo block (not a gradient/blob treatment — see
// docs/DESIGN.md Forbidden Patterns) that gives the homepage one deliberate,
// high-contrast conversion moment. Copy stays limited to claims already made
// elsewhere on the homepage (mobile convenience, one-on-one attention); no
// invented pricing/discounts or fabricated trust stats, per README §7/§16.
export function CampaignSection({ eyebrow, heading, description, perks, cta }: CampaignSectionProps) {
  return (
    <Section tone="primary">
      <Container size="wide" className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <span className="inline-flex items-center rounded-pill bg-accent px-4 py-1.5 text-[13px] font-semibold uppercase tracking-wide text-accent-foreground">
            {eyebrow}
          </span>
          <h2 className="mt-4 text-[30px] leading-[1.15] font-bold text-primary-foreground sm:text-[34px] lg:text-[40px]">
            {heading}
          </h2>
          <p className="mt-4 max-w-[55ch] text-[16px] text-primary-foreground/90 sm:text-[18px]">
            {description}
          </p>
          <div className="mt-8">
            <Link href={cta.href} className={buttonVariants({ variant: "secondary", size: "lg" })}>
              {cta.label}
            </Link>
          </div>
        </div>
        <ul className="flex flex-col gap-5">
          {perks.map((perk) => (
            <li key={perk} className="flex items-start gap-4">
              <span
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-[18px] w-[18px]"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="pt-1.5 text-[16px] font-medium text-primary-foreground sm:text-[17px]">
                {perk}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
