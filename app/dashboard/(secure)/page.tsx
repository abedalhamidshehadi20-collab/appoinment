import Link from "next/link";
import { getDashboardCounts } from "../actions";
import { requireUser } from "@/lib/auth";

export default async function DashboardOverviewPage() {
  const user = await requireUser();
  const counts = await getDashboardCounts();

  return (
    <>
      <article className="card p-6">
        <h1 className="text-3xl font-extrabold">Dashboard Overview</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Welcome back, {user.name}. Manage your website content from this panel.
        </p>
      </article>

      <section className="grid-cards">
        <article className="card p-4"><p className="text-sm text-[var(--muted)]">Services</p><p className="text-3xl font-extrabold">{counts.services}</p></article>
        <article className="card p-4"><p className="text-sm text-[var(--muted)]">Doctors</p><p className="text-3xl font-extrabold">{counts.projects}</p></article>
        <article className="card p-4"><p className="text-sm text-[var(--muted)]">Blogs</p><p className="text-3xl font-extrabold">{counts.blogs}</p></article>
        <article className="card p-4"><p className="text-sm text-[var(--muted)]">News</p><p className="text-3xl font-extrabold">{counts.news}</p></article>
        <article className="card p-4"><p className="text-sm text-[var(--muted)]">Contact Messages</p><p className="text-3xl font-extrabold">{counts.contacts}</p></article>
        <article className="card p-4"><p className="text-sm text-[var(--muted)]">Appointment Requests</p><p className="text-3xl font-extrabold">{counts.interests}</p></article>
      </section>

      <article className="card p-6 text-sm text-[var(--muted)]">
        <p>Need to verify role-based access quickly?</p>
        <p className="mt-1">
          Login as <strong>blogger</strong> and you will only be able to edit the blog section.
        </p>
        <Link href="/dashboard/blogs" className="mt-3 inline-block font-semibold text-[var(--brand-deep)]">
          Open blog management
        </Link>
      </article>
    </>
  );
}
