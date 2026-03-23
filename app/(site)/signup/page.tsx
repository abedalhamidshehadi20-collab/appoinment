import Link from "next/link";
import { redirect } from "next/navigation";
import { patientSignupAction } from "../auth-actions";
import { getPatientSession } from "@/lib/patient-auth";

type Props = {
  searchParams: Promise<{ error?: string; exists?: string; config?: string }>;
};

export default async function SignupPage({ searchParams }: Props) {
  const query = await searchParams;
  const patient = await getPatientSession();

  if (patient) {
    redirect("/");
  }

  return (
    <main className="container fade-up py-10">
      <section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <article className="card rounded-[28px] border border-[#dbe9ff] bg-white p-8">
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

        <article className="overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#1d4f91_0%,#2377e7_55%,#6fb3ff_100%)] p-8 text-white shadow-[0_24px_60px_-32px_rgba(29,79,145,0.65)]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/90">New Patient</p>
            <h2 className="mt-3 text-3xl font-extrabold">Sign Up</h2>
            <p className="mt-2 text-sm text-white/80">
              Start with a simple account so booking and follow-up become much easier.
            </p>
          </div>

          {query.error === "1" ? (
            <p className="mt-6 rounded-2xl border border-white/30 bg-white/12 p-4 text-sm font-medium text-white">
              Please complete the required fields to create your patient account.
            </p>
          ) : null}

          {query.exists === "1" ? (
            <p className="mt-6 rounded-2xl border border-white/30 bg-white/12 p-4 text-sm font-medium text-white">
              A patient account with this email already exists.
            </p>
          ) : null}

          {query.config === "1" ? (
            <p className="mt-6 rounded-2xl border border-[#ffd7a8] bg-[#fff4e5] p-4 text-sm font-medium text-[#7a4b00]">
              Patient signup is blocked by Supabase policies. Run
              <span className="font-semibold"> fix-patient-signup.sql</span> in Supabase SQL Editor or set
              <span className="font-semibold"> SUPABASE_SERVICE_ROLE_KEY</span> in your local environment, then restart the server.
            </p>
          ) : null}

          <form action={patientSignupAction} className="mt-8 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-white">
              First Name
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                className="h-12 rounded-2xl border border-white/20 bg-white/12 px-4 text-sm font-medium text-white placeholder:text-white/65 outline-none transition focus:border-white/40 focus:bg-white/18"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-white">
              Last Name
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                className="h-12 rounded-2xl border border-white/20 bg-white/12 px-4 text-sm font-medium text-white placeholder:text-white/65 outline-none transition focus:border-white/40 focus:bg-white/18"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-white sm:col-span-2">
              Email Address
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                className="h-12 rounded-2xl border border-white/20 bg-white/12 px-4 text-sm font-medium text-white placeholder:text-white/65 outline-none transition focus:border-white/40 focus:bg-white/18"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-white">
              Phone Number
              <input
                type="tel"
                name="phone"
                placeholder="+961 ..."
                className="h-12 rounded-2xl border border-white/20 bg-white/12 px-4 text-sm font-medium text-white placeholder:text-white/65 outline-none transition focus:border-white/40 focus:bg-white/18"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-white">
              Password
              <input
                type="password"
                name="password"
                placeholder="Create password"
                className="h-12 rounded-2xl border border-white/20 bg-white/12 px-4 text-sm font-medium text-white placeholder:text-white/65 outline-none transition focus:border-white/40 focus:bg-white/18"
              />
            </label>

            <button type="submit" className="mt-2 inline-flex h-12 items-center justify-center rounded-2xl bg-white px-6 text-sm font-semibold text-[var(--brand-deep)] transition hover:bg-[#eef5ff] sm:col-span-2">
              Create Account
            </button>
          </form>

          <p className="mt-5 text-sm text-white/80">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-white">
              Login here
            </Link>
          </p>
        </article>
      </section>
    </main>
  );
}
