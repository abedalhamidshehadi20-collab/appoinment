"use client";

type Doctor = {
  id: string;
  title: string;
  sector: string;
};

type Props = {
  doctors: Doctor[];
  showSuccess: boolean;
};

export default function AppointmentForm({ doctors, showSuccess }: Props) {
  return (
    <article className="card rounded-[28px] p-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">Appointment Form</p>
        <h2 className="mt-3 text-3xl font-extrabold">Book An Appointment</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Share your concern and preferred time. Our care coordinator will confirm your visit.
        </p>
      </div>

      {showSuccess ? (
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
              {doctors.map((doctor) => (
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
        <button
          type="submit"
          className="mt-1 inline-flex h-12 items-center justify-center rounded-2xl bg-[var(--brand)] px-6 text-sm font-semibold text-white transition hover:bg-[#1f68cb]"
        >
          Send Message
        </button>
      </form>
    </article>
  );
}
