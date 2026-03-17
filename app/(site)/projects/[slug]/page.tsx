import Image from "next/image";
import { notFound } from "next/navigation";
import { readData } from "@/lib/cms";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sent?: string }>;
};

export default async function ProjectDetailsPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;
  const data = await readData();
  const project = data.projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="container fade-up pb-8">
      <section className="card overflow-hidden">
        <Image
          src={project.coverImage}
          alt={project.title}
          width={1600}
          height={760}
          className="h-64 w-full object-cover md:h-80"
        />
        <div className="p-8">
          <p className="text-xs font-semibold uppercase text-[var(--accent)]">{project.status}</p>
          <h1 className="mt-2 text-4xl font-extrabold">{project.title}</h1>
          <p className="mt-4 text-[var(--muted)]">{project.description}</p>
          <div className="mt-5 grid gap-2 text-sm text-[var(--brand-deep)] md:grid-cols-3">
            <p><strong>Sector:</strong> {project.sector}</p>
            <p><strong>Location:</strong> {project.location}</p>
            <p><strong>Started:</strong> {new Date(project.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 md:grid-cols-[1.4fr_1fr]">
        <article className="card p-6">
          <h2 className="text-2xl font-bold">Project Highlights</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--muted)]">
            {project.details.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="card p-6">
          <h2 className="text-2xl font-bold">Submit Your Interest</h2>
          {query.sent === "1" ? (
            <p className="mt-3 rounded-lg bg-[#e8fff2] p-3 text-sm text-[#145f39]">
              Thank you. Your interest has been submitted.
            </p>
          ) : null}
          <form action={`/api/public/projects/${project.slug}/interest`} method="post" className="mt-4 grid gap-3 text-sm">
            <input required name="name" placeholder="Your name" className="rounded-lg border border-[var(--line)] px-3 py-2" />
            <input required type="email" name="email" placeholder="Work email" className="rounded-lg border border-[var(--line)] px-3 py-2" />
            <input name="phone" placeholder="Phone" className="rounded-lg border border-[var(--line)] px-3 py-2" />
            <input name="company" placeholder="Company" className="rounded-lg border border-[var(--line)] px-3 py-2" />
            <input name="budget" placeholder="Estimated budget" className="rounded-lg border border-[var(--line)] px-3 py-2" />
            <textarea name="message" placeholder="Project requirements" rows={4} className="rounded-lg border border-[var(--line)] px-3 py-2" />
            <button className="button button-primary">Send inquiry</button>
          </form>
        </article>
      </section>
    </main>
  );
}
