import { PatientsManagementClient } from "@/components/dashboard/PatientsManagementClient";
import { requirePermission } from "@/lib/auth";
import { getAllAppointments, getAllDoctors, getAllPatients } from "@/lib/db";

function errorMessage(code: string | undefined) {
  if (!code) return "";
  if (code === "slot_unavailable") {
    return "Selected slot is no longer available. Please choose another time.";
  }
  if (code === "missing_appointment_fields") {
    return "Please select doctor, date, and time before submitting.";
  }
  return "Could not create appointment. Please try again.";
}

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function DashboardPatientsPage({ searchParams }: Props) {
  await requirePermission("patients");
  const query = await searchParams;
  const [patients, doctors, appointments] = await Promise.all([
    getAllPatients(),
    getAllDoctors(),
    getAllAppointments(),
  ]);

  return (
    <PatientsManagementClient
      patients={patients}
      doctors={doctors.map(({ id, title }) => ({ id, title }))}
      appointments={appointments}
      errorMessage={errorMessage(query.error)}
    />
  );
}
