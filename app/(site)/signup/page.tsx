import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="container fade-up py-10">
      <section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <article className="card rounded-[28px] border border-[#dbe9ff] bg-[#f7fbff] p-8">
          <span className="inline-flex rounded-full border border-[#cfe0ff] bg-white px-4 py-1 text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand-deep)]">
            Why Join
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight">
            Create your account and keep every visit organized.
          </h1>
          <p className="mt-4 text-sm text-[var(--muted)]">
            Signing up makes repeat bookings easier and helps patients keep their medical scheduling in one place.
          </p>
          <div className="mt-8 space-y-3">
            <div className="rounded-2xl border border-[#d9e7ff] bg-white p-4 text-sm font-semibold text-[var(--brand-deep)]">
              Faster booking with saved details
            </div>
            <div className="rounded-2xl border border-[#d9e7ff] bg-white p-4 text-sm font-semibold text-[var(--brand-deep)]">
              View your appointment history
            </div>
            <div className="rounded-2xl border border-[#d9e7ff] bg-white p-4 text-sm font-semibold text-[var(--brand-deep)]">
              Submit trusted doctor reviews
            </div>
          </div>
        </article>

        <article className="card rounded-[28px] p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">New Patient</p>
            <h2 className="mt-3 text-3xl font-extrabold">Sign Up</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Start with a simple account so booking and follow-up become much easier.
            </p>
          </div>

          <form className="mt-8 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
              First Name
              <input
                type="text"
                placeholder="First name"
                className="h-12 rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 text-sm font-medium outline-none transition focus:border-[#9ec5ff] focus:bg-white"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
              Last Name
              <input
                type="text"
                placeholder="Last name"
                className="h-12 rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 text-sm font-medium outline-none transition focus:border-[#9ec5ff] focus:bg-white"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)] sm:col-span-2">
              Email Address
              <input
                type="email"
                placeholder="name@example.com"
                className="h-12 rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 text-sm font-medium outline-none transition focus:border-[#9ec5ff] focus:bg-white"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
              Phone Number
              <input
                type="tel"
                placeholder="+961 ..."
                className="h-12 rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 text-sm font-medium outline-none transition focus:border-[#9ec5ff] focus:bg-white"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
              Password
              <input
                type="password"
                placeholder="Create password"
                className="h-12 rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 text-sm font-medium outline-none transition focus:border-[#9ec5ff] focus:bg-white"
              />
            </label>

            <button type="submit" className="mt-2 inline-flex h-12 items-center justify-center rounded-2xl bg-[var(--brand)] px-6 text-sm font-semibold text-white transition hover:bg-[#1f68cb] sm:col-span-2">
              Create Account
            </button>
          </form>

          <p className="mt-5 text-sm text-[var(--muted)]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[var(--brand)]">
              Login here
            </Link>
          </p>
        </article>
      </section>
    </main>
  );
}
