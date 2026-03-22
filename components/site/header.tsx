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

export function SiteHeader() {
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
                  className={`rounded-md px-3 py-2 transition hover:bg-[#eff6ff] hover:text-[var(--brand)] ${
                    pathname === item.href
                      ? "font-extrabold text-[var(--brand-deep)] underline underline-offset-4"
                      : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center">
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-full border border-[#cfe0ff] px-5 text-sm font-bold text-[var(--brand-deep)] transition hover:border-[#9ec5ff] hover:bg-[#f3f8ff]"
            >
              Login
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
