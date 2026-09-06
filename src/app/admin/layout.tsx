import type { ReactNode } from "react";

// Production safety previously came from a NODE_ENV check that 404'd this
// entire route in production (see git history) — a stopgap for when the
// only "auth" was a hardcoded demo password. That's no longer needed: every
// /admin route except /admin/login is now gated by real Supabase Auth plus
// an admin allow-list check, enforced in src/proxy.ts and again in
// src/app/admin/(protected)/layout.tsx. Production /admin is usable only
// by a real, authorized Supabase user.
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="flex min-h-full flex-1 flex-col bg-background">{children}</div>;
}
