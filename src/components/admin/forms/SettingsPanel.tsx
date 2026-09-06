"use client";

import { useState } from "react";
import { DestructiveConfirm } from "@/components/admin/DestructiveConfirm";
import { resetAllLocalContent } from "@/lib/content/resetAll";

export function SettingsPanel() {
  const [done, setDone] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <p className="text-[15px] text-muted-foreground">
        This is a local development demo — there are no account-level or site-wide settings yet.
        Business details, page content, and images are managed from their own admin sections; this
        page only covers a factory-reset for the data those sections write to.
      </p>

      <div className="flex flex-col gap-3 rounded-lg border border-destructive/40 bg-surface p-4">
        <span className="text-[14px] font-medium text-foreground">Reset All Content</span>
        <p className="text-[14px] text-muted-foreground">
          Clears every admin edit (business, homepage, about, services page, contact page,
          services, FAQs) and every uploaded image, restoring the site to its shipped defaults.
        </p>
        <div className="flex items-center gap-3">
          <DestructiveConfirm
            message="Reset ALL content (business info, homepage, about, services page, contact page, services, FAQs) and remove all uploaded images? This can't be undone."
            confirmWord="RESET"
            actionLabel="Reset All Content"
            pendingLabel="Resetting…"
            onConfirm={async () => {
              await resetAllLocalContent();
              setDone(true);
            }}
          />
          {done && (
            <span className="text-[14px] text-success">Done. Refresh public pages to see defaults.</span>
          )}
        </div>
      </div>
    </div>
  );
}
