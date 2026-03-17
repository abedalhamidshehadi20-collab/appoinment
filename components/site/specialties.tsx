import Link from "next/link";

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

export const homepageSpecialties: SpecialtyItem[] = [
  { icon: "dentist", label: "Dentist" },
  { icon: "cardiologist", label: "Cardiologist" },
  { icon: "orthopedic", label: "Orthopedic" },
  { icon: "neurologist", label: "Neurologist" },
  { icon: "otology", label: "Otology" },
  { icon: "general", label: "General Doctor" },
];

export const allSpecialties: SpecialtyItem[] = [
  ...homepageSpecialties,
  { icon: "surgeon", label: "Surgeon" },
  { icon: "psychiatry", label: "Psychiatry" },
  { icon: "eye", label: "Eye Specialist" },
];

export function specialtyHref(label: string) {
  return `/search/${encodeURIComponent(label)}`;
}

export function MedicalIcon({ type }: { type: SpecialtyIcon }) {
  const shared = "h-7 w-7 text-[var(--brand)]";

  if (type === "dentist") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={shared} aria-hidden="true">
        <path d="M12 3c-3 0-6 1.1-6 3.8 0 1.6.9 3 1.7 4.3.6 1 .9 2 .9 3.1v2c0 2.7 1.5 4.8 3.4 4.8 1 0 1.6-.7 1.9-1.9l.4-1.8c.1-.4.4-.7.8-.7s.7.3.8.7l.4 1.8c.3 1.2.9 1.9 1.9 1.9 1.9 0 3.4-2.1 3.4-4.8v-2c0-1.1.3-2.1.9-3.1.8-1.3 1.7-2.7 1.7-4.3C18 4.1 15 3 12 3z" />
      </svg>
    );
  }

  if (type === "cardiologist") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={shared} aria-hidden="true">
        <path d="M12 20s-7-4.2-7-9.3C5 7.8 7 6 9.4 6c1.6 0 2.4.8 2.6 1.2.2-.4 1-1.2 2.6-1.2C17 6 19 7.8 19 10.7 19 15.8 12 20 12 20z" stroke="currentColor" strokeWidth="2" />
        <path d="M7.5 12h2l1.1-2.2 1.8 4.2 1.2-2H16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "orthopedic") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={shared} aria-hidden="true">
        <path d="M12 3v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M8 7c0-1.7 1.8-3 4-3s4 1.3 4 3-1.8 3-4 3-4-1.3-4-3z" stroke="currentColor" strokeWidth="2" />
        <path d="M8 17c0-1.7 1.8-3 4-3s4 1.3 4 3-1.8 3-4 3-4-1.3-4-3z" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  if (type === "neurologist") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={shared} aria-hidden="true">
        <path d="M12 4c-3.3 0-6 2.5-6 5.6 0 2 1.1 3.6 2.8 4.6V18a2 2 0 0 0 2 2h2.4a2 2 0 0 0 2-2v-3.8c1.7-1 2.8-2.6 2.8-4.6C18 6.5 15.3 4 12 4z" stroke="currentColor" strokeWidth="2" />
        <path d="M12 6v8M9.5 8.5h5M9.5 11h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "otology") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={shared} aria-hidden="true">
        <path d="M14.5 4.5c-3 0-5.5 2.3-5.5 5.2 0 1.8 1.1 3.3 2.4 4.1.9.6 1.1 1.1 1.1 1.8V18c0 1.1-.7 2-1.7 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M14.5 7.5a2.5 2.5 0 0 1 2.5 2.4c0 1.2-.7 2-1.6 2.6-.8.5-1.4 1.2-1.4 2.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "surgeon") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={shared} aria-hidden="true">
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M7.5 4.5a2 2 0 1 1-2.8 2.8 2 2 0 0 1 2.8-2.8zM19.3 16.3a2 2 0 1 1-2.8 2.8 2 2 0 0 1 2.8-2.8z" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  if (type === "psychiatry") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={shared} aria-hidden="true">
        <circle cx="12" cy="11" r="6" stroke="currentColor" strokeWidth="2" />
        <path d="M12 8v3l2 2M9 20l1.2-2M15 20l-1.2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "eye") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={shared} aria-hidden="true">
        <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12z" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="2.7" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className={shared} aria-hidden="true">
      <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M6 19c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M19 10v4M17 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition ${
        active
          ? "bg-[#dbeafe] text-[var(--brand)]"
          : "text-[var(--brand-deep)] hover:bg-[#eff6ff]"
      }`}
    >
      <MedicalIcon type={item.icon} />
      {item.label}
    </Link>
  );
}
