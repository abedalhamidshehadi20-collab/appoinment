import { getAllDoctors, getAllServices, getSiteSettings } from "@/lib/db";
import AppointmentForm from "@/components/AppointmentForm";
import { requirePatient } from "@/lib/patient-auth";

type Props = {
  searchParams: Promise<{ sent?: string; doctor?: string; date?: string; time?: string }>;
};

export default async function AppointmentsPage({ searchParams }: Props) {
  const query = await searchParams;
  await requirePatient("/appointments");
  const [doctors, services, settings] = await Promise.all([
    getAllDoctors(),
    getAllServices(),
    getSiteSettings()
  ]);

  const contactInfo = settings.contact || {
    address: "123 Main Street, Springfield",
    city: "IL 62704, United States",
    email: "contact@shmed.com",
    phone: "+1 (555) 123-4567",
    mapUrl: "https://www.openstreetmap.org/export/embed.html?bbox=72.48%2C23.00%2C72.68%2C23.14&layer=mapnik"
  };

  return (
    <main className="container fade-up py-10">
      <section className="mx-auto max-w-6xl rounded-[32px] border border-[#e5e7eb] bg-white p-8 shadow-sm md:p-10">
        <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <article className="overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#1d4f91_0%,#2377e7_55%,#6fb3ff_100%)] p-8 text-white shadow-[0_24px_60px_-32px_rgba(29,79,145,0.65)]">
            <h1 className="text-4xl font-extrabold leading-tight">
              Visit Our Clinic
            </h1>

            <div className="mt-8 grid gap-3 text-sm text-white/90 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/18 bg-white/10 p-4">
                Fast appointment confirmation
              </div>
              <div className="rounded-2xl border border-white/18 bg-white/10 p-4">
                Guidance to the right doctor
              </div>
              <div className="rounded-2xl border border-white/18 bg-white/10 p-4">
                Easy follow-up coordination
              </div>
              <div className="rounded-2xl border border-white/18 bg-white/10 p-4">
                Friendly clinic support
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm leading-7 text-white/90">
              <p>{contactInfo.address}, {contactInfo.city}</p>
              <p>{contactInfo.email}</p>
              <p>{contactInfo.phone}</p>
            </div>

            <iframe
              title="Appointment location map"
              src={contactInfo.mapUrl}
              className="mt-5 h-56 w-full rounded-2xl border border-white/18 bg-white"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </article>

          <AppointmentForm
            doctors={doctors}
            services={services}
            showSuccess={query.sent === "1"}
            preselectedDoctor={query.doctor}
            preselectedDate={query.date}
            preselectedTime={query.time}
          />
        </div>
      </section>
    </main>
  );
}
