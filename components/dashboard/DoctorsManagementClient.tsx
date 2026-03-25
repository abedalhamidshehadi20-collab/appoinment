"use client";

import { useState } from "react";
import { deleteProjectAction } from "@/app/dashboard/actions";
import { DoctorProfileForm } from "@/components/dashboard/DoctorProfileForm";
import { NewDoctorForm } from "@/components/dashboard/NewDoctorForm";
import type { Doctor, DoctorCredential } from "@/lib/db";
import {
  ChevronDown,
  Filter,
  MapPin,
  Pencil,
  Plus,
  Search,
  Stethoscope,
  Trash2,
  X,
} from "lucide-react";

type DoctorsManagementClientProps = {
  doctors: Doctor[];
  credentials: DoctorCredential[];
  successMessage?: string;
  errorMessage?: string;
};

function getStatusBadge(status: string) {
  const value = status.trim().toLowerCase();

  if (value === "available") {
    return "bg-[#ecfff3] text-[#145f39]";
  }

  if (value === "unavailable") {
    return "bg-[#fef2f2] text-[#991b1b]";
  }

  if (value === "on leave") {
    return "bg-[#fff7ed] text-[#b45309]";
  }

  return "bg-[#eef4ff] text-[var(--brand-deep)]";
}

export function DoctorsManagementClient({
  doctors,
  credentials,
  successMessage,
  errorMessage,
}: DoctorsManagementClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(
    doctors[0]?.id ?? null,
  );

  const availableStatuses = Array.from(
    new Set(
      doctors
        .map((doctor) => doctor.status?.trim())
        .filter(Boolean),
    ),
  );

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesStatus =
      statusFilter === "All" ? true : doctor.status === statusFilter;

    if (!matchesStatus) {
      return false;
    }

    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return true;
    }

    const haystack = [
      doctor.title,
      doctor.excerpt,
      doctor.sector,
      doctor.location,
      doctor.status,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });

  const selectedDoctor =
    doctors.find((doctor) => doctor.id === selectedDoctorId) ?? null;
  const selectedCredential = selectedDoctor
    ? credentials.find((credential) => credential.doctor_id === selectedDoctor.id) ?? null
    : null;

  return (
    <div className="space-y-6">
      {successMessage ? (
        <article className="card border border-[#bde5cb] bg-[#ecfff3] p-4 text-sm font-medium text-[#145f39]">
          {successMessage}
        </article>
      ) : null}

      {errorMessage ? (
        <article className="card border border-[#fecaca] bg-[#fef2f2] p-4 text-sm font-medium text-[#991b1b]">
          {errorMessage}
        </article>
      ) : null}

      <article className="card overflow-hidden rounded-[28px] border border-[#e7eef9] bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.28)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
              Doctors
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-[var(--brand-deep)]">
              Doctor Management
            </h1>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Manage doctor profiles, clinic details, availability, and doctor login emails from one place.
            </p>
            <p className="mt-2 text-sm font-semibold text-[var(--brand-deep)]">
              {doctors.length} doctor{doctors.length === 1 ? "" : "s"} in directory
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowCreateForm((current) => !current)}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f68cb]"
            >
              <Plus className="h-4 w-4" />
              {showCreateForm ? "Close Form" : "Add Doctor"}
            </button>
          </div>
        </div>

        {showCreateForm ? (
          <section className="mt-6 flex justify-center">
            <div className="w-full max-w-5xl overflow-hidden rounded-[30px] border border-[#dce8fb] bg-white shadow-[0_24px_50px_-34px_rgba(15,23,42,0.35)]">
              <div className="flex items-start justify-between gap-4 border-b border-[#edf2fb] px-6 py-5">
                <div className="flex items-start gap-4">
                  <div className="rounded-[20px] bg-[#eef4ff] p-3 text-[var(--brand)]">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
                      Create Form
                    </p>
                    <h2 className="mt-1 text-2xl font-extrabold text-[var(--brand-deep)]">
                      Create Doctor Profile
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      Add the doctor profile here. You can prepare the doctor login email and password before saving the profile.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d8e5fb] bg-white text-[var(--brand-deep)] transition hover:bg-[#f8fbff]"
                  title="Close form"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="px-6 py-6">
                <NewDoctorForm />
              </div>
            </div>
          </section>
        ) : null}

        <section className="mt-6 rounded-[24px] border border-[#dce8fb] bg-white p-5 shadow-[0_12px_28px_-24px_rgba(17,24,39,0.25)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[var(--brand-deep)]">
                Doctor Directory
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Search, filter, and open a doctor profile for editing below.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:w-[540px]">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search doctors"
                  className="h-11 w-full rounded-xl border border-[var(--line)] bg-white pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-[#bfd5ff] focus:ring-4 focus:ring-[#e8f0ff]"
                />
              </label>

              <label className="relative block">
                <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-[var(--line)] bg-white pl-11 pr-10 text-sm shadow-sm outline-none transition focus:border-[#bfd5ff] focus:ring-4 focus:ring-[#e8f0ff]"
                >
                  <option value="All">All Status</option>
                  {availableStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              </label>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto rounded-[22px] border border-[#edf2fb]">
            <table className="min-w-[1080px] w-full border-collapse">
              <thead>
                <tr className="bg-[#f8fbff] text-left text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  <th className="px-5 py-4">Doctor</th>
                  <th className="px-4 py-4">Specialty</th>
                  <th className="px-4 py-4">Location</th>
                  <th className="px-4 py-4">Fee</th>
                  <th className="px-4 py-4">Experience</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Login Email</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-10 text-center text-sm text-[var(--muted)]">
                      No doctors match this search or filter.
                    </td>
                  </tr>
                ) : (
                  filteredDoctors.map((doctor) => {
                    const credential =
                      credentials.find((item) => item.doctor_id === doctor.id) ?? null;
                    const isSelected = doctor.id === selectedDoctorId;

                    return (
                      <tr
                        key={doctor.id}
                        className={`border-t border-[#eef2f7] align-top transition ${
                          isSelected ? "bg-[#f8fbff]" : "bg-white hover:bg-[#fbfdff]"
                        }`}
                      >
                        <td className="px-5 py-4">
                          <div className="max-w-[270px]">
                            <p className="text-sm font-semibold text-[var(--brand-deep)]">
                              {doctor.title}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                              {doctor.excerpt || "No summary available."}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-[var(--brand-deep)]">
                          {doctor.sector || "-"}
                        </td>
                        <td className="px-4 py-4 text-sm text-[var(--muted)]">
                          <span className="inline-flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-[var(--brand)]" />
                            {doctor.location || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-[var(--brand-deep)]">
                          ${doctor.appointment_fee ?? 0}
                        </td>
                        <td className="px-4 py-4 text-sm text-[var(--muted)]">
                          {doctor.years_experience ?? 0} yrs
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(doctor.status || "Available")}`}
                          >
                            {doctor.status || "Available"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-[var(--muted)]">
                          {credential?.email || "-"}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedDoctorId(doctor.id)}
                              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition ${
                                isSelected
                                  ? "border-[#bfd5ff] bg-[#eef4ff] text-[var(--brand)]"
                                  : "border-[#e5e7eb] bg-white text-[var(--muted)] hover:border-[#bfd5ff] hover:text-[var(--brand)]"
                              }`}
                              title="Edit Doctor"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>

                            <form action={deleteProjectAction}>
                              <input type="hidden" name="id" value={doctor.id} />
                              <button
                                type="submit"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e5e7eb] bg-white text-[var(--muted)] transition hover:border-[#fecaca] hover:text-[#dc2626]"
                                title="Delete Doctor"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </form>
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

        {selectedDoctor ? (
          <section className="mt-6 rounded-[24px] border border-[#dce8fb] bg-white p-5 shadow-[0_12px_28px_-24px_rgba(17,24,39,0.25)]">
            <div className="mb-4 flex flex-col gap-3 border-b border-[#eef2f7] pb-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--brand)]">
                  Editing Doctor
                </p>
                <h2 className="mt-1 text-2xl font-extrabold text-[var(--brand-deep)]">
                  {selectedDoctor.title}
                </h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {[selectedDoctor.sector, selectedDoctor.location].filter(Boolean).join(" - ") || "Doctor profile"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDoctorId(null)}
                className="inline-flex items-center rounded-lg border border-[#d8e5fb] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-deep)] transition hover:bg-[#f8fbff]"
              >
                Close Editor
              </button>
            </div>

            <DoctorProfileForm
              doctor={selectedDoctor}
              credential={selectedCredential}
            />
          </section>
        ) : null}
      </article>
    </div>
  );
}
