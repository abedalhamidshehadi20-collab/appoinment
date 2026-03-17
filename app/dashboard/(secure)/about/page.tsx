import { updateAboutAction } from "@/app/dashboard/actions";
import { requirePermission } from "@/lib/auth";
import { readData } from "@/lib/cms";

export default async function DashboardAboutPage() {
  await requirePermission("about");
  const data = await readData();

  return (
    <article className="card p-6">
      <h1 className="text-2xl font-extrabold">Edit About Content</h1>
      <form action={updateAboutAction} className="mt-4 grid gap-3">
        <input name="title" defaultValue={data.about.title} className="rounded-lg border border-[var(--line)] px-3 py-2" />
        <textarea name="description" rows={4} defaultValue={data.about.description} className="rounded-lg border border-[var(--line)] px-3 py-2" />
        <textarea name="mission" rows={3} defaultValue={data.about.mission} className="rounded-lg border border-[var(--line)] px-3 py-2" />
        <textarea name="vision" rows={3} defaultValue={data.about.vision} className="rounded-lg border border-[var(--line)] px-3 py-2" />
        <textarea name="values" rows={4} defaultValue={data.about.values.join("\n")} className="rounded-lg border border-[var(--line)] px-3 py-2" />
        <p className="text-xs text-[var(--muted)]">Use one value per line.</p>
        <button className="button button-primary w-fit">Save About</button>
      </form>
    </article>
  );
}
