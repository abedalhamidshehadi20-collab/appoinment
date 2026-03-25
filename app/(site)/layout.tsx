import { ReactNode } from "react";
import { SiteShell } from "@/components/site/shell";
import { getSessionUser } from "@/lib/auth";
import { getPatientSession } from "@/lib/patient-auth";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const [admin, patient] = await Promise.all([getSessionUser(), getPatientSession()]);

  return (
    <SiteShell
      admin={admin ? { name: admin.name, email: admin.email || admin.role, role: admin.role } : null}
      patient={patient ? { name: patient.name, email: patient.email } : null}
    >
      {children}
    </SiteShell>
  );
}
