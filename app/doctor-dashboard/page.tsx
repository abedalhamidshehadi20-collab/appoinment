import Link from "next/link";
import { CalendarClock, CheckCircle2, Users } from "lucide-react";
import { requireDoctorUser } from "@/lib/auth";
import {
  getDoctorDashboardSummary,
  getDoctorNotifications,
  getDoctorReports,
  getDoctorTodayAppointments,
} from "@/lib/doctor-dashboard/service";
import { SummaryCard } from "@/components/doctor-dashboard/summary-card";
import { ReportsChart } from "@/components/doctor-dashboard/reports-chart";

function formatDateTime(dateValue: string, timeValue: string) {
  if (!dateValue) {
    return timeValue || "N/A";
  }

  const parsed = new Date(dateValue);
  const dateLabel = Number.isNaN(parsed.getTime())
    ? dateValue
    : parsed.toLocaleDateString();

  return `${dateLabel} ${timeValue || ""}`.trim();
}

export default async function DoctorDashboardHomePage() {
  const user = await requireDoctorUser();
  const [summary, todaysAppointments, notifications, reports] = await Promise.all([
    getDoctorDashboardSummary(user.doctorId!),
    getDoctorTodayAppointments(user.doctorId!),
    getDoctorNotifications(user.doctorId!),
    getDoctorReports(user.doctorId!),
  ]);

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-[#dfe9f7] bg-[linear-gradient(135deg,#ffffff_0%,#f7fbff_58%,#edf5ff_100%)] p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.2)] sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5b87c5]">
              Doctor Dashboard
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-[#153a6b] sm:text-4xl">
              Clinical command center
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6d7f95]">
              Review your day, monitor patient flow, and stay on top of every visit from one professional workspace.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/doctor-dashboard/appointments"
              className="rounded-2xl bg-[#2377e7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1b67cb]"
            >
              Open appointments
            </Link>
            <Link
              href="/doctor-dashboard/patients"
              className="rounded-2xl border border-[#d7e4f5] bg-white px-5 py-3 text-sm font-semibold text-[#24476e] transition hover:bg-[#f8fbff]"
            >
              Review patients
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-3">
        <SummaryCard
          label="Total patients"
          value={summary.totalPatients}
          hint="Assigned to your current practice"
          icon={Users}
          tone="blue"
        />
        <SummaryCard
          label="Today's appointments"
          value={summary.todaysAppointments}
          hint="Scheduled for the current day"
          icon={CalendarClock}
          tone="amber"
        />
        <SummaryCard
          label="Completed appointments"
          value={summary.completedAppointments}
          hint="Marked completed in your panel"
          icon={CheckCircle2}
          tone="green"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[28px] border border-[#e6edf7] bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.16)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5f8ed5]">
                Today
              </p>
              <h3 className="mt-2 text-xl font-extrabold tracking-[-0.03em] text-[#153a6b]">
                Today&apos;s appointments
              </h3>
            </div>
            <Link href="/doctor-dashboard/appointments" className="text-sm font-semibold text-[#2377e7]">
              View all
            </Link>
          </div>

          <div className="mt-5 space-y-4">
            {todaysAppointments.length === 0 ? (
              <div className="rounded-[22px] border border-dashed border-[#d7e4f5] bg-[#fbfdff] px-5 py-10 text-center text-sm text-[#7f8da0]">
                No appointments scheduled for today.
              </div>
            ) : (
              todaysAppointments.map((appointment) => (
                <article
                  key={appointment.id}
                  className="rounded-[22px] border border-[#e9eef7] bg-[#fbfdff] px-5 py-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-[#153a6b]">{appointment.name}</p>
                      <p className="mt-1 text-sm text-[#6d7f95]">
                        {appointment.service || "General Consultation"}
                      </p>
                    </div>
                    <div className="text-sm text-[#4a6078]">
                      {formatDateTime(appointment.appointment_date, appointment.appointment_time)}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="rounded-[28px] border border-[#e6edf7] bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.16)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5f8ed5]">
            Activity
          </p>
          <h3 className="mt-2 text-xl font-extrabold tracking-[-0.03em] text-[#153a6b]">
            Recent notifications
          </h3>

          <div className="mt-5 space-y-4">
            {notifications.slice(0, 5).map((notification) => (
              <article key={notification.id} className="rounded-[22px] border border-[#e9eef7] bg-[#fbfdff] px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-[#153a6b]">{notification.title}</p>
                  {!notification.is_read ? (
                    <span className="rounded-full bg-[#e8f1ff] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2b63b8]">
                      New
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm leading-6 text-[#6d7f95]">{notification.message}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-[28px] border border-[#e6edf7] bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.16)]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5f8ed5]">
            Reports Snapshot
          </p>
          <h3 className="mt-2 text-xl font-extrabold tracking-[-0.03em] text-[#153a6b]">
            Appointment performance
          </h3>
        </div>
        <div className="mt-6">
          <ReportsChart data={reports.monthlyAppointments} />
        </div>
      </section>
    </div>
  );
}
