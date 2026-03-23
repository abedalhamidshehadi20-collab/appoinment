import { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/shell";
import { requireUser, canAccess } from "@/lib/auth";
import { Permission } from "@/lib/db";

const sections: { href: string; label: string; permission?: Permission }[] = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/home", label: "Home", permission: "home" },
  { href: "/dashboard/about", label: "About", permission: "about" },
  { href: "/dashboard/services", label: "Services", permission: "services" },
  { href: "/dashboard/projects", label: "Doctors", permission: "projects" },
  { href: "/dashboard/patients", label: "Patients", permission: "patients" },
  { href: "/dashboard/blogs", label: "Blogs", permission: "blogs" },
  { href: "/dashboard/news", label: "News", permission: "news" },
  { href: "/dashboard/contacts", label: "Messages", permission: "contacts" },
  { href: "/dashboard/interests", label: "Appointments", permission: "interests" },
];

export default async function SecureDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireUser();

  const navItems = sections
    .filter((item) => !item.permission || canAccess(user, item.permission))
    .map(({ href, label }) => ({ href, label }));

  return (
    <DashboardShell
      user={{ name: user.name, role: user.role }}
      navItems={navItems}
    >
      {children}
    </DashboardShell>
  );
}
