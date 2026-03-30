"use client";

import { saveBlogAction } from "@/app/dashboard/actions";
import {
  DoctorFormField,
  inputClassName,
  textareaClassName,
} from "@/components/dashboard/doctor-form-ui";
import { TiptapEditorField } from "@/components/dashboard/TiptapEditorField";
import type { Blog } from "@/lib/db";
import { toDateInputValue } from "@/lib/published-date";

type BlogFormProps = {
  blog?: Blog | null;
  submitLabel: string;
  onCancel?: () => void;
};

export function BlogForm({ blog, submitLabel, onCancel }: BlogFormProps) {
  return (
    <form action={saveBlogAction} className="grid gap-6">
      {blog ? <input type="hidden" name="id" value={blog.id} /> : null}

      <div className="grid gap-6 md:grid-cols-2">
        <DoctorFormField label="Title">
          <input
            name="title"
            required
            defaultValue={blog?.title ?? ""}
            placeholder="Title"
            className={inputClassName}
          />
        </DoctorFormField>

        <DoctorFormField label="Slug">
          <input
            name="slug"
            defaultValue={blog?.slug ?? ""}
            placeholder="Slug (optional)"
            className={inputClassName}
          />
        </DoctorFormField>

        <DoctorFormField label="Author">
          <input
            name="author"
            defaultValue={blog?.author ?? ""}
            placeholder="Author"
            className={inputClassName}
          />
        </DoctorFormField>

        <DoctorFormField label="Published Date">
          <input
            type="date"
            name="publishedAt"
            defaultValue={toDateInputValue(blog?.published_at ?? "")}
            placeholder="Published date (YYYY-MM-DD)"
            className={inputClassName}
          />
        </DoctorFormField>
      </div>

      <DoctorFormField label="Excerpt">
        <input
          name="excerpt"
          required
          defaultValue={blog?.excerpt ?? ""}
          placeholder="Excerpt"
          className={inputClassName}
        />
      </DoctorFormField>

      <DoctorFormField label="Content">
        <TiptapEditorField
          key={blog?.id ?? "new-blog-content"}
          name="content"
          required
          defaultValue={blog?.content ?? ""}
          placeholder="Content"
        />
      </DoctorFormField>

      <DoctorFormField label="Tags">
        <textarea
          name="tags"
          rows={5}
          defaultValue={blog?.tags?.join("\n") ?? ""}
          placeholder="Tags (one per line)"
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
