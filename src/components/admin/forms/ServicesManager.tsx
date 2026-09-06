"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { AdminLoadingState } from "@/components/admin/layout/AdminLoadingState";
import { DestructiveConfirm } from "@/components/admin/DestructiveConfirm";
import { FormError } from "@/components/admin/forms/FormError";
import { ServiceForm } from "@/components/admin/forms/ServiceForm";
import { servicesRepository } from "@/lib/content/servicesRepository";
import type { Service } from "@/data/services";

type View = { mode: "list" } | { mode: "create" } | { mode: "edit"; slug: string };

export function ServicesManager() {
  const [services, setServices] = useState<Service[] | null>(null);
  const [view, setView] = useState<View>({ mode: "list" });
  const [actionError, setActionError] = useState<string | null>(null);

  async function refresh() {
    const list = await servicesRepository.list();
    setServices(list);
  }

  useEffect(() => {
    let active = true;
    servicesRepository.list().then((list) => {
      if (active) setServices(list);
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleDelete(slug: string, title: string) {
    const confirmed = window.confirm(
      `Delete "${title}"? This can't be undone unless you reset all services to defaults.`,
    );
    if (!confirmed) return;
    setActionError(null);
    try {
      await servicesRepository.remove(slug);
      await refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to delete service.");
    }
  }

  if (services === null) {
    return <AdminLoadingState />;
  }

  if (view.mode === "create") {
    return (
      <Card>
        <ServiceForm
          initialService={null}
          onSaved={() => {
            setView({ mode: "list" });
            refresh();
          }}
          onCancel={() => setView({ mode: "list" })}
        />
      </Card>
    );
  }

  if (view.mode === "edit") {
    const service = services.find((item) => item.slug === view.slug) ?? null;
    return (
      <Card>
        <ServiceForm
          initialService={service}
          onSaved={() => {
            setView({ mode: "list" });
            refresh();
          }}
          onCancel={() => setView({ mode: "list" })}
        />
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => setView({ mode: "create" })}>Add Service</Button>
        <DestructiveConfirm
          message="Reset all services to the original 3 defaults? Local creates, edits, and deletes will be lost."
          confirmWord="RESET"
          actionLabel="Reset All to Defaults"
          pendingLabel="Resetting…"
          onConfirm={async () => {
            setActionError(null);
            try {
              await servicesRepository.reset();
              await refresh();
            } catch (err) {
              setActionError(err instanceof Error ? err.message : "Failed to reset services.");
              throw err;
            }
          }}
        />
      </div>

      <FormError message={actionError} />

      {services.length === 0 ? (
        <EmptyState title="No services" description="Add a service to get started." />
      ) : (
        <div className="flex flex-col gap-3">
          {services.map((service) => (
            <Card
              key={service.slug}
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-foreground">{service.title}</p>
                <p className="text-[14px] text-muted-foreground">/services/{service.slug}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setView({ mode: "edit", slug: service.slug })}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(service.slug, service.title)}
                >
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
