import { createMedicalRecordAction } from "@/app/doctor-dashboard/actions";
import { FormSubmitButton } from "@/components/doctor-dashboard/form-submit-button";
import { requireDoctorUser } from "@/lib/auth";
import {
  getDoctorMedicalRecords,
  getDoctorPatients,
} from "@/lib/doctor-dashboard/service";

export default async function DoctorMedicalRecordsPage() {
  const user = await requireDoctorUser();
  const [patients, records] = await Promise.all([
    getDoctorPatients(user.doctorId!),
    getDoctorMedicalRecords(user.doctorId!),
  ]);
  const patientMap = new Map(patients.map((patient) => [patient.id, patient]));

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[#e6edf7] bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.16)]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5f8ed5]">
          Clinical Documentation
        </p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[#153a6b]">
          Medical Records
        </h2>
        <p className="mt-2 text-sm text-[#6d7f95]">
          Add diagnoses, store note history, and keep attachments linked to the right patient.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <section className="rounded-[28px] border border-[#e6edf7] bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.16)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5f8ed5]">
            Create
          </p>
          <h3 className="mt-2 text-xl font-extrabold tracking-[-0.03em] text-[#153a6b]">
            New Medical Record
          </h3>

          {patients.length === 0 ? (
            <div className="mt-6 rounded-[22px] border border-dashed border-[#d7e4f5] bg-[#fbfdff] px-5 py-10 text-center text-sm text-[#7f8da0]">
              Add or assign patients first to create medical records.
            </div>
          ) : (
            <form action={createMedicalRecordAction} className="mt-6 grid gap-4">
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
                name="diagnosis"
                required
                placeholder="Diagnosis"
                className="h-11 rounded-2xl border border-[#dce7f6] bg-[#fbfdff] px-4 text-sm text-[#24476e] outline-none"
              />
              <textarea
                name="notes"
                rows={5}
                placeholder="Clinical notes"
                className="rounded-2xl border border-[#dce7f6] bg-[#fbfdff] px-4 py-3 text-sm text-[#24476e] outline-none"
              />
              <textarea
                name="attachments"
                rows={4}
                placeholder="Attachment URLs, one per line"
                className="rounded-2xl border border-[#dce7f6] bg-[#fbfdff] px-4 py-3 text-sm text-[#24476e] outline-none"
              />
              <FormSubmitButton
                label="Add record"
                pendingLabel="Saving record..."
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
                Full Record Timeline
              </h3>
            </div>
            <div className="rounded-full bg-[#eef5ff] px-3 py-1.5 text-xs font-semibold text-[#2b63b8]">
              {records.length} total record{records.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {records.length === 0 ? (
              <p className="text-sm text-[#7f8da0]">No medical records available yet.</p>
            ) : (
              records.map((record) => {
                const patient = patientMap.get(record.patient_id);

                return (
                  <article
                    key={record.id}
                    className="rounded-[22px] border border-[#e9eef7] bg-[#fbfdff] px-5 py-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-semibold text-[#153a6b]">{record.diagnosis}</p>
                        <p className="mt-1 text-sm font-medium text-[#2b63b8]">
                          {patient?.name || "Unknown patient"}
                        </p>
                      </div>
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#94a0b0]">
                        {new Date(record.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#6d7f95]">
                      {record.notes || "No notes."}
                    </p>
                    {record.attachments.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {record.attachments.map((attachment) => (
                          <a
                            key={attachment}
                            href={attachment}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-semibold text-[#2b63b8]"
                          >
                            Attachment
                          </a>
                        ))}
                      </div>
                    ) : null}
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
