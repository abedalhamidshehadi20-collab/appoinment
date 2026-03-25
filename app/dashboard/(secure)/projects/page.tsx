import { deleteProjectAction, saveProjectAction } from "@/app/dashboard/actions";
import { DoctorCredentialActions } from "@/components/dashboard/DoctorCredentialActions";
import { NewDoctorForm } from "@/components/dashboard/NewDoctorForm";
import { requirePermission } from "@/lib/auth";
import { getAllDoctorCredentials, getAllDoctors, type Doctor, type DoctorCredential } from "@/lib/db";

function getCredentialSuccessMessage(code: string | undefined) {
  if (!code) return "";
  if (code === "1") return "Doctor login saved successfully.";
  return "";
}

function getCredentialErrorMessage(code: string | undefined) {
  if (!code) return "";
  if (code === "password_required") return "Password is required when creating a doctor email.";
  if (code === "email_taken") return "This email is already being used by another doctor.";
  if (code === "missing_fields") return "Doctor email and doctor selection are required.";
  if (code === "doctor_credentials_missing") return "Run the doctor credentials SQL file first, then try again.";
  if (code === "doctor_credentials_access_denied") return "Doctor credentials table exists, but this app cannot write to it yet. Add SUPABASE_SERVICE_ROLE_KEY to .env.local and restart the server.";
  return "Unable to save the doctor email right now.";
}

function ProjectForm({
  item,
  credential,
}: {
  item?: Doctor;
  credential?: DoctorCredential | null;
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
          {item && (
            <>
              <option value="Booked">Booked</option>
              <option value="On Leave">On Leave</option>
            </>
          )}
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
      {item ? (
        <div className="flex flex-col items-start gap-3">
          <DoctorCredentialActions
            doctor={{ id: item.id, title: item.title }}
            credential={credential}
          />
          <button className="button button-primary w-fit">Save Doctor</button>
        </div>
      ) : (
        <button className="button button-primary w-fit">Add Doctor</button>
      )}
    </form>
  );
}

type Props = {
  searchParams: Promise<{ credential_success?: string; credential_error?: string }>;
};

export default async function DashboardProjectsPage({ searchParams }: Props) {
  await requirePermission("projects");
  const query = await searchParams;
  const [doctors, credentials] = await Promise.all([
    getAllDoctors(),
    getAllDoctorCredentials(),
  ]);

  const credentialMap = new Map(
    credentials.map((credential) => [credential.doctor_id, credential]),
  );
  const successMessage = getCredentialSuccessMessage(query.credential_success);
  const errorMessage = getCredentialErrorMessage(query.credential_error);

  return (
    <>
      {successMessage ? (
        <article className="card border border-[#bde5cb] bg-[#ecfff3] p-4 text-sm font-medium text-[#145f39]">
          {successMessage}
        </article>
      ) : null}

      {errorMessage ? (
        <article className="card border border-[#fecaca] bg-[#fef2f2] p-4 text-sm font-medium text-[#991b1b]">
          {errorMessage}
        </article>
      ) : null}

      <article className="card p-6">
        <h1 className="text-2xl font-extrabold">Create Doctor Profile</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Add the doctor profile here. You can prepare the doctor login email and password before saving the profile.
        </p>
        <div className="mt-4">
          <NewDoctorForm />
        </div>
      </article>

      {doctors.map((doctor) => (
        <article key={doctor.id} className="card p-6">
          <div className="mb-4 border-b border-[#eef2f7] pb-4">
            <div>
              <h2 className="text-lg font-bold">{doctor.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {[doctor.sector, doctor.location].filter(Boolean).join(" - ") || "Doctor profile"}
              </p>
            </div>
          </div>
          <div className="mt-3">
            <ProjectForm item={doctor} credential={credentialMap.get(doctor.id) ?? null} />
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
