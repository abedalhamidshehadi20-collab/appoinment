import { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/shell";
import { requireUser } from "@/lib/auth";

export default async function SecureDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireUser();
  return <DashboardShell user={user}>{children}</DashboardShell>;
}
