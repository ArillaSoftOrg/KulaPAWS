"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { servicesRepository } from "@/lib/content/servicesRepository";
import type { Service, ServiceProcessStep } from "@/data/services";

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface ServiceFormProps {
  initialService: Service | null;
  onSaved: () => void;
  onCancel: () => void;
}

export function ServiceForm({ initialService, onSaved, onCancel }: ServiceFormProps) {
  const isEditing = initialService !== null;

  const [title, setTitle] = useState(initialService?.title ?? "");
  const [slug, setSlug] = useState(initialService?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [shortDescription, setShortDescription] = useState(initialService?.shortDescription ?? "");
  const [overview, setOverview] = useState(initialService?.overview ?? "");
  const [whoItsFor, setWhoItsFor] = useState<string[]>(initialService?.whoItsFor ?? []);
  const [process, setProcess] = useState<ServiceProcessStep[]>(initialService?.process ?? []);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function updateWhoItsFor(index: number, value: string) {
    setWhoItsFor((prev) => prev.map((item, i) => (i === index ? value : item)));
  }
  function addWhoItsFor() {
    setWhoItsFor((prev) => [...prev, ""]);
  }
  function removeWhoItsFor(index: number) {
    setWhoItsFor((prev) => prev.filter((_, i) => i !== index));
  }

  function updateProcessStep(index: number, patch: Partial<ServiceProcessStep>) {
    setProcess((prev) => prev.map((step, i) => (i === index ? { ...step, ...patch } : step)));
  }
  function addProcessStep() {
    setProcess((prev) => [...prev, { title: "", description: "" }]);
  }
  function removeProcessStep(index: number) {
    setProcess((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const cleanedSlug = slug.trim().toLowerCase();
    if (!SLUG_PATTERN.test(cleanedSlug)) {
      setError("Slug must be lowercase kebab-case, e.g. nail-trimming.");
      return;
    }

    const service: Service = {
      slug: cleanedSlug,
      title: title.trim(),
      shortDescription: shortDescription.trim(),
      overview: overview.trim(),
      whoItsFor: whoItsFor.map((item) => item.trim()).filter(Boolean),
      process: process
        .map((step) => ({ title: step.title.trim(), description: step.description.trim() }))
        .filter((step) => step.title || step.description),
      image: initialService?.image ?? null,
    };

    setSaving(true);
    try {
      if (isEditing) {
        await servicesRepository.update(initialService.slug, service);
      } else {
        await servicesRepository.create(service);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save service.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="service-title" className="text-[14px] font-medium text-foreground">
            Title
          </label>
          <Input
            id="service-title"
            value={title}
            onChange={(event) => handleTitleChange(event.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="service-slug" className="text-[14px] font-medium text-foreground">
            Slug
          </label>
          <Input
            id="service-slug"
            value={slug}
            onChange={(event) => {
              setSlug(event.target.value);
              setSlugTouched(true);
            }}
            error={Boolean(error)}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="service-short-description" className="text-[14px] font-medium text-foreground">
          Short Description
        </label>
        <Textarea
          id="service-short-description"
          value={shortDescription}
          onChange={(event) => setShortDescription(event.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="service-overview" className="text-[14px] font-medium text-foreground">
          Overview
        </label>
        <Textarea
          id="service-overview"
          value={overview}
          onChange={(event) => setOverview(event.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-[14px] font-medium text-foreground">Who It&apos;s For</span>
        {whoItsFor.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(event) => updateWhoItsFor(index, event.target.value)}
              aria-label={`Who it's for item ${index + 1}`}
            />
            <Button type="button" variant="tertiary" onClick={() => removeWhoItsFor(index)}>
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" variant="secondary" onClick={addWhoItsFor} className="self-start">
          Add Item
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-[14px] font-medium text-foreground">Process Steps</span>
        {process.map((step, index) => (
          <div
            key={index}
            className="grid gap-2 rounded-md border border-border p-3 sm:grid-cols-[1fr_2fr_auto] sm:items-start"
          >
            <Input
              placeholder="Step title"
              value={step.title}
              onChange={(event) => updateProcessStep(index, { title: event.target.value })}
              aria-label={`Process step ${index + 1} title`}
            />
            <Input
              placeholder="Step description"
              value={step.description}
              onChange={(event) => updateProcessStep(index, { description: event.target.value })}
              aria-label={`Process step ${index + 1} description`}
            />
            <Button type="button" variant="tertiary" onClick={() => removeProcessStep(index)}>
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" variant="secondary" onClick={addProcessStep} className="self-start">
          Add Step
        </Button>
      </div>

      {error && (
        <p className="text-[14px] text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : isEditing ? "Save Changes" : "Create Service"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
