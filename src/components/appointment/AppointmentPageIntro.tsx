"use client";

import { AppointmentHero } from "@/components/appointment/AppointmentHero";
import { appointmentCopy } from "@/data/appointment";
import { appointmentCopyTr } from "@/lib/i18n/content/appointment.tr";
import { appointmentCopyRu } from "@/lib/i18n/content/appointment.ru";
import { useLocalizedValue } from "@/lib/i18n/useLocalizedValue";

// src/app/appointment/page.tsx (re-exported unchanged for /tr, /ru — see
// that file) is a Server Component with no locale param, same reason
// FaqPageIntro exists: the hero needs useLocale(), so it's split into this
// small Client Component. Metadata (the <title> tag, JSON-LD) stays
// English-only, same documented scope boundary as every other page here —
// only the visible body is translated. Renders AppointmentHero (a richer,
// booking-flow-specific hero) instead of the generic PageHeader every other
// page uses — PageHeader itself is intentionally left untouched since it's
// shared by every other page on the site.
export function AppointmentPageIntro() {
  return <AppointmentHero />;
}

// The Suspense fallback shown very briefly while AppointmentWizard (which
// reads useSearchParams(), forcing a client-only boundary here) mounts.
// Needs the same locale resolution as the header above, for the same
// reason — it's rendered by the same Server Component.
export function AppointmentLoadingFallback() {
  const copy = useLocalizedValue(appointmentCopy, appointmentCopyTr, appointmentCopyRu);
  return (
    <p role="status" className="py-10 text-[15px] text-muted-foreground">
      {copy.loading}
    </p>
  );
}
