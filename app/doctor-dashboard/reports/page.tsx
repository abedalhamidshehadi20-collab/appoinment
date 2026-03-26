import { CalendarClock, CheckCircle2, CircleSlash, Users } from "lucide-react";
import { ReportsChart } from "@/components/doctor-dashboard/reports-chart";
import { SummaryCard } from "@/components/doctor-dashboard/summary-card";
import { requireDoctorUser } from "@/lib/auth";
import { getDoctorReports } from "@/lib/doctor-dashboard/service";

function percent(part: number, total: number) {
  if (total === 0) {
    return "0%";
  }

  return `${Math.round((part / total) * 100)}%`;
}

export default async function DoctorReportsPage() {
  const user = await requireDoctorUser();
  const reports = await getDoctorReports(user.doctorId!);
  const totalAppointments =
    reports.statusBreakdown.pending +
    reports.statusBreakdown.completed +
    reports.statusBreakdown.cancelled;

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-[#dfe9f7] bg-[linear-gradient(135deg,#ffffff_0%,#f7fbff_58%,#edf5ff_100%)] p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.2)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5b87c5]">
          Performance Overview
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-[#153a6b] sm:text-4xl">
          Reports
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6d7f95]">
          Review patient growth, appointment throughput, and completion trends from one reporting view.
        </p>
      </section>

      <div className="grid gap-4 xl:grid-cols-3">
        <SummaryCard
          label="Patients count"
          value={reports.summary.totalPatients}
          hint="Patients assigned to your care panel"
          icon={Users}
          tone="blue"
        />
        <SummaryCard
          label="Appointments count"
          value={totalAppointments}
          hint="All tracked appointments in this dashboard"
          icon={CalendarClock}
          tone="amber"
        />
        <SummaryCard
          label="Completed rate"
          value={percent(reports.statusBreakdown.completed, totalAppointments)}
          hint="Portion of appointments closed as completed"
          icon={CheckCircle2}
          tone="green"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[28px] border border-[#e6edf7] bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.16)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5f8ed5]">
            Monthly Trend
          </p>
          <h3 className="mt-2 text-xl font-extrabold tracking-[-0.03em] text-[#153a6b]">
            Appointment activity
          </h3>
          <div className="mt-6">
            <ReportsChart data={reports.monthlyAppointments} />
          </div>
        </section>

        <section className="rounded-[28px] border border-[#e6edf7] bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.16)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5f8ed5]">
            Status Breakdown
          </p>
          <h3 className="mt-2 text-xl font-extrabold tracking-[-0.03em] text-[#153a6b]">
            Operational snapshot
          </h3>

          <div className="mt-6 space-y-4">
            <article className="rounded-[22px] border border-[#e8eef7] bg-[#fbfdff] px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef5ff] text-[#2b63b8]">
                    <CalendarClock className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-[#153a6b]">Pending</p>
                    <p className="text-sm text-[#6d7f95]">Awaiting treatment or review</p>
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-[#153a6b]">{reports.statusBreakdown.pending}</p>
              </div>
            </article>

            <article className="rounded-[22px] border border-[#e8eef7] bg-[#fbfdff] px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf9f1] text-[#1f9d57]">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-[#153a6b]">Completed</p>
                    <p className="text-sm text-[#6d7f95]">Visits closed successfully</p>
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-[#153a6b]">{reports.statusBreakdown.completed}</p>
              </div>
            </article>

            <article className="rounded-[22px] border border-[#e8eef7] bg-[#fbfdff] px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff4e7] text-[#e79c23]">
                    <CircleSlash className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-[#153a6b]">Cancelled</p>
                    <p className="text-sm text-[#6d7f95]">Visits removed from the queue</p>
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-[#153a6b]">{reports.statusBreakdown.cancelled}</p>
              </div>
            </article>
          </div>
        </section>
      </div>

      <section className="overflow-hidden rounded-[28px] border border-[#e6edf7] bg-white shadow-[0_18px_40px_-30px_rgba(15,23,42,0.16)]">
        <div className="border-b border-[#eef3f8] px-6 py-5">
          <h3 className="text-lg font-bold text-[#153a6b]">Monthly archive</h3>
          <p className="mt-1 text-sm text-[#6d7f95]">
            Last {reports.monthlyAppointments.length || 0} tracked reporting period{reports.monthlyAppointments.length === 1 ? "" : "s"}.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[680px] w-full">
            <thead>
              <tr className="bg-[#f8fbff] text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#7f8da0]">
                <th className="px-6 py-4">Month</th>
                <th className="px-4 py-4">Appointments</th>
                <th className="px-4 py-4">Completed</th>
                <th className="px-6 py-4">Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {reports.monthlyAppointments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-[#7f8da0]">
                    No report rows available yet.
                  </td>
                </tr>
              ) : (
                reports.monthlyAppointments.map((item) => (
                  <tr key={item.month} className="border-t border-[#eef3f8]">
                    <td className="px-6 py-4 font-semibold text-[#153a6b]">{item.month}</td>
                    <td className="px-4 py-4 text-sm text-[#4a6078]">{item.appointments}</td>
                    <td className="px-4 py-4 text-sm text-[#4a6078]">{item.completed}</td>
                    <td className="px-6 py-4 text-sm text-[#4a6078]">
                      {percent(item.completed, item.appointments)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
