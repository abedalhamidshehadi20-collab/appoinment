import { deleteServiceAction, saveServiceAction } from "@/app/dashboard/actions";
import { requirePermission } from "@/lib/auth";
import { readData } from "@/lib/cms";

export default async function DashboardServicesPage() {
  await requirePermission("services");
  const data = await readData();

  return (
    <>
      <article className="card p-6">
        <h1 className="text-2xl font-extrabold">Create Service</h1>
        <form action={saveServiceAction} className="mt-4 grid gap-3">
          <input name="title" placeholder="Service title" className="rounded-lg border border-[var(--line)] px-3 py-2" required />
          <textarea name="summary" rows={2} placeholder="Summary" className="rounded-lg border border-[var(--line)] px-3 py-2" required />
          <textarea name="features" rows={4} placeholder="One feature per line" className="rounded-lg border border-[var(--line)] px-3 py-2" />
          <button className="button button-primary w-fit">Add Service</button>
        </form>
      </article>

      {data.services.map((service) => (
        <article key={service.id} className="card p-6">
          <form action={saveServiceAction} className="grid gap-3">
            <input type="hidden" name="id" value={service.id} />
            <input name="title" defaultValue={service.title} className="rounded-lg border border-[var(--line)] px-3 py-2" required />
            <textarea name="summary" rows={2} defaultValue={service.summary} className="rounded-lg border border-[var(--line)] px-3 py-2" required />
            <textarea name="features" rows={3} defaultValue={service.features.join("\n")} className="rounded-lg border border-[var(--line)] px-3 py-2" />
            <div className="flex gap-2">
              <button className="button button-primary">Save</button>
            </div>
          </form>
          <form action={deleteServiceAction} className="mt-2">
            <input type="hidden" name="id" value={service.id} />
            <button className="button button-secondary text-xs">Delete</button>
          </form>
        </article>
      ))}
    </>
  );
}
