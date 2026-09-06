"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { localAuthAdapter } from "@/lib/auth/localAuthAdapter";
import { AdminLoadingState } from "@/components/admin/layout/AdminLoadingState";
import type { AdminSession } from "@/lib/auth/types";

type SessionState = AdminSession | null | "loading";

export function AdminAuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<SessionState>("loading");

  useEffect(() => {
    let active = true;
    localAuthAdapter.getSession().then((result) => {
      if (!active) return;
      setSession(result);
      if (!result) router.replace("/admin/login");
    });
    return () => {
      active = false;
    };
  }, [router]);

  if (session === "loading" || session === null) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center py-24">
        <AdminLoadingState label="Checking session…" />
      </div>
    );
  }

  return <>{children}</>;
}
