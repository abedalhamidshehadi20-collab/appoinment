import { loginAction } from "../actions";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function DashboardLoginPage({ searchParams }: Props) {
  const query = await searchParams;

  return (
    <main className="container flex min-h-[80vh] items-center justify-center py-10">
      <section className="card w-full max-w-md p-7">
        <h1 className="text-3xl font-extrabold">Dashboard Login</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Use one of the seeded users to access the CMS.</p>

        {query.error === "1" ? (
          <p className="mt-3 rounded-lg bg-[#ffe9e9] p-3 text-sm text-[#8c1f1f]">
            Invalid username or password.
          </p>
        ) : null}

        <form action={loginAction} className="mt-5 grid gap-3">
          <input name="username" required placeholder="Username" className="rounded-lg border border-[var(--line)] px-3 py-2" />
          <input name="password" type="password" required placeholder="Password" className="rounded-lg border border-[var(--line)] px-3 py-2" />
          <button className="button button-primary">Login</button>
        </form>

        <div className="mt-4 rounded-lg bg-[#f6fbff] p-3 text-xs text-[var(--muted)]">
          <p>Admin: admin / admin123</p>
          <p>Blog only editor: blogger / blog123</p>
        </div>
      </section>
    </main>
  );
}
