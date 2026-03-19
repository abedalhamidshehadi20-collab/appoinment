import Image from "next/image";
import { redirect } from "next/navigation";
import Link from "next/link";
import { readData } from "@/lib/cms";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectDetailsPage({ params }: Props) {
  const { slug } = await params;
  const data = await readData();
  const project = data.projects.find((item) => item.slug === slug);
  const suggestions = data.projects.filter((item) => item.slug !== slug).slice(0, 5);

  if (!project) {
    redirect("/doctors");
  }

  return (
    <main className="container fade-up pb-10">
      <section className="mt-4">
        <h1 className="text-4xl font-black text-[#111827]">Details</h1>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-[1.45fr_0.75fr]">
        <article className="rounded-xl border border-[#e4e9ef] bg-white p-4 md:p-5">
          <div className="grid gap-4 md:grid-cols-[300px_1fr]">
            <Image
              src={project.coverImage}
              alt={project.title}
              width={800}
              height={680}
              className="h-64 w-full rounded-lg object-cover"
            />

            <div className="pt-1">
              <h2 className="text-4xl font-black text-[#111827]">{project.title}</h2>
              <p className="mt-3 text-lg font-semibold text-[#374151]">{new Date().getFullYear() - 2008} Years of Experience</p>
              <p className="mt-2 text-lg text-[#4b5563]">{project.location}</p>

              <span className="mt-3 inline-block rounded-full bg-[#dbeafe] px-3 py-1 text-sm font-semibold text-[#1d4ed8]">
                {project.sector}
              </span>

              <div className="mt-4 flex items-center gap-2">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#ef4444] text-sm font-bold text-white">Y</span>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0a66c2] text-sm font-bold text-white">in</span>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#1d9bf0] text-sm font-bold text-white">x</span>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#1877f2] text-sm font-bold text-white">f</span>
              </div>

              <Link href="/appointments" className="button button-primary mt-5">
                Book Appointment
              </Link>
            </div>
          </div>
        </article>

        <aside className="rounded-xl border border-[#e4e9ef] bg-white p-4 md:p-5">
          <h3 className="text-3xl font-black text-[#111827]">Suggestions</h3>
          <div className="mt-4 grid gap-3">
            {suggestions.map((doctor) => (
              <Link
                key={doctor.id}
                href={`/doctors/${doctor.slug}`}
                className="rounded-lg border border-[#e8edf3] p-3 transition hover:border-[#c8dbf2]"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={doctor.coverImage}
                    alt={doctor.title}
                    width={72}
                    height={72}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div>
                    <span className="inline-block rounded-full bg-[#dbeafe] px-2 py-0.5 text-xs font-semibold text-[#1d4ed8]">
                      {doctor.sector}
                    </span>
                    <p className="mt-1 text-xl font-bold text-[#111827]">{doctor.title}</p>
                    <p className="text-sm font-semibold text-[#3b82f6]">{new Date().getFullYear() - 2012} Years</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </section>

      <section className="mt-5 rounded-xl border border-[#e4e9ef] bg-white p-5 md:p-6">
        <h3 className="text-4xl font-black text-[#111827]">About Me</h3>
        <p className="mt-3 text-lg leading-8 text-[#4b5563]">
          {project.description} {project.details.join(" ")} With a patient-first approach, every treatment
          plan is customized to the patient&apos;s symptoms, history, and lifestyle. The goal is to deliver
          clear diagnosis, practical care plans, and measurable recovery outcomes in a comfortable clinic
          environment.
        </p>
      </section>
    </main>
  );
}
