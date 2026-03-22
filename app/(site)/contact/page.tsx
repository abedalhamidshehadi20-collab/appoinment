import Image from "next/image";

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

      {/* Contact Form Section */}
      <section className="mt-16 mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <article className="overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#1d4f91_0%,#2377e7_55%,#6fb3ff_100%)] p-8 text-white shadow-[0_24px_60px_-32px_rgba(29,79,145,0.65)]">
          <span className="inline-flex rounded-full border border-white/20 bg-white/12 px-4 py-1 text-xs font-bold uppercase tracking-[0.24em]">
            Contact Us
          </span>
          <h1 className="mt-5 max-w-md text-4xl font-extrabold leading-tight">
            Get in touch and let us help guide your next visit.
          </h1>
          <p className="mt-4 max-w-lg text-sm text-white/80">
            Reach out for appointments, questions, or support. Our team is here to help patients
            connect with the right care in a simple and friendly way.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-white/90 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/18 bg-white/10 p-4">
              Fast responses for patient questions
            </div>
            <div className="rounded-2xl border border-white/18 bg-white/10 p-4">
              Help with appointment requests
            </div>
            <div className="rounded-2xl border border-white/18 bg-white/10 p-4">
              Guidance to the right doctor
            </div>
            <div className="rounded-2xl border border-white/18 bg-white/10 p-4">
              Friendly support from our team
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/85">Stay Connected</p>
            <div className="mt-3 flex gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/18 bg-white/10 text-sm font-bold text-white">
                f
              </span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/18 bg-white/10 text-sm font-bold text-white">
                ig
              </span>
            </div>
          </div>
        </article>

        <article className="card rounded-[28px] p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">Contact Form</p>
            <h2 className="mt-3 text-3xl font-extrabold">Leave Us Your Info</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Fill out the form and we will get back to you as soon as possible.
            </p>
          </div>

          {query.sent === "1" ? (
            <p className="mt-6 rounded-2xl border border-[#bde5cb] bg-[#ecfff3] p-4 text-sm font-medium text-[#145f39]">
              Your message has been sent successfully.
            </p>
          ) : null}

          <form action="/api/public/contact" method="post" className="mt-8 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
                Full Name
                <input
                  required
                  name="name"
                  placeholder="Full name"
                  className="h-12 rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 text-sm font-medium outline-none transition focus:border-[#9ec5ff] focus:bg-white"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
                Phone Number
                <input
                  name="phone"
                  placeholder="+1"
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
                  placeholder="name@example.com"
                  className="h-12 rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 text-sm font-medium outline-none transition focus:border-[#9ec5ff] focus:bg-white"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
                Subject
                <input
                  name="subject"
                  placeholder="Subject"
                  className="h-12 rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 text-sm font-medium outline-none transition focus:border-[#9ec5ff] focus:bg-white"
                />
              </label>
            </div>

            <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
              Message
              <textarea
                required
                name="message"
                rows={5}
                placeholder="Write your message"
                className="rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 py-3 text-sm font-medium outline-none transition focus:border-[#9ec5ff] focus:bg-white"
              />
            </label>

            <p className="text-center text-xs text-[var(--muted)]">* These fields are required</p>
            <button className="mt-1 inline-flex h-12 items-center justify-center rounded-2xl bg-[var(--brand)] px-6 text-sm font-semibold text-white transition hover:bg-[#1f68cb]">
              Submit Now
            </button>
          </form>
        </article>
      </section>
    </main>
  );
}
