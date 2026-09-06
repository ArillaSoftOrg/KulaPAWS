"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/admin/forms/FormError";
import { useUnsavedChangesWarning } from "@/components/admin/useUnsavedChangesWarning";
import { faqsRepository } from "@/lib/content/faqsRepository";
import { faqCategories } from "@/data/faqs";
import type { Faq, FaqCategory } from "@/data/faqs";

interface FaqFormProps {
  initialFaq: Faq | null;
  onSaved: () => void;
  onCancel: () => void;
}

export function FaqForm({ initialFaq, onSaved, onCancel }: FaqFormProps) {
  const isEditing = initialFaq !== null;
  const [category, setCategory] = useState<FaqCategory>(initialFaq?.category ?? "General");
  const [question, setQuestion] = useState(initialFaq?.question ?? "");
  const [answer, setAnswer] = useState(initialFaq?.answer ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useUnsavedChangesWarning(dirty);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedQuestion = question.trim();
    const trimmedAnswer = answer.trim();
    if (!trimmedQuestion || !trimmedAnswer) {
      setError("Question and answer are both required.");
      return;
    }

    const faq: Faq = {
      id: initialFaq?.id ?? crypto.randomUUID(),
      category,
      question: trimmedQuestion,
      answer: trimmedAnswer,
    };

    setSaving(true);
    try {
      if (isEditing) {
        await faqsRepository.update(initialFaq.id, faq);
      } else {
        await faqsRepository.create(faq);
      }
      setDirty(false);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save FAQ.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="faq-category" className="text-[14px] font-medium text-foreground">
          Category
        </label>
        <Select
          id="faq-category"
          value={category}
          onChange={(e) => {
            setDirty(true);
            setCategory(e.target.value as FaqCategory);
          }}
        >
          {faqCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="faq-question" className="text-[14px] font-medium text-foreground">
          Question
        </label>
        <Input
          id="faq-question"
          value={question}
          onChange={(e) => {
            setDirty(true);
            setQuestion(e.target.value);
          }}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="faq-answer" className="text-[14px] font-medium text-foreground">
          Answer
        </label>
        <Textarea
          id="faq-answer"
          value={answer}
          onChange={(e) => {
            setDirty(true);
            setAnswer(e.target.value);
          }}
          required
        />
      </div>

      <FormError message={error} />

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : isEditing ? "Save Changes" : "Add FAQ"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
