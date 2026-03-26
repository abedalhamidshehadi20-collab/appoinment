import { notFound } from "next/navigation";
import { requireDoctorUser } from "@/lib/auth";
import { getDoctorPatientDetail } from "@/lib/doctor-dashboard/service";

function calculateAge(dateOfBirth: string) {
  if (!dateOfBirth) {
    return "N/A";
  }

  const date = new Date(dateOfBirth);
  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  const diff = Date.now() - date.getTime();
  return Math.abs(new Date(diff).getUTCFullYear() - 1970);
}

function formatStatus(value: string) {
  const normalized = value.trim().toLowerCase();
  if (normalized === "done") return "Completed";
  if (normalized === "confirmed" || normalized === "scheduled") return "Pending";
  if (normalized === "canceled") return "Cancelled";
  return value || "Pending";
}

export default async function DoctorPatientProfilePage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const user = await requireDoctorUser();
  const { patientId } = await params;
  const patient = await getDoctorPatientDetail(user.doctorId!, patientId);

  if (!patient) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-[#dfe9f7] bg-[linear-gradient(135deg,#ffffff_0%,#f7fbff_58%,#edf5ff_100%)] p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.2)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5b87c5]">
          Patient Profile
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-[#153a6b]">
          {patient.name}
        </h2>
        <p className="mt-2 text-sm leading-7 text-[#6d7f95]">
          Full patient overview, medical history, and treatment timeline.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[28px] border border-[#e6edf7] bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.16)]">
          <h3 className="text-xl font-extrabold tracking-[-0.03em] text-[#153a6b]">
            Patient Details
          </h3>
          <dl className="mt-6 grid gap-4 text-sm text-[#4a6078]">
            <div className="rounded-[22px] border border-[#edf2f8] bg-[#fbfdff] px-4 py-3">
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94a0b0]">Age</dt>
              <dd className="mt-2 font-semibold text-[#153a6b]">{calculateAge(patient.date_of_birth)}</dd>
            </div>
            <div className="rounded-[22px] border border-[#edf2f8] bg-[#fbfdff] px-4 py-3">
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94a0b0]">Gender</dt>
              <dd className="mt-2 font-semibold text-[#153a6b]">{patient.gender || "N/A"}</dd>
            </div>
            <div className="rounded-[22px] border border-[#edf2f8] bg-[#fbfdff] px-4 py-3">
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94a0b0]">Email</dt>
              <dd className="mt-2 font-semibold text-[#153a6b]">{patient.email}</dd>
            </div>
            <div className="rounded-[22px] border border-[#edf2f8] bg-[#fbfdff] px-4 py-3">
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94a0b0]">Phone</dt>
              <dd className="mt-2 font-semibold text-[#153a6b]">{patient.phone || "N/A"}</dd>
            </div>
            <div className="rounded-[22px] border border-[#edf2f8] bg-[#fbfdff] px-4 py-3">
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94a0b0]">Address</dt>
              <dd className="mt-2 font-semibold text-[#153a6b]">{patient.address || "N/A"}</dd>
            </div>
            <div className="rounded-[22px] border border-[#edf2f8] bg-[#fbfdff] px-4 py-3">
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94a0b0]">Medical History</dt>
              <dd className="mt-2 leading-6 text-[#4a6078]">{patient.medical_history || "No history added."}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-[28px] border border-[#e6edf7] bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.16)]">
          <h3 className="text-xl font-extrabold tracking-[-0.03em] text-[#153a6b]">
            Appointment History
          </h3>
          <div className="mt-6 space-y-4">
            {patient.appointments.length === 0 ? (
              <div className="rounded-[22px] border border-dashed border-[#d7e4f5] bg-[#fbfdff] px-5 py-10 text-center text-sm text-[#7f8da0]">
                No appointments recorded for this patient.
              </div>
            ) : (
              patient.appointments.map((appointment) => (
                <article key={appointment.id} className="rounded-[22px] border border-[#e9eef7] bg-[#fbfdff] px-5 py-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-[#153a6b]">{appointment.service || "General Consultation"}</p>
                      <p className="mt-1 text-sm text-[#6d7f95]">{formatStatus(appointment.status || "Pending")}</p>
                    </div>
                    <p className="text-sm text-[#4a6078]">
                      {appointment.appointment_date || "N/A"} {appointment.appointment_time || ""}
                    </p>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-[28px] border border-[#e6edf7] bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.16)]">
          <h3 className="text-xl font-extrabold tracking-[-0.03em] text-[#153a6b]">
            Medical Records
          </h3>
          <div className="mt-6 space-y-4">
            {patient.medicalRecords.length === 0 ? (
              <p className="text-sm text-[#7f8da0]">No medical records yet.</p>
            ) : (
              patient.medicalRecords.map((record) => (
                <article key={record.id} className="rounded-[22px] border border-[#e9eef7] bg-[#fbfdff] px-5 py-4">
                  <p className="font-semibold text-[#153a6b]">{record.diagnosis}</p>
                  <p className="mt-2 text-sm leading-6 text-[#6d7f95]">{record.notes || "No notes."}</p>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="rounded-[28px] border border-[#e6edf7] bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.16)]">
          <h3 className="text-xl font-extrabold tracking-[-0.03em] text-[#153a6b]">
            Prescriptions
          </h3>
          <div className="mt-6 space-y-4">
            {patient.prescriptions.length === 0 ? (
              <p className="text-sm text-[#7f8da0]">No prescriptions yet.</p>
            ) : (
              patient.prescriptions.map((prescription) => (
                <article key={prescription.id} className="rounded-[22px] border border-[#e9eef7] bg-[#fbfdff] px-5 py-4">
                  <p className="font-semibold text-[#153a6b]">{prescription.medication}</p>
                  <p className="mt-2 text-sm text-[#6d7f95]">
                    {prescription.dosage} for {prescription.duration}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#6d7f95]">{prescription.instructions || "No instructions."}</p>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
