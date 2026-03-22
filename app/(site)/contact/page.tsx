import Image from "next/image";
import ContactFormToggle from "@/components/ContactFormToggle";

type Props = {
  searchParams: Promise<{ sent?: string }>;
};

export default async function ContactPage({ searchParams }: Props) {
  const query = await searchParams;

  return (
    <main className="container fade-up pb-16 pt-10">
      {/* Contact Info Section - Image Left, Text Right */}
      <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="overflow-hidden rounded-xl">
          <Image
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80"
            alt="Medical office"
            width={600}
            height={500}
            className="h-auto w-full object-cover"
          />
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#1f2937]">OUR OFFICE</h2>
          <div className="mt-4 space-y-3 text-[#4b5563]">
            <p>123 Main Street, Springfield</p>
            <p>IL 62704, United States</p>
            <p className="mt-4">Tel: +1 (555) 123-4567</p>
            <p>Email: contact@shmed.com</p>
          </div>
        </div>
      </section>

      {/* Contact Form Toggle Section */}
      <ContactFormToggle doctors={[]} showSuccess={query.sent === "1"} />
    </main>
  );
}
