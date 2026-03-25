"use client";

import { useState } from "react";
import DoctorsList, { type DoctorListItem } from "@/components/site/DoctorsList";
import SpecialtyCards, { type FilterSpecialtyItem } from "@/components/site/SpecialtyCards";

type Props = {
  specialties: FilterSpecialtyItem[];
  doctors: DoctorListItem[];
  defaultEmptyMessage?: string;
};

const ALL_SPECIALTIES = "All";

export default function PopularDoctorsFilter({
  specialties,
  doctors,
  defaultEmptyMessage = "No doctors found.",
}: Props) {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(ALL_SPECIALTIES);

  function handleSelectSpecialty(specialty: string) {
    setSelectedSpecialty((currentSpecialty) =>
      currentSpecialty === specialty ? ALL_SPECIALTIES : specialty,
    );
  }

  const filteredDoctors =
    selectedSpecialty === ALL_SPECIALTIES
      ? doctors
      : doctors.filter((doctor) => doctor.specialty === selectedSpecialty);

  const emptyMessage =
    selectedSpecialty === ALL_SPECIALTIES
      ? defaultEmptyMessage
      : `No doctors found for ${selectedSpecialty}.`;

  return (
    <>
      <SpecialtyCards
        specialties={specialties}
        selectedSpecialty={selectedSpecialty}
        onSelect={handleSelectSpecialty}
      />

      <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="text-3xl font-extrabold">Popular Doctors</h3>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Showing {filteredDoctors.length} doctor{filteredDoctors.length === 1 ? "" : "s"}
            {selectedSpecialty === ALL_SPECIALTIES ? "." : ` in ${selectedSpecialty}.`}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <DoctorsList
          doctors={filteredDoctors}
          emptyMessage={emptyMessage}
          animationKey={selectedSpecialty}
        />
      </div>
    </>
  );
}
