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
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(248,249,251,0.95)] backdrop-blur">
      <div className="container py-4">
        <nav className="card flex flex-wrap items-center justify-between gap-4 px-5 py-3">
          <Link href="/" className="flex items-center gap-2 text-xl font-black text-[var(--brand)]">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand)] text-white">M</span>
            MedAxis
          </Link>
          <ul className="flex flex-wrap items-center gap-1 text-sm font-semibold text-[var(--muted)]">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-md px-3 py-2 transition hover:bg-[#eff6ff] hover:text-[var(--brand)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/login" className="button button-secondary text-xs">
              Dashboard
            </Link>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#065f46] text-sm font-bold text-white">
              G
            </span>
          </div>
        </nav>
      </div>
    </header>
  );
}
