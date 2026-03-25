import { savePatientAction } from "@/app/dashboard/actions";
import {
  DoctorFormField,
  inputClassName,
  textareaClassName,
} from "@/components/dashboard/doctor-form-ui";
import type { Patient } from "@/lib/db";

type PatientProfileFormProps = {
  patient: Patient;
  onCancel?: () => void;
};

export function PatientProfileForm({
  patient,
  onCancel,
}: PatientProfileFormProps) {
  return (
    <form action={savePatientAction} className="grid gap-6 md:grid-cols-2">
      <input type="hidden" name="id" value={patient.id} />

      <DoctorFormField label="Full Name">
        <input
          name="name"
          required
          defaultValue={patient.name}
          placeholder="Full Name"
          className={inputClassName}
        />
      </DoctorFormField>

      <DoctorFormField label="Email Address">
        <input
          type="email"
          name="email"
          required
          defaultValue={patient.email}
          placeholder="Email Address"
          className={inputClassName}
        />
      </DoctorFormField>

      <div className="grid gap-6 md:col-span-2 md:grid-cols-3">
        <DoctorFormField label="Phone Number">
          <input
            name="phone"
            required
            defaultValue={patient.phone}
            placeholder="Phone Number"
            className={inputClassName}
          />
        </DoctorFormField>

        <DoctorFormField label="Date of Birth">
          <input
            type="date"
            name="dateOfBirth"
            defaultValue={patient.date_of_birth}
            className={inputClassName}
          />
        </DoctorFormField>

        <DoctorFormField label="Gender">
          <select
            name="gender"
            defaultValue={patient.gender}
            className={inputClassName}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </DoctorFormField>
      </div>

      <div className="md:col-span-2">
        <DoctorFormField label="Address">
          <input
            name="address"
            defaultValue={patient.address}
            placeholder="Address"
            className={inputClassName}
          />
        </DoctorFormField>
      </div>

      <div className="md:col-span-2">
        <DoctorFormField label="Medical History / Notes">
          <textarea
            name="medicalHistory"
            rows={4}
            defaultValue={patient.medical_history}
            placeholder="Medical History / Notes"
            className={textareaClassName}
          />
        </DoctorFormField>
      </div>

      <div className="md:col-span-2 border-t border-[#edf2fb] pt-2">
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
            Save Patient
          </button>
        </div>
      </div>
    </form>
  );
}
