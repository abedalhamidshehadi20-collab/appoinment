import type { ReactNode } from "react";

export const defaultAvailableTimes =
  "8:00 am\n8:30 am\n9:00 am\n9:30 am\n10:00 am\n10:30 am\n11:00 am\n11:30 am";

export const inputClassName =
  "h-12 w-full rounded-2xl border border-[#dfe8f8] bg-[#f8fbff] px-4 text-sm text-[var(--brand-deep)] outline-none transition placeholder:text-[#8da0be] focus:border-[#bfd5ff] focus:bg-white focus:ring-4 focus:ring-[#e8f0ff]";

export const textareaClassName =
  "w-full rounded-2xl border border-[#dfe8f8] bg-[#f8fbff] px-4 py-3 text-sm text-[var(--brand-deep)] outline-none transition placeholder:text-[#8da0be] focus:border-[#bfd5ff] focus:bg-white focus:ring-4 focus:ring-[#e8f0ff]";

export function DoctorFormField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-[var(--brand-deep)]">
        {label}
      </span>
      {children}
    </label>
  );
}
