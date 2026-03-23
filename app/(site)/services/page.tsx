import Image from "next/image";
import { getAllServices } from "@/lib/db";

export default async function ServicesPage() {
  const services = await getAllServices();
  const data = { services };

  return (
    <main className="container fade-up pb-16">
      <section className="rounded-[32px] border border-[#e5e7eb] bg-white p-8 shadow-sm md:p-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
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
        </div>

        <div className="mt-16">
          <h2 className="text-center text-2xl font-bold text-[#1f2937]">OUR SERVICES</h2>
          <p className="mt-2 text-center text-sm text-[#6b7280]">
            Practical support designed to improve care delivery and clinic operations
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.services.map((service) => (
              <article
                key={service.id}
                className="group overflow-hidden rounded-xl border border-[#e5e7eb] bg-white transition hover:shadow-lg"
              >
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-medium text-[#5f6fff]">
                      Service
                    </span>
                    <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-medium text-[#5f6fff]">
                      Care Support
                    </span>
                  </div>
                  <h2 className="mt-4 text-lg font-bold text-[#1f2937] group-hover:text-[#5f6fff]">
                    {service.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#6b7280]">
                    {service.summary}
                  </p>
                  <ul className="mt-4 list-disc pl-5 text-sm leading-relaxed text-[#6b7280]">
                    {service.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
