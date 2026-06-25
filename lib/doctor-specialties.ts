import type { Doctor } from "@/lib/db";

type DoctorSpecialtySource = Pick<Doctor, "sector" | "title" | "excerpt">;

export const specialtyKeywords: Record<string, string[]> = {
  Dentist: ["dent", "oral", "teeth"],
  Cardiologist: ["cardio", "heart"],
  Orthopedic: ["ortho", "bone", "joint"],
  Neurologist: ["neuro", "brain", "nerve"],
  Otology: ["oto", "ent", "ear"],
  "General Doctor": ["general", "internal", "family"],
  Surgeon: ["surgery", "surgeon"],
  Psychiatry: ["psych", "mental"],
  "Eye Specialist": ["eye", "ophthal", "vision"],
};

export const specialtySectorAliases: Record<string, string[]> = {
  Dentist: ["Dentistry", "Dental"],
  Cardiologist: ["Cardiology"],
  Orthopedic: ["Orthopedics", "Orthopedic Surgery"],
  Neurologist: ["Neurology"],
  Otology: ["ENT", "Otolaryngology", "Otology"],
  "General Doctor": ["Internal Medicine", "General Medicine", "Family Medicine"],
  Surgeon: ["Surgery", "General Surgery"],
  Psychiatry: ["Psychiatry"],
  "Eye Specialist": ["Ophthalmology", "Eye Care"],
};

const specialtyLabels = Object.keys(specialtySectorAliases);

export function normalizeSpecialtyLabel(value: string) {
  const label = value.trim();

  if (!label) {
    return "";
  }

  const normalized = label.toLowerCase();

  for (const specialty of specialtyLabels) {
    if (specialty.toLowerCase() === normalized) {
      return specialty;
    }

    if (specialtySectorAliases[specialty]?.some((alias) => alias.toLowerCase() === normalized)) {
      return specialty;
    }
  }

  return label;
}

export function doctorMatchesSpecialty(
  doctor: DoctorSpecialtySource,
  selectedSpecialty: string,
) {
  const specialty = normalizeSpecialtyLabel(selectedSpecialty);

  if (!specialty) {
    return true;
  }

  const haystack = `${doctor.sector} ${doctor.title} ${doctor.excerpt}`.toLowerCase();
  const sector = doctor.sector.toLowerCase();
  const aliases = specialtySectorAliases[specialty] ?? [specialty];
  const keywords = specialtyKeywords[specialty] ?? [specialty.toLowerCase()];

  return (
    aliases.some((alias) => sector === alias.toLowerCase()) ||
    keywords.some((keyword) => haystack.includes(keyword))
  );
}

export function getDoctorSpecialty(doctor: DoctorSpecialtySource) {
  for (const specialty of specialtyLabels) {
    if (doctorMatchesSpecialty(doctor, specialty)) {
      return specialty;
    }
  }

  return normalizeSpecialtyLabel(doctor.sector);
}
