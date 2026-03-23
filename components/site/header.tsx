"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { patientLogoutAction } from "@/app/(site)/auth-actions";

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
  patient?: {
    name: string;
    email: string;
  } | null;
};

export function SiteHeader({ patient }: Props) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const heroBottomRef = useRef<number>(0);
  const mouseHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isVisibleRef = useRef(true);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!accountMenuRef.current) {
        return;
      }

      if (!accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

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
              <div className="relative" ref={accountMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsAccountMenuOpen((current) => !current)}
                  className="flex items-center gap-3 rounded-2xl bg-[linear-gradient(135deg,#2377e7_0%,#1d4f91_100%)] px-4 py-3 text-left text-white shadow-[0_18px_30px_-24px_rgba(29,79,145,0.8)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_34px_-24px_rgba(29,79,145,0.95)]"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/14 text-sm font-extrabold text-white">
                    {patientInitial}
                  </span>
                  <span className="min-w-0">
                    <span className="block max-w-[170px] truncate text-sm font-extrabold">
                      {patient.name}
                    </span>
                    <span className="block text-xs font-medium text-white/75">
                      Patient account
                    </span>
                  </span>
                </button>

                {isAccountMenuOpen ? (
                  <div className="absolute right-0 top-[calc(100%+0.75rem)] w-64 rounded-3xl border border-[#dbe9ff] bg-white p-3 text-[var(--brand-deep)] shadow-[0_24px_50px_-30px_rgba(15,23,42,0.45)]">
                    <div className="rounded-2xl bg-[#f5f9ff] px-4 py-3">
                      <p className="truncate text-sm font-bold">{patient.name}</p>
                      <p className="truncate text-xs text-[var(--muted)]">{patient.email}</p>
                    </div>

                    <Link
                      href="/appointments"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="mt-3 flex h-11 items-center rounded-2xl px-4 text-sm font-semibold transition hover:bg-[#eef5ff]"
                    >
                      My Appointments
                    </Link>

                    <form action={patientLogoutAction} className="mt-2">
                      <button
                        type="submit"
                        className="flex h-11 w-full items-center rounded-2xl px-4 text-sm font-semibold text-[#b42318] transition hover:bg-[#fff1ef]"
                      >
                        Logout
                      </button>
                    </form>
                  </div>
                ) : null}
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center rounded-full border border-[#cfe0ff] px-5 text-sm font-bold text-[var(--brand-deep)] transition hover:border-[#9ec5ff] hover:bg-[#f3f8ff]"
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
