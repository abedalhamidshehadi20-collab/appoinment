import Link from "next/link";
import Image from "next/image";
import { getAllDoctors } from "@/lib/db";

export default async function ProjectsPage() {
  const doctors = await getAllDoctors();

  return (
    <main className="container fade-up pb-16">
      <section className="rounded-[32px] border border-[#e5e7eb] bg-white p-8 shadow-sm md:p-10">
        <div>
          <h1 className="text-4xl font-extrabold">Doctors</h1>
          <p className="mt-3 text-[var(--muted)]">Meet our medical specialists and book your appointment.</p>
        </div>

        <div className="grid-cards mt-6">
          {doctors.map((doctor) => (
            <article key={doctor.id} className="card overflow-hidden">
              <Image
                src={doctor.cover_image}
                alt={doctor.title}
                width={1200}
                height={520}
                className="h-44 w-full object-cover"
              />
              <div className="p-5">
                <p className="text-xs font-semibold uppercase text-[var(--accent)]">{doctor.sector}</p>
                <h2 className="mt-2 text-xl font-bold">{doctor.title}</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">{doctor.excerpt}</p>
                <Link href={`/doctors/${doctor.slug}`} className="mt-4 inline-block text-sm font-semibold text-[var(--brand-deep)]">
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
