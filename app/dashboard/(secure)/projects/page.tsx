import { deleteProjectAction, saveProjectAction } from "@/app/dashboard/actions";
import { requirePermission } from "@/lib/auth";
import { readData } from "@/lib/cms";

function ProjectForm({
  item,
}: {
  item?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    description: string;
    sector: string;
    location: string;
    status: string;
    coverImage: string;
    gallery: string[];
    details: string[];
    createdAt: string;
  };
}) {
  return (
    <form action={saveProjectAction} className="grid gap-3">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <input name="title" required defaultValue={item?.title} placeholder="Title" className="rounded-lg border border-[var(--line)] px-3 py-2" />
      <input name="slug" defaultValue={item?.slug} placeholder="Slug (optional)" className="rounded-lg border border-[var(--line)] px-3 py-2" />
      <input name="excerpt" required defaultValue={item?.excerpt} placeholder="Doctor summary" className="rounded-lg border border-[var(--line)] px-3 py-2" />
      <textarea name="description" required rows={3} defaultValue={item?.description} placeholder="Doctor bio" className="rounded-lg border border-[var(--line)] px-3 py-2" />
      <div className="grid gap-3 md:grid-cols-3">
        <input name="sector" defaultValue={item?.sector} placeholder="Specialty" className="rounded-lg border border-[var(--line)] px-3 py-2" />
        <input name="location" defaultValue={item?.location} placeholder="Clinic location" className="rounded-lg border border-[var(--line)] px-3 py-2" />
        <input name="status" defaultValue={item?.status} placeholder="Availability" className="rounded-lg border border-[var(--line)] px-3 py-2" />
      </div>
      <input name="coverImage" defaultValue={item?.coverImage} placeholder="Cover image URL" className="rounded-lg border border-[var(--line)] px-3 py-2" />
      <textarea name="gallery" defaultValue={item?.gallery.join("\n")} rows={3} placeholder="Gallery URLs (one per line)" className="rounded-lg border border-[var(--line)] px-3 py-2" />
      <textarea name="details" defaultValue={item?.details.join("\n")} rows={3} placeholder="Doctor highlights (one per line)" className="rounded-lg border border-[var(--line)] px-3 py-2" />
      <input name="createdAt" defaultValue={item?.createdAt} placeholder="Created date ISO" className="rounded-lg border border-[var(--line)] px-3 py-2" />
      <button className="button button-primary w-fit">{item ? "Save Doctor" : "Add Doctor"}</button>
    </form>
  );
}

export default async function DashboardProjectsPage() {
  await requirePermission("projects");
  const data = await readData();

  return (
    <>
      <article className="card p-6">
        <h1 className="text-2xl font-extrabold">Create Doctor Profile</h1>
        <div className="mt-4">
          <ProjectForm />
        </div>
      </article>

      {data.projects.map((project) => (
        <article key={project.id} className="card p-6">
          <h2 className="text-lg font-bold">{project.title}</h2>
          <div className="mt-3">
            <ProjectForm item={project} />
          </div>
          <form action={deleteProjectAction} className="mt-2">
            <input type="hidden" name="id" value={project.id} />
            <button className="button button-secondary text-xs">Delete</button>
          </form>
        </article>
      ))}
    </>
  );
}
