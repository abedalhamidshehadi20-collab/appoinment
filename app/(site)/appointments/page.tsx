import { readData } from "@/lib/cms";

type Props = {
  searchParams: Promise<{ sent?: string }>;
};

export default async function AppointmentsPage({ searchParams }: Props) {
  const query = await searchParams;
  const data = await readData();

  return (
    <main className="fade-up bg-[linear-gradient(180deg,#eef3f9_0%,#f7f9fc_36%,#f7f9fc_100%)] pb-16">
      <section className="container mt-4">
        <div className="relative overflow-hidden rounded-xl bg-[#1f5ca8] py-4 text-white md:py-5">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1600&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#163d73]/80 to-[#2f6ab7]/70" />
          <div className="relative text-center">
            <h1 className="text-xl font-black md:text-3xl">Book Appointment</h1>
          </div>
        </div>
      </section>

      <section className="container -mt-10 md:-mt-14">
        <div className="rounded-2xl border border-[#dfe6ef] bg-white p-5 shadow-[0_24px_50px_-36px_rgba(15,23,42,0.55)] md:p-8 lg:p-10">
          <div className="grid gap-7 lg:grid-cols-[1.5fr_0.85fr]">
            <article className="rounded-xl border border-[#e7edf5] bg-[#fbfcfe] p-5 md:p-6">
              <h2 className="text-3xl font-black text-[#102a52] md:text-4xl">Book An Appointment</h2>
              <p className="mt-2 text-sm text-[#64748b] md:text-base">
                Share your concern and preferred time. Our care coordinator will confirm your visit.
              </p>

              {query.sent === "1" ? (
                <p className="mt-4 rounded-md bg-[#e8fff2] p-3 text-sm text-[#145f39]">
                  Appointment request sent successfully.
                </p>
              ) : null}

              <form action="/api/public/appointments" method="post" className="mt-6 grid gap-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="grid gap-1.5 text-sm font-semibold text-[#334155]">
                    Full Name *
                    <input
                      required
                      name="name"
                      placeholder="Enter your full name"
                      className="h-11 rounded-md border border-[#dbe3ee] bg-white px-3 text-sm font-normal outline-none transition focus:border-[#7ea8da] focus:ring-2 focus:ring-[#d8e7fa]"
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm font-semibold text-[#334155]">
                    Phone
                    <input
                      name="phone"
                      placeholder="+91"
                      className="h-11 rounded-md border border-[#dbe3ee] bg-white px-3 text-sm font-normal outline-none transition focus:border-[#7ea8da] focus:ring-2 focus:ring-[#d8e7fa]"
                    />
                  </label>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="grid gap-1.5 text-sm font-semibold text-[#334155]">
                    Email *
                    <input
                      required
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      className="h-11 rounded-md border border-[#dbe3ee] bg-white px-3 text-sm font-normal outline-none transition focus:border-[#7ea8da] focus:ring-2 focus:ring-[#d8e7fa]"
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm font-semibold text-[#334155]">
                    Location
                    <input
                      name="location"
                      placeholder="City or area"
                      className="h-11 rounded-md border border-[#dbe3ee] bg-white px-3 text-sm font-normal outline-none transition focus:border-[#7ea8da] focus:ring-2 focus:ring-[#d8e7fa]"
                    />
                  </label>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="grid gap-1.5 text-sm font-semibold text-[#334155]">
                    Required Service
                    <select
                      name="service"
                      className="h-11 rounded-md border border-[#dbe3ee] bg-white px-3 text-sm font-normal text-[#374151] outline-none transition focus:border-[#7ea8da] focus:ring-2 focus:ring-[#d8e7fa]"
                    >
                      <option value="General Consultation">General Consultation</option>
                      <option value="Dental Checkup">Dental Checkup</option>
                      <option value="ENT Care">ENT Care</option>
                      <option value="Neurology Visit">Neurology Visit</option>
                      <option value="Cardiology Visit">Cardiology Visit</option>
                    </select>
                  </label>

                  <label className="grid gap-1.5 text-sm font-semibold text-[#334155]">
                    Preferred Doctor
                    <select
                      name="doctorId"
                      className="h-11 rounded-md border border-[#dbe3ee] bg-white px-3 text-sm font-normal text-[#374151] outline-none transition focus:border-[#7ea8da] focus:ring-2 focus:ring-[#d8e7fa]"
                    >
                      <option value="">Choose doctor (optional)</option>
                      {data.projects.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.title}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="grid gap-1.5 text-sm font-semibold text-[#334155]">
                  Message
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="Briefly describe your symptoms or request"
                    className="rounded-md border border-[#dbe3ee] bg-white px-3 py-2 text-sm font-normal outline-none transition focus:border-[#7ea8da] focus:ring-2 focus:ring-[#d8e7fa]"
                  />
                </label>

                <div className="pt-2 text-center md:text-left">
                  <button className="rounded-md bg-[#183e73] px-7 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#14345f]">
                    Send Message
                  </button>
                  <p className="mt-3 text-xs text-[#94a3b8]">* These fields are required.</p>
                </div>
              </form>
            </article>

            <article className="rounded-xl border border-[#e3e8ef] bg-[linear-gradient(180deg,#f7fafe_0%,#f8fafc_100%)] p-5 md:p-6">
              <h3 className="text-3xl font-black text-[#102a52]">Visit Our Clinic</h3>

              <div className="mt-4 space-y-3 text-sm leading-6 text-[#475569]">
                <p>123 Main Street, Springfield, IL 62704 United States</p>
                <p>company@gmail.com</p>
                <p>+91 12345 67890</p>
              </div>

              <iframe
                title="Appointment location map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=72.48%2C23.00%2C72.68%2C23.14&layer=mapnik"
                className="mt-5 h-60 w-full rounded-md border border-[#dbe3ee]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
