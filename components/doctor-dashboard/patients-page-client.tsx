"use client";

import Link from "next/link";
import { useState } from "react";
import type { DoctorPatientSummary } from "@/lib/doctor-dashboard/service";
import { useDeferredSearch } from "@/hooks/useDeferredSearch";
import { Search, Users } from "lucide-react";

type PatientsPageClientProps = {
  patients: DoctorPatientSummary[];
};

type HistoryFilter = "all" | "with-records" | "without-records";

function calculateAge(dateOfBirth: string) {
  if (!dateOfBirth) {
    return "N/A";
  }

  const date = new Date(dateOfBirth);
  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  const diff = Date.now() - date.getTime();
  return Math.abs(new Date(diff).getUTCFullYear() - 1970);
}

export function PatientsPageClient({ patients }: PatientsPageClientProps) {
  const { query, setQuery, deferredQuery } = useDeferredSearch();
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>("all");

  const filteredPatients = patients.filter((patient) => {
    if (historyFilter === "with-records" && patient.recordsCount === 0) {
      return false;
    }

    if (historyFilter === "without-records" && patient.recordsCount > 0) {
      return false;
    }

    if (!deferredQuery) {
      return true;
    }

    const haystack = [
      patient.name,
      patient.email,
      patient.phone,
      patient.medical_history,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(deferredQuery);
  });

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[#e6edf7] bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.16)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5f8ed5]">
              Patient Directory
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[#153a6b]">
              Patients
            </h2>
            <p className="mt-2 text-sm text-[#6d7f95]">
              Search active patients and open a full clinical profile.
            </p>
          </div>

          <div className="grid gap-3 xl:w-[520px] xl:grid-cols-[190px_minmax(0,1fr)]">
            <select
              value={historyFilter}
              onChange={(event) => setHistoryFilter(event.target.value as HistoryFilter)}
              className="h-11 rounded-2xl border border-[#e6edf7] bg-[#fbfdff] px-4 text-sm text-[#24476e] outline-none"
            >
              <option value="all">All patients</option>
              <option value="with-records">With records</option>
              <option value="without-records">Without records</option>
            </select>

            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#97a5b8]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, email, phone"
                className="h-11 w-full rounded-2xl border border-[#e6edf7] bg-[#fbfdff] pl-11 pr-4 text-sm text-[#24476e] outline-none"
              />
            </label>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[28px] border border-[#e6edf7] bg-white shadow-[0_18px_40px_-30px_rgba(15,23,42,0.16)]">
        <div className="flex items-center justify-between border-b border-[#eef3f8] px-6 py-5">
          <div>
            <h3 className="text-lg font-bold text-[#153a6b]">Assigned Patients</h3>
            <p className="mt-1 text-sm text-[#6d7f95]">
              {filteredPatients.length} patient{filteredPatients.length === 1 ? "" : "s"} in your panel
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#eef5ff] px-3 py-1.5 text-xs font-semibold text-[#2b63b8]">
            <Users className="h-4 w-4" />
            Doctor scoped
          </div>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredPatients.length === 0 ? (
            <div className="col-span-full rounded-[24px] border border-dashed border-[#d7e4f5] bg-[#fbfdff] px-6 py-12 text-center text-sm text-[#7f8da0]">
              No patients match the current search or filter.
            </div>
          ) : (
            filteredPatients.map((patient) => (
              <Link
                key={patient.id}
                href={`/doctor-dashboard/patients/${patient.id}`}
                className="group rounded-[24px] border border-[#e8eef7] bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] p-5 shadow-[0_18px_36px_-32px_rgba(15,23,42,0.18)] transition hover:-translate-y-1 hover:border-[#cadcf5]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-bold text-[#153a6b]">{patient.name}</h4>
                    <p className="mt-1 text-sm text-[#6d7f95]">{patient.email}</p>
                  </div>
                  <span className="rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-semibold text-[#2b63b8]">
                    {patient.recordsCount} record{patient.recordsCount === 1 ? "" : "s"}
                  </span>
                </div>

                <dl className="mt-5 grid gap-3 text-sm text-[#4a6078]">
                  <div className="flex items-center justify-between">
                    <dt className="text-[#7f8da0]">Age</dt>
                    <dd className="font-semibold">{calculateAge(patient.date_of_birth)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-[#7f8da0]">Phone</dt>
                    <dd className="font-semibold">{patient.phone || "N/A"}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-[#7f8da0]">Visits</dt>
                    <dd className="font-semibold">{patient.appointmentsCount}</dd>
                  </div>
                </dl>

                <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#6d7f95]">
                  {patient.medical_history || "No medical history added yet."}
                </p>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
