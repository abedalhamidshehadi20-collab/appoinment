import Image from "next/image";
import Link from "next/link";
import { SpecialtyLink, getSpecialtyItems, defaultAllSpecialties } from "@/components/site/specialties";
import { getAllDoctors, getAllSpecialties } from "@/lib/db";
import { getSafeDoctorImageSrc } from "@/lib/image";

type Props = {
  params: Promise<{ specialty: string }>;
  searchParams: Promise<{ q?: string }>;
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

export default async function SpecialtySearchPage({ params, searchParams }: Props) {
  const { specialty } = await params;
  const selectedSpecialty = decodeSpecialty(specialty);
  const query = (await searchParams).q?.trim().toLowerCase() ?? "";
  const [allDoctors, specialtiesData] = await Promise.all([
    getAllDoctors(),
    getAllSpecialties().catch(() => null)
  ]);

  const allSpecialties = getSpecialtyItems(specialtiesData, false);

  const selectedKeywords = categoryKeywords[selectedSpecialty] ?? [selectedSpecialty.toLowerCase()];
  const selectedSectorAliases = specialtySectorAliases[selectedSpecialty] ?? [selectedSpecialty];

  const doctorsBySpecialty = allDoctors.filter((doctor) => {
    const haystack = `${doctor.sector} ${doctor.title} ${doctor.excerpt}`.toLowerCase();
    const sector = doctor.sector.toLowerCase();

    return (
      selectedSectorAliases.some((alias) => sector === alias.toLowerCase()) ||
      selectedKeywords.some((keyword) => haystack.includes(keyword))
    );
  });

  const doctors = doctorsBySpecialty.filter((doctor) => {
    if (!query) {
      return true;
    }
    const haystack = `${doctor.title} ${doctor.sector} ${doctor.location} ${doctor.excerpt}`.toLowerCase();
    return haystack.includes(query);
  });

  return (
    <main className="container fade-up pb-10">
      <section className="grid gap-6 md:grid-cols-[260px_1fr]">
        <aside className="card h-fit p-4">
          <div className="rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm text-[var(--muted)]">
            Type a command or search
          </div>

          <p className="mt-4 text-sm font-bold text-[var(--brand-deep)]">Suggestions</p>
          <nav className="mt-2 grid gap-1">
            {allSpecialties.map((item) => (
              <SpecialtyLink key={item.label} item={item} active={item.label === selectedSpecialty} />
            ))}
          </nav>
        </aside>

        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <h1 className="text-4xl font-extrabold">{selectedSpecialty}</h1>
            <form method="get" className="flex gap-2">
              <input
                name="q"
                defaultValue={query}
                placeholder="Search doctors"
                className="h-10 rounded-lg border border-[var(--line)] bg-white px-3 text-sm"
              />
              <button className="button button-primary h-10 px-4 text-sm">Search</button>
            </form>
          </div>

          {doctors.length === 0 ? (
            <article className="card p-6 text-sm text-[var(--muted)]">No doctors found for this specialty.</article>
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
                  <p className="mt-1 text-lg font-semibold text-[var(--brand)]">{doctor.years_experience || 10} Years</p>
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
