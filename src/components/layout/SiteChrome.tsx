"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface SiteChromeProps {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}

// Decides whether the public Header/Footer wrap the page, based on route.
// header/footer/children are all rendered by the (Server Component) root
// layout and passed in as already-built ReactNode — this component only
// ever toggles their visibility, so no public page content becomes a
// Client Component by association.
export function SiteChrome({ header, footer, children }: SiteChromeProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) {
    return <div className="flex min-h-full flex-1 flex-col">{children}</div>;
  }

  return (
    <>
      {header}
      <main className="flex flex-1 flex-col">{children}</main>
      {footer}
    </>
  );
}
