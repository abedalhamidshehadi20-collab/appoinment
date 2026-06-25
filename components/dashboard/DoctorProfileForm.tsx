import { saveProjectAction } from "@/app/dashboard/actions";
import { DoctorCredentialActions } from "@/components/dashboard/DoctorCredentialActions";
import {
  DoctorFormField,
  defaultAvailableTimes,
  inputClassName,
  textareaClassName,
} from "@/components/dashboard/doctor-form-ui";
import type { Doctor, DoctorCredential } from "@/lib/db";

type DoctorProfileFormProps = {
  doctor: Doctor;
  credential?: DoctorCredential | null;
  onCancel?: () => void;
};

export function DoctorProfileForm({
  doctor,
  credential,
  onCancel,
}: DoctorProfileFormProps) {
  return (
    <form action={saveProjectAction} className="grid gap-6 md:grid-cols-2">
      <input type="hidden" name="id" value={doctor.id} />

      <DoctorFormField label="Title">
        <input
          name="title"
          required
          defaultValue={doctor.title}
          placeholder="Title"
          className={inputClassName}
        />
      </DoctorFormField>

      <DoctorFormField label="Slug">
        <input
          name="slug"
          defaultValue={doctor.slug}
          placeholder="Slug (optional)"
          className={inputClassName}
        />
      </DoctorFormField>

      <DoctorFormField label="Doctor Summary">
        <input
          name="excerpt"
          required
          defaultValue={doctor.excerpt}
          placeholder="Doctor summary"
          className={inputClassName}
        />
      </DoctorFormField>

      <div className="md:col-span-2">
        <DoctorFormField label="Doctor Bio">
          <textarea
            name="description"
            required
            rows={4}
            defaultValue={doctor.description}
            placeholder="Doctor bio"
            className={textareaClassName}
          />
        </DoctorFormField>
      </div>

      <div className="grid gap-6 md:col-span-2 md:grid-cols-3">
        <DoctorFormField label="Specialty">
          <input
            name="sector"
            defaultValue={doctor.sector}
            placeholder="Specialty"
            className={inputClassName}
          />
        </DoctorFormField>

        <DoctorFormField label="Clinic Location">
          <input
            name="location"
            defaultValue={doctor.location}
            placeholder="Clinic location"
            className={inputClassName}
          />
        </DoctorFormField>

        <DoctorFormField label="Status">
          <select
            name="status"
            defaultValue={doctor.status || "Available"}
            className={inputClassName}
          >
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
            <option value="Booked">Booked</option>
            <option value="On Leave">On Leave</option>
          </select>
        </DoctorFormField>
      </div>

      <div className="grid gap-6 md:col-span-2 md:grid-cols-2">
        <DoctorFormField label="Appointment Fee">
          <input
            name="appointmentFee"
            type="number"
            step="0.01"
            defaultValue={doctor.appointment_fee ?? 50}
            placeholder="Appointment Fee ($)"
            className={inputClassName}
          />
        </DoctorFormField>

        <DoctorFormField label="Years of Experience">
          <input
            name="yearsExperience"
            type="number"
            defaultValue={doctor.years_experience ?? 0}
            placeholder="Years of Experience"
            className={inputClassName}
          />
        </DoctorFormField>
      </div>

      <div className="md:col-span-2">
        <DoctorFormField label="Cover Image URL">
          <input
            name="coverImage"
            defaultValue={doctor.cover_image}
            placeholder="Cover image URL"
            className={inputClassName}
          />
        </DoctorFormField>
      </div>

      <DoctorFormField label="Gallery URLs">
        <textarea
          name="gallery"
          defaultValue={doctor.gallery?.join("\n")}
          rows={4}
          placeholder="Gallery URLs (one per line)"
          className={textareaClassName}
        />
      </DoctorFormField>

      <DoctorFormField label="Doctor Highlights">
        <textarea
          name="details"
          defaultValue={doctor.details?.join("\n")}
          rows={4}
          placeholder="Doctor highlights (one per line)"
          className={textareaClassName}
        />
      </DoctorFormField>

      <div className="md:col-span-2">
        <DoctorFormField label="Available Time Slots">
          <textarea
            name="availableTimes"
            defaultValue={
              doctor.available_times?.join("\n") ?? defaultAvailableTimes
            }
            rows={5}
            placeholder="Available time slots (one per line)"
            className={textareaClassName}
          />
        </DoctorFormField>
      </div>

      <div className="md:col-span-2 border-t border-[#edf2fb] pt-2">
        <div className="flex flex-col gap-5">
          <div className="rounded-[24px] border border-[#dce8fb] bg-[#f8fbff] px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
                Doctor Login
              </p>
              <p className="mt-1 text-sm font-medium text-[var(--brand-deep)]">
                {credential?.email
                  ? `Current email: ${credential.email}`
                  : "Create or update the doctor login email from here."}
              </p>
            </div>

            <div className="mt-3">
              <DoctorCredentialActions
                doctor={{ id: doctor.id, title: doctor.title }}
                credential={credential}
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            {onCancel ? (
              <button
                type="button"
                onClick={onCancel}
                className="rounded-xl border border-[#d8e5fb] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--brand-deep)] transition hover:bg-[#f8fbff]"
              >
                Cancel
              </button>
            ) : null}

            <button className="button button-primary rounded-xl px-5 py-2.5">
              Save Doctor
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
