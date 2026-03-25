import Link from "next/link";
import { Specialty } from "@/lib/db";

export type SpecialtyIcon =
  | "dentist"
  | "cardiologist"
  | "orthopedic"
  | "neurologist"
  | "otology"
  | "general"
  | "surgeon"
  | "psychiatry"
  | "eye";

export type SpecialtyItem = {
  icon: SpecialtyIcon;
  label: string;
};

// Fallback specialties when database is empty
export const defaultHomepageSpecialties: SpecialtyItem[] = [
  { icon: "dentist", label: "Dentist" },
  { icon: "cardiologist", label: "Cardiologist" },
  { icon: "orthopedic", label: "Orthopedic" },
  { icon: "neurologist", label: "Neurologist" },
  { icon: "otology", label: "Otology" },
  { icon: "general", label: "General Doctor" },
];

export const defaultAllSpecialties: SpecialtyItem[] = [
  ...defaultHomepageSpecialties,
  { icon: "surgeon", label: "Surgeon" },
  { icon: "psychiatry", label: "Psychiatry" },
  { icon: "eye", label: "Eye Specialist" },
];

// Convert database specialty to SpecialtyItem
export function specialtyToItem(specialty: Specialty): SpecialtyItem {
  return {
    icon: specialty.icon as SpecialtyIcon,
    label: specialty.name,
  };
}

// Convert database specialties to items with fallback
export function getSpecialtyItems(
  specialties: Specialty[] | null,
  featuredOnly: boolean = false
): SpecialtyItem[] {
  if (!specialties || specialties.length === 0) {
    return featuredOnly ? defaultHomepageSpecialties : defaultAllSpecialties;
  }
  const items = specialties.map(specialtyToItem);
  return featuredOnly
    ? items.filter((_, idx) => idx < 6)
    : items;
}

export function specialtyHref(label: string) {
  return `/doctors?specialty=${encodeURIComponent(label)}`;
}

