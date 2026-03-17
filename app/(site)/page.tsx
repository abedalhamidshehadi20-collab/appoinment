import Link from "next/link";
import Image from "next/image";
import { readData } from "@/lib/cms";

export default async function HomePage() {
  const data = await readData();

  return (
    <main className="container fade-up pb-8">
      <section className="card mt-2 grid gap-8 p-7 md:grid-cols-[1.5fr_1fr] md:p-10">
        <div>
          <p className="mb-3 inline-block rounded-full bg-[#daf3ff] px-3 py-1 text-xs font-semibold text-[var(--brand-deep)]">
            Clinic Management Agency
          </p>
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
            {data.home.headline}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
            {data.home.subheadline}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={data.home.primaryCtaLink} className="button button-primary">
              {data.home.primaryCtaText}
            </Link>
            <Link
              href={data.home.secondaryCtaLink}
              className="button button-secondary"
            >
              {data.home.secondaryCtaText}
            </Link>
          </div>
        </div>
        <div className="grid gap-3">
          {data.home.stats.map((stat) => (
            <article key={stat.label} className="card bg-[#f8fdff] p-4">
              <p className="text-3xl font-black text-[var(--brand-deep)]">{stat.value}</p>
              <p className="text-sm text-[var(--muted)]">{stat.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-2xl font-extrabold">Featured Doctors</h2>
          <Link href="/doctors" className="text-sm font-semibold text-[var(--brand-deep)]">
            View all
          </Link>
        </div>
        <div className="grid-cards">
          {data.projects.slice(0, 3).map((project) => (
            <article key={project.id} className="card overflow-hidden">
              <Image
                src={project.coverImage}
                alt={project.title}
                width={1200}
                height={520}
                className="h-44 w-full object-cover"
              />
              <div className="p-4">
                <p className="text-xs font-semibold uppercase text-[var(--accent)]">{project.status}</p>
                <h3 className="mt-2 text-xl font-bold">{project.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{project.excerpt}</p>
                <Link
                  href={`/doctors/${project.slug}`}
                  className="mt-4 inline-block text-sm font-semibold text-[var(--brand-deep)]"
                >
                  View profile
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}