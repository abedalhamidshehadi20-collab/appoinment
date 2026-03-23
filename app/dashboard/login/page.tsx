import { redirect } from "next/navigation";
import { loginAction } from "../actions";
import { getSessionUser } from "@/lib/auth";

type Props = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export default async function DashboardLoginPage({ searchParams }: Props) {
  const query = await searchParams;
  const user = await getSessionUser();

  if (user) {
    redirect(query.next || "/");
  }

  return (
    <main className="container flex min-h-[80vh] items-center justify-center py-10">
      <section className="card w-full max-w-md p-7">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">Admin Access</p>
        <h1 className="mt-3 text-3xl font-extrabold">Admin Login</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Enter your email and password to continue to the admin dashboard.</p>

        {query.error === "1" ? (
          <p className="mt-3 rounded-lg bg-[#ffe9e9] p-3 text-sm text-[#8c1f1f]">
            Invalid email or password.
          </p>
        ) : null}

        <form action={loginAction} className="mt-5 grid gap-3">
          <input type="hidden" name="next" value={query.next || "/"} />
          <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
            Email Address
            <input name="email" type="email" required placeholder="admin@shmed.com" className="rounded-lg border border-[var(--line)] px-3 py-2" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
            Password
            <input name="password" type="password" required placeholder="Enter your password" className="rounded-lg border border-[var(--line)] px-3 py-2" />
          </label>
          <button className="button button-primary">Login</button>
        </form>

        <div className="mt-4 rounded-lg bg-[#f6fbff] p-3 text-xs text-[var(--muted)]">
          <p>Admin: admin@shmed.com / admin123</p>
          <p>Editor: blogger@shmed.com / blog123</p>
        </div>
      </section>
    </main>
  );
}
