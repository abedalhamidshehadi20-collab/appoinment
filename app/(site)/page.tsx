import Link from "next/link";
import Image from "next/image";
import { getAllDoctors, getSiteSettings, getFeaturedSpecialties } from "@/lib/db";
import PopularDoctorsFilter from "@/components/site/PopularDoctorsFilter";
import { type DoctorListItem } from "@/components/site/DoctorsList";
import { type FilterSpecialtyItem } from "@/components/site/SpecialtyCards";
import { getSpecialtyItems } from "@/components/site/specialties";
import { getPatientSession } from "@/lib/patient-auth";
import { getSafeDoctorImageSrc } from "@/lib/image";
import { getDoctorSpecialty, normalizeSpecialtyLabel } from "@/lib/doctor-specialties";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function HomePage({ searchParams }: Props) {
  const [doctors, settings, specialtiesData] = await Promise.all([
    getAllDoctors(),
    getSiteSettings(),
    getFeaturedSpecialties().catch(() => null)
  ]);
  const patient = await getPatientSession();
  const query = (await searchParams).q?.trim().toLowerCase() ?? "";
  const filteredDoctors = query
    ? doctors.filter((doctor) => {
        const haystack = `${doctor.title} ${doctor.sector} ${doctor.location} ${doctor.excerpt}`.toLowerCase();
        return haystack.includes(query);
      })
    : doctors;

  const popularDoctors: DoctorListItem[] = filteredDoctors.map((doctor) => ({
    id: doctor.id,
    slug: doctor.slug,
    name: doctor.title,
    specialty: getDoctorSpecialty(doctor),
    status: doctor.status?.trim() || "Available",
    image: getSafeDoctorImageSrc(doctor.cover_image),
    bio: doctor.excerpt,
    location: doctor.location,
  }));

  const homepageSpecialties = getSpecialtyItems(specialtiesData, true);
  const filterSpecialties = homepageSpecialties.reduce<FilterSpecialtyItem[]>((items, item) => {
    const normalizedLabel = normalizeSpecialtyLabel(item.label);
    const value = normalizedLabel || item.label.trim();

    if (!value || items.some((existingItem) => existingItem.value.toLowerCase() === value.toLowerCase())) {
      return items;
    }

    items.push({
      ...item,
      label: normalizedLabel || item.label,
      value,
    });

    return items;
  }, []);

  return (
    <main className="container fade-up pb-8">
      <section className="rounded-[32px] border border-[#e5e7eb] bg-white p-8 shadow-sm md:p-10">
        <div className="grid items-center gap-8 md:grid-cols-2 md:py-2">
          <div>
            <h1 className="max-w-xl text-4xl font-extrabold leading-tight md:text-6xl">
              Find &amp; Book <span className="text-[var(--brand)]">Appointment</span> with your Fav <span className="text-[var(--brand)]">Doctors</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-[var(--muted)]">
              Search your doctor and request your appointment in one click. Fast, secure, and easy for every patient.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/doctors" className="button button-primary">
                Explore Now
              </Link>
              <Link
                href={patient ? "/appointments" : "/login?next=%2Fappointments"}
                className="button button-secondary"
              >
                Book Appointment
              </Link>
            </div>
          </div>
          <div className="card overflow-hidden p-2">
            <Image
              src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80"
              alt="Medical team"
              width={1200}
              height={900}
              className="h-[420px] w-full rounded-lg object-cover"
              priority
            />
          </div>
        </div>

        <div className="mt-16 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--brand-deep)]">
            Browse By Specialty
          </span>
          <h2 className="mt-3 text-4xl font-extrabold">
            Search <span className="text-[var(--brand)]">Doctors</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-[var(--muted)]">
            Choose a care category first, then move into doctors with a cleaner and more guided booking flow.
          </p>

          <form action="/" method="get" className="mx-auto mt-5 flex w-full max-w-md gap-2">
            <input
              name="q"
              defaultValue={query}
              placeholder="Search..."
              className="h-11 flex-1 rounded-lg border border-[var(--line)] bg-white px-3 text-sm"
            />
            <button className="button button-primary h-11 px-5">Search</button>
          </form>
        </div>

        <div className="mt-8">
          <PopularDoctorsFilter
            specialties={filterSpecialties}
            doctors={popularDoctors}
            defaultEmptyMessage={query ? "No doctors found for your search." : "No doctors found."}
          />
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {settings.home.stats.map((stat) => (
            <article
              key={stat.label}
              className="group overflow-hidden rounded-[22px] border border-[var(--line)] bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] p-5 text-center shadow-[0_12px_28px_-24px_rgba(17,24,39,0.28)] transition-all duration-200 hover:-translate-y-1 hover:border-[#c7ddff] hover:shadow-[0_18px_30px_-22px_rgba(17,24,39,0.22)]"
            >
              <p className="text-3xl font-black text-[var(--brand)] transition-colors duration-200 group-hover:text-[var(--brand-deep)]">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--muted)] transition-colors duration-200 group-hover:text-[var(--brand-deep)]">
                {stat.label}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
