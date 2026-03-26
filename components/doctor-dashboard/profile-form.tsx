import type { Doctor } from "@/lib/db";
import { FormSubmitButton } from "@/components/doctor-dashboard/form-submit-button";

type DoctorProfileFormProps = {
  doctor: Doctor;
  email: string;
  updateAction: (formData: FormData) => void | Promise<void>;
};

export function DoctorProfileForm({
  doctor,
  email,
  updateAction,
}: DoctorProfileFormProps) {
  return (
    <form action={updateAction} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-[28px] border border-[#e6edf7] bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.16)]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5f8ed5]">
          Personal Details
        </p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[#153a6b]">
          Profile
        </h2>
        <p className="mt-2 text-sm text-[#6d7f95]">
          Update your doctor-facing details and login password from one place.
        </p>

        <div className="mt-6 grid gap-5">
          <label className="grid gap-2 text-sm font-semibold text-[#24476e]">
            Name
            <input name="name" defaultValue={doctor.title} className="h-11 rounded-2xl border border-[#dce7f6] bg-[#fbfdff] px-4 text-sm font-medium outline-none" />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-[#24476e]">
            Specialty
            <input name="specialty" defaultValue={doctor.sector} className="h-11 rounded-2xl border border-[#dce7f6] bg-[#fbfdff] px-4 text-sm font-medium outline-none" />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-[#24476e]">
            Clinic Location
            <input name="location" defaultValue={doctor.location} className="h-11 rounded-2xl border border-[#dce7f6] bg-[#fbfdff] px-4 text-sm font-medium outline-none" />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-[#24476e]">
            Profile Image URL
            <input name="profileImage" defaultValue={doctor.cover_image} className="h-11 rounded-2xl border border-[#dce7f6] bg-[#fbfdff] px-4 text-sm font-medium outline-none" />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-[#24476e]">
            New Password
            <input name="password" type="password" placeholder="Leave blank to keep current password" className="h-11 rounded-2xl border border-[#dce7f6] bg-[#fbfdff] px-4 text-sm font-medium outline-none" />
          </label>
        </div>
      </section>

      <section className="rounded-[28px] border border-[#e6edf7] bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.16)]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5f8ed5]">
          Login Details
        </p>
        <h3 className="mt-2 text-xl font-extrabold tracking-[-0.03em] text-[#153a6b]">
          Account Snapshot
        </h3>

        <dl className="mt-6 space-y-4 text-sm text-[#4a6078]">
          <div className="rounded-[22px] border border-[#edf2f8] bg-[#fbfdff] px-4 py-3">
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94a0b0]">Login Email</dt>
            <dd className="mt-2 font-semibold text-[#153a6b]">{email}</dd>
          </div>
          <div className="rounded-[22px] border border-[#edf2f8] bg-[#fbfdff] px-4 py-3">
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94a0b0]">Status</dt>
            <dd className="mt-2 font-semibold text-[#153a6b]">{doctor.status || "Available"}</dd>
          </div>
          <div className="rounded-[22px] border border-[#edf2f8] bg-[#fbfdff] px-4 py-3">
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94a0b0]">Experience</dt>
            <dd className="mt-2 font-semibold text-[#153a6b]">{doctor.years_experience ?? 0} years</dd>
          </div>
        </dl>

        <div className="mt-8">
          <FormSubmitButton
            label="Save profile"
            pendingLabel="Saving profile..."
            className="w-full rounded-2xl bg-[#2377e7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1b67cb] disabled:opacity-60"
          />
        </div>
      </section>
    </form>
  );
}
