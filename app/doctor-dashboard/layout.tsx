import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { requireDoctorUser } from "@/lib/auth";
import { getDoctorBySessionId } from "@/lib/doctor-dashboard/service";
import { DoctorDashboardShell } from "@/components/doctor-dashboard/shell";

export default async function DoctorDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireDoctorUser();
  const doctor = await getDoctorBySessionId(user.doctorId!);

  if (!doctor) {
    redirect("/doctor-login");
  }

  return (
    <DoctorDashboardShell
      doctor={{
        name: doctor.title,
        specialty: doctor.sector || "Doctor",
        email: user.email,
      }}
    >
      {children}
    </DoctorDashboardShell>
  );
}
