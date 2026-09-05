import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { footerNav } from "@/data/navigation";
import { business } from "@/data/business";
import { LiveLogo } from "@/components/content/LiveLogo";
import { LiveBusinessName } from "@/components/content/LiveBusinessName";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <Container className="flex flex-col gap-8 py-10 sm:flex-row sm:items-start sm:justify-between sm:py-12">
        <Link href="/" className="inline-flex items-center gap-2">
          <LiveLogo defaultBusiness={business} size={40} />
          <span className="text-[16px] font-semibold text-foreground">
            <LiveBusinessName defaultBusiness={business} />
          </span>
        </Link>

        <nav aria-label="Footer" className="flex flex-col gap-3 sm:flex-row sm:gap-6">
          {footerNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[15px] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>

      <Container className="border-t border-border py-5 text-[14px] text-muted-foreground">
        © {year} <LiveBusinessName defaultBusiness={business} />. All rights reserved.
      </Container>
    </footer>
  );
}
