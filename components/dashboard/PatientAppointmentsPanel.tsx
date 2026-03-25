import { deleteAppointmentAction, updateAppointmentStatusAction } from "@/app/dashboard/actions";
import AppointmentStatusSelector from "@/components/AppointmentStatusSelector";
import AddPatientAppointmentForm from "@/components/dashboard/add-patient-appointment-form";
import type { Appointment } from "@/lib/db";

type Props = {
  patientId: string;
  appointments: Appointment[];
  doctors: { id: string; title: string }[];
};

function formatDate(value: string) {
  if (!value) return "-";

  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;

  return `${month}/${day}/${year}`;
}

function getStatusBadge(status: string) {
  const value = status.trim().toLowerCase();

  if (value === "completed") {
    return "bg-[#ecfff3] text-[#145f39]";
  }

  if (value === "cancelled") {
    return "bg-[#fef2f2] text-[#991b1b]";
  }

  return "bg-[#eef4ff] text-[var(--brand-deep)]";
}

export function PatientAppointmentsPanel({
  patientId,
  appointments,
  doctors,
}: Props) {
  return (
    <section className="mt-6 grid gap-5">
      <div className="rounded-[24px] border border-[#dce8fb] bg-white p-5 shadow-[0_12px_28px_-24px_rgba(17,24,39,0.25)]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
              Appointments
            </p>
            <h3 className="mt-1 text-lg font-bold text-[var(--brand-deep)]">
              Patient Appointments
            </h3>
          </div>
          <p className="text-sm font-semibold text-[var(--brand-deep)]">
            {appointments.length} appointment{appointments.length === 1 ? "" : "s"}
          </p>
        </div>

        {appointments.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--muted)]">
            No appointments for this patient yet.
          </p>
        ) : (
          <div className="mt-4 grid gap-3">
            {appointments.map((appointment) => (
              <article
                key={appointment.id}
                className="rounded-[20px] border border-[#edf2fb] bg-[#fbfdff] p-4"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <p className="text-base font-semibold text-[var(--brand-deep)]">
                      {appointment.doctor_name}
                    </p>
                    <p className="text-sm text-[var(--muted)]">
                      {formatDate(appointment.appointment_date)} at {appointment.appointment_time}
                    </p>
                    {appointment.message ? (
                      <p className="text-sm text-[var(--brand-deep)]">
                        {appointment.message}
                      </p>
                    ) : null}
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(appointment.status)}`}
                    >
                      {appointment.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <AppointmentStatusSelector
                      patientId={patientId}
                      appointmentId={appointment.id}
                      currentStatus={appointment.status}
                      onUpdate={updateAppointmentStatusAction}
                    />

                    <form action={deleteAppointmentAction}>
                      <input type="hidden" name="patientId" value={patientId} />
                      <input
                        type="hidden"
                        name="appointmentId"
                        value={appointment.id}
                      />
                      <button className="rounded-xl border border-[#d8e5fb] bg-white px-4 py-2 text-xs font-semibold text-[var(--brand-deep)] transition hover:bg-[#f8fbff]">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <AddPatientAppointmentForm patientId={patientId} doctors={doctors} />
    </section>
  );
}
