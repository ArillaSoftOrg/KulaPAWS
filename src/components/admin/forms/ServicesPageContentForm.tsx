"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { AdminLoadingState } from "@/components/admin/layout/AdminLoadingState";
import { FormError } from "@/components/admin/forms/FormError";
import { useUnsavedChangesWarning } from "@/components/admin/useUnsavedChangesWarning";
import { servicesPageRepository } from "@/lib/content/servicesPageRepository";
import { servicesPageContent as defaultServicesPage } from "@/data/servicesPage";
import type { ServicesPageContent } from "@/data/servicesPage";

type Status = "idle" | "saving" | "saved";

export function ServicesPageContentForm() {
  const [form, setForm] = useState<ServicesPageContent>(defaultServicesPage);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useUnsavedChangesWarning(dirty);

  useEffect(() => {
    let active = true;
    servicesPageRepository.get().then((value) => {
      if (!active) return;
      setForm(value);
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  function markDirty() {
    setStatus("idle");
    setDirty(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setError(null);
    try {
      await servicesPageRepository.set(form);
      setStatus("saved");
      setDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save Services page content.");
      setStatus("idle");
    }
  }

  async function handleReset() {
    const confirmed = window.confirm("Reset the Services page content to shipped defaults? This can't be undone.");
    if (!confirmed) return;
    setError(null);
    try {
      await servicesPageRepository.reset();
      setForm(defaultServicesPage);
      setStatus("idle");
      setDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset Services page content.");
    }
  }

  if (!loaded) {
    return <AdminLoadingState />;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <fieldset className="flex flex-col gap-4">
        <legend className="text-[16px] font-semibold text-foreground">Page Header</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-foreground">Eyebrow</label>
            <Input
              value={form.header.eyebrow}
              onChange={(e) => {
                markDirty();
                setForm((p) => ({ ...p, header: { ...p.header, eyebrow: e.target.value } }));
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-foreground">Title</label>
            <Input
              value={form.header.title}
              onChange={(e) => {
                markDirty();
                setForm((p) => ({ ...p, header: { ...p.header, title: e.target.value } }));
              }}
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-foreground">Description</label>
          <Textarea
            value={form.header.description}
            onChange={(e) => {
              markDirty();
              setForm((p) => ({ ...p, header: { ...p.header, description: e.target.value } }));
            }}
            required
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="text-[16px] font-semibold text-foreground">CTA</legend>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-foreground">Heading</label>
          <Input
            value={form.cta.heading}
            onChange={(e) => {
              markDirty();
              setForm((p) => ({ ...p, cta: { ...p.cta, heading: e.target.value } }));
            }}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-foreground">Description</label>
          <Textarea
            value={form.cta.description}
            onChange={(e) => {
              markDirty();
              setForm((p) => ({ ...p, cta: { ...p.cta, description: e.target.value } }));
            }}
            required
          />
        </div>
      </fieldset>

      <FormError message={error} />

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={status === "saving"}>
          {status === "saving" ? "Saving…" : "Save Changes"}
        </Button>
        <Button type="button" variant="secondary" onClick={handleReset}>
          Reset to Defaults
        </Button>
        {status === "saved" && <span className="text-[14px] text-success">Saved.</span>}
      </div>
    </form>
  );
}
