"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { logoutAction } from "@/app/dashboard/actions";
import { getRoleLabel } from "@/lib/rbac";
import {
  LayoutDashboard,
  Home,
  Info,
  Stethoscope,
  Users,
  UserRound,
  FileText,
  Newspaper,
  Mail,
  Calendar,
  LogOut,
  Search,
  Bell,
  Settings,
  UserCog,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
};

const iconMap: Record<string, React.ElementType> = {
  "/dashboard": LayoutDashboard,
  "/dashboard/home": Home,
  "/dashboard/about": Info,
  "/dashboard/services": Stethoscope,
  "/dashboard/projects": Users,
  "/dashboard/patients": UserRound,
  "/dashboard/blogs": FileText,
  "/dashboard/news": Newspaper,
  "/dashboard/contacts": Mail,
  "/dashboard/interests": Calendar,
  "/dashboard/employees": UserCog,
};

type User = {
  name: string;
  role: string;
};

export function DashboardShell({
  user,
  navItems,
  children,
}: {
  user: User;
  navItems: NavItem[];
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#f1f5f9]">
      {/* Dark Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-[260px] bg-[var(--brand)] text-white">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-white/10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500">
            <Stethoscope className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold">Clinic Admin</span>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-3">
          {navItems.map((item) => {
            const Icon = iconMap[item.href] || LayoutDashboard;
            const isActive = pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 mb-1 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-sm font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-gray-400">{getRoleLabel(user.role)}</p>
            </div>
          </div>
          <form action={logoutAction}>
            <button className="flex w-full items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/20 hover:text-white">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="ml-[260px] flex-1">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="h-10 w-64 rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
