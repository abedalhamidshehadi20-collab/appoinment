"use client";

import { saveServiceAction } from "@/app/dashboard/actions";
import {
  DoctorFormField,
  inputClassName,
  textareaClassName,
} from "@/components/dashboard/doctor-form-ui";
import type { Service } from "@/lib/db";

type ServiceFormProps = {
  service?: Service | null;
  submitLabel: string;
  onCancel?: () => void;
};

export function ServiceForm({
  service,
  submitLabel,
  onCancel,
}: ServiceFormProps) {
  return (
    <form action={saveServiceAction} className="grid gap-6">
      {service ? <input type="hidden" name="id" value={service.id} /> : null}

      <DoctorFormField label="Service Title">
        <input
          name="title"
          required
          defaultValue={service?.title ?? ""}
          placeholder="Service title"
          className={inputClassName}
        />
      </DoctorFormField>

      <DoctorFormField label="Summary">
        <textarea
          name="summary"
          required
          rows={4}
          defaultValue={service?.summary ?? ""}
          placeholder="Summary"
          className={textareaClassName}
        />
      </DoctorFormField>

      <DoctorFormField label="Features">
        <textarea
          name="features"
          rows={8}
          defaultValue={service?.features?.join("\n") ?? ""}
          placeholder="One feature per line"
          className={textareaClassName}
        />
      </DoctorFormField>

      <div className="border-t border-[#edf2fb] pt-2">
        <div className="flex flex-wrap justify-end gap-3">
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-[#d8e5fb] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--brand-deep)] transition hover:bg-[#f8fbff]"
            >
              Cancel
            </button>
          ) : null}

          <button className="button button-primary rounded-xl px-5 py-2.5">
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
