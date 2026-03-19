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
  const shared = "h-8 w-8 text-[var(--brand)]";

  if (type === "dentist") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={shared} aria-hidden="true">
        <path
          d="M12 2C8.5 2 6 3.5 6 6.2c0 1.8 1 3.4 1.9 4.8.7 1.1 1 2.2 1 3.4v2.1c0 3 1.7 5.5 3.8 5.5 1.1 0 1.8-.8 2.2-2.2l.4-2c.1-.5.5-.8.9-.8.4 0 .8.3.9.8l.4 2c.4 1.4 1.1 2.2 2.2 2.2 2.1 0 3.8-2.5 3.8-5.5v-2.1c0-1.2.3-2.3 1-3.4.9-1.4 1.9-3 1.9-4.8 0-2.7-2.5-4.2-6-4.2z"
          fill="currentColor"
          fillOpacity="0.1"
          stroke="currentColor"
          strokeWidth="1.5"
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
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          fill="currentColor"
          fillOpacity="0.08"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 11h2.5l1.5-3 2 6 1.5-3H17"
          stroke="currentColor"
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
        <g>
          <rect
            x="10"
            y="3"
            width="4"
            height="18"
            rx="2"
            fill="currentColor"
            fillOpacity="0.08"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <ellipse
            cx="12"
            cy="7"
            rx="4.5"
            ry="3"
            fill="currentColor"
            fillOpacity="0.08"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <ellipse
            cx="12"
            cy="17"
            rx="4.5"
            ry="3"
            fill="currentColor"
            fillOpacity="0.08"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </g>
      </svg>
    );
  }

  if (type === "neurologist") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={shared} aria-hidden="true">
        <g>
          <path
            d="M12 3c-3.5 0-6.5 2.8-6.5 6.2 0 2.2 1.2 4 3 5.1V18c0 1.7 1.3 3 3 3h1c1.7 0 3-1.3 3-3v-3.7c1.8-1.1 3-2.9 3-5.1C18.5 5.8 15.5 3 12 3z"
            fill="currentColor"
            fillOpacity="0.08"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="12"
            y1="6"
            x2="12"
            y2="14"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <line
            x1="9"
            y1="8.5"
            x2="15"
            y2="8.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <line
            x1="9"
            y1="11.5"
            x2="15"
            y2="11.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </g>
      </svg>
    );
  }

  if (type === "otology") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={shared} aria-hidden="true">
        <g>
          <path
            d="M15 4c-3.3 0-6 2.7-6 6 0 2 1 3.7 2.5 4.8 1 .8 1.5 1.5 1.5 2.5V19c0 1.7-1.3 3-3 3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 7c1.7 0 3 1.3 3 3 0 1.4-.8 2.4-1.8 3.2-1 .7-1.7 1.5-1.7 2.8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle
            cx="9.5"
            cy="10"
            r="1.2"
            fill="currentColor"
          />
          <circle
            cx="9.5"
            cy="14"
            r="1.2"
            fill="currentColor"
          />
          <circle
            cx="9.5"
            cy="18"
            r="1.2"
            fill="currentColor"
          />
        </g>
      </svg>
    );
  }

  if (type === "surgeon") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={shared} aria-hidden="true">
        <g>
          <path
            d="M4 4l16 16M20 4L4 20"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle
            cx="6"
            cy="6"
            r="2.5"
            fill="currentColor"
            fillOpacity="0.1"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <circle
            cx="18"
            cy="18"
            r="2.5"
            fill="currentColor"
            fillOpacity="0.1"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M10 10l4 4"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
      </svg>
    );
  }

  if (type === "psychiatry") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={shared} aria-hidden="true">
        <g>
          <circle
            cx="12"
            cy="12"
            r="7"
            fill="currentColor"
            fillOpacity="0.08"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M12 8v5l3 3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 19.5l1.5-2.5M15 19.5l-1.5-2.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle
            cx="12"
            cy="12"
            r="1.5"
            fill="currentColor"
          />
        </g>
      </svg>
    );
  }

  if (type === "eye") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={shared} aria-hidden="true">
        <g>
          <path
            d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z"
            fill="currentColor"
            fillOpacity="0.08"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="12"
            cy="12"
            r="3.5"
            fill="currentColor"
            fillOpacity="0.1"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <circle
            cx="12"
            cy="12"
            r="1.5"
            fill="currentColor"
          />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className={shared} aria-hidden="true">
      <g>
        <circle
          cx="12"
          cy="8"
          r="3.5"
          fill="currentColor"
          fillOpacity="0.08"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M19 9v6M16 12h6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </g>
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
      className={`group flex flex-col items-center justify-center gap-2 rounded-lg px-3 py-4 text-sm font-semibold transition-all duration-200 ${
        active
          ? "bg-[#dbeafe] text-[var(--brand)] shadow-sm"
          : "text-[var(--brand-deep)] hover:bg-[#eff6ff] hover:shadow-sm hover:-translate-y-0.5"
      }`}
    >
      <div className={`rounded-full p-2 transition-colors ${active ? "bg-white/50" : "bg-[#eff6ff] group-hover:bg-white"}`}>
        <MedicalIcon type={item.icon} />
      </div>
      <span className="text-center">{item.label}</span>
    </Link>
  );
}
