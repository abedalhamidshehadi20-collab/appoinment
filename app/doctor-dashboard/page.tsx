import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BellRing,
  Calendar,
  CheckCircle2,
  CircleAlert,
  PlusCircle,
  UserRound,
  Users,
} from "lucide-react";
import { requireDoctorUser } from "@/lib/auth";
import {
  getDoctorAppointments,
  getDoctorBySessionId,
  getDoctorDashboardSummary,
  getDoctorNotifications,
  getDoctorTodayAppointments,
} from "@/lib/doctor-dashboard/service";

function normalizeStatus(status: string) {
  const value = status.trim().toLowerCase();

  if (value === "completed" || value === "done") {
    return "completed";
  }

  if (value === "scheduled" || value === "confirmed") {
    return "scheduled";
  }

  if (value === "cancelled" || value === "canceled") {
    return "cancelled";
  }

  return "pending";
}

function statusLabel(status: string) {
  const value = normalizeStatus(status);
  return value.charAt(0).toUpperCase() + value.slice(1);
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

function parseDate(value: string) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

function formatDate(value: string) {
  const parsed = parseDate(value);
  return parsed ? parsed.toLocaleDateString() : value || "-";
}

function isSameDay(value: string, compare: Date) {
  const parsed = parseDate(value);
  if (!parsed) {
    return false;
  }

  return (
    parsed.getFullYear() === compare.getFullYear() &&
    parsed.getMonth() === compare.getMonth() &&
    parsed.getDate() === compare.getDate()
  );
}

function formatNotificationDate(value: string) {
  const parsed = parseDate(value);
  return parsed ? parsed.toLocaleString() : value || "-";
}

export default async function DoctorDashboardHomePage() {
  const user = await requireDoctorUser();
  const [doctor, summary, appointments, todaysAppointments, notifications] = await Promise.all([
    getDoctorBySessionId(user.doctorId!),
    getDoctorDashboardSummary(user.doctorId!),
    getDoctorAppointments(user.doctorId!),
    getDoctorTodayAppointments(user.doctorId!),
    getDoctorNotifications(user.doctorId!),
  ]);

  if (!doctor) {
    redirect("/doctor-login");
  }

  const today = new Date();
  const pendingCount = appointments.filter(
    (appointment) => normalizeStatus(appointment.status || "") === "pending",
  ).length;

  const recentAppointments = appointments
    .filter((appointment) => !isSameDay(appointment.appointment_date, today))
    .slice()
    .sort((left, right) => {
      const leftValue = parseDate(left.appointment_date)?.getTime() ?? 0;
      const rightValue = parseDate(right.appointment_date)?.getTime() ?? 0;
      return rightValue - leftValue;
    })
    .slice(0, 8);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {doctor.title}. Track today&apos;s visits, patient activity, and recent updates.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/doctor-dashboard/appointments"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium !text-white transition hover:bg-blue-700"
          >
            <PlusCircle className="h-4 w-4 text-white" />
            Open Appointments
          </Link>
          <Link
            href="/doctor-dashboard/patients"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <Users className="h-4 w-4" />
            Review Patients
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Patients</p>
            <p className="text-2xl font-bold text-gray-900">{summary.totalPatients}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Today&apos;s Appointments</p>
            <p className="text-2xl font-bold text-gray-900">{summary.todaysAppointments}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500">
            <CircleAlert className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500">
            <CheckCircle2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-gray-900">{summary.completedAppointments}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-xl bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Today&apos;s Appointments</h2>
            <span className="text-sm text-gray-500">Current day schedule</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Patient</th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Service</th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Time</th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {todaysAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-sm text-gray-500">
                      No appointments scheduled for today.
                    </td>
                  </tr>
                ) : (
                  todaysAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="py-3 text-sm font-medium text-gray-900">{appointment.name}</td>
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
                <dd className="font-medium text-gray-900">{doctor.title}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Specialty</dt>
                <dd className="font-medium text-gray-900">{doctor.sector || "Doctor"}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Email</dt>
                <dd className="font-medium text-gray-900">{user.email}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Location</dt>
                <dd className="font-medium text-gray-900">{doctor.location || "-"}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <BellRing className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Recent Notifications</h2>
            </div>

            <div className="space-y-3">
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-500">No notifications yet.</p>
              ) : (
                notifications.slice(0, 3).map((notification) => (
                  <article key={notification.id} className="rounded-lg border border-gray-200 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                      </div>
                      {!notification.is_read ? (
                        <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                          New
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      {formatNotificationDate(notification.created_at)}
                    </p>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Appointments</h2>
          <span className="text-sm text-gray-500">Completed or older visits</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Patient</th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Service</th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Time</th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentAppointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-sm text-gray-500">
                    No recent appointments outside today&apos;s queue.
                  </td>
                </tr>
              ) : (
                recentAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="py-3 text-sm font-medium text-gray-900">{appointment.name}</td>
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
