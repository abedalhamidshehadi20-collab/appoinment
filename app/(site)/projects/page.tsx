import Image from "next/image";
import Link from "next/link";
import { SpecialtyLink, getSpecialtyItems } from "@/components/site/specialties";
import { getAllDoctors, getAllSpecialties } from "@/lib/db";
import { getSafeDoctorImageSrc } from "@/lib/image";

type Props = {
  searchParams: Promise<{ q?: string; specialty?: string }>;
};

const categoryKeywords: Record<string, string[]> = {
  Dentist: ["dent", "oral", "teeth"],
  Cardiologist: ["cardio", "heart"],
  Orthopedic: ["ortho", "bone", "joint"],
  Neurologist: ["neuro", "brain", "nerve"],
  Otology: ["oto", "ent", "ear"],
  "General Doctor": ["general", "internal", "family"],
  Surgeon: ["surgery", "surgeon"],
  Psychiatry: ["psych", "mental"],
  "Eye Specialist": ["eye", "ophthal", "vision"],
};

const specialtySectorAliases: Record<string, string[]> = {
  Dentist: ["Dentistry", "Dental"],
  Cardiologist: ["Cardiology"],
  Orthopedic: ["Orthopedics", "Orthopedic Surgery"],
  Neurologist: ["Neurology"],
  Otology: ["ENT", "Otolaryngology", "Otology"],
  "General Doctor": ["Internal Medicine", "General Medicine", "Family Medicine"],
  Surgeon: ["Surgery", "General Surgery"],
  Psychiatry: ["Psychiatry"],
  "Eye Specialist": ["Ophthalmology", "Eye Care"],
};

function decodeSpecialty(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export default async function ProjectsPage({ searchParams }: Props) {
  const params = await searchParams;
  const rawQuery = params.q?.trim() ?? "";
  const rawSpecialty = params.specialty?.trim() ?? "";
  const query = rawQuery.toLowerCase();

  const [allDoctors, specialtiesData] = await Promise.all([
    getAllDoctors(),
    getAllSpecialties().catch(() => null),
  ]);

  const allSpecialties = getSpecialtyItems(specialtiesData, false);
  const selectedSpecialty =
    allSpecialties.find((item) => item.label.toLowerCase() === rawSpecialty.toLowerCase())?.label ??
    (rawSpecialty ? decodeSpecialty(rawSpecialty) : "");

  const selectedKeywords = selectedSpecialty
    ? categoryKeywords[selectedSpecialty] ?? [selectedSpecialty.toLowerCase()]
    : [];
  const selectedSectorAliases = selectedSpecialty
    ? specialtySectorAliases[selectedSpecialty] ?? [selectedSpecialty]
    : [];

  const doctorsBySpecialty = selectedSpecialty
    ? allDoctors.filter((doctor) => {
        const haystack = `${doctor.sector} ${doctor.title} ${doctor.excerpt}`.toLowerCase();
        const sector = doctor.sector.toLowerCase();

        return (
          selectedSectorAliases.some((alias) => sector === alias.toLowerCase()) ||
          selectedKeywords.some((keyword) => haystack.includes(keyword))
        );
      })
    : allDoctors;

  const doctors = doctorsBySpecialty.filter((doctor) => {
    if (!query) {
      return true;
    }
    const haystack = `${doctor.title} ${doctor.sector} ${doctor.location} ${doctor.excerpt}`.toLowerCase();
    return haystack.includes(query);
  });

  const emptyStateMessage = selectedSpecialty
    ? "No doctors found for this specialty."
    : query
    ? "No doctors found for your search."
    : "No doctors are available right now.";

  return (
    <main className="container fade-up pb-10">
      <section className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="card h-fit p-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
          <div className="rounded-[20px] border border-[#e7eef9] bg-[linear-gradient(180deg,#fbfdff_0%,#f5f9ff_100%)] px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[var(--brand-deep)]">Specialties</p>
                <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                  Choose a specialty to narrow the doctor list quickly.
                </p>
              </div>
              <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[var(--brand)] shadow-sm">
                {allSpecialties.length}
              </span>
            </div>
          </div>

          <nav className="mt-3 grid gap-2">
            {allSpecialties.map((item) => (
              <SpecialtyLink
                key={item.label}
                item={item}
                active={item.label === selectedSpecialty}
                compact
              />
            ))}
          </nav>
        </aside>

        <section className="min-w-0">
          <div className="mb-5 rounded-[28px] border border-[#e7eef9] bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] p-5 shadow-[0_14px_36px_-30px_rgba(17,24,39,0.35)] md:p-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="inline-flex rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
                  Doctor Directory
                </span>
                <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-[var(--brand-deep)] md:text-4xl">
                  {selectedSpecialty || "Find the right specialist"}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                  {selectedSpecialty
                    ? "Explore doctors in this specialty and refine the list with a quick search."
                    : "Browse all specialists and narrow the list by specialty or search term."}
                </p>
              </div>

              <form method="get" className="flex w-full flex-wrap gap-2 sm:w-auto sm:flex-nowrap">
                {selectedSpecialty ? (
                  <input type="hidden" name="specialty" value={selectedSpecialty} />
                ) : null}
                <input
                  name="q"
                  defaultValue={rawQuery}
                  placeholder="Search doctors"
                  className="h-11 w-full rounded-xl border border-[var(--line)] bg-white px-4 text-sm shadow-sm outline-none transition focus:border-[#bfd5ff] focus:ring-4 focus:ring-[#e8f0ff] sm:w-64"
                />
                <button className="button button-primary h-11 rounded-xl px-5 text-sm">Search</button>
              </form>
            </div>

            {selectedSpecialty ? (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-[#d8e5fb] bg-[#f8fbff] px-3 py-1 text-xs font-semibold text-[var(--brand-deep)]">
                  Active specialty: {selectedSpecialty}
                </span>
                <Link href="/doctors" className="text-sm font-semibold text-[var(--brand)] transition hover:text-[var(--brand-deep)]">
                  View all doctors
                </Link>
              </div>
            ) : null}
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[var(--brand-deep)]">
                {doctors.length} doctor{doctors.length === 1 ? "" : "s"} found
              </h2>
              <p className="text-sm text-[var(--muted)]">
                Profiles are updated based on the selected specialty and search filters.
              </p>
            </div>
          </div>

          {doctors.length === 0 ? (
            <article className="card rounded-[24px] p-8 text-sm text-[var(--muted)]">{emptyStateMessage}</article>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {doctors.map((doctor) => (
              <article key={doctor.id} className="card p-3">
                <Image
                  src={getSafeDoctorImageSrc(doctor.cover_image)}
                  alt={doctor.title}
                  width={900}
                  height={700}
                  className="h-52 w-full rounded-lg object-cover"
                />
                <div className="p-1 pt-3">
                  <span className="rounded-full bg-[#dbeafe] px-3 py-1 text-xs font-semibold text-[var(--brand)]">
                    {doctor.sector}
                  </span>
                  <h2 className="mt-3 text-2xl font-bold">{doctor.title}</h2>
                  <p className="mt-1 text-lg font-semibold text-[var(--brand)]">
                    {doctor.years_experience || 10} Years
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{doctor.location}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">{doctor.excerpt}</p>
                  <Link href={`/doctors/${doctor.slug}`} className="button button-secondary mt-4 w-full">
                    View profile
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
