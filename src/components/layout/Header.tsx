import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { buttonVariants } from "@/components/ui/Button";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { primaryNav, primaryCta } from "@/data/navigation";
import { business } from "@/data/business";
import { LiveLogo } from "@/components/content/LiveLogo";

export function Header() {
  return (
    <header className="relative border-b border-border bg-surface">
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <Link href="/" className="inline-flex items-center gap-2">
          <LiveLogo defaultBusiness={business} size={48} priority />
        </Link>

        <nav aria-label="Primary" className="hidden md:flex md:items-center md:gap-8">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[15px] font-medium text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link href={primaryCta.href} className={buttonVariants({ variant: "primary" })}>
            {primaryCta.label}
          </Link>
        </div>

        <MobileNavigation />
      </Container>
    </header>
  );
}
