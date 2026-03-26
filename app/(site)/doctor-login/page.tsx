import { redirect } from "next/navigation";
import { loginAction } from "@/app/dashboard/actions";
import { getSessionUser } from "@/lib/auth";

type Props = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export default async function DoctorLoginPage({ searchParams }: Props) {
  const query = await searchParams;
  const user = await getSessionUser();

  if (user) {
    redirect(query.next || "/dashboard/projects");
  }

  return (
    <main className="container flex min-h-[80vh] items-center justify-center py-10">
      <section className="card w-full max-w-md p-7">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">Doctor Access</p>
        <h1 className="mt-3 text-3xl font-extrabold">Doctor Login</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Enter your doctor email and password to continue to your dashboard.
        </p>

        {query.error === "1" ? (
          <p className="mt-3 rounded-lg bg-[#ffe9e9] p-3 text-sm text-[#8c1f1f]">
            Invalid email or password.
          </p>
        ) : null}

        <form action={loginAction} className="mt-5 grid gap-3">
          <input type="hidden" name="next" value={query.next || "/dashboard/projects"} />
          <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
            Email Address
            <input
              name="email"
              type="email"
              required
              placeholder="doctor@clinic.com"
              className="rounded-lg border border-[var(--line)] px-3 py-2"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
            Password
            <input
              name="password"
              type="password"
              required
              placeholder="Enter your password"
              className="rounded-lg border border-[var(--line)] px-3 py-2"
            />
          </label>
          <button className="button button-primary">Login</button>
        </form>
      </section>
    </main>
  );
}
