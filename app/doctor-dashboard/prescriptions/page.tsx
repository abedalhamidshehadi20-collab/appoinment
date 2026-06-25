import { createPrescriptionAction } from "@/app/doctor-dashboard/actions";
import { FormSubmitButton } from "@/components/doctor-dashboard/form-submit-button";
import { requireDoctorUser } from "@/lib/auth";
import {
  getDoctorPatients,
  getDoctorPrescriptions,
} from "@/lib/doctor-dashboard/service";

export default async function DoctorPrescriptionsPage() {
  const user = await requireDoctorUser();
  const [patients, prescriptions] = await Promise.all([
    getDoctorPatients(user.doctorId!),
    getDoctorPrescriptions(user.doctorId!),
  ]);
  const patientMap = new Map(patients.map((patient) => [patient.id, patient]));

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[#e6edf7] bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.16)]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5f8ed5]">
          Medication Orders
        </p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[#153a6b]">
          Prescriptions
        </h2>
        <p className="mt-2 text-sm text-[#6d7f95]">
          Issue medication plans with clear dosage and duration details for every assigned patient.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <section className="rounded-[28px] border border-[#e6edf7] bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.16)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5f8ed5]">
            Create
          </p>
          <h3 className="mt-2 text-xl font-extrabold tracking-[-0.03em] text-[#153a6b]">
            New Prescription
          </h3>

          {patients.length === 0 ? (
            <div className="mt-6 rounded-[22px] border border-dashed border-[#d7e4f5] bg-[#fbfdff] px-5 py-10 text-center text-sm text-[#7f8da0]">
              Add or assign patients first to create prescriptions.
            </div>
          ) : (
            <form action={createPrescriptionAction} className="mt-6 grid gap-4">
              <select
                name="patientId"
                required
                className="h-11 rounded-2xl border border-[#dce7f6] bg-[#fbfdff] px-4 text-sm text-[#24476e] outline-none"
              >
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
              <input
                name="medication"
                required
                placeholder="Medication"
                className="h-11 rounded-2xl border border-[#dce7f6] bg-[#fbfdff] px-4 text-sm text-[#24476e] outline-none"
              />
              <input
                name="dosage"
                required
                placeholder="Dosage"
                className="h-11 rounded-2xl border border-[#dce7f6] bg-[#fbfdff] px-4 text-sm text-[#24476e] outline-none"
              />
              <input
                name="duration"
                required
                placeholder="Duration"
                className="h-11 rounded-2xl border border-[#dce7f6] bg-[#fbfdff] px-4 text-sm text-[#24476e] outline-none"
              />
              <textarea
                name="instructions"
                rows={5}
                placeholder="Instructions"
                className="rounded-2xl border border-[#dce7f6] bg-[#fbfdff] px-4 py-3 text-sm text-[#24476e] outline-none"
              />
              <FormSubmitButton
                label="Create prescription"
                pendingLabel="Saving prescription..."
                className="rounded-2xl bg-[#2377e7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1b67cb] disabled:opacity-60"
              />
            </form>
          )}
        </section>

        <section className="rounded-[28px] border border-[#e6edf7] bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.16)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5f8ed5]">
                History
              </p>
              <h3 className="mt-2 text-xl font-extrabold tracking-[-0.03em] text-[#153a6b]">
                Prescription Log
              </h3>
            </div>
            <div className="rounded-full bg-[#eef5ff] px-3 py-1.5 text-xs font-semibold text-[#2b63b8]">
              {prescriptions.length} total prescription{prescriptions.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {prescriptions.length === 0 ? (
              <p className="text-sm text-[#7f8da0]">No prescriptions issued yet.</p>
            ) : (
              prescriptions.map((prescription) => {
                const patient = patientMap.get(prescription.patient_id);

                return (
                  <article
                    key={prescription.id}
                    className="rounded-[22px] border border-[#e9eef7] bg-[#fbfdff] px-5 py-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-semibold text-[#153a6b]">{prescription.medication}</p>
                        <p className="mt-1 text-sm font-medium text-[#2b63b8]">
                          {patient?.name || "Unknown patient"}
                        </p>
                      </div>
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#94a0b0]">
                        {new Date(prescription.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="mt-3 text-sm text-[#6d7f95]">
                      {prescription.dosage} for {prescription.duration}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#6d7f95]">
                      {prescription.instructions || "No instructions."}
                    </p>
                  </article>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
