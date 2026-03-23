import { requirePatient } from "@/lib/patient-auth";
import { getAppointmentsForPatient } from "@/lib/db";
import { Calendar, CheckCircle2, Clock3, CircleAlert } from "lucide-react";

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

export default async function PatientDashboardPage() {
  const patient = await requirePatient("/patient-dashboard");
  const appointments = await getAppointmentsForPatient(patient.id, patient.email);

  const pendingCount = appointments.filter((item) => normalizeStatus(item.status) === "pending").length;
  const scheduledCount = appointments.filter((item) => normalizeStatus(item.status) === "scheduled").length;
  const completedCount = appointments.filter((item) => normalizeStatus(item.status) === "completed").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {patient.name}. Track your upcoming and previous appointments.
          </p>
        </div>
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

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">My Appointments</h2>
          <span className="text-sm text-gray-500">Latest first</span>
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
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-sm text-gray-500">
                    No appointments yet. Book your first appointment.
                  </td>
                </tr>
              ) : (
                appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="py-3 text-sm font-medium text-gray-900">{appointment.doctor_name || "General Desk"}</td>
                    <td className="py-3 text-sm text-gray-600">{appointment.service || "General Consultation"}</td>
                    <td className="py-3 text-sm text-gray-600">{formatDate(appointment.appointment_date)}</td>
                    <td className="py-3 text-sm text-gray-600">{appointment.appointment_time || "-"}</td>
                    <td className="py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge(appointment.status)}`}>
                        {normalizeStatus(appointment.status)}
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
