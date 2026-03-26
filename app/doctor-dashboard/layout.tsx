import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { requireDoctorUser } from "@/lib/auth";
import {
  getDoctorBySessionId,
  getDoctorNotifications,
} from "@/lib/doctor-dashboard/service";
import { DoctorDashboardShell } from "@/components/doctor-dashboard/shell";

export default async function DoctorDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireDoctorUser();
  const [doctor, notifications] = await Promise.all([
    getDoctorBySessionId(user.doctorId!),
    getDoctorNotifications(user.doctorId!),
  ]);

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
      unreadNotifications={notifications.filter((item) => !item.is_read).length}
    >
      {children}
    </DoctorDashboardShell>
  );
}
