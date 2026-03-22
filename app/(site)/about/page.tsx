import Image from "next/image";
import { readData } from "@/lib/cms";

export default async function AboutPage() {
  const data = await readData();

  return (
    <main className="container fade-up pb-16">
      <section className="py-8 text-center">
        <p className="text-sm font-medium tracking-widest text-[#6b7280]">ABOUT US</p>
      </section>

      <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="overflow-hidden rounded-xl">
          <Image
            src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=1200&q=80"
            alt="Medical team"
            width={600}
            height={500}
            className="h-auto w-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold text-[#1f2937]">{data.about.title}</h1>
          <p className="text-[#4b5563] leading-relaxed">
            {data.about.description}
          </p>
          <p className="text-[#4b5563] leading-relaxed">
            {data.about.mission}
          </p>

          <div className="pt-4">
            <h2 className="text-xl font-bold text-[#1f2937]">Our Vision</h2>
            <p className="mt-3 text-[#4b5563] leading-relaxed">
              {data.about.vision}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-center text-2xl font-bold text-[#1f2937]">WHY CHOOSE US</h2>
        <p className="mt-2 text-center text-sm text-[#6b7280]">
          The values and care principles that shape every patient experience
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.about.values.map((value, index) => (
            <article
              key={value}
              className="group overflow-hidden rounded-xl border border-[#e5e7eb] bg-white transition hover:shadow-lg"
            >
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-medium text-[#5f6fff]">
                    Core Value
                  </span>
                  <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-medium text-[#5f6fff]">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-[#1f2937] group-hover:text-[#5f6fff]">
                  {value}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#6b7280]">
                  {value === "Clinical excellence"
                    ? "We focus on dependable care standards, thoughtful treatment planning, and consistent patient outcomes."
                    : value === "Transparent operations"
                      ? "We build trust through clear communication, organized systems, and reliable coordination across every visit."
                      : "We invest in relationships that support sustainable growth, better care delivery, and lasting patient confidence."}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
