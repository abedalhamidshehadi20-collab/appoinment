import type { ReactNode } from "react";
import { MedicalIcon, type SpecialtyItem } from "@/components/site/specialties";

export type FilterSpecialtyItem = SpecialtyItem & {
  value: string;
};

type Props = {
  specialties: FilterSpecialtyItem[];
  selectedSpecialty: string;
  onSelect: (specialty: string) => void;
};

const ALL_SPECIALTIES_VALUE = "All";

function SpecialtyCardButton({
  title,
  subtitle,
  active,
  onClick,
  icon,
}: {
  title: string;
  subtitle: string;
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group relative flex min-h-[132px] w-full flex-col justify-between rounded-[22px] border px-5 py-5 text-left transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#dbeafe] ${
        active
          ? "border-[#cfe0ff] bg-[linear-gradient(180deg,#eef5ff_0%,#dbeafe_100%)] text-[var(--brand-deep)] shadow-[0_16px_28px_-22px_rgba(35,119,231,0.65)]"
          : "border-[var(--line)] bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] text-[var(--brand-deep)] hover:-translate-y-1 hover:border-[#c7ddff] hover:shadow-[0_18px_30px_-22px_rgba(17,24,39,0.22)]"
      }`}
    >
      <span
        className={`absolute right-5 top-5 h-2 w-2 rounded-full transition-opacity ${
          active ? "bg-[var(--brand)] opacity-100" : "bg-[#c7d2fe] opacity-0 group-hover:opacity-100"
        }`}
      />

      <div className="relative w-fit">
        <div
          className={`absolute -inset-1 rounded-[20px] transition-opacity ${
            active
              ? "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),rgba(219,234,254,0.55))] opacity-100"
              : "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.92),rgba(239,246,255,0.8))] opacity-0 group-hover:opacity-100"
          }`}
        />
        <div
          className={`relative flex h-[62px] w-[62px] items-center justify-center rounded-[18px] border shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition-all ${
            active
              ? "border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#edf4ff_100%)]"
              : "border-[#e7eef9] bg-[linear-gradient(180deg,#f8fbff_0%,#eef4fc_100%)] group-hover:border-[#d5e4fb] group-hover:bg-[linear-gradient(180deg,#ffffff_0%,#f1f6ff_100%)]"
          }`}
        >
          {icon}
        </div>
      </div>

      <div className="mt-5">
        <span className="block text-lg font-bold leading-tight tracking-[-0.02em]">
          {title}
        </span>
        <span className="mt-2 block text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
          {subtitle}
        </span>
      </div>
    </button>
  );
}

export default function SpecialtyCards({
  specialties,
  selectedSpecialty,
  onSelect,
}: Props) {
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--muted)]">
          Click a specialty card to filter the doctor list instantly.
        </p>

        <button
          type="button"
          onClick={() => onSelect(ALL_SPECIALTIES_VALUE)}
          className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#dbeafe] ${
            selectedSpecialty === ALL_SPECIALTIES_VALUE
              ? "border-[#cfe0ff] bg-[#eef5ff] text-[var(--brand-deep)]"
              : "border-[#d8e5fb] bg-white text-[var(--brand)] hover:border-[#bfd5ff] hover:bg-[#f8fbff]"
          }`}
        >
          All Doctors
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {specialties.map((item) => (
          <SpecialtyCardButton
            key={item.value}
            title={item.label}
            subtitle="Explore specialty"
            active={selectedSpecialty === item.value}
            onClick={() => onSelect(item.value)}
            icon={<MedicalIcon type={item.icon} />}
          />
        ))}
      </div>
    </>
  );
}
