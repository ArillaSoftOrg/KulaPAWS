import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isAdminEnabled } from "@/lib/auth/adminAccess";

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  // The admin panel only has a local demo login (see localAuthAdapter.ts) —
  // not real authentication — so the whole /admin surface 404s in a
  // production build instead of exposing a login screen for it.
  if (!isAdminEnabled()) {
    notFound();
  }

  return <div className="flex min-h-full flex-1 flex-col bg-background">{children}</div>;
}
