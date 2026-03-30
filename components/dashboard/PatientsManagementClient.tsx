"use client";

import { useState } from "react";
import { deletePatientAction } from "@/app/dashboard/actions";
import { PatientAppointmentsPanel } from "@/components/dashboard/PatientAppointmentsPanel";
import { PatientProfileForm } from "@/components/dashboard/PatientProfileForm";
import { DeleteActionButton } from "@/components/ui/DeleteActionButton";
import type { Appointment, Patient } from "@/lib/db";
import PatientWithAppointmentForm from "@/components/PatientWithAppointmentForm";
import {
  CalendarDays,
  ChevronDown,
  Filter,
  Mail,
  Pencil,
  Phone,
  Plus,
  Search,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

type DoctorOption = {
  id: string;
  title: string;
};

type PatientsManagementClientProps = {
  patients: Patient[];
  doctors: DoctorOption[];
  appointments: Appointment[];
  errorMessage?: string;
};

function formatDate(value: string) {
  if (!value) return "-";

  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;

  return `${month}/${day}/${year}`;
}

export function PatientsManagementClient({
  patients,
  doctors,
  appointments,
  errorMessage,
}: PatientsManagementClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const availableGenders = Array.from(
    new Set(
      patients
        .map((patient) => patient.gender?.trim())
        .filter(Boolean),
    ),
  );

  const filteredPatients = patients.filter((patient) => {
    const matchesGender =
      genderFilter === "All" ? true : patient.gender === genderFilter;

    if (!matchesGender) {
      return false;
    }

    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return true;
    }

    const haystack = [
      patient.name,
      patient.email,
      patient.phone,
      patient.address,
      patient.gender,
      patient.medical_history,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });

  const selectedPatient =
    patients.find((patient) => patient.id === selectedPatientId) ?? null;
  const selectedPatientAppointments = selectedPatient
    ? appointments.filter((appointment) => appointment.patient_id === selectedPatient.id)
    : [];

  return (
    <div className="space-y-6">
      {errorMessage ? (
        <article className="card border border-[#fecaca] bg-[#fef2f2] p-4 text-sm font-medium text-[#991b1b]">
          {errorMessage}
        </article>
      ) : null}

      <article className="card overflow-hidden rounded-[28px] border border-[#e7eef9] bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.28)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
              Patients
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-[var(--brand-deep)]">
              Patient Management
            </h1>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Manage patient records, contact details, and appointments from one place.
            </p>
            <p className="mt-2 text-sm font-semibold text-[var(--brand-deep)]">
              {patients.length} patient{patients.length === 1 ? "" : "s"} in directory
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-16 lg:pt-20">
            <button
              type="button"
              onClick={() => {
                setSelectedPatientId(null);
                setShowCreateForm(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f68cb]"
            >
              <Plus className="h-4 w-4" />
              Add Patient
            </button>
          </div>
        </div>

        <section className="mt-6 rounded-[24px] border border-[#dce8fb] bg-white p-5 shadow-[0_12px_28px_-24px_rgba(17,24,39,0.25)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[var(--brand-deep)]">
                Patient Directory
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Search, filter, and open a patient record for editing below.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:w-[540px]">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search patients"
                  className="h-11 w-full rounded-xl border border-[var(--line)] bg-white pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-[#bfd5ff] focus:ring-4 focus:ring-[#e8f0ff]"
                />
              </label>

              <label className="relative block">
                <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                <select
                  value={genderFilter}
                  onChange={(event) => setGenderFilter(event.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-[var(--line)] bg-white pl-11 pr-10 text-sm shadow-sm outline-none transition focus:border-[#bfd5ff] focus:ring-4 focus:ring-[#e8f0ff]"
                >
                  <option value="All">All Genders</option>
                  {availableGenders.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              </label>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto rounded-[22px] border border-[#edf2fb]">
            <table className="min-w-[1040px] w-full border-collapse">
              <thead>
                <tr className="bg-[#f8fbff] text-left text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  <th className="px-5 py-4">Patient</th>
                  <th className="px-4 py-4">Email</th>
                  <th className="px-4 py-4">Phone</th>
                  <th className="px-4 py-4">Date of Birth</th>
                  <th className="px-4 py-4">Gender</th>
                  <th className="px-4 py-4">Appointments</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-sm text-[var(--muted)]">
                      No patients match this search or filter.
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient) => {
                    const isSelected = patient.id === selectedPatientId;
                    const appointmentCount = appointments.filter(
                      (appointment) => appointment.patient_id === patient.id,
                    ).length;

                    return (
                      <tr
                        key={patient.id}
                        className={`border-t border-[#eef2f7] align-top transition ${
                          isSelected ? "bg-[#f8fbff]" : "bg-white hover:bg-[#fbfdff]"
                        }`}
                      >
                        <td className="px-5 py-4">
                          <p className="max-w-[240px] text-sm font-semibold text-[var(--brand-deep)]">
                            {patient.name}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-sm text-[var(--muted)]">
                          <span className="inline-flex items-center gap-2">
                            <Mail className="h-4 w-4 text-[var(--brand)]" />
                            {patient.email || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-[var(--muted)]">
                          <span className="inline-flex items-center gap-2">
                            <Phone className="h-4 w-4 text-[var(--brand)]" />
                            {patient.phone || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-[var(--muted)]">
                          <span className="inline-flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-[var(--brand)]" />
                            {patient.date_of_birth ? formatDate(patient.date_of_birth) : "-"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-[var(--brand-deep)]">
                          {patient.gender || "-"}
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-[var(--brand-deep)]">
                          {appointmentCount}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setShowCreateForm(false);
                                setSelectedPatientId(patient.id);
                              }}
                              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition ${
                                isSelected
                                  ? "border-[#bfd5ff] bg-[#eef4ff] text-[var(--brand)]"
                                  : "border-[#e5e7eb] bg-white text-[var(--muted)] hover:border-[#bfd5ff] hover:text-[var(--brand)]"
                              }`}
                              title="Edit Patient"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>

                            <DeleteActionButton
                              action={deletePatientAction}
                              values={{ id: patient.id }}
                              dialogTitle="Delete Patient"
                              dialogMessage={`Are you sure you want to delete "${patient.name}"? This action cannot be undone.`}
                              buttonTitle="Delete Patient"
                              buttonClassName="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e5e7eb] bg-white text-[var(--muted)] transition hover:border-[#fecaca] hover:text-[#dc2626]"
                            >
                                <Trash2 className="h-4 w-4" />
                            </DeleteActionButton>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </article>

      {showCreateForm ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[rgba(15,23,42,0.28)] p-4 backdrop-blur-[6px] sm:p-6">
          <button
            type="button"
            aria-label="Close create patient form"
            onClick={() => setShowCreateForm(false)}
            className="absolute inset-0 cursor-default"
          />

          <section className="relative z-10 flex max-h-[calc(100vh-3rem)] w-full max-w-5xl flex-col overflow-hidden rounded-[30px] border border-[#dce8fb] bg-white shadow-[0_36px_70px_-38px_rgba(15,23,42,0.42)]">
            <div className="flex items-start justify-between gap-4 border-b border-[#edf2fb] px-6 py-5 sm:px-8">
              <div className="flex items-start gap-4">
                <div className="rounded-[20px] bg-[#eef4ff] p-3 text-[var(--brand)]">
                  <UserRound className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
                    Create Form
                  </p>
                  <h2 className="mt-1 text-[28px] font-extrabold tracking-[-0.03em] text-[var(--brand-deep)]">
                    Create Patient Record
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                    Add the patient profile here. You can also book an appointment now for walk-ins or phone bookings.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#d8e5fb] bg-white text-[var(--brand-deep)] transition hover:bg-[#f8fbff]"
                title="Close form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
              <PatientWithAppointmentForm
                doctors={doctors}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          </section>
        </div>
      ) : null}

      {selectedPatient ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[rgba(15,23,42,0.28)] p-4 backdrop-blur-[6px] sm:p-6">
          <button
            type="button"
            aria-label="Close update patient form"
            onClick={() => setSelectedPatientId(null)}
            className="absolute inset-0 cursor-default"
          />

          <section className="relative z-10 flex max-h-[calc(100vh-3rem)] w-full max-w-5xl flex-col overflow-hidden rounded-[30px] border border-[#dce8fb] bg-white shadow-[0_36px_70px_-38px_rgba(15,23,42,0.42)]">
            <div className="flex items-start justify-between gap-4 border-b border-[#edf2fb] px-6 py-5 sm:px-8">
              <div className="flex items-start gap-4">
                <div className="rounded-[20px] bg-[#eef4ff] p-3 text-[var(--brand)]">
                  <UserRound className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
                    Update Form
                  </p>
                  <h2 className="mt-1 text-[28px] font-extrabold tracking-[-0.03em] text-[var(--brand-deep)]">
                    Update Patient Record
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                    Edit {selectedPatient.name} and manage the patient profile and appointment history from one place.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPatientId(null)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#d8e5fb] bg-white text-[var(--brand-deep)] transition hover:bg-[#f8fbff]"
                title="Close form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
              <PatientProfileForm
                patient={selectedPatient}
                onCancel={() => setSelectedPatientId(null)}
              />

              <PatientAppointmentsPanel
                patientId={selectedPatient.id}
                appointments={selectedPatientAppointments}
                doctors={doctors}
              />
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
