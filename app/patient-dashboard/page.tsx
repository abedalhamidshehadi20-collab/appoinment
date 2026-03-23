import { requirePatient } from "@/lib/patient-auth";
import { findPatientByEmail, getAppointmentsForPatient, updatePatientReminderPreference } from "@/lib/db";
import Link from "next/link";
import { Calendar, CheckCircle2, Clock3, CircleAlert, BellRing, UserRound, PlusCircle } from "lucide-react";

function normalizeStatus(status: string) {
  const value = status.toLowerCase();

  if (value === "scheduled" || value === "confirmed") {
    return "scheduled";
  }

  if (value === "done" || value === "completed") {
    return "completed";
  }

  if (value === "cancelled" || value === "canceled") {
    return "cancelled";
  }

  return "pending";
}

function statusBadge(status: string) {
  const value = normalizeStatus(status);

  if (value === "completed") {
    return "bg-green-100 text-green-700";
  }

  if (value === "scheduled") {
    return "bg-blue-100 text-blue-700";
  }

  if (value === "cancelled") {
    return "bg-red-100 text-red-700";
  }

  return "bg-amber-100 text-amber-700";
}

function formatDate(dateValue: string) {
  if (!dateValue) {
    return "-";
  }

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) {
    return dateValue;
  }

  return parsed.toLocaleDateString();
}

function toDateOnly(value: string) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  parsed.setHours(0, 0, 0, 0);
  return parsed;
}

function statusLabel(status: string) {
  const value = normalizeStatus(status);
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default async function PatientDashboardPage() {
  const patient = await requirePatient("/patient-dashboard");
  const [appointments, patientRecord] = await Promise.all([
    getAppointmentsForPatient(patient.id, patient.email),
    findPatientByEmail(patient.email),
  ]);

  const remindersEnabled = patientRecord?.reminder_opt_in ?? true;

  async function updateReminderPreference(formData: FormData) {
    "use server";

    const enabled = formData.get("reminders") === "on";
    await updatePatientReminderPreference(patient.id, enabled);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingAppointments = appointments.filter((item) => {
    const status = normalizeStatus(item.status);
    if (status === "completed" || status === "cancelled") {
      return false;
    }

    const dateOnly = toDateOnly(item.appointment_date);
    if (!dateOnly) {
      return true;
    }

    return dateOnly >= today;
  });

  const upcomingIds = new Set(upcomingAppointments.map((item) => item.id));
  const previousAppointments = appointments.filter((item) => !upcomingIds.has(item.id));

  const pendingCount = appointments.filter((item) => normalizeStatus(item.status) === "pending").length;
  const scheduledCount = appointments.filter((item) => normalizeStatus(item.status) === "scheduled").length;
  const completedCount = appointments.filter((item) => normalizeStatus(item.status) === "completed").length;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {patient.name}. Track your upcoming and previous appointments.
          </p>
        </div>

        <Link
          href="/appointments"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium !text-white transition hover:bg-blue-700"
        >
          <PlusCircle className="h-4 w-4 text-white" />
          Book New Appointment
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Appointments</p>
            <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500">
            <Clock3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500">
            <CircleAlert className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Scheduled</p>
            <p className="text-2xl font-bold text-gray-900">{scheduledCount}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500">
            <CheckCircle2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-xl bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
            <span className="text-sm text-gray-500">Action required first</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Doctor</th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Service</th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Time</th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {upcomingAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-sm text-gray-500">
                      No upcoming appointments. You can book a new one anytime.
                    </td>
                  </tr>
                ) : (
                  upcomingAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="py-3 text-sm font-medium text-gray-900">{appointment.doctor_name || "General Desk"}</td>
                      <td className="py-3 text-sm text-gray-600">{appointment.service || "General Consultation"}</td>
                      <td className="py-3 text-sm text-gray-600">{formatDate(appointment.appointment_date)}</td>
                      <td className="py-3 text-sm text-gray-600">{appointment.appointment_time || "-"}</td>
                      <td className="py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge(appointment.status)}`}>
                          {statusLabel(appointment.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <UserRound className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
            </div>

            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Name</dt>
                <dd className="font-medium text-gray-900">{patientRecord?.name || patient.name}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Email</dt>
                <dd className="font-medium text-gray-900">{patientRecord?.email || patient.email}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Phone</dt>
                <dd className="font-medium text-gray-900">{patientRecord?.phone || "-"}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <BellRing className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Appointment Reminders</h2>
            </div>

            <p className="mb-4 text-sm text-gray-600">
              Receive email reminders for pending and scheduled appointments.
            </p>

            <form action={updateReminderPreference} className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3">
                <input
                  type="checkbox"
                  name="reminders"
                  defaultChecked={remindersEnabled}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Enable reminder emails</span>
              </label>

              <button
                type="submit"
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Save preference
              </button>
            </form>
          </div>
        </section>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Previous Appointments</h2>
          <span className="text-sm text-gray-500">Completed or older visits</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Doctor</th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Service</th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Time</th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {previousAppointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-sm text-gray-500">
                    No previous appointments yet.
                  </td>
                </tr>
              ) : (
                previousAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="py-3 text-sm font-medium text-gray-900">{appointment.doctor_name || "General Desk"}</td>
                    <td className="py-3 text-sm text-gray-600">{appointment.service || "General Consultation"}</td>
                    <td className="py-3 text-sm text-gray-600">{formatDate(appointment.appointment_date)}</td>
                    <td className="py-3 text-sm text-gray-600">{appointment.appointment_time || "-"}</td>
                    <td className="py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge(appointment.status)}`}>
                        {statusLabel(appointment.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
