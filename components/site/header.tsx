"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

type Props = {
  admin?: {
    name: string;
    role: string;
  } | null;
  patient?: {
    name: string;
    email: string;
  } | null;
};

export function SiteHeader({ admin, patient }: Props) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const heroBottomRef = useRef<number>(0);
  const mouseHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const setHeaderVisible = (value: boolean) => {
      isVisibleRef.current = value;
      setIsVisible(value);
    };

    const clearMouseHideTimer = () => {
      if (mouseHideTimerRef.current) {
        clearTimeout(mouseHideTimerRef.current);
        mouseHideTimerRef.current = null;
      }
    };

    const updateHeroBottom = () => {
      const heroSection = document.querySelector("main section");

      if (!heroSection) {
        heroBottomRef.current = 0;
        return;
      }

      const rect = heroSection.getBoundingClientRect();
      heroBottomRef.current = rect.top + window.scrollY + rect.height;
    };

    const isPastHero = () => {
      return heroBottomRef.current > 0 && window.scrollY > heroBottomRef.current - 120;
    };

    const handleScroll = () => {
      if (isPastHero()) {
        setHeaderVisible(false);
        return;
      }

      clearMouseHideTimer();
      setHeaderVisible(true);
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isPastHero()) {
        clearMouseHideTimer();
        setHeaderVisible(true);
        return;
      }

      if (event.clientY <= 160) {
        clearMouseHideTimer();
        setHeaderVisible(true);
        return;
      }

      if (isVisibleRef.current) {
        clearMouseHideTimer();
        mouseHideTimerRef.current = setTimeout(() => {
          if (isPastHero()) {
            setHeaderVisible(false);
          }
        }, 220);
      }
    };

    updateHeroBottom();
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateHeroBottom);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      clearMouseHideTimer();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateHeroBottom);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const adminInitial = admin?.name.trim().charAt(0).toUpperCase() ?? "A";
  const patientInitial = patient?.name.trim().charAt(0).toUpperCase() ?? "P";

  return (
    <header
      className={`sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(248,249,251,0.95)] backdrop-blur transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container py-4">
        <nav className="card flex flex-wrap items-center justify-between gap-4 px-5 py-3">
          <Link href="/" className="flex items-center gap-2 text-xl font-black text-[var(--brand)]">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand)] text-sm text-white">SH</span>
            Sh-Med
          </Link>
          <ul className="flex flex-wrap items-center gap-1 text-sm font-semibold text-[var(--muted)]">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`inline-flex px-3 py-2 transition hover:bg-[#eff6ff] hover:text-[var(--brand)] ${
                    isActivePath(pathname, item.href)
                      ? "border-b-4 border-blue-600 font-extrabold text-blue-600"
                      : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center">
            {patient ? (
              <Link
                href="/patient-dashboard"
                aria-label="Open patient account"
                title={patient.name}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#2377e7_0%,#1d4f91_100%)] text-sm font-extrabold text-white shadow-[0_18px_30px_-24px_rgba(29,79,145,0.8)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_34px_-24px_rgba(29,79,145,0.95)]"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/14 text-sm font-extrabold text-white">
                  {patientInitial}
                </span>
              </Link>
            ) : admin ? (
              <Link
                href="/dashboard"
                aria-label="Open admin dashboard"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#2377e7_0%,#1d4f91_100%)] text-sm font-extrabold text-white shadow-[0_18px_30px_-24px_rgba(29,79,145,0.8)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_34px_-24px_rgba(29,79,145,0.95)]"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/14 text-sm font-extrabold text-white">
                  {adminInitial}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center rounded-full border border-[#cfe0ff] px-8 text-sm font-bold text-[var(--brand-deep)] transition hover:border-[#9ec5ff] hover:bg-[#f3f8ff]"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
