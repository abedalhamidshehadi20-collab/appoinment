import { ReactNode } from "react";
import { requirePatient } from "@/lib/patient-auth";
import { patientLogoutAction } from "@/app/(site)/auth-actions";
import { UserRound, LogOut } from "lucide-react";

export default async function PatientDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const patient = await requirePatient("/patient-dashboard");

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-semibold text-slate-900">Patient Portal</p>
            <p className="text-xs text-slate-500">Manage your appointments and profile</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 sm:flex">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <UserRound className="h-4 w-4" />
              </div>
              <div className="leading-tight">
                <p className="max-w-[180px] truncate text-xs font-semibold text-slate-800">{patient.name}</p>
                <p className="max-w-[180px] truncate text-[11px] text-slate-500">{patient.email}</p>
              </div>
            </div>

            <form action={patientLogoutAction}>
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
