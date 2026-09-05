"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { businessRepository } from "@/lib/content/businessRepository";
import { business as defaultBusiness } from "@/data/business";
import type { Business, SocialLink } from "@/data/business";

type Status = "idle" | "saving" | "saved";

export function BusinessForm() {
  const [form, setForm] = useState<Business>(defaultBusiness);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    let active = true;
    businessRepository.get().then((value) => {
      if (!active) return;
      setForm(value);
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  function updateField<K extends keyof Business>(key: K, value: Business[K]) {
    setStatus("idle");
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateServiceArea(index: number, value: string) {
    setStatus("idle");
    setForm((prev) => ({
      ...prev,
      serviceAreas: prev.serviceAreas.map((area, i) => (i === index ? value : area)),
    }));
  }
  function addServiceArea() {
    setForm((prev) => ({ ...prev, serviceAreas: [...prev.serviceAreas, ""] }));
  }
  function removeServiceArea(index: number) {
    setForm((prev) => ({
      ...prev,
      serviceAreas: prev.serviceAreas.filter((_, i) => i !== index),
    }));
  }

  function updateSocialLink(index: number, patch: Partial<SocialLink>) {
    setStatus("idle");
    setForm((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) => (i === index ? { ...link, ...patch } : link)),
    }));
  }
  function addSocialLink() {
    setForm((prev) => ({ ...prev, socialLinks: [...prev.socialLinks, { platform: "", url: "" }] }));
  }
  function removeSocialLink(index: number) {
    setForm((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    const cleaned: Business = {
      ...form,
      serviceAreas: form.serviceAreas.map((area) => area.trim()).filter(Boolean),
      socialLinks: form.socialLinks
        .map((link) => ({ platform: link.platform.trim(), url: link.url.trim() }))
        .filter((link) => link.platform && link.url),
    };
    await businessRepository.set(cleaned);
    setForm(cleaned);
    setStatus("saved");
  }

  async function handleReset() {
    await businessRepository.reset();
    setForm(defaultBusiness);
    setStatus("idle");
  }

  if (!loaded) {
    return <p className="text-[14px] text-muted-foreground">Loading…</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="business-name" className="text-[14px] font-medium text-foreground">
            Business Name
          </label>
          <Input
            id="business-name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="business-tagline" className="text-[14px] font-medium text-foreground">
            Tagline
          </label>
          <Input
            id="business-tagline"
            value={form.tagline ?? ""}
            onChange={(event) => updateField("tagline", event.target.value || null)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="business-phone" className="text-[14px] font-medium text-foreground">
            Phone
          </label>
          <Input
            id="business-phone"
            type="tel"
            value={form.phone ?? ""}
            onChange={(event) => updateField("phone", event.target.value || null)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="business-email" className="text-[14px] font-medium text-foreground">
            Email
          </label>
          <Input
            id="business-email"
            type="email"
            value={form.email ?? ""}
            onChange={(event) => updateField("email", event.target.value || null)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="business-whatsapp" className="text-[14px] font-medium text-foreground">
            WhatsApp
          </label>
          <Input
            id="business-whatsapp"
            value={form.whatsapp ?? ""}
            onChange={(event) => updateField("whatsapp", event.target.value || null)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="business-address" className="text-[14px] font-medium text-foreground">
            Address
          </label>
          <Input
            id="business-address"
            value={form.address ?? ""}
            onChange={(event) => updateField("address", event.target.value || null)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="business-hours" className="text-[14px] font-medium text-foreground">
          Business Hours
        </label>
        <Textarea
          id="business-hours"
          value={form.businessHours ?? ""}
          onChange={(event) => updateField("businessHours", event.target.value || null)}
          placeholder="e.g. Mon–Fri 9am–5pm"
        />
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-[14px] font-medium text-foreground">Service Areas</span>
        {form.serviceAreas.map((area, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={area}
              onChange={(event) => updateServiceArea(index, event.target.value)}
              aria-label={`Service area ${index + 1}`}
            />
            <Button type="button" variant="tertiary" onClick={() => removeServiceArea(index)}>
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" variant="secondary" onClick={addServiceArea} className="self-start">
          Add Service Area
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-[14px] font-medium text-foreground">Social Links</span>
        {form.socialLinks.map((link, index) => (
          <div key={index} className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
            <Input
              placeholder="Platform"
              value={link.platform}
              onChange={(event) => updateSocialLink(index, { platform: event.target.value })}
              aria-label={`Social link ${index + 1} platform`}
            />
            <Input
              placeholder="URL"
              value={link.url}
              onChange={(event) => updateSocialLink(index, { url: event.target.value })}
              aria-label={`Social link ${index + 1} URL`}
            />
            <Button type="button" variant="tertiary" onClick={() => removeSocialLink(index)}>
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" variant="secondary" onClick={addSocialLink} className="self-start">
          Add Social Link
        </Button>
      </div>

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
