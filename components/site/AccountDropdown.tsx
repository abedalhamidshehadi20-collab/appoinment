"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { ChevronDown, LayoutDashboard, LogOut, UserRound } from "lucide-react";

type FormAction = (formData: FormData) => void | Promise<void>;

type Props = {
  name: string;
  email: string;
  dashboardHref: string;
  logoutAction: FormAction;
};

export function AccountDropdown({
  name,
  email,
  dashboardHref,
  logoutAction,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dashboardRef = useRef<HTMLAnchorElement>(null);
  const logoutRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const focusMenuItem = (index: number) => {
    const items = [dashboardRef.current, logoutRef.current].filter(Boolean) as HTMLElement[];
    items[index]?.focus();
  };

  const openMenu = () => {
    setIsOpen(true);
    requestAnimationFrame(() => focusMenuItem(0));
  };

  const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openMenu();
    }
  };

  const handleMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const items = [dashboardRef.current, logoutRef.current].filter(Boolean) as HTMLElement[];
    const currentIndex = items.findIndex((item) => item === document.activeElement);

    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusMenuItem((currentIndex + 1 + items.length) % items.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      focusMenuItem((currentIndex - 1 + items.length) % items.length);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusMenuItem(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      focusMenuItem(items.length - 1);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setIsOpen((value) => !value)}
        onKeyDown={handleTriggerKeyDown}
        className="flex min-w-[156px] items-center gap-1.5 rounded-full border border-[#dbe4f0] bg-white px-2 py-1 text-left shadow-sm transition hover:border-[#c3d3ea] hover:bg-[#f8fbff]"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d9e7ff] bg-[#f4f8ff] text-[var(--brand)]">
          <UserRound className="h-3.5 w-3.5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[12px] font-semibold leading-4 text-[var(--brand-deep)]">
            {name}
          </span>
          <span className="block truncate text-[10px] leading-4 text-[var(--muted)]">
            {email}
          </span>
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-[var(--muted)] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        id={menuId}
        role="menu"
        aria-hidden={!isOpen}
        onKeyDown={handleMenuKeyDown}
        className={`absolute right-0 top-[calc(100%+0.55rem)] w-52 origin-top-right rounded-2xl border border-[#dbe4f0] bg-white p-2 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)] transition-all duration-200 ${
          isOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-1 scale-95 opacity-0"
        }`}
      >
        <div className="mb-2 border-b border-[#eef2f8] px-3 pb-2">
          <p className="truncate text-[12px] font-semibold text-[var(--brand-deep)]">{name}</p>
          <p className="truncate text-[10px] text-[var(--muted)]">{email}</p>
        </div>

        <div className="grid gap-1">
          <Link
            ref={dashboardRef}
            href={dashboardHref}
            role="menuitem"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-[var(--brand-deep)] outline-none transition hover:bg-[#f4f8ff] focus:bg-[#f4f8ff]"
          >
            <LayoutDashboard className="h-4 w-4 text-[var(--brand)]" />
            My Dashboard
          </Link>

          <form action={logoutAction}>
            <button
              ref={logoutRef}
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-[var(--brand-deep)] outline-none transition hover:bg-[#fff4f4] focus:bg-[#fff4f4]"
            >
              <LogOut className="h-4 w-4 text-[#d14343]" />
              Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
