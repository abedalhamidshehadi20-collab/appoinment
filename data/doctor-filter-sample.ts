import type { DoctorListItem } from "@/components/site/DoctorsList";
import type { FilterSpecialtyItem } from "@/components/site/SpecialtyCards";

export const sampleSpecialties: FilterSpecialtyItem[] = [
  { icon: "dentist", label: "Dentist", value: "Dentist" },
  { icon: "cardiologist", label: "Cardiologist", value: "Cardiologist" },
  { icon: "orthopedic", label: "Orthopedic", value: "Orthopedic" },
  { icon: "neurologist", label: "Neurologist", value: "Neurologist" },
  { icon: "otology", label: "Otology", value: "Otology" },
  { icon: "general", label: "General Doctor", value: "General Doctor" },
];

export const sampleDoctors: DoctorListItem[] = [
  {
    id: "doctor-1",
    slug: "dr-maya-hassan",
    name: "Dr. Maya Hassan",
    specialty: "Dentist",
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80",
    bio: "Cosmetic and restorative dentist focused on preventive care and smile design.",
    location: "Beirut, Lebanon",
  },
  {
    id: "doctor-2",
    slug: "dr-sarah-mitchell",
    name: "Dr. Sarah Mitchell",
    specialty: "Cardiologist",
    status: "Unavailable",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=900&q=80",
    bio: "Cardiology specialist with a strong background in heart rhythm and wellness plans.",
    location: "Jounieh, Lebanon",
  },
  {
    id: "doctor-3",
    slug: "dr-karim-nasr",
    name: "Dr. Karim Nasr",
    specialty: "Orthopedic",
    status: "Booked",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=80",
    bio: "Orthopedic surgeon helping patients recover from sports and joint injuries.",
    location: "Tripoli, Lebanon",
  },
  {
    id: "doctor-4",
    slug: "dr-omar-khalil",
    name: "Dr. Omar Khalil",
    specialty: "Neurologist",
    status: "On Leave",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=900&q=80",
    bio: "Neurology consultant focused on headache care, memory assessment, and follow-up.",
    location: "Saida, Lebanon",
  },
];
