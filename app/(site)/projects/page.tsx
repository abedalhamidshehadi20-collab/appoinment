import Link from "next/link";
import Image from "next/image";
import { readData } from "@/lib/cms";

export default async function ProjectsPage() {
  const data = await readData();

  return (
    <main className="container fade-up pb-8">
      <section className="card p-8 md:p-10">
        <h1 className="text-4xl font-extrabold">Projects</h1>
        <p className="mt-3 text-[var(--muted)]">Selected healthcare transformation initiatives.</p>
      </section>

      <section className="grid-cards mt-6">
        {data.projects.map((project) => (
          <article key={project.id} className="card overflow-hidden">
            <Image
              src={project.coverImage}
              alt={project.title}
              width={1200}
              height={520}
              className="h-44 w-full object-cover"
            />
            <div className="p-5">
              <p className="text-xs font-semibold uppercase text-[var(--accent)]">{project.sector}</p>
              <h2 className="mt-2 text-xl font-bold">{project.title}</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">{project.excerpt}</p>
              <Link href={`/projects/${project.slug}`} className="mt-4 inline-block text-sm font-semibold text-[var(--brand-deep)]">
                View details
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
