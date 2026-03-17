import { readData } from "@/lib/cms";

export default async function ServicesPage() {
  const data = await readData();

  return (
    <main className="container fade-up pb-8">
      <section className="card p-8 md:p-10">
        <h1 className="text-4xl font-extrabold">Services</h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          End-to-end healthcare operations support for emerging and enterprise clinic networks.
        </p>
      </section>

      <section className="grid-cards mt-6">
        {data.services.map((service) => (
          <article key={service.id} className="card p-6">
            <h2 className="text-2xl font-bold">{service.title}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{service.summary}</p>
            <ul className="mt-4 list-disc pl-5 text-sm text-[var(--brand-deep)]">
              {service.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </main>
  );
}
