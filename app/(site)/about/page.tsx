import Image from "next/image";
import { readData } from "@/lib/cms";

export default async function AboutPage() {
  const data = await readData();

  return (
    <main className="container fade-up pb-16">
      {/* Header */}
      <section className="py-8 text-center">
        <p className="text-sm font-medium tracking-widest text-[#6b7280]">ABOUT US</p>
      </section>

      {/* About Section - Image Left, Text Right */}
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

      {/* Why Choose Us Section */}
      <section className="mt-20">
        <h2 className="text-center text-2xl font-bold text-[#1f2937]">WHY CHOOSE US</h2>

        <div className="mt-10 grid gap-0 overflow-hidden rounded-xl border border-[#e5e7eb] md:grid-cols-3">
          {/* Efficiency */}
          <div className="border-b border-[#e5e7eb] p-10 transition hover:bg-[#5f6fff] hover:text-white md:border-b-0 md:border-r">
            <h3 className="text-lg font-bold">EFFICIENCY</h3>
            <p className="mt-4 text-sm leading-relaxed opacity-80">
              Streamlined appointment scheduling that fits into your busy lifestyle. Quick check-ins, minimal wait times, and efficient consultations.
            </p>
          </div>

          {/* Convenience */}
          <div className="border-b border-[#e5e7eb] p-10 transition hover:bg-[#5f6fff] hover:text-white md:border-b-0 md:border-r">
            <h3 className="text-lg font-bold">CONVENIENCE</h3>
            <p className="mt-4 text-sm leading-relaxed opacity-80">
              Access to a network of trusted healthcare professionals in your area. Book appointments online, anytime, from anywhere.
            </p>
          </div>

          {/* Personalization */}
          <div className="p-10 transition hover:bg-[#5f6fff] hover:text-white">
            <h3 className="text-lg font-bold">PERSONALIZATION</h3>
            <p className="mt-4 text-sm leading-relaxed opacity-80">
              Tailored recommendations and reminders to help you stay on top of your health. Your medical history and preferences always at hand.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
