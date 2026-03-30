"use client";

import { saveNewsAction } from "@/app/dashboard/actions";
import {
  DoctorFormField,
  inputClassName,
} from "@/components/dashboard/doctor-form-ui";
import { TiptapEditorField } from "@/components/dashboard/TiptapEditorField";
import type { News } from "@/lib/db";
import { toDateInputValue } from "@/lib/published-date";

type NewsFormProps = {
  news?: News | null;
  submitLabel: string;
  onCancel?: () => void;
};

export function NewsForm({ news, submitLabel, onCancel }: NewsFormProps) {
  return (
    <form action={saveNewsAction} className="grid gap-6">
      {news ? <input type="hidden" name="id" value={news.id} /> : null}

      <div className="grid gap-6 md:grid-cols-2">
        <DoctorFormField label="Title">
          <input
            name="title"
            required
            defaultValue={news?.title ?? ""}
            placeholder="Title"
            className={inputClassName}
          />
        </DoctorFormField>

        <DoctorFormField label="Slug">
          <input
            name="slug"
            defaultValue={news?.slug ?? ""}
            placeholder="Slug (optional)"
            className={inputClassName}
          />
        </DoctorFormField>

        <DoctorFormField label="Source">
          <input
            name="source"
            defaultValue={news?.source ?? ""}
            placeholder="Source"
            className={inputClassName}
          />
        </DoctorFormField>

        <DoctorFormField label="Published Date">
          <input
            type="date"
            name="publishedAt"
            defaultValue={toDateInputValue(news?.published_at ?? "")}
            placeholder="Published date (YYYY-MM-DD)"
            className={inputClassName}
          />
        </DoctorFormField>
      </div>

      <DoctorFormField label="Excerpt">
        <input
          name="excerpt"
          required
          defaultValue={news?.excerpt ?? ""}
          placeholder="Excerpt"
          className={inputClassName}
        />
      </DoctorFormField>

      <DoctorFormField label="Content">
        <TiptapEditorField
          key={news?.id ?? "new-news-content"}
          name="content"
          required
          defaultValue={news?.content ?? ""}
          placeholder="Content"
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
