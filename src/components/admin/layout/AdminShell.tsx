"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { localAuthAdapter } from "@/lib/auth/localAuthAdapter";
import { adminNavItems } from "@/components/admin/layout/adminNav";

function NavLinks({ pathname, onNavigate }: { pathname: string | null; onNavigate?: () => void }) {
  return (
    <>
      {adminNavItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md border-l-2 px-3 py-2 text-[15px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "border-primary bg-secondary font-semibold text-secondary-foreground"
                : "border-transparent font-medium text-foreground hover:bg-muted",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Close on route change so navigating from the mobile drawer doesn't
  // leave it open behind the new page. Adjusting state directly during
  // render (rather than in an effect) is the pattern React recommends for
  // "reset state when a prop changes" — see "You Might Not Need an Effect".
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    if (!mobileOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  async function handleLogout() {
    await localAuthAdapter.signOut();
    router.replace("/admin/login");
  }

  return (
    <div className="flex min-h-full flex-1 flex-col md:flex-row">
      <div className="flex items-center justify-between border-b border-border bg-surface px-5 py-3 md:hidden">
        <div className="flex flex-col leading-tight">
          <span className="text-[15px] font-bold text-foreground">Kulapaws</span>
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Admin</span>
        </div>
        <button
          ref={menuButtonRef}
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="admin-mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((value) => !value)}
          className="flex h-11 w-11 items-center justify-center rounded-md text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {mobileOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <nav
          id="admin-mobile-nav"
          aria-label="Admin"
          className="flex flex-col gap-1 border-b border-border bg-surface px-5 py-3 md:hidden"
        >
          <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          <Button variant="secondary" onClick={handleLogout} className="mt-2">
            Log Out
          </Button>
        </nav>
      )}

      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-border bg-surface p-5 md:flex">
        <div className="flex flex-col leading-tight">
          <span className="text-[16px] font-bold text-foreground">Kulapaws</span>
          <span className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground">Admin</span>
        </div>
        <nav aria-label="Admin" className="mt-6 flex flex-col gap-1">
          <NavLinks pathname={pathname} />
        </nav>
        <div className="mt-auto pt-6">
          <Button variant="secondary" onClick={handleLogout} className="w-full">
            Log Out
          </Button>
        </div>
      </aside>

      <main className="flex-1 bg-background px-5 py-8 sm:px-8">
        <div className="mx-auto w-full max-w-[1080px]">{children}</div>
      </main>
    </div>
  );
}
