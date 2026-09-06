"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { AdminLoadingState } from "@/components/admin/layout/AdminLoadingState";
import { FormError } from "@/components/admin/forms/FormError";
import { useUnsavedChangesWarning } from "@/components/admin/useUnsavedChangesWarning";
import { aboutRepository } from "@/lib/content/aboutRepository";
import { aboutContent as defaultAbout } from "@/data/about";
import type { AboutContent } from "@/data/about";

type Status = "idle" | "saving" | "saved";

export function AboutContentForm() {
  const [form, setForm] = useState<AboutContent>(defaultAbout);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useUnsavedChangesWarning(dirty);

  useEffect(() => {
    let active = true;
    aboutRepository.get().then((value) => {
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

  function updateValueItem(index: number, patch: Partial<{ title: string; description: string }>) {
    markDirty();
    setForm((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        items: prev.values.items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
      },
    }));
  }
  function addValueItem() {
    setForm((prev) => ({
      ...prev,
      values: { ...prev.values, items: [...prev.values.items, { title: "", description: "" }] },
    }));
  }
  function removeValueItem(index: number) {
    setForm((prev) => ({
      ...prev,
      values: { ...prev.values, items: prev.values.items.filter((_, i) => i !== index) },
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    const cleaned: AboutContent = {
      ...form,
      values: {
        ...form.values,
        items: form.values.items
          .map((item) => ({ title: item.title.trim(), description: item.description.trim() }))
          .filter((item) => item.title || item.description),
      },
    };
    setError(null);
    try {
      await aboutRepository.set(cleaned);
      setForm(cleaned);
      setStatus("saved");
      setDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save About page content.");
      setStatus("idle");
    }
  }

  async function handleReset() {
    const confirmed = window.confirm("Reset the About page content to shipped defaults? This can't be undone.");
    if (!confirmed) return;
    setError(null);
    try {
      await aboutRepository.reset();
      setForm(defaultAbout);
      setStatus("idle");
      setDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset About page content.");
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
        <legend className="text-[16px] font-semibold text-foreground">Mobile Service Story</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-foreground">Eyebrow</label>
            <Input
              value={form.mobileStory.eyebrow}
              onChange={(e) => {
                markDirty();
                setForm((p) => ({ ...p, mobileStory: { ...p.mobileStory, eyebrow: e.target.value } }));
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-foreground">Heading</label>
            <Input
              value={form.mobileStory.heading}
              onChange={(e) => {
                markDirty();
                setForm((p) => ({ ...p, mobileStory: { ...p.mobileStory, heading: e.target.value } }));
              }}
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-foreground">Description</label>
          <Textarea
            value={form.mobileStory.description}
            onChange={(e) => {
              markDirty();
              setForm((p) => ({ ...p, mobileStory: { ...p.mobileStory, description: e.target.value } }));
            }}
            required
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="text-[16px] font-semibold text-foreground">Values</legend>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-foreground">Heading</label>
          <Input
            value={form.values.heading}
            onChange={(e) => {
              markDirty();
              setForm((p) => ({ ...p, values: { ...p.values, heading: e.target.value } }));
            }}
            required
          />
        </div>
        <div className="flex flex-col gap-3">
          {form.values.items.map((item, i) => (
            <div key={i} className="grid gap-2 rounded-md border border-border p-3 sm:grid-cols-[1fr_2fr_auto]">
              <Input
                placeholder="Title"
                value={item.title}
                onChange={(e) => updateValueItem(i, { title: e.target.value })}
              />
              <Input
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateValueItem(i, { description: e.target.value })}
              />
              <Button type="button" variant="tertiary" onClick={() => removeValueItem(i)}>
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addValueItem} className="self-start">
            Add Value
          </Button>
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
