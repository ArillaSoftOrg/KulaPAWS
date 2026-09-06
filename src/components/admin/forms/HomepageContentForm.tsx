"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { AdminLoadingState } from "@/components/admin/layout/AdminLoadingState";
import { FormError } from "@/components/admin/forms/FormError";
import { useUnsavedChangesWarning } from "@/components/admin/useUnsavedChangesWarning";
import { homepageRepository } from "@/lib/content/homepageRepository";
import { homepage as defaultHomepage } from "@/data/homepage";
import type { HomepageContent } from "@/data/homepage";

type Status = "idle" | "saving" | "saved";

export function HomepageContentForm() {
  const [form, setForm] = useState<HomepageContent>(defaultHomepage);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useUnsavedChangesWarning(dirty);

  useEffect(() => {
    let active = true;
    homepageRepository.get().then((value) => {
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

  function updateBullet(index: number, value: string) {
    markDirty();
    setForm((prev) => ({
      ...prev,
      mobileHighlight: {
        ...prev.mobileHighlight,
        bullets: prev.mobileHighlight.bullets.map((b, i) => (i === index ? value : b)),
      },
    }));
  }
  function addBullet() {
    setForm((prev) => ({
      ...prev,
      mobileHighlight: { ...prev.mobileHighlight, bullets: [...prev.mobileHighlight.bullets, ""] },
    }));
  }
  function removeBullet(index: number) {
    setForm((prev) => ({
      ...prev,
      mobileHighlight: {
        ...prev.mobileHighlight,
        bullets: prev.mobileHighlight.bullets.filter((_, i) => i !== index),
      },
    }));
  }

  function updateWhyItem(index: number, patch: Partial<{ title: string; description: string }>) {
    markDirty();
    setForm((prev) => ({
      ...prev,
      whyKulapaws: {
        ...prev.whyKulapaws,
        items: prev.whyKulapaws.items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
      },
    }));
  }
  function addWhyItem() {
    setForm((prev) => ({
      ...prev,
      whyKulapaws: { ...prev.whyKulapaws, items: [...prev.whyKulapaws.items, { title: "", description: "" }] },
    }));
  }
  function removeWhyItem(index: number) {
    setForm((prev) => ({
      ...prev,
      whyKulapaws: { ...prev.whyKulapaws, items: prev.whyKulapaws.items.filter((_, i) => i !== index) },
    }));
  }

  function updateStep(index: number, patch: Partial<{ title: string; description: string }>) {
    markDirty();
    setForm((prev) => ({
      ...prev,
      howItWorks: {
        ...prev.howItWorks,
        steps: prev.howItWorks.steps.map((step, i) => (i === index ? { ...step, ...patch } : step)),
      },
    }));
  }
  function addStep() {
    setForm((prev) => ({
      ...prev,
      howItWorks: { ...prev.howItWorks, steps: [...prev.howItWorks.steps, { title: "", description: "" }] },
    }));
  }
  function removeStep(index: number) {
    setForm((prev) => ({
      ...prev,
      howItWorks: { ...prev.howItWorks, steps: prev.howItWorks.steps.filter((_, i) => i !== index) },
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    const cleaned: HomepageContent = {
      ...form,
      mobileHighlight: {
        ...form.mobileHighlight,
        bullets: form.mobileHighlight.bullets.map((b) => b.trim()).filter(Boolean),
      },
      whyKulapaws: {
        ...form.whyKulapaws,
        items: form.whyKulapaws.items
          .map((item) => ({ title: item.title.trim(), description: item.description.trim() }))
          .filter((item) => item.title || item.description),
      },
      howItWorks: {
        ...form.howItWorks,
        steps: form.howItWorks.steps
          .map((step) => ({ title: step.title.trim(), description: step.description.trim() }))
          .filter((step) => step.title || step.description),
      },
    };
    setError(null);
    try {
      await homepageRepository.set(cleaned);
      setForm(cleaned);
      setStatus("saved");
      setDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save homepage content.");
      setStatus("idle");
    }
  }

  async function handleReset() {
    const confirmed = window.confirm("Reset the homepage content to shipped defaults? This can't be undone.");
    if (!confirmed) return;
    setError(null);
    try {
      await homepageRepository.reset();
      setForm(defaultHomepage);
      setStatus("idle");
      setDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset homepage content.");
    }
  }

  if (!loaded) {
    return <AdminLoadingState />;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <fieldset className="flex flex-col gap-4">
        <legend className="text-[16px] font-semibold text-foreground">Hero</legend>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-foreground">Heading</label>
          <Input
            value={form.hero.heading}
            onChange={(e) => {
              markDirty();
              setForm((p) => ({ ...p, hero: { ...p.hero, heading: e.target.value } }));
            }}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-foreground">Description</label>
          <Textarea
            value={form.hero.description}
            onChange={(e) => {
              markDirty();
              setForm((p) => ({ ...p, hero: { ...p.hero, description: e.target.value } }));
            }}
            required
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-foreground">Primary CTA Label</label>
            <Input
              value={form.hero.primaryCtaLabel}
              onChange={(e) => {
                markDirty();
                setForm((p) => ({ ...p, hero: { ...p.hero, primaryCtaLabel: e.target.value } }));
              }}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-foreground">Secondary CTA Label</label>
            <Input
              value={form.hero.secondaryCtaLabel}
              onChange={(e) => {
                markDirty();
                setForm((p) => ({ ...p, hero: { ...p.hero, secondaryCtaLabel: e.target.value } }));
              }}
              required
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="text-[16px] font-semibold text-foreground">Services Section</legend>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-foreground">Heading</label>
          <Input
            value={form.servicesSection.heading}
            onChange={(e) => {
              markDirty();
              setForm((p) => ({ ...p, servicesSection: { ...p.servicesSection, heading: e.target.value } }));
            }}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-foreground">Description</label>
          <Textarea
            value={form.servicesSection.description}
            onChange={(e) => {
              markDirty();
              setForm((p) => ({ ...p, servicesSection: { ...p.servicesSection, description: e.target.value } }));
            }}
            required
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="text-[16px] font-semibold text-foreground">Mobile Service Highlight</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-foreground">Eyebrow</label>
            <Input
              value={form.mobileHighlight.eyebrow}
              onChange={(e) => {
                markDirty();
                setForm((p) => ({ ...p, mobileHighlight: { ...p.mobileHighlight, eyebrow: e.target.value } }));
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-foreground">Heading</label>
            <Input
              value={form.mobileHighlight.heading}
              onChange={(e) => {
                markDirty();
                setForm((p) => ({ ...p, mobileHighlight: { ...p.mobileHighlight, heading: e.target.value } }));
              }}
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-foreground">Description</label>
          <Textarea
            value={form.mobileHighlight.description}
            onChange={(e) => {
              markDirty();
              setForm((p) => ({ ...p, mobileHighlight: { ...p.mobileHighlight, description: e.target.value } }));
            }}
            required
          />
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-[14px] font-medium text-foreground">Bullets</span>
          {form.mobileHighlight.bullets.map((bullet, i) => (
            <div key={i} className="flex gap-2">
              <Input value={bullet} onChange={(e) => updateBullet(i, e.target.value)} />
              <Button type="button" variant="tertiary" onClick={() => removeBullet(i)}>
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addBullet} className="self-start">
            Add Bullet
          </Button>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="text-[16px] font-semibold text-foreground">Why Kulapaws</legend>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-foreground">Heading</label>
          <Input
            value={form.whyKulapaws.heading}
            onChange={(e) => {
              markDirty();
              setForm((p) => ({ ...p, whyKulapaws: { ...p.whyKulapaws, heading: e.target.value } }));
            }}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-foreground">Description</label>
          <Textarea
            value={form.whyKulapaws.description}
            onChange={(e) => {
              markDirty();
              setForm((p) => ({ ...p, whyKulapaws: { ...p.whyKulapaws, description: e.target.value } }));
            }}
            required
          />
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-[14px] font-medium text-foreground">Benefit Items</span>
          {form.whyKulapaws.items.map((item, i) => (
            <div key={i} className="grid gap-2 rounded-md border border-border p-3 sm:grid-cols-[1fr_2fr_auto]">
              <Input placeholder="Title" value={item.title} onChange={(e) => updateWhyItem(i, { title: e.target.value })} />
              <Input
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateWhyItem(i, { description: e.target.value })}
              />
              <Button type="button" variant="tertiary" onClick={() => removeWhyItem(i)}>
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addWhyItem} className="self-start">
            Add Item
          </Button>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="text-[16px] font-semibold text-foreground">Products Preview</legend>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-foreground">Heading</label>
          <Input
            value={form.productsPreview.heading}
            onChange={(e) => {
              markDirty();
              setForm((p) => ({ ...p, productsPreview: { ...p.productsPreview, heading: e.target.value } }));
            }}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-foreground">Description</label>
          <Textarea
            value={form.productsPreview.description}
            onChange={(e) => {
              markDirty();
              setForm((p) => ({ ...p, productsPreview: { ...p.productsPreview, description: e.target.value } }));
            }}
            required
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="text-[16px] font-semibold text-foreground">How It Works</legend>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-foreground">Heading</label>
          <Input
            value={form.howItWorks.heading}
            onChange={(e) => {
              markDirty();
              setForm((p) => ({ ...p, howItWorks: { ...p.howItWorks, heading: e.target.value } }));
            }}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-foreground">Description</label>
          <Textarea
            value={form.howItWorks.description}
            onChange={(e) => {
              markDirty();
              setForm((p) => ({ ...p, howItWorks: { ...p.howItWorks, description: e.target.value } }));
            }}
            required
          />
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-[14px] font-medium text-foreground">Steps</span>
          {form.howItWorks.steps.map((step, i) => (
            <div key={i} className="grid gap-2 rounded-md border border-border p-3 sm:grid-cols-[1fr_2fr_auto]">
              <Input placeholder="Title" value={step.title} onChange={(e) => updateStep(i, { title: e.target.value })} />
              <Input
                placeholder="Description"
                value={step.description}
                onChange={(e) => updateStep(i, { description: e.target.value })}
              />
              <Button type="button" variant="tertiary" onClick={() => removeStep(i)}>
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addStep} className="self-start">
            Add Step
          </Button>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="text-[16px] font-semibold text-foreground">FAQ Preview</legend>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-foreground">Heading</label>
          <Input
            value={form.faqPreview.heading}
            onChange={(e) => {
              markDirty();
              setForm((p) => ({ ...p, faqPreview: { heading: e.target.value } }));
            }}
            required
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="text-[16px] font-semibold text-foreground">Final CTA</legend>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-foreground">Heading</label>
          <Input
            value={form.finalCta.heading}
            onChange={(e) => {
              markDirty();
              setForm((p) => ({ ...p, finalCta: { ...p.finalCta, heading: e.target.value } }));
            }}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-foreground">Description</label>
          <Textarea
            value={form.finalCta.description}
            onChange={(e) => {
              markDirty();
              setForm((p) => ({ ...p, finalCta: { ...p.finalCta, description: e.target.value } }));
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
