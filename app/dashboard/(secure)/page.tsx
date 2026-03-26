import { redirect } from "next/navigation";
import { getDashboardStats, getRecentAppointments } from "../actions";
import { requireUser } from "@/lib/auth";
import {
  Calendar,
  Users,
  UserRound,
  UserPlus,
  TrendingUp,
  Activity,
  Clock,
} from "lucide-react";
import { AppointmentsLineChart, DoctorBarChart, StatusPieChart } from "@/components/dashboard/charts";

export default async function DashboardOverviewPage() {
  const user = await requireUser();
  if (user.role === "doctor") {
    redirect("/doctor-dashboard");
  }

  const stats = await getDashboardStats();
  const recentAppointments = await getRecentAppointments(5);

  const statCards = [
    {
      label: "Today's Appointments",
      value: stats.todayAppointments,
      icon: Calendar,
      color: "bg-blue-500",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Total Patients",
      value: stats.totalPatients,
      icon: Users,
      color: "bg-purple-500",
      bgLight: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      label: "Active Doctors",
      value: stats.totalDoctors,
      icon: UserRound,
      color: "bg-cyan-500",
      bgLight: "bg-cyan-50",
      textColor: "text-cyan-600",
    },
    {
      label: "New Patients",
      value: stats.newPatientsThisMonth,
      icon: UserPlus,
      color: "bg-green-500",
      bgLight: "bg-green-50",
      textColor: "text-green-600",
    },
  ];

  const overviewCards = [
    {
      label: "Monthly Appointments",
      value: stats.monthlyAppointments,
      icon: TrendingUp,
      trend: "+12%",
      trendUp: true,
    },
    {
      label: "Total Appointments",
      value: stats.totalAppointments,
      icon: Activity,
    },
    {
      label: "Completed",
      value: stats.completedAppointments,
      icon: Clock,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {user.name}. Here&apos;s what&apos;s happening with your clinic today.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overview Cards */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Overview</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {overviewCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="rounded-lg bg-gray-50 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    <p className="text-xs text-gray-500">{card.label}</p>
                  </div>
                  {card.trend && (
                    <span className={`ml-auto text-sm font-medium ${card.trendUp ? "text-green-600" : "text-red-600"}`}>
                      {card.trend}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <AppointmentsLineChart />
        <DoctorBarChart />
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Appointments Table */}
        <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Appointments</h3>
            <a href="/dashboard/interests" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View all
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Patient
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Doctor
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Time
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-sm text-gray-500">
                      No appointments found
                    </td>
                  </tr>
                ) : (
                  recentAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                            {apt.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{apt.name}</p>
                            <p className="text-xs text-gray-500">{apt.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-gray-600">{apt.doctor_name}</td>
                      <td className="py-3 text-sm text-gray-600">{apt.appointment_date}</td>
                      <td className="py-3 text-sm text-gray-600">{apt.appointment_time}</td>
                      <td className="py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(apt.status)}`}>
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Status Pie Chart */}
        <StatusPieChart />
      </div>
    </div>
  );
}
