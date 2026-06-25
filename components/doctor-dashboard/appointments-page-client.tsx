"use client";

import { useState } from "react";
import type { Appointment } from "@/lib/db";
import { useDeferredSearch } from "@/hooks/useDeferredSearch";
import { FormSubmitButton } from "@/components/doctor-dashboard/form-submit-button";
import { CalendarClock, Search } from "lucide-react";

type AppointmentsPageClientProps = {
  appointments: Appointment[];
  updateStatusAction: (formData: FormData) => void | Promise<void>;
};

type RangeFilter = "all" | "day" | "week" | "month";
type StatusFilter = "all" | "Pending" | "Completed" | "Cancelled";

function normalizeStatus(value: string) {
  const normalized = value.trim().toLowerCase();
  if (normalized === "done") return "completed";
  if (normalized === "confirmed") return "pending";
  if (normalized === "scheduled") return "pending";
  if (normalized === "canceled") return "cancelled";
  return normalized || "pending";
}

function formatStatusLabel(value: string) {
  const normalized = normalizeStatus(value);
  if (normalized === "completed") return "Completed";
  if (normalized === "cancelled") return "Cancelled";
  return "Pending";
}

function parseDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function matchesRange(value: string, range: RangeFilter) {
  if (range === "all") {
    return true;
  }

  const date = parseDate(value);
  if (!date) {
    return false;
  }

  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (range === "day") return diffDays >= -1 && diffDays <= 1;
  if (range === "week") return diffDays >= -7 && diffDays <= 7;
  return diffDays >= -31 && diffDays <= 31;
}

function formatDate(value: string) {
  const date = parseDate(value);
  return date ? date.toLocaleDateString() : value || "N/A";
}

export function AppointmentsPageClient({
  appointments,
  updateStatusAction,
}: AppointmentsPageClientProps) {
  const { query, setQuery, deferredQuery } = useDeferredSearch();
  const [range, setRange] = useState<RangeFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");

  const filteredAppointments = appointments.filter((appointment) => {
    if (!matchesRange(appointment.appointment_date, range)) {
      return false;
    }

    if (status !== "all" && normalizeStatus(appointment.status || "") !== status.toLowerCase()) {
      return false;
    }

    if (!deferredQuery) {
      return true;
    }

    const haystack = [
      appointment.name,
      appointment.email,
      appointment.phone,
      appointment.service,
      appointment.appointment_date,
      appointment.status,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(deferredQuery);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[28px] border border-[#e6edf7] bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.16)]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5f8ed5]">
            Appointment Flow
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[#153a6b]">
            Appointments
          </h2>
          <p className="mt-2 text-sm text-[#6d7f95]">
            Review upcoming visits, update statuses, and keep your schedule clean.
          </p>
        </div>

        <div className="grid gap-3 xl:grid-cols-[180px_180px_minmax(0,1fr)]">
          <select
            value={range}
            onChange={(event) => setRange(event.target.value as RangeFilter)}
            className="h-11 rounded-2xl border border-[#e6edf7] bg-[#fbfdff] px-4 text-sm text-[#24476e] outline-none"
          >
            <option value="all">All ranges</option>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as StatusFilter)}
            className="h-11 rounded-2xl border border-[#e6edf7] bg-[#fbfdff] px-4 text-sm text-[#24476e] outline-none"
          >
            <option value="all">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#97a5b8]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search appointments, patients, or services"
              className="h-11 w-full rounded-2xl border border-[#e6edf7] bg-[#fbfdff] pl-11 pr-4 text-sm text-[#24476e] outline-none"
            />
          </label>
        </div>
      </div>

      <section className="overflow-hidden rounded-[28px] border border-[#e6edf7] bg-white shadow-[0_18px_40px_-30px_rgba(15,23,42,0.16)]">
        <div className="flex items-center justify-between border-b border-[#eef3f8] px-6 py-5">
          <div>
            <h3 className="text-lg font-bold text-[#153a6b]">Appointment Queue</h3>
            <p className="mt-1 text-sm text-[#6d7f95]">
              {filteredAppointments.length} appointment{filteredAppointments.length === 1 ? "" : "s"} found
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#eef5ff] px-3 py-1.5 text-xs font-semibold text-[#2b63b8]">
            <CalendarClock className="h-4 w-4" />
            Doctor schedule
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1040px] w-full">
            <thead>
              <tr className="bg-[#f8fbff] text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#7f8da0]">
                <th className="px-6 py-4">Patient</th>
                <th className="px-4 py-4">Contact</th>
                <th className="px-4 py-4">Date</th>
                <th className="px-4 py-4">Time</th>
                <th className="px-4 py-4">Service</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-[#7f8da0]">
                    No appointments match the current filters.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="border-t border-[#eef3f8] align-top">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#153a6b]">{appointment.name}</p>
                      <p className="mt-1 text-sm text-[#6d7f95]">{appointment.message || "No message"}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-[#4a6078]">
                      <p>{appointment.email}</p>
                      <p className="mt-1">{appointment.phone || "N/A"}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-[#4a6078]">{formatDate(appointment.appointment_date)}</td>
                    <td className="px-4 py-4 text-sm text-[#4a6078]">{appointment.appointment_time || "N/A"}</td>
                    <td className="px-4 py-4 text-sm text-[#4a6078]">{appointment.service || "General Consultation"}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-semibold text-[#2b63b8]">
                        {formatStatusLabel(appointment.status || "Pending")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <form action={updateStatusAction} className="flex justify-end gap-2">
                        <input type="hidden" name="appointmentId" value={appointment.id} />
                        <select
                          name="status"
                          defaultValue={formatStatusLabel(appointment.status || "Pending")}
                          className="h-10 rounded-xl border border-[#dce7f6] bg-white px-3 text-sm text-[#24476e] outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <FormSubmitButton
                          label="Save"
                          pendingLabel="Saving..."
                          className="rounded-xl bg-[#2377e7] px-4 text-sm font-semibold text-white transition hover:bg-[#1b67cb] disabled:opacity-60"
                        />
                      </form>
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
