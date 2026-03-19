import { readData } from "@/lib/cms";

type Props = {
  searchParams: Promise<{ sent?: string }>;
};

export default async function AppointmentsPage({ searchParams }: Props) {
  const query = await searchParams;
  const data = await readData();

  return (
    <main className="container fade-up py-10">
      <section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.02fr_0.98fr]">
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
            <p>123 Main Street, Springfield, IL 62704 United States</p>
            <p>company@gmail.com</p>
            <p>+91 12345 67890</p>
          </div>

          <iframe
            title="Appointment location map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=72.48%2C23.00%2C72.68%2C23.14&layer=mapnik"
            className="mt-5 h-56 w-full rounded-2xl border border-white/18 bg-white"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </article>

        <article className="card rounded-[28px] p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">Appointment Form</p>
            <h2 className="mt-3 text-3xl font-extrabold">Book An Appointment</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Share your concern and preferred time. Our care coordinator will confirm your visit.
            </p>
          </div>

          {query.sent === "1" ? (
            <p className="mt-6 rounded-2xl border border-[#bde5cb] bg-[#ecfff3] p-4 text-sm font-medium text-[#145f39]">
              Appointment request sent successfully.
            </p>
          ) : null}

          <form action="/api/public/appointments" method="post" className="mt-8 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
                Full Name
                <input
                  required
                  name="name"
                  placeholder="Enter your full name"
                  className="h-12 rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 text-sm font-medium outline-none transition focus:border-[#9ec5ff] focus:bg-white"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
                Phone
                <input
                  name="phone"
                  placeholder="+91"
                  className="h-12 rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 text-sm font-medium outline-none transition focus:border-[#9ec5ff] focus:bg-white"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
                Email Address
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="h-12 rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 text-sm font-medium outline-none transition focus:border-[#9ec5ff] focus:bg-white"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
                Location
                <input
                  name="location"
                  placeholder="City or area"
                  className="h-12 rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 text-sm font-medium outline-none transition focus:border-[#9ec5ff] focus:bg-white"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
                Required Service
                <select
                  name="service"
                  className="h-12 rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 text-sm font-medium text-[#374151] outline-none transition focus:border-[#9ec5ff] focus:bg-white"
                >
                  <option value="General Consultation">General Consultation</option>
                  <option value="Dental Checkup">Dental Checkup</option>
                  <option value="ENT Care">ENT Care</option>
                  <option value="Neurology Visit">Neurology Visit</option>
                  <option value="Cardiology Visit">Cardiology Visit</option>
                </select>
              </label>

              <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
                Preferred Doctor
                <select
                  name="doctorId"
                  className="h-12 rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 text-sm font-medium text-[#374151] outline-none transition focus:border-[#9ec5ff] focus:bg-white"
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

            <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
              Message
              <textarea
                name="message"
                rows={5}
                placeholder="Briefly describe your symptoms or request"
                className="rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 py-3 text-sm font-medium outline-none transition focus:border-[#9ec5ff] focus:bg-white"
              />
            </label>

            <p className="text-center text-xs text-[var(--muted)]">* These fields are required.</p>
            <button className="mt-1 inline-flex h-12 items-center justify-center rounded-2xl bg-[var(--brand)] px-6 text-sm font-semibold text-white transition hover:bg-[#1f68cb]">
              Send Message
            </button>
          </form>
        </article>
      </section>
    </main>
  );
}
