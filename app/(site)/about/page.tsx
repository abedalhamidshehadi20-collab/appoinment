import { readData } from "@/lib/cms";

export default async function AboutPage() {
  const data = await readData();

  return (
    <main className="container fade-up pb-8">
      <section className="card p-8 md:p-10">
        <h1 className="text-4xl font-extrabold">{data.about.title}</h1>
        <p className="mt-4 max-w-3xl text-[var(--muted)]">{data.about.description}</p>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="card p-6">
          <h2 className="text-2xl font-bold">Mission</h2>
          <p className="mt-3 text-[var(--muted)]">{data.about.mission}</p>
        </article>
        <article className="card p-6">
          <h2 className="text-2xl font-bold">Vision</h2>
          <p className="mt-3 text-[var(--muted)]">{data.about.vision}</p>
        </article>
      </section>

      <section className="card mt-6 p-6">
        <h2 className="text-2xl font-bold">Our Values</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {data.about.values.map((value) => (
            <div key={value} className="rounded-xl bg-[#f7fbfe] p-4 text-sm font-semibold text-[var(--brand-deep)]">
              {value}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
