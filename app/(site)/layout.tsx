import { ReactNode } from "react";
import { SiteShell } from "@/components/site/shell";
import { getSessionUser } from "@/lib/auth";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const admin = await getSessionUser();

  return (
    <SiteShell admin={admin ? { name: admin.name, role: admin.role } : null}>
      {children}
    </SiteShell>
  );
}
