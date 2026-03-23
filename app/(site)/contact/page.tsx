import Image from "next/image";
import ContactFormToggle from "@/components/ContactFormToggle";
import { getPatientSession } from "@/lib/patient-auth";
import { getAllDoctors, getSiteSettings } from "@/lib/db";

type Props = {
  searchParams: Promise<{ sent?: string }>;
};

export default async function ContactPage({ searchParams }: Props) {
  const query = await searchParams;
  const [patient, doctors, settings] = await Promise.all([
    getPatientSession(),
    getAllDoctors(),
    getSiteSettings()
  ]);

  const contactInfo = settings.contact || {
    address: "123 Main Street, Springfield",
    city: "IL 62704, United States",
    phone: "+1 (555) 123-4567",
    email: "contact@shmed.com"
  };

  return (
    <main className="container fade-up pb-16 pt-10">
      <section className="rounded-[32px] border border-[#e5e7eb] bg-white p-8 shadow-sm md:p-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
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
              <p>{contactInfo.address}</p>
              <p>{contactInfo.city}</p>
              <p className="mt-4">Tel: {contactInfo.phone}</p>
              <p>Email: {contactInfo.email}</p>
            </div>
          </div>
        </div>

        <ContactFormToggle doctors={doctors} showSuccess={query.sent === "1"} isPatientLoggedIn={Boolean(patient)} />
      </section>
    </main>
  );
}
