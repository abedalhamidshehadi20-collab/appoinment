import { ReactNode } from "react";
import { SiteShell } from "@/components/site/shell";
import { getPatientSession } from "@/lib/patient-auth";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const patient = await getPatientSession();

  return <SiteShell patientName={patient?.name}>{children}</SiteShell>;
}
