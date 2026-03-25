import Image from "next/image";
import Link from "next/link";

export type DoctorListItem = {
  id: string;
  slug: string;
  name: string;
  specialty: string;
  status: string;
  image: string;
  bio: string;
  location: string;
};

type Props = {
  doctors: DoctorListItem[];
  animationKey: string;
  emptyMessage?: string;
};

function getStatusStyles(status: string) {
  const normalizedStatus = status.trim().toLowerCase();

  if (normalizedStatus === "available") {
    return {
      dot: "bg-[#10b981]",
      text: "text-[#10b981]",
    };
  }

  if (normalizedStatus === "unavailable") {
    return {
      dot: "bg-[#ef4444]",
      text: "text-[#ef4444]",
    };
  }

  if (normalizedStatus === "on leave") {
    return {
      dot: "bg-[#f59e0b]",
      text: "text-[#f59e0b]",
    };
  }

  return {
    dot: "bg-[#6b7280]",
    text: "text-[#6b7280]",
  };
}

export default function DoctorsList({
  doctors,
  animationKey,
  emptyMessage = "No doctors found.",
}: Props) {
  if (doctors.length === 0) {
    return (
      <article
        key={`empty-${animationKey}`}
        className="card fade-up rounded-[24px] p-6 text-sm text-[var(--muted)]"
      >
        {emptyMessage}
      </article>
    );
  }

  return (
    <div
      key={animationKey}
      className="fade-up grid gap-5 justify-items-start sm:grid-cols-2 xl:grid-cols-4"
    >
      {doctors.map((doctor) => {
        const statusStyles = getStatusStyles(doctor.status);

        return (
          <article
            key={doctor.id}
            className="card w-full max-w-[340px] overflow-hidden rounded-[22px] border border-[#e7eef9] bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] shadow-[0_18px_36px_-28px_rgba(15,23,42,0.25)]"
          >
            <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
              <Image
                src={doctor.image}
                alt={doctor.name}
                fill
                className="object-cover object-top transition-transform duration-300 hover:scale-105"
              />
            </div>

            <div className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <p className={`inline-flex items-center gap-1 text-sm font-semibold ${statusStyles.text}`}>
                  <span className={`inline-block h-2 w-2 rounded-full ${statusStyles.dot}`} />
                  <span>{doctor.status}</span>
                </p>
                <span className="rounded-full bg-[#eef4ff] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--brand)]">
                  {doctor.specialty}
                </span>
              </div>

              <h3 className="mt-3 text-[22px] font-bold leading-tight text-[var(--brand-deep)]">
                {doctor.name}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                {doctor.bio}
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--brand-deep)]">
                {doctor.location}
              </p>

              <Link
                href={`/doctors/${doctor.slug}`}
                className="mt-5 inline-flex items-center text-sm font-semibold text-[var(--brand-deep)] transition hover:text-[var(--brand)]"
              >
                View profile
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
