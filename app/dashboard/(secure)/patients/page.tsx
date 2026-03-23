import {
  savePatientAction,
  deletePatientAction,
  addAppointmentAction,
  updateAppointmentStatusAction,
  deleteAppointmentAction,
} from "@/app/dashboard/actions";
import { requirePermission } from "@/lib/auth";
import { getAllPatients, getAllDoctors, getAllAppointments } from "@/lib/db";
import AppointmentStatusSelector from "@/components/AppointmentStatusSelector";
import PatientWithAppointmentForm from "@/components/PatientWithAppointmentForm";

function PatientForm({
  patient,
}: {
  patient?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    date_of_birth: string;
    gender: string;
    medical_history: string;
  };
}) {
  return (
    <form action={savePatientAction} className="grid gap-3">
      {patient ? <input type="hidden" name="id" value={patient.id} /> : null}

      <div className="grid gap-3 md:grid-cols-2">
        <input
          name="name"
          required
          defaultValue={patient?.name}
          placeholder="Full Name"
          className="rounded-lg border border-[var(--line)] px-3 py-2"
        />
        <input
          type="email"
          name="email"
          required
          defaultValue={patient?.email}
          placeholder="Email Address"
          className="rounded-lg border border-[var(--line)] px-3 py-2"
        />
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <input
          name="phone"
          required
          defaultValue={patient?.phone}
          placeholder="Phone Number"
          className="rounded-lg border border-[var(--line)] px-3 py-2"
        />
        <input
          type="date"
          name="dateOfBirth"
          defaultValue={patient?.date_of_birth}
          placeholder="Date of Birth"
          className="rounded-lg border border-[var(--line)] px-3 py-2"
        />
        <select
          name="gender"
          defaultValue={patient?.gender}
          className="rounded-lg border border-[var(--line)] px-3 py-2"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <input
        name="address"
        defaultValue={patient?.address}
        placeholder="Address"
        className="rounded-lg border border-[var(--line)] px-3 py-2"
      />

      <textarea
        name="medicalHistory"
        rows={3}
        defaultValue={patient?.medical_history}
        placeholder="Medical History / Notes"
        className="rounded-lg border border-[var(--line)] px-3 py-2"
      />

      <button className="button button-primary w-fit">
        {patient ? "Update Patient" : "Add Patient"}
      </button>
    </form>
  );
}

function AppointmentForm({
  patientId,
  doctors,
}: {
  patientId: string;
  doctors: { id: string; title: string }[];
}) {
  return (
    <form action={addAppointmentAction} className="mt-3 grid gap-3 rounded-lg border border-[var(--line)] bg-[#f9fafb] p-4">
      <input type="hidden" name="patientId" value={patientId} />

      <p className="text-sm font-semibold text-[var(--brand-deep)]">Add New Appointment</p>

      <div className="grid gap-3 md:grid-cols-3">
        <select
          name="doctorId"
          required
          className="rounded-lg border border-[var(--line)] px-3 py-2 text-sm"
        >
          <option value="">Select Doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.title}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="date"
          required
          className="rounded-lg border border-[var(--line)] px-3 py-2 text-sm"
        />

        <input
          type="time"
          name="time"
          required
          className="rounded-lg border border-[var(--line)] px-3 py-2 text-sm"
        />
      </div>

      <textarea
        name="notes"
        rows={2}
        placeholder="Appointment notes"
        className="rounded-lg border border-[var(--line)] px-3 py-2 text-sm"
      />

      <button className="button button-primary w-fit text-sm">
        Add Appointment
      </button>
    </form>
  );
}

export default async function DashboardPatientsPage() {
  await requirePermission("patients");
  const [patients, doctors, allAppointments] = await Promise.all([
    getAllPatients(),
    getAllDoctors(),
    getAllAppointments(),
  ]);

  // Group appointments by patient
  const appointmentsByPatient = allAppointments.reduce((acc, apt) => {
    if (apt.patient_id) {
      if (!acc[apt.patient_id]) {
        acc[apt.patient_id] = [];
      }
      acc[apt.patient_id].push(apt);
    }
    return acc;
  }, {} as Record<string, typeof allAppointments>);

  return (
    <>
      <article className="card p-6">
        <h1 className="text-2xl font-extrabold">Add New Patient</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Create a patient record for phone bookings or walk-ins
        </p>
        <div className="mt-4">
          <PatientWithAppointmentForm doctors={doctors} />
        </div>
      </article>

      {patients.length === 0 ? (
        <article className="card p-6">
          <p className="text-sm text-[var(--muted)]">No patients yet.</p>
        </article>
      ) : (
        patients.map((patient) => {
          const patientAppointments = appointmentsByPatient[patient.id] || [];

          return (
            <article key={patient.id} className="card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[var(--brand-deep)]">{patient.name}</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {patient.email} • {patient.phone}
                  </p>
                  {patient.date_of_birth && (
                    <p className="text-sm text-[var(--muted)]">
                      DOB: {new Date(patient.date_of_birth).toLocaleDateString()}
                      {patient.gender && ` • ${patient.gender}`}
                    </p>
                  )}
                  {patient.address && (
                    <p className="text-sm text-[var(--muted)]">{patient.address}</p>
                  )}
                  {patient.medical_history && (
                    <p className="mt-2 text-sm">
                      <span className="font-semibold">Medical History:</span> {patient.medical_history}
                    </p>
                  )}
                </div>
              </div>

              {/* Appointments Section */}
              <div className="mt-5">
                <h3 className="text-lg font-bold text-[var(--brand-deep)]">
                  Appointments ({patientAppointments.length})
                </h3>

                {patientAppointments.length > 0 && (
                  <div className="mt-3 grid gap-2">
                    {patientAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-start justify-between rounded-lg border border-[var(--line)] bg-[#fbfdff] p-3"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-[var(--brand-deep)]">
                            {appointment.doctor_name}
                          </p>
                          <p className="text-sm text-[var(--muted)]">
                            {appointment.appointment_date && new Date(appointment.appointment_date).toLocaleDateString()} at {appointment.appointment_time}
                          </p>
                          {appointment.message && (
                            <p className="mt-1 text-sm">{appointment.message}</p>
                          )}
                          <p className="mt-1">
                            <span
                              className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                                appointment.status === "Scheduled"
                                  ? "bg-blue-100 text-blue-700"
                                  : appointment.status === "Completed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {appointment.status}
                            </span>
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <AppointmentStatusSelector
                            patientId={patient.id}
                            appointmentId={appointment.id}
                            currentStatus={appointment.status}
                            onUpdate={updateAppointmentStatusAction}
                          />

                          <form action={deleteAppointmentAction}>
                            <input type="hidden" name="patientId" value={patient.id} />
                            <input type="hidden" name="appointmentId" value={appointment.id} />
                            <button className="button button-secondary text-xs">Delete</button>
                          </form>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <AppointmentForm patientId={patient.id} doctors={doctors} />
              </div>

              {/* Patient Actions */}
              <div className="mt-4 border-t border-[var(--line)] pt-4">
                <details className="text-sm">
                  <summary className="cursor-pointer font-semibold text-[var(--brand)]">
                    Edit Patient Details
                  </summary>
                  <div className="mt-3">
                    <PatientForm patient={patient} />
                  </div>
                </details>

                <form action={deletePatientAction} className="mt-3">
                  <input type="hidden" name="id" value={patient.id} />
                  <button className="button button-secondary text-xs">Delete Patient</button>
                </form>
              </div>
            </article>
          );
        })
      )}
    </>
  );
}
