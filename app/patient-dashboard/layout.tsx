import { ReactNode } from "react";
import { requirePatient } from "@/lib/patient-auth";
import { PatientDashboardShell } from "@/components/patient/dashboard-shell";

const navItems = [
  { href: "/patient-dashboard", label: "Overview" },
  { href: "/appointments", label: "Book Appointment" },
];

export default async function PatientDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const patient = await requirePatient("/patient-dashboard");

  return (
    <PatientDashboardShell
      patient={{ name: patient.name, email: patient.email }}
      navItems={navItems}
    >
      {children}
    </PatientDashboardShell>
  );
}
