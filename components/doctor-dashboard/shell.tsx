"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { logoutAction } from "@/app/dashboard/actions";
import {
  CalendarClock,
  ClipboardList,
  Home,
  LogOut,
  Search,
  UserRoundCog,
  Users,
} from "lucide-react";

type DoctorDashboardShellProps = {
  doctor: {
    name: string;
    specialty: string;
    email: string;
  };
  children: ReactNode;
};

const navItems = [
  { href: "/doctor-dashboard", label: "Dashboard", icon: Home },
  { href: "/doctor-dashboard/appointments", label: "Appointments", icon: CalendarClock },
  { href: "/doctor-dashboard/patients", label: "Patients", icon: Users },
  { href: "/doctor-dashboard/profile", label: "Profile", icon: UserRoundCog },
];

export function DoctorDashboardShell({
  doctor,
  children,
}: DoctorDashboardShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eff5ff_0%,#f7fbff_35%,#edf4fb_100%)]">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[270px] overflow-hidden border-r border-white/15 bg-[linear-gradient(180deg,#184a89_0%,#2377e7_55%,#4f9cff_100%)] text-white lg:block">
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 shadow-[0_18px_30px_-20px_rgba(15,23,42,0.5)]">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-bold tracking-[-0.02em]">Doctor Portal</p>
            <p className="text-xs text-white/70">Professional workspace</p>
          </div>
        </div>

        <nav className="px-4 py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`mb-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-white/16 text-white shadow-[0_16px_28px_-22px_rgba(15,23,42,0.45)]"
                    : "text-white/78 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/10 p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-sm font-bold">
              {doctor.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{doctor.name}</p>
              <p className="truncate text-xs text-white/70">{doctor.specialty}</p>
            </div>
          </div>

          <form action={logoutAction}>
            <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/12 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/18">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </form>
        </div>
      </aside>

      <div className="lg:ml-[270px]">
        <header className="sticky top-0 z-30 border-b border-white/50 bg-white/80 backdrop-blur-xl">
          <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5b87c5]">
                Doctor Workspace
              </p>
              <h1 className="mt-1 text-2xl font-extrabold tracking-[-0.03em] text-[#153a6b]">
                Welcome back, {doctor.name}
              </h1>
            </div>

            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa7b8]" />
              <input
                type="text"
                placeholder="Search dashboard..."
                className="h-11 w-64 rounded-2xl border border-[#e6edf7] bg-[#f8fbff] pl-10 pr-4 text-sm text-[#24476e] outline-none"
              />
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
