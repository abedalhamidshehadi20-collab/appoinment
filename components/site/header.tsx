import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/doctors", label: "Doctors" },
  { href: "/appointments", label: "Appointments" },
  { href: "/blog", label: "Blog" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="container py-5">
      <nav className="card flex flex-wrap items-center justify-between gap-3 p-4">
        <Link href="/" className="text-xl font-black text-[var(--brand-deep)]">
          MedAxis
        </Link>
        <ul className="flex flex-wrap gap-2 text-sm font-semibold text-[var(--muted)]">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="rounded-full px-3 py-2 transition hover:bg-[#e8f6fc] hover:text-[var(--brand-deep)]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/dashboard/login" className="button button-secondary text-xs">
          Dashboard
        </Link>
      </nav>
    </header>
  );
}