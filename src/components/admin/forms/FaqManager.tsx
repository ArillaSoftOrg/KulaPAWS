"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FaqForm } from "@/components/admin/forms/FaqForm";
import { faqsRepository } from "@/lib/content/faqsRepository";
import type { Faq } from "@/data/faqs";

type View = { mode: "list" } | { mode: "create" } | { mode: "edit"; id: string };

export function FaqManager() {
  const [faqs, setFaqs] = useState<Faq[] | null>(null);
  const [view, setView] = useState<View>({ mode: "list" });

  async function refresh() {
    const list = await faqsRepository.list();
    setFaqs(list);
  }

  useEffect(() => {
    let active = true;
    faqsRepository.list().then((list) => {
      if (active) setFaqs(list);
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleDelete(id: string, question: string) {
    const confirmed = window.confirm(`Delete "${question}"?`);
    if (!confirmed) return;
    await faqsRepository.remove(id);
    refresh();
  }

  async function handleResetAll() {
    const confirmed = window.confirm("Remove all local FAQs? This can't be undone.");
    if (!confirmed) return;
    await faqsRepository.reset();
    refresh();
  }

  if (faqs === null) {
    return <p className="text-[14px] text-muted-foreground">Loading…</p>;
  }

  if (view.mode === "create") {
    return (
      <FaqForm
        initialFaq={null}
        onSaved={() => {
          setView({ mode: "list" });
          refresh();
        }}
        onCancel={() => setView({ mode: "list" })}
      />
    );
  }

  if (view.mode === "edit") {
    const faq = faqs.find((item) => item.id === view.id) ?? null;
    return (
      <FaqForm
        initialFaq={faq}
        onSaved={() => {
          setView({ mode: "list" });
          refresh();
        }}
        onCancel={() => setView({ mode: "list" })}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setView({ mode: "create" })}>Add FAQ</Button>
        <Button variant="secondary" onClick={handleResetAll}>
          Remove All
        </Button>
      </div>

      {faqs.length === 0 ? (
        <EmptyState title="No FAQs yet" description="Add a question to get started." />
      ) : (
        <div className="flex flex-col gap-3">
          {faqs.map((faq) => (
            <Card key={faq.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[13px] font-medium uppercase tracking-wide text-primary">{faq.category}</p>
                <p className="font-semibold text-foreground">{faq.question}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setView({ mode: "edit", id: faq.id })}>
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(faq.id, faq.question)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
