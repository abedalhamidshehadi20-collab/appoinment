"use client";

import { useState } from "react";
import type { Appointment } from "@/lib/db";
import {
  BellRing,
  CalendarClock,
  ChevronDown,
  Eye,
  Search,
  UserRound,
  X,
} from "lucide-react";

type ReminderState = {
  eligible: boolean;
  alreadySent: boolean;
};

type AppointmentsManagementClientProps = {
  appointments: Appointment[];
  reminderBanner?: string;
  reminderStateMap: Record<string, ReminderState>;
  sendReminderAction: (formData: FormData) => void | Promise<void>;
};

type AppointmentTab = "all" | "reminders" | "upcoming";

function formatDate(value: string) {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString();
}

function formatDateTime(value: string) {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function normalizeStatus(status: string) {
  return status.trim().toLowerCase();
}

function getStatusBadgeClassName(status: string) {
  const value = normalizeStatus(status);

  if (value === "completed") {
    return "bg-[#eaf8ec] text-[#2f8f46]";
  }

  if (value === "scheduled" || value === "confirmed") {
    return "bg-[#eaf4ff] text-[var(--brand)]";
  }

  if (value === "cancelled" || value === "canceled") {
    return "bg-[#fdecec] text-[#c24141]";
  }

  if (value === "pending") {
    return "bg-[#fff3dc] text-[#c78818]";
  }

  return "bg-[#f3f5f8] text-[#6b7280]";
}

export function AppointmentsManagementClient({
  appointments,
  reminderBanner,
  reminderStateMap,
  sendReminderAction,
}: AppointmentsManagementClientProps) {
  const [activeTab, setActiveTab] = useState<AppointmentTab>("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  const availableStatuses = Array.from(
    new Set(
      appointments
        .map((item) => item.status?.trim())
        .filter(Boolean),
    ),
  );

  const today = new Date();
  const todayKey = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  ).getTime();

  const filteredAppointments = appointments.filter((item) => {
    const reminderState = reminderStateMap[item.id] ?? {
      eligible: false,
      alreadySent: false,
    };

    if (activeTab === "reminders" && !reminderState.eligible) {
      return false;
    }

    if (activeTab === "upcoming") {
      const appointmentDate = new Date(item.appointment_date);
      if (Number.isNaN(appointmentDate.getTime())) {
        return false;
      }

      const appointmentKey = new Date(
        appointmentDate.getFullYear(),
        appointmentDate.getMonth(),
        appointmentDate.getDate(),
      ).getTime();

      if (appointmentKey < todayKey) {
        return false;
      }
    }

    if (statusFilter !== "all" && item.status !== statusFilter) {
      return false;
    }

    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return true;
    }

    const haystack = [
      item.name,
      item.doctor_name,
      item.email,
      item.phone,
      item.location,
      item.service,
      item.message,
      item.appointment_date,
      item.appointment_time,
      item.status,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });

  const eligibleRemindersCount = appointments.filter(
    (item) => reminderStateMap[item.id]?.eligible,
  ).length;

  const upcomingCount = appointments.filter((item) => {
    const appointmentDate = new Date(item.appointment_date);
    if (Number.isNaN(appointmentDate.getTime())) {
      return false;
    }

    const appointmentKey = new Date(
      appointmentDate.getFullYear(),
      appointmentDate.getMonth(),
      appointmentDate.getDate(),
    ).getTime();

    return appointmentKey >= todayKey;
  }).length;

  const selectedAppointment =
    appointments.find((item) => item.id === selectedAppointmentId) ?? null;

  const tabButtonClassName = (value: AppointmentTab) =>
    `rounded-2xl px-4 py-3 text-sm font-semibold transition ${
      activeTab === value
        ? "bg-[#ffbc42] text-white shadow-[0_10px_24px_-18px_rgba(245,158,11,0.7)]"
        : "bg-[#fff7ea] text-[#b7791f] hover:bg-[#ffefcf]"
    }`;

  return (
    <div className="space-y-6">
      <article className="card overflow-hidden rounded-[30px] border border-[#e8edf5] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcff_100%)] shadow-[0_18px_40px_-30px_rgba(15,23,42,0.28)]">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-medium text-[#96a0af]">
                Appointment Requests
              </p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-[var(--brand-deep)]">
                Appointment Management
              </h1>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Requests submitted from doctor profile pages.
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--brand-deep)]">
                {appointments.length} total request{appointments.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          {reminderBanner ? (
            <article className="mt-6 rounded-[22px] border border-[#d9e8ff] bg-[#eef5ff] px-5 py-4 text-sm font-medium text-[#2456a6]">
              {reminderBanner}
            </article>
          ) : null}

          <div className="mt-6 grid gap-4 xl:grid-cols-3">
            <article className="rounded-[24px] border border-[#e7edf5] bg-white px-5 py-5 shadow-[0_12px_28px_-24px_rgba(15,23,42,0.22)]">
              <div className="flex items-center gap-4">
                <div className="rounded-[18px] bg-[#ecf8ee] p-3 text-[#2f8f46]">
                  <UserRound className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#7a8799]">Total Requests</p>
                  <p className="mt-1 text-3xl font-extrabold text-[var(--brand-deep)]">
                    {appointments.length}
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-[24px] border border-[#e7edf5] bg-white px-5 py-5 shadow-[0_12px_28px_-24px_rgba(15,23,42,0.22)]">
              <div className="flex items-center gap-4">
                <div className="rounded-[18px] bg-[#eef7ff] p-3 text-[var(--brand)]">
                  <BellRing className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#7a8799]">Reminder Queue</p>
                  <p className="mt-1 text-3xl font-extrabold text-[var(--brand-deep)]">
                    {eligibleRemindersCount}
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-[24px] border border-[#e7edf5] bg-white px-5 py-5 shadow-[0_12px_28px_-24px_rgba(15,23,42,0.22)]">
              <div className="flex items-center gap-4">
                <div className="rounded-[18px] bg-[#fff3dc] p-3 text-[#c78818]">
                  <CalendarClock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#7a8799]">Upcoming Requests</p>
                  <p className="mt-1 text-3xl font-extrabold text-[var(--brand-deep)]">
                    {upcomingCount}
                  </p>
                </div>
              </div>
            </article>
          </div>

          <div className="mt-7 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={tabButtonClassName("all")}
              >
                All Requests
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("reminders")}
                className={tabButtonClassName("reminders")}
              >
                Reminder Queue
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("upcoming")}
                className={tabButtonClassName("upcoming")}
              >
                Upcoming
              </button>
            </div>

            <div className="grid gap-3 xl:w-[540px] xl:grid-cols-[210px_minmax(0,1fr)]">
              <label className="relative block">
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="h-12 w-full appearance-none rounded-2xl border border-[#e7ebf3] bg-white px-4 pr-11 text-sm text-[#526072] shadow-sm outline-none transition focus:border-[#f0d49f] focus:ring-4 focus:ring-[#fff3dc]"
                >
                  <option value="all">All Status</option>
                  {availableStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98a3b3]" />
              </label>

              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98a3b3]" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search here"
                  className="h-12 w-full rounded-2xl border border-[#e7ebf3] bg-white pl-11 pr-4 text-sm text-[var(--brand-deep)] shadow-sm outline-none transition placeholder:text-[#9aa5b5] focus:border-[#f0d49f] focus:ring-4 focus:ring-[#fff3dc]"
                />
              </label>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto rounded-[24px] border border-[#edf1f6]">
            <table className="min-w-[1320px] w-full border-collapse bg-white">
              <thead>
                <tr className="bg-[#f8fafc] text-left text-xs font-semibold uppercase tracking-[0.12em] text-[#8290a2]">
                  <th className="px-5 py-4">Patient</th>
                  <th className="px-4 py-4">Doctor</th>
                  <th className="px-4 py-4">Preferred Date</th>
                  <th className="px-4 py-4">Preferred Time</th>
                  <th className="px-4 py-4">Location</th>
                  <th className="px-4 py-4">Service</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Submitted</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-5 py-10 text-center text-sm text-[var(--muted)]">
                      No appointment requests match the current search or filter.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((item) => {
                    const reminderState = reminderStateMap[item.id] ?? {
                      eligible: false,
                      alreadySent: false,
                    };

                    return (
                      <tr
                        key={item.id}
                        className="border-t border-[#eef2f7] align-top transition hover:bg-[#fbfdff]"
                      >
                        <td className="px-5 py-4">
                          <div className="max-w-[220px]">
                            <p className="text-sm font-semibold text-[var(--brand-deep)]">
                              {item.name}
                            </p>
                            <p className="mt-1 text-sm text-[#728093]">
                              {item.email}
                            </p>
                            <p className="mt-1 text-sm text-[#728093]">
                              {item.phone || "N/A"}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-[#526072]">
                          {item.doctor_name || "N/A"}
                        </td>
                        <td className="px-4 py-4 text-sm text-[#526072]">
                          {formatDate(item.appointment_date)}
                        </td>
                        <td className="px-4 py-4 text-sm text-[#526072]">
                          {item.appointment_time || "N/A"}
                        </td>
                        <td className="px-4 py-4 text-sm text-[#526072]">
                          {item.location || "N/A"}
                        </td>
                        <td className="px-4 py-4 text-sm text-[#526072]">
                          {item.service || "N/A"}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClassName(item.status || "N/A")}`}
                          >
                            {item.status || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-[#526072]">
                          {formatDateTime(item.created_at)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            {reminderState.eligible ? (
                              <form action={sendReminderAction}>
                                <input type="hidden" name="appointmentId" value={item.id} />
                                <button
                                  type="submit"
                                  disabled={reminderState.alreadySent}
                                  className="inline-flex rounded-xl border border-[#d9e8ff] bg-[#eef5ff] px-3 py-2 text-xs font-semibold text-[#2456a6] transition hover:bg-[#e1eeff] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {reminderState.alreadySent ? "Reminder Sent" : "Send Reminder"}
                                </button>
                              </form>
                            ) : null}

                            <button
                              type="button"
                              onClick={() => setSelectedAppointmentId(item.id)}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#e7ebf3] bg-white text-[#7b8797] transition hover:border-[#f0d49f] hover:text-[#b7791f]"
                              title="View request"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </article>

      {selectedAppointment ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[rgba(15,23,42,0.28)] p-4 backdrop-blur-[6px] sm:p-6">
          <button
            type="button"
            aria-label="Close appointment details"
            onClick={() => setSelectedAppointmentId(null)}
            className="absolute inset-0 cursor-default"
          />

          <section className="relative z-10 flex max-h-[calc(100vh-3rem)] w-full max-w-4xl flex-col overflow-hidden rounded-[30px] border border-[#ece3d3] bg-white shadow-[0_36px_70px_-38px_rgba(15,23,42,0.42)]">
            <div className="flex items-start justify-between gap-4 border-b border-[#f3ede2] px-6 py-5 sm:px-8">
              <div className="flex items-start gap-4">
                <div className="rounded-[20px] bg-[#fff3dc] p-3 text-[#c78818]">
                  <CalendarClock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c78818]">
                    Request Details
                  </p>
                  <h2 className="mt-1 text-[28px] font-extrabold tracking-[-0.03em] text-[var(--brand-deep)]">
                    {selectedAppointment.name}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    Full appointment request details from the doctor profile request queue.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAppointmentId(null)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#ece3d3] bg-white text-[var(--brand-deep)] transition hover:bg-[#fffaf1]"
                title="Close appointment details"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
              <div className="grid gap-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-[24px] border border-[#edf2f7] bg-[#fbfdff] px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#98a3b3]">
                      Doctor
                    </p>
                    <p className="mt-2 text-sm font-medium text-[var(--brand-deep)]">
                      {selectedAppointment.doctor_name || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#edf2f7] bg-[#fbfdff] px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#98a3b3]">
                      Submitted
                    </p>
                    <p className="mt-2 text-sm font-medium text-[var(--brand-deep)]">
                      {formatDateTime(selectedAppointment.created_at)}
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div className="rounded-[24px] border border-[#edf2f7] bg-[#fbfdff] px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#98a3b3]">
                      Email
                    </p>
                    <p className="mt-2 text-sm font-medium text-[var(--brand-deep)]">
                      {selectedAppointment.email}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#edf2f7] bg-[#fbfdff] px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#98a3b3]">
                      Phone
                    </p>
                    <p className="mt-2 text-sm font-medium text-[var(--brand-deep)]">
                      {selectedAppointment.phone || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#edf2f7] bg-[#fbfdff] px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#98a3b3]">
                      Status
                    </p>
                    <div className="mt-2">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClassName(selectedAppointment.status || "N/A")}`}
                      >
                        {selectedAppointment.status || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div className="rounded-[24px] border border-[#edf2f7] bg-[#fbfdff] px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#98a3b3]">
                      Preferred Date
                    </p>
                    <p className="mt-2 text-sm font-medium text-[var(--brand-deep)]">
                      {formatDate(selectedAppointment.appointment_date)}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#edf2f7] bg-[#fbfdff] px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#98a3b3]">
                      Preferred Time
                    </p>
                    <p className="mt-2 text-sm font-medium text-[var(--brand-deep)]">
                      {selectedAppointment.appointment_time || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#edf2f7] bg-[#fbfdff] px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#98a3b3]">
                      Service
                    </p>
                    <p className="mt-2 text-sm font-medium text-[var(--brand-deep)]">
                      {selectedAppointment.service || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#edf2f7] bg-[#fbfdff] px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#98a3b3]">
                    Location / Insurance
                  </p>
                  <p className="mt-2 text-sm font-medium text-[var(--brand-deep)]">
                    {selectedAppointment.location || "N/A"}
                  </p>
                </div>

                <div className="rounded-[24px] border border-[#edf2f7] bg-[#fbfdff] px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#98a3b3]">
                    Message
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#445164]">
                    {selectedAppointment.message || "No message"}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
