import Link from "next/link";
import Image from "next/image";
import { readData } from "@/lib/cms";
import { homepageSpecialties, SpecialtyLink } from "@/components/site/specialties";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function HomePage({ searchParams }: Props) {
  const data = await readData();
  const query = (await searchParams).q?.trim().toLowerCase() ?? "";
  const filteredDoctors = query
    ? data.projects.filter((doctor) => {
        const haystack = `${doctor.title} ${doctor.sector} ${doctor.location} ${doctor.excerpt}`.toLowerCase();
        return haystack.includes(query);
      })
    : data.projects;

  const popularDoctors = filteredDoctors.slice(0, 4);

  return (
    <main className="container fade-up pb-8">
      <section className="grid items-center gap-8 py-8 md:grid-cols-2 md:py-12">
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
            <Link href="/appointments" className="button button-secondary">
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
      </section>

      <section className="mt-10 text-center">
        <h2 className="text-4xl font-extrabold">
          Search <span className="text-[var(--brand)]">Doctors</span>
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-lg text-[var(--muted)]">
          Search your doctor and book appointment in one click.
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
      </section>

      <section className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {homepageSpecialties.map((item) => (
          <article key={item.label} className="card px-3 py-3 text-center">
            <SpecialtyLink item={item} />
          </article>
        ))}
      </section>

      <section className="mt-10">
        <h3 className="text-3xl font-extrabold">Popular Doctors</h3>
      </section>

      <section className="mt-5">
        {popularDoctors.length === 0 ? (
          <article className="card p-6 text-sm text-[var(--muted)]">No doctors found for your search.</article>
        ) : null}
        <div className="grid-cards">
          {popularDoctors.map((project) => (
            <article key={project.id} className="card overflow-hidden">
              <Image
                src={project.coverImage}
                alt={project.title}
                width={1200}
                height={520}
                className="h-52 w-full object-cover"
              />
              <div className="p-4">
                <p className="text-xs font-semibold uppercase text-[var(--brand)]">{project.sector}</p>
                <h3 className="mt-2 text-xl font-bold">{project.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{project.excerpt}</p>
                <p className="mt-2 text-xs font-semibold text-[var(--brand-deep)]">{project.location}</p>
                <Link
                  href={`/doctors/${project.slug}`}
                  className="mt-4 inline-block text-sm font-semibold text-[var(--brand-deep)]"
                >
                  Book now
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {data.home.stats.map((stat) => (
          <article key={stat.label} className="card p-5 text-center">
            <p className="text-3xl font-black text-[var(--brand)]">{stat.value}</p>
            <p className="mt-1 text-sm font-semibold text-[var(--muted)]">{stat.label}</p>
          </article>
        ))}
      </section>
    </main>
  );
}