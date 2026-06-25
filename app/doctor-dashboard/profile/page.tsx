import { redirect } from "next/navigation";
import { updateDoctorProfileAction } from "@/app/doctor-dashboard/actions";
import { DoctorProfileForm } from "@/components/doctor-dashboard/profile-form";
import { requireDoctorUser } from "@/lib/auth";
import { getDoctorBySessionId } from "@/lib/doctor-dashboard/service";

export default async function DoctorProfilePage() {
  const user = await requireDoctorUser();
  const doctor = await getDoctorBySessionId(user.doctorId!);

  if (!doctor) {
    redirect("/doctor-login");
  }

  return (
    <DoctorProfileForm
      doctor={doctor}
      email={user.email}
      updateAction={updateDoctorProfileAction}
    />
  );
}
