import { requireDoctorUser } from "@/lib/auth";
import { getDoctorAppointments } from "@/lib/doctor-dashboard/service";
import { updateDoctorAppointmentStatusAction } from "@/app/doctor-dashboard/actions";
import { AppointmentsPageClient } from "@/components/doctor-dashboard/appointments-page-client";

export default async function DoctorAppointmentsPage() {
  const user = await requireDoctorUser();
  const appointments = await getDoctorAppointments(user.doctorId!);

  return (
    <AppointmentsPageClient
      appointments={appointments}
      updateStatusAction={updateDoctorAppointmentStatusAction}
    />
  );
}
