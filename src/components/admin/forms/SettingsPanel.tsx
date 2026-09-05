"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { resetAllLocalContent } from "@/lib/content/resetAll";

export function SettingsPanel() {
  const [status, setStatus] = useState<"idle" | "resetting" | "done">("idle");

  async function handleResetAll() {
    const confirmed = window.confirm(
      "Reset ALL local content (business info, homepage, about, services page, contact page, services, FAQs) and remove all locally stored images? This can't be undone.",
    );
    if (!confirmed) return;
    setStatus("resetting");
    await resetAllLocalContent();
    setStatus("done");
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-[15px] text-muted-foreground">
          This is a local development demo — there are no account-level or site-wide settings yet.
          Business details, page content, and images are managed from their own admin sections; this
          page only covers a factory-reset for the local data those sections write to.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-destructive/40 bg-surface p-4">
        <span className="text-[14px] font-medium text-foreground">Reset All Local Content</span>
        <p className="text-[14px] text-muted-foreground">
          Clears every local admin edit (business, homepage, about, services page, contact page,
          services, FAQs) and every locally stored image, restoring the site to its shipped defaults.
        </p>
        <div>
          <Button variant="destructive" onClick={handleResetAll} disabled={status === "resetting"}>
            {status === "resetting" ? "Resetting…" : "Reset All Local Content"}
          </Button>
          {status === "done" && (
            <span className="ml-3 text-[14px] text-success">Done. Refresh public pages to see defaults.</span>
          )}
        </div>
      </div>
    </div>
  );
}
