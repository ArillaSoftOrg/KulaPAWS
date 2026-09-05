"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Button } from "@/components/ui/Button";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { localImageStore } from "@/lib/images/localImageStore";
import { resolveImageSrc } from "@/lib/images/resolveImageSrc";

interface ImageSlotEditorProps {
  label: string;
  currentRef: string | null;
  defaultRef: string | null;
  onChange: (nextRef: string | null) => Promise<void>;
  aspect?: "square" | "video" | "portrait";
  fit?: "cover" | "contain";
}

// One reusable "pick from device / preview / persist / reset" unit. The
// blob itself goes into IndexedDB via localImageStore; only the returned
// ref string is ever handed to onChange, which is responsible for writing
// that ref into the right content record.
export function ImageSlotEditor({
  label,
  currentRef,
  defaultRef,
  onChange,
  aspect = "video",
  fit = "cover",
}: ImageSlotEditorProps) {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    resolveImageSrc(currentRef).then((src) => {
      if (active) setPreviewSrc(src);
    });
    return () => {
      active = false;
    };
  }, [currentRef]);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setSaving(true);
    try {
      const ref = await localImageStore.save(file);
      await onChange(ref);
    } finally {
      setSaving(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleReset() {
    setSaving(true);
    try {
      await onChange(defaultRef);
    } finally {
      setSaving(false);
    }
  }

  const isDefault = currentRef === defaultRef;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
      <span className="text-[14px] font-medium text-foreground">{label}</span>
      <PhotoPlaceholder
        src={previewSrc}
        label={`${label} — no image set`}
        aspect={aspect}
        fit={fit}
        className="max-w-xs"
      />
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={saving}
          className="text-[14px] text-muted-foreground file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-[14px] file:font-medium file:text-secondary-foreground"
        />
        {!isDefault && (
          <Button type="button" variant="tertiary" onClick={handleReset} disabled={saving}>
            Reset to Default
          </Button>
        )}
      </div>
    </div>
  );
}
