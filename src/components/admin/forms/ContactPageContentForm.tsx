"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { contactPageRepository } from "@/lib/content/contactPageRepository";
import { contactPageContent as defaultContactPage } from "@/data/contactPage";
import type { ContactPageContent } from "@/data/contactPage";

type Status = "idle" | "saving" | "saved";

export function ContactPageContentForm() {
  const [form, setForm] = useState<ContactPageContent>(defaultContactPage);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    let active = true;
    contactPageRepository.get().then((value) => {
      if (!active) return;
      setForm(value);
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    await contactPageRepository.set(form);
    setStatus("saved");
  }

  async function handleReset() {
    await contactPageRepository.reset();
    setForm(defaultContactPage);
    setStatus("idle");
  }

  if (!loaded) {
    return <p className="text-[14px] text-muted-foreground">Loading…</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-medium text-foreground">Title</label>
        <Input
          value={form.title}
          onChange={(e) => {
            setStatus("idle");
            setForm((p) => ({ ...p, title: e.target.value }));
          }}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-medium text-foreground">Description</label>
        <Textarea
          value={form.description}
          onChange={(e) => {
            setStatus("idle");
            setForm((p) => ({ ...p, description: e.target.value }));
          }}
          required
        />
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
