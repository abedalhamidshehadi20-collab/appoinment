import Link from "next/link";
import { ReactNode } from "react";
import { Permission } from "@/lib/cms";
import { canAccess } from "@/lib/auth";
import { logoutAction } from "@/app/dashboard/actions";

const sections: { href: string; label: string; permission?: Permission }[] = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/home", label: "Home", permission: "home" },
  { href: "/dashboard/about", label: "About", permission: "about" },
  { href: "/dashboard/services", label: "Services", permission: "services" },
  { href: "/dashboard/projects", label: "Projects", permission: "projects" },
  { href: "/dashboard/blogs", label: "Blogs", permission: "blogs" },
  { href: "/dashboard/news", label: "News", permission: "news" },
  { href: "/dashboard/contacts", label: "Contact Messages", permission: "contacts" },
  { href: "/dashboard/interests", label: "Project Interests", permission: "interests" },
];

type User = {
  name: string;
  role: string;
  permissions: Permission[];
};

export function DashboardShell({
  user,
  children,
}: {
  user: User;
  children: ReactNode;
}) {
  const availableSections = sections.filter(
    (item) => !item.permission || canAccess(user, item.permission),
  );

  return (
    <div className="container grid gap-4 pb-8 md:grid-cols-[260px_1fr]">
      <aside className="card h-fit p-4">
        <h2 className="text-lg font-extrabold text-[var(--brand-deep)]">Admin Panel</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">{user.name} • {user.role}</p>

        <nav className="mt-4 grid gap-1 text-sm font-semibold">
          {availableSections.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-[var(--muted)] transition hover:bg-[#edf8fd] hover:text-[var(--brand-deep)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form action={logoutAction} className="mt-4">
          <button className="button button-secondary w-full text-xs">Logout</button>
        </form>
      </aside>

      <section className="grid gap-4">{children}</section>
    </div>
  );
}
