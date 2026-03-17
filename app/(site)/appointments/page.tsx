import Link from "next/link";
import { readData } from "@/lib/cms";

export default async function AppointmentsPage() {
  const data = await readData();

  return (
    <main className="container fade-up pb-8">
      <section className="card p-8 md:p-10">
        <h1 className="text-4xl font-extrabold">Appointments</h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          Select a doctor to submit your appointment request online.
        </p>
      </section>

      <section className="mt-6 grid-cards">
        {data.projects.map((doctor) => (
          <article key={doctor.id} className="card p-5">
            <p className="text-xs font-semibold uppercase text-[var(--accent)]">{doctor.sector}</p>
            <h2 className="mt-2 text-xl font-bold">{doctor.title}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{doctor.excerpt}</p>
            <p className="mt-2 text-sm text-[var(--brand-deep)]">{doctor.location}</p>
            <Link href={`/doctors/${doctor.slug}`} className="mt-4 inline-block text-sm font-semibold text-[var(--brand-deep)]">
              Book with this doctor
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
