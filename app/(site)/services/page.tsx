import Image from "next/image";
import { readData } from "@/lib/cms";

export default async function ServicesPage() {
  const data = await readData();

  return (
    <main className="container fade-up pb-16">
      <section className="py-8 text-center">
        <p className="text-sm font-medium tracking-widest text-[#6b7280]">SERVICES</p>
      </section>

      <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="overflow-hidden rounded-xl">
          <Image
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80"
            alt="Healthcare services"
            width={600}
            height={500}
            className="h-auto w-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold text-[#1f2937]">Services</h1>
          <p className="text-[#4b5563] leading-relaxed">
            End-to-end healthcare operations support for emerging and enterprise clinic networks.
          </p>
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-center text-2xl font-bold text-[#1f2937]">OUR SERVICES</h2>

        <div className="mt-10 grid gap-0 overflow-hidden rounded-xl border border-[#e5e7eb] md:grid-cols-3">
          {data.services.map((service, index) => (
            <article
              key={service.id}
              className={`p-10 transition hover:bg-[#5f6fff] hover:text-white ${
                index < data.services.length - 1
                  ? "border-b border-[#e5e7eb] md:border-b-0 md:border-r"
                  : ""
              }`}
            >
              <h2 className="text-lg font-bold uppercase">{service.title}</h2>
              <p className="mt-4 text-sm leading-relaxed opacity-80">
                {service.summary}
              </p>
              <ul className="mt-4 list-disc pl-5 text-sm leading-relaxed opacity-80">
                {service.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
