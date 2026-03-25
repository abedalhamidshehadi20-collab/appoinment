import { saveProjectAction } from "@/app/dashboard/actions";
import { DoctorCredentialActions } from "@/components/dashboard/DoctorCredentialActions";
import type { Doctor, DoctorCredential } from "@/lib/db";

type DoctorProfileFormProps = {
  doctor: Doctor;
  credential?: DoctorCredential | null;
};

export function DoctorProfileForm({
  doctor,
  credential,
}: DoctorProfileFormProps) {
  return (
    <form action={saveProjectAction} className="grid gap-3">
      <input type="hidden" name="id" value={doctor.id} />

      <input
        name="title"
        required
        defaultValue={doctor.title}
        placeholder="Title"
        className="rounded-lg border border-[var(--line)] px-3 py-2"
      />
      <input
        name="slug"
        defaultValue={doctor.slug}
        placeholder="Slug (optional)"
        className="rounded-lg border border-[var(--line)] px-3 py-2"
      />
      <input
        name="excerpt"
        required
        defaultValue={doctor.excerpt}
        placeholder="Doctor summary"
        className="rounded-lg border border-[var(--line)] px-3 py-2"
      />
      <textarea
        name="description"
        required
        rows={3}
        defaultValue={doctor.description}
        placeholder="Doctor bio"
        className="rounded-lg border border-[var(--line)] px-3 py-2"
      />

      <div className="grid gap-3 md:grid-cols-3">
        <input
          name="sector"
          defaultValue={doctor.sector}
          placeholder="Specialty"
          className="rounded-lg border border-[var(--line)] px-3 py-2"
        />
        <input
          name="location"
          defaultValue={doctor.location}
          placeholder="Clinic location"
          className="rounded-lg border border-[var(--line)] px-3 py-2"
        />
        <select
          name="status"
          defaultValue={doctor.status || "Available"}
          className="rounded-lg border border-[var(--line)] bg-white px-3 py-2"
        >
          <option value="Available">Available</option>
          <option value="Unavailable">Unavailable</option>
          <option value="Booked">Booked</option>
          <option value="On Leave">On Leave</option>
        </select>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <input
          name="appointmentFee"
          type="number"
          step="0.01"
          defaultValue={doctor.appointment_fee ?? 50}
          placeholder="Appointment Fee ($)"
          className="rounded-lg border border-[var(--line)] px-3 py-2"
        />
        <input
          name="yearsExperience"
          type="number"
          defaultValue={doctor.years_experience ?? 0}
          placeholder="Years of Experience"
          className="rounded-lg border border-[var(--line)] px-3 py-2"
        />
      </div>

      <input
        name="coverImage"
        defaultValue={doctor.cover_image}
        placeholder="Cover image URL"
        className="rounded-lg border border-[var(--line)] px-3 py-2"
      />
      <textarea
        name="gallery"
        defaultValue={doctor.gallery?.join("\n")}
        rows={3}
        placeholder="Gallery URLs (one per line)"
        className="rounded-lg border border-[var(--line)] px-3 py-2"
      />
      <textarea
        name="details"
        defaultValue={doctor.details?.join("\n")}
        rows={3}
        placeholder="Doctor highlights (one per line)"
        className="rounded-lg border border-[var(--line)] px-3 py-2"
      />
      <textarea
        name="availableTimes"
        defaultValue={
          doctor.available_times?.join("\n") ??
          "8:00 am\n8:30 am\n9:00 am\n9:30 am\n10:00 am\n10:30 am\n11:00 am\n11:30 am"
        }
        rows={4}
        placeholder="Available time slots (one per line)"
        className="rounded-lg border border-[var(--line)] px-3 py-2"
      />

      <div className="flex flex-col items-start gap-3 pt-1">
        <DoctorCredentialActions
          doctor={{ id: doctor.id, title: doctor.title }}
          credential={credential}
        />
        <button className="button button-primary w-fit">Save Doctor</button>
      </div>
    </form>
  );
}
