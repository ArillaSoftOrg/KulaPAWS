"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface SiteChromeProps {
  header: ReactNode;
  footer: ReactNode;
  businessJsonLd: ReactNode;
  children: ReactNode;
}

// Decides whether the public Header/Footer wrap the page, based on route.
// header/footer/businessJsonLd/children are all rendered by the (Server
// Component) root layout and passed in as already-built ReactNode — this
// component only ever toggles their visibility, so no public page content
// becomes a Client Component by association. businessJsonLd is scoped to
// the public branch only — no need for it on /admin, which is noindex
// anyway.
export function SiteChrome({ header, footer, businessJsonLd, children }: SiteChromeProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) {
    return <div className="flex min-h-full flex-1 flex-col">{children}</div>;
  }

  return (
    <>
      {businessJsonLd}
      {header}
      <main className="flex flex-1 flex-col">{children}</main>
      {footer}
    </>
  );
}
