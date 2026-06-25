import { requireDoctorUser } from "@/lib/auth";
import { getDoctorPatients } from "@/lib/doctor-dashboard/service";
import { PatientsPageClient } from "@/components/doctor-dashboard/patients-page-client";

export default async function DoctorPatientsPage() {
  const user = await requireDoctorUser();
  const patients = await getDoctorPatients(user.doctorId!);

  return <PatientsPageClient patients={patients} />;
}
