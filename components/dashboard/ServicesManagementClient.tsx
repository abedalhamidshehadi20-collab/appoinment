"use client";

import { useState } from "react";
import { deleteServiceAction } from "@/app/dashboard/actions";
import { ServiceForm } from "@/components/dashboard/ServiceForm";
import type { Service } from "@/lib/db";
import { FileText, Pencil, Plus, Search, Trash2, X } from "lucide-react";

type ServicesManagementClientProps = {
  services: Service[];
};

export function ServicesManagementClient({
  services,
}: ServicesManagementClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const filteredServices = services.filter((service) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return true;
    }

    const haystack = [
      service.title,
      service.summary,
      ...(service.features ?? []),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });

  const selectedService =
    services.find((service) => service.id === selectedServiceId) ?? null;

  return (
    <div className="space-y-6">
      <article className="card overflow-hidden rounded-[28px] border border-[#e7eef9] bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.28)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
              Services
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-[var(--brand-deep)]">
              Service Management
            </h1>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Manage the service section with the same structured workflow used for doctor profiles.
            </p>
            <p className="mt-2 text-sm font-semibold text-[var(--brand-deep)]">
              {services.length} service{services.length === 1 ? "" : "s"} in library
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-16 lg:pt-20">
            <button
              type="button"
              onClick={() => {
                setSelectedServiceId(null);
                setShowCreateForm(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f68cb]"
            >
              <Plus className="h-4 w-4" />
              Add Service
            </button>
          </div>
        </div>

        <section className="mt-6 rounded-[24px] border border-[#dce8fb] bg-white p-5 shadow-[0_12px_28px_-24px_rgba(17,24,39,0.25)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[var(--brand-deep)]">
                Service Directory
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Search the service list and open any entry for editing below.
              </p>
            </div>

            <div className="lg:w-[360px]">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search services"
                  className="h-11 w-full rounded-xl border border-[var(--line)] bg-white pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-[#bfd5ff] focus:ring-4 focus:ring-[#e8f0ff]"
                />
              </label>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto rounded-[22px] border border-[#edf2fb]">
            <table className="min-w-[920px] w-full border-collapse">
              <thead>
                <tr className="bg-[#f8fbff] text-left text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  <th className="px-5 py-4">Service</th>
                  <th className="px-4 py-4">Summary</th>
                  <th className="px-4 py-4">Features</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-sm text-[var(--muted)]">
                      No services match this search.
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service) => {
                    const featureCount = service.features?.length ?? 0;
                    const featurePreview = service.features?.slice(0, 3) ?? [];
                    const isSelected = service.id === selectedServiceId;

                    return (
                      <tr
                        key={service.id}
                        className={`border-t border-[#eef2f7] align-top transition ${
                          isSelected ? "bg-[#f8fbff]" : "bg-white hover:bg-[#fbfdff]"
                        }`}
                      >
                        <td className="px-5 py-4">
                          <p className="max-w-[250px] text-sm font-semibold text-[var(--brand-deep)]">
                            {service.title}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="max-w-[380px] line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                            {service.summary}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="max-w-[280px]">
                            <p className="text-sm font-semibold text-[var(--brand-deep)]">
                              {featureCount} feature{featureCount === 1 ? "" : "s"}
                            </p>
                            {featurePreview.length > 0 ? (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {featurePreview.map((feature, index) => (
                                  <span
                                    key={`${service.id}-${index}`}
                                    className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-medium text-[var(--brand-deep)]"
                                  >
                                    {feature}
                                  </span>
                                ))}
                                {featureCount > featurePreview.length ? (
                                  <span className="rounded-full bg-[#f3f6fb] px-3 py-1 text-xs font-medium text-[var(--muted)]">
                                    +{featureCount - featurePreview.length} more
                                  </span>
                                ) : null}
                              </div>
                            ) : (
                              <p className="mt-1 text-sm text-[var(--muted)]">
                                No features listed.
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setShowCreateForm(false);
                                setSelectedServiceId(service.id);
                              }}
                              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition ${
                                isSelected
                                  ? "border-[#bfd5ff] bg-[#eef4ff] text-[var(--brand)]"
                                  : "border-[#e5e7eb] bg-white text-[var(--muted)] hover:border-[#bfd5ff] hover:text-[var(--brand)]"
                              }`}
                              title="Edit Service"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>

                            <form action={deleteServiceAction}>
                              <input type="hidden" name="id" value={service.id} />
                              <button
                                type="submit"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e5e7eb] bg-white text-[var(--muted)] transition hover:border-[#fecaca] hover:text-[#dc2626]"
                                title="Delete Service"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </article>

      {showCreateForm ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[rgba(15,23,42,0.28)] p-4 backdrop-blur-[6px] sm:p-6">
          <button
            type="button"
            aria-label="Close create service form"
            onClick={() => setShowCreateForm(false)}
            className="absolute inset-0 cursor-default"
          />

          <section className="relative z-10 flex max-h-[calc(100vh-3rem)] w-full max-w-3xl flex-col overflow-hidden rounded-[30px] border border-[#dce8fb] bg-white shadow-[0_36px_70px_-38px_rgba(15,23,42,0.42)]">
            <div className="flex items-start justify-between gap-4 border-b border-[#edf2fb] px-6 py-5 sm:px-8">
              <div className="flex items-start gap-4">
                <div className="rounded-[20px] bg-[#eef4ff] p-3 text-[var(--brand)]">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
                    Create Form
                  </p>
                  <h2 className="mt-1 text-[28px] font-extrabold tracking-[-0.03em] text-[var(--brand-deep)]">
                    Create Service
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                    Add a service using the same structured editing flow as the doctor section.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#d8e5fb] bg-white text-[var(--brand-deep)] transition hover:bg-[#f8fbff]"
                title="Close form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
              <ServiceForm
                submitLabel="Add Service"
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          </section>
        </div>
      ) : null}

      {selectedService ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[rgba(15,23,42,0.28)] p-4 backdrop-blur-[6px] sm:p-6">
          <button
            type="button"
            aria-label="Close update service form"
            onClick={() => setSelectedServiceId(null)}
            className="absolute inset-0 cursor-default"
          />

          <section className="relative z-10 flex max-h-[calc(100vh-3rem)] w-full max-w-3xl flex-col overflow-hidden rounded-[30px] border border-[#dce8fb] bg-white shadow-[0_36px_70px_-38px_rgba(15,23,42,0.42)]">
            <div className="flex items-start justify-between gap-4 border-b border-[#edf2fb] px-6 py-5 sm:px-8">
              <div className="flex items-start gap-4">
                <div className="rounded-[20px] bg-[#eef4ff] p-3 text-[var(--brand)]">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
                    Update Form
                  </p>
                  <h2 className="mt-1 text-[28px] font-extrabold tracking-[-0.03em] text-[var(--brand-deep)]">
                    Update Service
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                    Edit {selectedService.title} without changing the service content structure.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedServiceId(null)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#d8e5fb] bg-white text-[var(--brand-deep)] transition hover:bg-[#f8fbff]"
                title="Close form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
              <ServiceForm
                service={selectedService}
                submitLabel="Save Service"
                onCancel={() => setSelectedServiceId(null)}
              />
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
