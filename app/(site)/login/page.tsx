import Link from "next/link";
import { redirect } from "next/navigation";
import { patientLoginAction } from "../auth-actions";
import { getPatientSession } from "@/lib/patient-auth";

type Props = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const query = await searchParams;
  const patient = await getPatientSession();

  if (patient) {
    redirect(query.next || "/");
  }

  return (
    <main className="container fade-up py-10">
      <section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#1d4f91_0%,#2377e7_55%,#6fb3ff_100%)] p-8 text-white shadow-[0_24px_60px_-32px_rgba(29,79,145,0.65)]">
          <span className="inline-flex rounded-full border border-white/20 bg-white/12 px-4 py-1 text-xs font-bold uppercase tracking-[0.24em]">
            Welcome Back
          </span>
          <h1 className="mt-5 max-w-md text-4xl font-extrabold leading-tight">
            Sign in to manage your appointments faster.
          </h1>
          <p className="mt-4 max-w-lg text-sm text-white/80">
            Keep your profile, booking details, and future doctor visits in one simple place.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-white/90 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/18 bg-white/10 p-4">
              Track upcoming appointments
            </div>
            <div className="rounded-2xl border border-white/18 bg-white/10 p-4">
              Save your patient details
            </div>
            <div className="rounded-2xl border border-white/18 bg-white/10 p-4">
              Rate doctors after visits
            </div>
            <div className="rounded-2xl border border-white/18 bg-white/10 p-4">
              Rebook in fewer steps
            </div>
          </div>
        </article>

        <article className="card rounded-[28px] p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">Client Login</p>
            <h2 className="mt-3 text-3xl font-extrabold">Login</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Enter your email and password to continue to your patient account.
            </p>
          </div>

          {query.error === "1" ? (
            <p className="mt-6 rounded-2xl border border-[#ffd1d1] bg-[#fff0f0] p-4 text-sm font-medium text-[#9b1c1c]">
              Invalid patient email or password.
            </p>
          ) : null}

          <form action={patientLoginAction} className="mt-8 grid gap-4">
            <input type="hidden" name="next" value={query.next || "/"} />
            <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
              Email Address
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                className="h-12 rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 text-sm font-medium outline-none transition focus:border-[#9ec5ff] focus:bg-white"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
              Password
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="h-12 rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 text-sm font-medium outline-none transition focus:border-[#9ec5ff] focus:bg-white"
              />
            </label>

            <button type="submit" className="mt-2 inline-flex h-12 items-center justify-center rounded-2xl bg-[var(--brand)] px-6 text-sm font-semibold text-white transition hover:bg-[#1f68cb]">
              Login
            </button>
          </form>

          <p className="mt-5 text-sm text-[var(--muted)]">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-[var(--brand)]">
              Create one
            </Link>
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Admin login?{" "}
            <Link href="/dashboard/login?next=/" className="font-semibold text-[var(--brand)]">
              Click here
            </Link>
          </p>
        </article>
      </section>
    </main>
  );
}
