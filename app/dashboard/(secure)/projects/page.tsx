import { deleteProjectAction, saveProjectAction } from "@/app/dashboard/actions";
import { requirePermission } from "@/lib/auth";
import { getAllDoctors, Doctor } from "@/lib/db";

function ProjectForm({
  item,
}: {
  item?: Doctor;
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
        <select name="status" defaultValue={item?.status || 'Available'} className="rounded-lg border border-[var(--line)] px-3 py-2 bg-white">
          <option value="Available">Available</option>
          <option value="Unavailable">Unavailable</option>
          <option value="On Leave">On Leave</option>
          <option value="Booked">Booked</option>
        </select>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <input name="appointmentFee" type="number" step="0.01" defaultValue={item?.appointment_fee ?? 50} placeholder="Appointment Fee ($)" className="rounded-lg border border-[var(--line)] px-3 py-2" />
        <input name="yearsExperience" type="number" defaultValue={item?.years_experience ?? 0} placeholder="Years of Experience" className="rounded-lg border border-[var(--line)] px-3 py-2" />
      </div>
      <input name="coverImage" defaultValue={item?.cover_image} placeholder="Cover image URL" className="rounded-lg border border-[var(--line)] px-3 py-2" />
      <textarea name="gallery" defaultValue={item?.gallery?.join("\n")} rows={3} placeholder="Gallery URLs (one per line)" className="rounded-lg border border-[var(--line)] px-3 py-2" />
      <textarea name="details" defaultValue={item?.details?.join("\n")} rows={3} placeholder="Doctor highlights (one per line)" className="rounded-lg border border-[var(--line)] px-3 py-2" />
      <textarea name="availableTimes" defaultValue={item?.available_times?.join("\n") ?? "8:00 am\n8:30 am\n9:00 am\n9:30 am\n10:00 am\n10:30 am\n11:00 am\n11:30 am"} rows={4} placeholder="Available time slots (one per line)" className="rounded-lg border border-[var(--line)] px-3 py-2" />
      <button className="button button-primary w-fit">{item ? "Save Doctor" : "Add Doctor"}</button>
    </form>
  );
}

export default async function DashboardProjectsPage() {
  await requirePermission("projects");
  const doctors = await getAllDoctors();

  return (
    <>
      <article className="card p-6">
        <h1 className="text-2xl font-extrabold">Create Doctor Profile</h1>
        <div className="mt-4">
          <ProjectForm />
        </div>
      </article>

      {doctors.map((doctor) => (
        <article key={doctor.id} className="card p-6">
          <h2 className="text-lg font-bold">{doctor.title}</h2>
          <div className="mt-3">
            <ProjectForm item={doctor} />
          </div>
          <form action={deleteProjectAction} className="mt-2">
            <input type="hidden" name="id" value={doctor.id} />
            <button className="button button-secondary text-xs">Delete</button>
          </form>
        </article>
      ))}
    </>
  );
}