export function MedicalIcon({ type }: { type: SpecialtyIcon }) {
  const shared = "h-7 w-7 text-[var(--brand)]";

  if (type === "dentist") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={shared} aria-hidden="true">
        <path
          d="M12 3.1c-3.4 0-5.8 1.4-5.8 4 0 1.4.7 2.6 1.5 3.8.8 1.1 1.1 2.2 1.1 3.6v1.2c0 2.9 1.2 5 2.9 5 .9 0 1.5-.8 1.8-2.3l.4-2.2c.1-.5.4-.8.9-.8s.8.3.9.8l.4 2.2c.3 1.5.9 2.3 1.8 2.3 1.7 0 2.9-2.1 2.9-5v-1.2c0-1.4.3-2.5 1.1-3.6.8-1.2 1.5-2.4 1.5-3.8 0-2.6-2.4-4-5.8-4z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.8 6.9c.6-.6 1.1-.9 1.7-.9.7 0 1.1.3 1.5.8.4-.5.9-.8 1.5-.8.7 0 1.2.3 1.7.9"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "cardiologist") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={shared} aria-hidden="true">
        <path
          d="M20.4 6.8a4.8 4.8 0 0 0-6.7 0L12 8.4l-1.7-1.6a4.8 4.8 0 0 0-6.7 6.8l1.6 1.5L12 21l6.8-5.9 1.6-1.5a4.8 4.8 0 0 0 0-6.8z"
          fill="currentColor"
        />
        <path
          d="M6.7 11.9h2.7l1.3-2.4 1.8 4.3 1.3-2.4h3"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "orthopedic") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={shared} aria-hidden="true">
        <path
          d="M12 2.8c-1.1 0-2 .9-2 2v2H8.6c-1.6 0-2.9 1.3-2.9 2.9s1.3 2.9 2.9 2.9H10v1.8H8.6c-1.6 0-2.9 1.3-2.9 2.9s1.3 2.9 2.9 2.9H10v2c0 1.1.9 2 2 2s2-.9 2-2v-2h1.4c1.6 0 2.9-1.3 2.9-2.9s-1.3-2.9-2.9-2.9H14v-1.8h1.4c1.6 0 2.9-1.3 2.9-2.9s-1.3-2.9-2.9-2.9H14v-2c0-1.1-.9-2-2-2z"
          fill="currentColor"
        />
        <path d="M12 6.1v11.8M8.5 9.7h7M8.5 14.3h7" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "neurologist") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={shared} aria-hidden="true">
        <path
          d="M12 3c-4.5 0-8 3.4-8 7.6 0 2.4 1.2 4.7 3.3 6l1.1-.9v-2.1l-1.7-1.3 1.2-1.9 1.9 1.1h1V8.8L9 7.5l1.1-1.8 1.7 1 .2-.1 1.7-1L14.8 7 13 8.3v3.2h1l1.9-1.1 1.2 1.9-1.7 1.3v2.1l1.1.9c2.1-1.3 3.3-3.6 3.3-6C20 6.4 16.5 3 12 3z"
          fill="currentColor"
        />
        <path d="M12 6.4v11.2M9 9.6h2M13 9.6h2M9.4 13.8h1.6M13 13.8h1.6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "otology") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={shared} aria-hidden="true">
        <path
          d="M15 3.7c-3.4 0-6.1 2.8-6.1 6.2 0 2 .9 3.7 2.5 4.9 1 .8 1.5 1.6 1.5 2.7v.6c0 1.3-.8 2.3-2.1 2.8-.3.1-.6.5-.6.9 0 .6.5 1.1 1.1 1.1 2.6 0 4.6-2 4.6-4.6v-1c0-1.4.5-2.2 1.6-3.1 1.4-1 2.2-2.6 2.2-4.5 0-3.2-2.1-6-4.7-6z"
          fill="currentColor"
        />
        <path d="M14.4 7.6c1.3 0 2.3 1 2.3 2.4 0 .8-.4 1.5-1 2.1-.8.7-1.3 1.5-1.3 2.8" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="9.1" cy="10" r="1" fill="white" />
        <circle cx="9.1" cy="13.4" r="1" fill="white" />
        <circle cx="9.1" cy="16.8" r="1" fill="white" />
      </svg>
    );
  }

  if (type === "surgeon") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={shared} aria-hidden="true">
        <path
          d="M12 3.1c-1.5 0-2.7 1.2-2.7 2.7 0 .5.2 1.1.5 1.6L7.1 9.3c-.7.5-1.1 1.2-1.1 2 0 .9.4 1.7 1.2 2.2l2.5 1.4v1.8l-2.5 1.4C6.4 18.6 6 19.4 6 20.3 6 22 7.8 23 10 23h4c2.2 0 4-.9 4-2.7 0-.9-.4-1.7-1.2-2.2l-2.5-1.4v-1.8l2.5-1.4c.8-.5 1.2-1.3 1.2-2.2 0-.8-.4-1.5-1.1-2l-2.7-1.9c.3-.5.5-1.1.5-1.6 0-1.5-1.2-2.7-2.7-2.7z"
          fill="currentColor"
        />
        <circle cx="12" cy="5.8" r="1.4" fill="white" />
        <path d="M9.8 14.9 12 13.8l2.2 1.1M10 19.6h4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "psychiatry") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={shared} aria-hidden="true">
        <path
          d="M11.8 3c-4.1 0-7.1 3-7.1 6.8 0 2.3 1.1 4.2 3 5.4v3.1c0 .8.6 1.4 1.4 1.4h.8v1.9c0 .8.6 1.4 1.4 1.4s1.4-.6 1.4-1.4v-1.9h.7c.8 0 1.4-.6 1.4-1.4V15c2-1.2 3.2-3.1 3.2-5.4C18 6 15.8 3 11.8 3z"
          fill="currentColor"
        />
        <path d="M10 8.9c.2-.9.9-1.7 2-1.7 1.2 0 2.1.8 2.1 1.9 0 1.9-2.3 1.9-2.3 3.6M11.9 15.8h.1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "eye") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={shared} aria-hidden="true">
        <path
          d="M2.4 12s3.8-5.9 9.6-5.9 9.6 5.9 9.6 5.9-3.8 5.9-9.6 5.9S2.4 12 2.4 12z"
          fill="currentColor"
        />
        <circle cx="12" cy="12" r="3" fill="white" />
        <circle cx="12" cy="12" r="1.35" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className={shared} aria-hidden="true">
      <circle cx="10.5" cy="7.2" r="3.1" fill="currentColor" />
      <path d="M4.8 19.6c0-3.4 2.8-6.1 6.2-6.1s6.2 2.7 6.2 6.1" fill="currentColor" />
      <path d="M18.1 8.8v5.8M15.2 11.7H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function SpecialtyLink({
  item,
  active = false,
}: {
  item: SpecialtyItem;
  active?: boolean;
}) {
  return (
    <Link
      href={specialtyHref(item.label)}
      className={`group relative flex min-h-[132px] flex-col justify-between rounded-[22px] px-5 py-5 text-left transition-all duration-200 ${
        active
          ? "bg-[linear-gradient(180deg,#eef5ff_0%,#dbeafe_100%)] text-[var(--brand-deep)] shadow-[0_16px_28px_-22px_rgba(35,119,231,0.65)]"
          : "bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] text-[var(--brand-deep)] hover:-translate-y-1 hover:border-[#c7ddff] hover:shadow-[0_18px_30px_-22px_rgba(17,24,39,0.22)]"
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
          <MedicalIcon type={item.icon} />
        </div>
      </div>

      <div className="mt-5">
        <span className="block text-lg font-bold leading-tight tracking-[-0.02em]">{item.label}</span>
        <span className="mt-2 block text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
          Explore specialty
        </span>
      </div>
    </Link>
  );
}
