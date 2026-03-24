import Link from "next/link";
import Image from "next/image";
import { getAllDoctors } from "@/lib/db";
import { getSafeDoctorImageSrc } from "@/lib/image";

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
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
                <Image
                  src={getSafeDoctorImageSrc(doctor.cover_image)}
                  alt={doctor.title}
                  fill
                  className="object-cover object-top transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase text-[var(--accent)]">{doctor.sector}</p>
                <h2 className="mt-2 text-xl font-bold">{doctor.title}</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">{doctor.excerpt}</p>

                {/* Availability Badge */}
                {doctor.status && (
                  <p className="mt-2 flex items-center gap-1 text-sm font-medium">
                    <span className={`inline-block h-2 w-2 rounded-full ${
                      doctor.status.toLowerCase() === 'available'
                        ? 'bg-[#10b981]'
                        : doctor.status.toLowerCase() === 'unavailable'
                        ? 'bg-[#ef4444]'
                        : doctor.status.toLowerCase() === 'on leave'
                        ? 'bg-[#f59e0b]'
                        : 'bg-[#6b7280]'
                    }`}></span>
                    <span className={
                      doctor.status.toLowerCase() === 'available'
                        ? 'text-[#10b981]'
                        : doctor.status.toLowerCase() === 'unavailable'
                        ? 'text-[#ef4444]'
                        : doctor.status.toLowerCase() === 'on leave'
                        ? 'text-[#f59e0b]'
                        : 'text-[#6b7280]'
                    }>
                      {doctor.status}
                    </span>
                  </p>
                )}

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
